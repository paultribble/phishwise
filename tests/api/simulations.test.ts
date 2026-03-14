import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}))

// next-auth re-exports getServerSession; the route imports from 'next-auth' directly
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    simulationEmail: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    userMetrics: {
      upsert: vi.fn(),
    },
  },
}))

import { GET, POST } from '@/app/api/simulations/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

function makeGetRequest(queryString = ''): NextRequest {
  return new NextRequest(`http://localhost/api/simulations${queryString}`)
}

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/simulations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockSession = {
  user: { id: 'user-1', email: 'test@example.com', role: 'USER', schoolId: null },
}

describe('GET /api/simulations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const req = makeGetRequest()
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 200 with simulations array when authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.simulationEmail.findMany).mockResolvedValue([
      { id: 'sim-1', userId: 'user-1', clicked: false } as any,
    ])
    vi.mocked(prisma.simulationEmail.count).mockResolvedValue(1)

    const req = makeGetRequest()
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(Array.isArray(data.simulations)).toBe(true)
    expect(data.total).toBe(1)
  })

  it('filters simulations by the current user id', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.simulationEmail.findMany).mockResolvedValue([])
    vi.mocked(prisma.simulationEmail.count).mockResolvedValue(0)

    const req = makeGetRequest()
    await GET(req)

    expect(prisma.simulationEmail.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
      })
    )
    expect(prisma.simulationEmail.count).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    })
  })
})

describe('POST /api/simulations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when simulationId is missing', async () => {
    const req = makePostRequest({})
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('simulationId is required')
  })

  it('returns 404 when simulation not found', async () => {
    vi.mocked(prisma.simulationEmail.findUnique).mockResolvedValue(null)

    const req = makePostRequest({ simulationId: 'nonexistent' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.error).toBe('Simulation not found')
  })

  it('marks simulation as clicked and returns 200', async () => {
    const mockSim = { id: 'sim-1', userId: 'user-1', templateId: 'tmpl-1', clicked: false }
    vi.mocked(prisma.simulationEmail.findUnique).mockResolvedValue(mockSim as any)
    vi.mocked(prisma.simulationEmail.update).mockResolvedValue({ ...mockSim, clicked: true } as any)
    vi.mocked(prisma.userMetrics.upsert).mockResolvedValue({} as any)

    const req = makePostRequest({ simulationId: 'sim-1' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.clicked).toBe(true)
    expect(prisma.simulationEmail.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'sim-1' },
        data: { clicked: true },
      })
    )
  })
})
