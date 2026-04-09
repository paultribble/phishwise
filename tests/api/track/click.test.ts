import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  prisma: {
    simulationEmail: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    userHistory: {
      create: vi.fn(),
    },
    userMetrics: {
      upsert: vi.fn(),
    },
    userTraining: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/logger', () => ({
  apiLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 99, reset: 0 }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
}))

import { GET } from '@/app/api/track/click/[token]/route'
import { prisma } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'

function makeRequest(token: string): NextRequest {
  return new NextRequest(`http://localhost/api/track/click/${token}`)
}

describe('GET /api/track/click/[token]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimit).mockResolvedValue({ success: true, remaining: 99, reset: 0 })
  })

  it('redirects to home for invalid token (no tk_ prefix)', async () => {
    const req = makeRequest('invalid-token')
    const res = await GET(req, { params: { token: 'invalid-token' } })
    expect(res.status).toBe(307)
    expect(res.headers.get('Location')).toContain('/')
  })

  it('redirects to home when simulation email not found', async () => {
    vi.mocked(prisma.simulationEmail.findUnique).mockResolvedValue(null)

    const req = makeRequest('tk_abc123')
    const res = await GET(req, { params: { token: 'tk_abc123' } })
    expect(res.status).toBe(307)
    expect(res.headers.get('Location')).toContain('/')
  })

  it('updates clicked status and redirects to training for valid token', async () => {
    const mockSimEmail = {
      id: 'sim-1',
      userId: 'user-1',
      clicked: false,
      template: { moduleId: 'mod-1' },
      user: { id: 'user-1', name: 'Test' },
    }
    vi.mocked(prisma.simulationEmail.findUnique).mockResolvedValue(mockSimEmail as any)
    vi.mocked(prisma.simulationEmail.update).mockResolvedValue({} as any)
    vi.mocked(prisma.userHistory.create).mockResolvedValue({} as any)
    vi.mocked(prisma.userMetrics.upsert).mockResolvedValue({} as any)
    vi.mocked(prisma.userTraining.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.userTraining.create).mockResolvedValue({} as any)

    const req = makeRequest('tk_abc123')
    const res = await GET(req, { params: { token: 'tk_abc123' } })

    expect(res.status).toBe(307)
    expect(res.headers.get('Location')).toContain('/training/mod-1/caught?token=tk_abc123')

    expect(prisma.simulationEmail.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'sim-1' },
        data: expect.objectContaining({ clicked: true }),
      })
    )
    expect(prisma.userMetrics.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        update: expect.objectContaining({ totalClicked: { increment: 1 } }),
      })
    )
  })

  it('does not re-update if already clicked', async () => {
    const mockSimEmail = {
      id: 'sim-1',
      userId: 'user-1',
      clicked: true, // already clicked
      template: { moduleId: 'mod-1' },
      user: { id: 'user-1', name: 'Test' },
    }
    vi.mocked(prisma.simulationEmail.findUnique).mockResolvedValue(mockSimEmail as any)

    const req = makeRequest('tk_abc123')
    const res = await GET(req, { params: { token: 'tk_abc123' } })

    expect(res.status).toBe(307)
    expect(res.headers.get('Location')).toContain('/training/mod-1/caught')

    // Should not update since already clicked
    expect(prisma.simulationEmail.update).not.toHaveBeenCalled()
    expect(prisma.userMetrics.upsert).not.toHaveBeenCalled()
    expect(prisma.userHistory.create).not.toHaveBeenCalled()
  })

  it('creates UserTraining record on first click', async () => {
    const mockSimEmail = {
      id: 'sim-1',
      userId: 'user-1',
      clicked: false,
      template: { moduleId: 'mod-1' },
      user: { id: 'user-1', name: 'Test' },
    }
    vi.mocked(prisma.simulationEmail.findUnique).mockResolvedValue(mockSimEmail as any)
    vi.mocked(prisma.simulationEmail.update).mockResolvedValue({} as any)
    vi.mocked(prisma.userHistory.create).mockResolvedValue({} as any)
    vi.mocked(prisma.userMetrics.upsert).mockResolvedValue({} as any)
    vi.mocked(prisma.userTraining.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.userTraining.create).mockResolvedValue({} as any)

    const req = makeRequest('tk_abc123')
    await GET(req, { params: { token: 'tk_abc123' } })

    expect(prisma.userTraining.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          moduleId: 'mod-1',
        }),
      })
    )
  })

  it('does not create duplicate UserTraining if one already exists', async () => {
    const mockSimEmail = {
      id: 'sim-1',
      userId: 'user-1',
      clicked: false,
      template: { moduleId: 'mod-1' },
      user: { id: 'user-1', name: 'Test' },
    }
    vi.mocked(prisma.simulationEmail.findUnique).mockResolvedValue(mockSimEmail as any)
    vi.mocked(prisma.simulationEmail.update).mockResolvedValue({} as any)
    vi.mocked(prisma.userHistory.create).mockResolvedValue({} as any)
    vi.mocked(prisma.userMetrics.upsert).mockResolvedValue({} as any)
    vi.mocked(prisma.userTraining.findUnique).mockResolvedValue({ id: 'ut-1' } as any) // already exists
    vi.mocked(prisma.userTraining.create).mockResolvedValue({} as any)

    const req = makeRequest('tk_abc123')
    await GET(req, { params: { token: 'tk_abc123' } })

    expect(prisma.userTraining.create).not.toHaveBeenCalled()
  })

  it('returns 429 when rate limited', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ success: false, remaining: 0, reset: 0 })

    const req = makeRequest('tk_abc123')
    const res = await GET(req, { params: { token: 'tk_abc123' } })
    expect(res.status).toBe(429)
  })
})
