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
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

import { GET } from '@/app/api/manager/export/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

describe('GET /api/manager/export', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 401 for non-MANAGER', async () => {
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
  })

  it('returns CSV with correct content-type header', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'mgr-1', role: 'MANAGER' },
    } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ schoolId: 'school-1' } as any)
    vi.mocked(prisma.user.findMany).mockResolvedValue([] as any)

    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/csv')
    expect(res.headers.get('Content-Disposition')).toContain('phishwise-report-')
  })

  it('returns CSV with header row and data rows', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'mgr-1', role: 'MANAGER' },
    } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ schoolId: 'school-1' } as any)

    const mockUsers = [
      {
        id: 'u1',
        name: 'Alice Smith',
        email: 'alice@test.com',
        metrics: {
          totalSent: 10,
          totalClicked: 2,
          totalCompleted: 3,
          lastActivity: new Date('2026-03-10T12:00:00Z'),
        },
      },
      {
        id: 'u2',
        name: null,
        email: 'bob@test.com',
        metrics: null,
      },
    ]
    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)

    const res = await GET()
    const csv = await res.text()

    const lines = csv.split('\n')
    expect(lines[0]).toBe('Name,Email,Simulations Sent,Links Clicked,Click Rate (%),Trainings Completed,Last Activity')
    expect(lines[1]).toContain('Alice Smith')
    expect(lines[1]).toContain('alice@test.com')
    expect(lines[1]).toContain('10')
    expect(lines[1]).toContain('2')
    expect(lines[1]).toContain('20') // 2/10 = 20%
    expect(lines[1]).toContain('3')
    expect(lines[1]).toContain('2026-03-10')

    // User with no metrics
    expect(lines[2]).toContain('Unknown')
    expect(lines[2]).toContain('bob@test.com')
    expect(lines[2]).toContain('0')
    expect(lines[2]).toContain('N/A')
  })

  it('escapes CSV fields containing commas', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'mgr-1', role: 'MANAGER' },
    } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ schoolId: 'school-1' } as any)

    const mockUsers = [
      {
        id: 'u1',
        name: 'Last, First',
        email: 'test@test.com',
        metrics: { totalSent: 0, totalClicked: 0, totalCompleted: 0, lastActivity: null },
      },
    ]
    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)

    const res = await GET()
    const csv = await res.text()

    expect(csv).toContain('"Last, First"')
  })
})
