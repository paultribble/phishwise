import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    trainingModule: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { GET, POST } from '@/app/api/admin/modules/route'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'

function makeRequest(body?: unknown, method = 'GET'): NextRequest {
  if (method === 'GET') {
    return new NextRequest('http://localhost/api/admin/modules')
  }
  return new NextRequest('http://localhost/api/admin/modules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/admin/modules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 for unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns 401 for non-ADMIN users', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'USER' },
      } as any)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns 200 and modules for ADMIN', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'ADMIN' },
      } as any)

      const mockModules = [
        { id: 'm1', name: 'Phishing 101', orderIndex: 0, _count: { templates: 3, userProgress: 10 } },
        { id: 'm2', name: 'Advanced Phishing', orderIndex: 1, _count: { templates: 2, userProgress: 5 } },
      ]
      vi.mocked(prisma.trainingModule.findMany).mockResolvedValue(mockModules as any)

      const res = await GET()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.modules).toEqual(mockModules)
      expect(data.modules).toHaveLength(2)
    })
  })

  describe('POST', () => {
    it('returns 401 for unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const req = makeRequest({ name: 'New Module' }, 'POST')
      const res = await POST(req)
      expect(res.status).toBe(401)
    })

    it('returns 401 for non-ADMIN', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'MANAGER' },
      } as any)
      const req = makeRequest({ name: 'New Module' }, 'POST')
      const res = await POST(req)
      expect(res.status).toBe(401)
    })

    it('returns 400 when required fields are missing', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'ADMIN' },
      } as any)

      const req = makeRequest({ name: 'New Module' }, 'POST') // missing description, content, orderIndex
      const res = await POST(req)
      expect(res.status).toBe(400)

      const data = await res.json()
      expect(data.error).toBe('Invalid data')
    })

    it('creates module for ADMIN with valid data', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'ADMIN' },
      } as any)

      const mockModule = {
        id: 'm1',
        name: 'New Module',
        description: 'A new training module',
        content: '# Module Content',
        orderIndex: 5,
        _count: { templates: 0, userProgress: 0 },
      }
      vi.mocked(prisma.trainingModule.create).mockResolvedValue(mockModule as any)

      const req = makeRequest(
        { name: 'New Module', description: 'A new training module', content: '# Module Content', orderIndex: 5 },
        'POST'
      )
      const res = await POST(req)
      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.name).toBe('New Module')
      expect(prisma.trainingModule.create).toHaveBeenCalledOnce()
    })
  })
})
