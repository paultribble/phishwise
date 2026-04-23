import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    trainingModule: {
      findUnique: vi.fn(),
    },
    userTraining: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    userHistory: {
      create: vi.fn(),
    },
    userMetrics: {
      upsert: vi.fn(),
    },
  },
}))

vi.mock('@/lib/errors', () => {
  const ApiError = class extends Error {
    code: string
    statusCode: number
    constructor(code: string, message: string, statusCode: number) {
      super(message)
      this.code = code
      this.statusCode = statusCode
    }
    toJSON() {
      return { error: { code: this.code, message: this.message } }
    }
  }
  return {
    errors: {
      unauthorized: () => new ApiError('ERR_UNAUTHORIZED', 'Authentication required', 401),
      notFound: (r: string) => new ApiError('ERR_NOT_FOUND', `${r} not found`, 404),
      invalidInput: (f?: string) => new ApiError('ERR_INVALID_INPUT', f ? `Invalid input: ${f}` : 'Invalid request body', 400),
      internal: () => new ApiError('ERR_INTERNAL', 'Internal server error', 500),
    },
    ApiError,
    ErrorCode: { UNAUTHORIZED: 'ERR_UNAUTHORIZED', NOT_FOUND: 'ERR_NOT_FOUND', INVALID_INPUT: 'ERR_INVALID_INPUT', INTERNAL: 'ERR_INTERNAL' },
  }
})

vi.mock('@/lib/logger', () => ({
  apiLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}))

import { POST } from '@/app/api/training/[moduleId]/complete/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/training/mod-1/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeParams(moduleId = 'mod-1') {
  return { params: Promise.resolve({ moduleId }) }
}

describe('POST /api/training/[moduleId]/complete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const res = await POST(makeRequest({ passed: true }), makeParams())
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body (missing passed field)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    } as any)

    const res = await POST(makeRequest({}), makeParams())
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid score (out of range)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    } as any)

    const res = await POST(makeRequest({ passed: true, score: 150 }), makeParams())
    expect(res.status).toBe(400)
  })

  it('returns 404 if module does not exist', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    } as any)
    vi.mocked(prisma.trainingModule.findUnique).mockResolvedValue(null)

    const res = await POST(makeRequest({ passed: true }), makeParams('nonexistent'))
    expect(res.status).toBe(404)
  })

  it('marks module complete and updates metrics when passed is true', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    } as any)
    vi.mocked(prisma.trainingModule.findUnique).mockResolvedValue({ id: 'mod-1' } as any)
    vi.mocked(prisma.userTraining.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.userTraining.create).mockResolvedValue({} as any)
    vi.mocked(prisma.userHistory.create).mockResolvedValue({} as any)
    vi.mocked(prisma.userMetrics.upsert).mockResolvedValue({} as any)

    const res = await POST(makeRequest({ passed: true, score: 85 }), makeParams())
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.success).toBe(true)

    expect(prisma.userTraining.create).toHaveBeenCalledOnce()
    expect(prisma.userHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          actionType: 'training_completed',
        }),
      })
    )
    expect(prisma.userMetrics.upsert).toHaveBeenCalledOnce()
  })

  it('updates existing UserTraining record instead of creating new', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    } as any)
    vi.mocked(prisma.trainingModule.findUnique).mockResolvedValue({ id: 'mod-1' } as any)
    vi.mocked(prisma.userTraining.findFirst).mockResolvedValue({ id: 'ut-1' } as any)
    vi.mocked(prisma.userTraining.update).mockResolvedValue({} as any)
    vi.mocked(prisma.userHistory.create).mockResolvedValue({} as any)
    vi.mocked(prisma.userMetrics.upsert).mockResolvedValue({} as any)

    const res = await POST(makeRequest({ passed: true }), makeParams())
    expect(res.status).toBe(200)

    expect(prisma.userTraining.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ut-1' },
      })
    )
    expect(prisma.userTraining.create).not.toHaveBeenCalled()
  })

  it('does not update training records when passed is false', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    } as any)
    vi.mocked(prisma.trainingModule.findUnique).mockResolvedValue({ id: 'mod-1' } as any)

    const res = await POST(makeRequest({ passed: false }), makeParams())
    expect(res.status).toBe(200)

    expect(prisma.userTraining.create).not.toHaveBeenCalled()
    expect(prisma.userTraining.update).not.toHaveBeenCalled()
    expect(prisma.userHistory.create).not.toHaveBeenCalled()
    expect(prisma.userMetrics.upsert).not.toHaveBeenCalled()
  })
})
