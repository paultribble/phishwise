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
    school: {
      findUnique: vi.fn(),
    },
  },
}))

import { GET } from '@/app/api/manager/analytics/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

describe('GET /api/manager/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 401 for USER role', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', role: 'USER' },
    } as any)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 404 when manager has no school', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'mgr-1', role: 'MANAGER' },
    } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ schoolId: null } as any)

    const res = await GET()
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('No school assigned')
  })

  it('returns 200 with analytics for MANAGER with school', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'mgr-1', role: 'MANAGER' },
    } as any)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({ schoolId: 'school-1' } as any)
    vi.mocked(prisma.school.findUnique).mockResolvedValue({
      id: 'school-1',
      name: 'Demo School',
      inviteCode: 'DEMO01',
      frequency: 'weekly',
      createdAt: new Date('2026-01-01'),
    } as any)

    const mockUsers = [
      {
        id: 'u1',
        name: 'Alice',
        email: 'alice@example.com',
        metrics: { totalSent: 10, totalClicked: 3, totalCompleted: 2, lastActivity: new Date('2026-03-10') },
      },
      {
        id: 'u2',
        name: 'Bob',
        email: 'bob@example.com',
        metrics: { totalSent: 10, totalClicked: 5, totalCompleted: 1, lastActivity: new Date('2026-03-12') },
      },
    ]
    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)

    const res = await GET()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.school.name).toBe('Demo School')
    expect(data.school.totalUsers).toBe(2)
    expect(data.aggregateStats.totalSimulationsSent).toBe(20)
    expect(data.aggregateStats.totalSimulationsClicked).toBe(8)
    expect(data.aggregateStats.averageClickRate).toBe(40)
    expect(data.userPerformance).toHaveLength(2)
    expect(data.userPerformance[0].name).toBe('Alice')
    expect(data.userPerformance[0].clickRate).toBe(30)
    expect(data.userPerformance[1].clickRate).toBe(50)
  })

  it('calculates usersNeedingAttention correctly (>30% click rate)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'mgr-1', role: 'MANAGER' },
    } as any)

    vi.mocked(prisma.user.findUnique).mockResolvedValue({ schoolId: 'school-1' } as any)
    vi.mocked(prisma.school.findUnique).mockResolvedValue({ id: 'school-1', name: 'School' } as any)

    const mockUsers = [
      { id: 'u1', name: 'Safe', email: 'safe@test.com', metrics: { totalSent: 10, totalClicked: 2, totalCompleted: 0, lastActivity: null } },
      { id: 'u2', name: 'Risky', email: 'risky@test.com', metrics: { totalSent: 10, totalClicked: 5, totalCompleted: 0, lastActivity: null } },
      { id: 'u3', name: 'New', email: 'new@test.com', metrics: null },
    ]
    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)

    const res = await GET()
    const data = await res.json()

    expect(data.aggregateStats.usersNeedingAttention).toBe(1) // only 'Risky' has >30%
  })
})
