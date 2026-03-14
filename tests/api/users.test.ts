import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    userTraining: {
      findMany: vi.fn(),
    },
  },
}))

import { GET } from '@/app/api/users/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

describe('GET /api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 200 with user profile and metrics when authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', role: 'USER', schoolId: null },
    } as any)

    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      schoolId: null,
      metrics: { totalSent: 5, totalClicked: 2, totalCompleted: 1 },
      school: null,
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
    vi.mocked(prisma.userTraining.findMany).mockResolvedValue([])

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.user).toBeDefined()
    expect(data.user.id).toBe('user-1')
    expect(data.user.metrics).toBeDefined()
  })

  it('response includes role and schoolId', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', role: 'MANAGER', schoolId: 'school-1' },
    } as any)

    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Manager User',
      role: 'MANAGER',
      schoolId: 'school-1',
      metrics: null,
      school: { id: 'school-1', name: 'Test School', inviteCode: 'TEST01' },
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
    vi.mocked(prisma.userTraining.findMany).mockResolvedValue([])
    vi.mocked(prisma.user.findMany).mockResolvedValue([mockUser] as any)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.user.role).toBe('MANAGER')
    expect(data.user.schoolId).toBe('school-1')
  })

  it('returns 404 when user not found in database', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'ghost-user', email: 'ghost@example.com', role: 'USER', schoolId: null },
    } as any)

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.error).toBe('User not found')
  })

  it('includes pendingTraining in response', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', role: 'USER', schoolId: null },
    } as any)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      role: 'USER',
      schoolId: null,
      metrics: null,
      school: null,
    } as any)

    vi.mocked(prisma.userTraining.findMany).mockResolvedValue([
      {
        id: 'ut-1',
        userId: 'user-1',
        moduleId: 'mod-1',
        completedAt: null,
        module: { id: 'mod-1', name: 'Phishing Basics' },
      },
    ] as any)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.pendingTraining).toBeDefined()
    expect(Array.isArray(data.pendingTraining)).toBe(true)
    expect(data.pendingTraining).toHaveLength(1)
    expect(data.pendingTraining[0]).toEqual({ id: 'mod-1', name: 'Phishing Basics' })
  })
})
