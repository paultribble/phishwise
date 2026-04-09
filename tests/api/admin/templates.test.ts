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
    template: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    trainingModule: {
      findUnique: vi.fn(),
    },
  },
}))

import { GET, POST } from '@/app/api/admin/templates/route'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'

function makeRequest(body?: unknown, method = 'GET'): NextRequest {
  if (method === 'GET') {
    return new NextRequest('http://localhost/api/admin/templates')
  }
  return new NextRequest('http://localhost/api/admin/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/admin/templates', () => {
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

    it('returns 401 for MANAGER users', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'MANAGER' },
      } as any)
      const res = await GET()
      expect(res.status).toBe(401)
    })

    it('returns 200 and templates for ADMIN', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'ADMIN' },
      } as any)

      const mockTemplates = [
        { id: 't1', name: 'Phishing Template', moduleId: 'm1', module: { id: 'm1', name: 'Module 1' }, _count: { simulations: 5 } },
      ]
      vi.mocked(prisma.template.findMany).mockResolvedValue(mockTemplates as any)

      const res = await GET()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.templates).toEqual(mockTemplates)
      expect(prisma.template.findMany).toHaveBeenCalledOnce()
    })
  })

  describe('POST', () => {
    it('returns 401 for unauthenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      const req = makeRequest({ name: 'New' }, 'POST')
      const res = await POST(req)
      expect(res.status).toBe(401)
    })

    it('returns 401 for non-ADMIN', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'MANAGER' },
      } as any)
      const req = makeRequest({ name: 'New' }, 'POST')
      const res = await POST(req)
      expect(res.status).toBe(401)
    })

    it('returns 400 when required fields are missing', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'ADMIN' },
      } as any)

      const req = makeRequest({ name: 'New' }, 'POST') // missing moduleId, subject, body, difficulty
      const res = await POST(req)
      expect(res.status).toBe(400)

      const data = await res.json()
      expect(data.error).toBe('Invalid data')
    })

    it('returns 404 when module does not exist', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'ADMIN' },
      } as any)
      vi.mocked(prisma.trainingModule.findUnique).mockResolvedValue(null)

      const req = makeRequest(
        { name: 'New', moduleId: 'nonexistent', subject: 'Test', body: 'Body', difficulty: 3 },
        'POST'
      )
      const res = await POST(req)
      expect(res.status).toBe(404)
    })

    it('creates template for ADMIN with valid data', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'ADMIN' },
      } as any)
      vi.mocked(prisma.trainingModule.findUnique).mockResolvedValue({ id: 'm1' } as any)

      const mockTemplate = {
        id: 't1',
        name: 'New Template',
        moduleId: 'm1',
        subject: 'Test Subject',
        body: 'Email body',
        difficulty: 3,
        module: { id: 'm1', name: 'Module 1' },
        _count: { simulations: 0 },
      }
      vi.mocked(prisma.template.create).mockResolvedValue(mockTemplate as any)

      const req = makeRequest(
        { name: 'New Template', moduleId: 'm1', subject: 'Test Subject', body: 'Email body', difficulty: 3 },
        'POST'
      )
      const res = await POST(req)
      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.name).toBe('New Template')
      expect(prisma.template.create).toHaveBeenCalledOnce()
    })
  })
})
