import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

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
      update: vi.fn(),
    },
    school: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

import { GET, POST } from '@/app/api/schools/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

function makeGetRequest(): NextRequest {
  return new NextRequest('http://localhost/api/schools')
}

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/schools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockUserSession = {
  user: { id: 'user-1', email: 'test@example.com', role: 'USER', schoolId: null },
}

describe('GET /api/schools', () => {
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

  it('returns school info when authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUserSession as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      school: { id: 'school-1', name: 'Demo School', inviteCode: 'DEMO01' },
    } as any)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.school).toEqual({ id: 'school-1', name: 'Demo School', inviteCode: 'DEMO01' })
  })

  it('returns null school when user has no school', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUserSession as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ school: null } as any)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.school).toBeNull()
  })
})

describe('POST /api/schools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const req = makePostRequest({ name: 'My School' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 409 when user already belongs to a school', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', role: 'MANAGER', schoolId: 'existing-school' },
    } as any)

    const req = makePostRequest({ name: 'New School' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(409)
    expect(data.error).toContain('school')
  })

  it('creates school and returns 201 for valid data', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUserSession as any)

    const mockSchool = { id: 'school-1', name: 'My School', inviteCode: 'ABCD1234' }
    vi.mocked(prisma.$transaction).mockResolvedValue([mockSchool, {}] as any)

    const req = makePostRequest({ name: 'My School' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.school).toEqual(mockSchool)
    expect(prisma.$transaction).toHaveBeenCalledOnce()
  })

  it('returns 400 when school name is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUserSession as any)

    const req = makePostRequest({})
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('School name is required')
  })

  it('returns 400 when school name is empty string', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockUserSession as any)

    const req = makePostRequest({ name: '   ' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('School name is required')
  })
})
