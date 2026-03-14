import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    authToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
}))

import { POST } from '@/app/api/auth/forgot-password/route'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and creates token when user exists', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    } as any)
    vi.mocked(prisma.authToken.deleteMany).mockResolvedValue({ count: 0 })
    vi.mocked(prisma.authToken.create).mockResolvedValue({} as any)
    vi.mocked(sendEmail).mockResolvedValue(undefined)

    const req = makeRequest({ email: 'test@example.com' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.authToken.create).toHaveBeenCalledOnce()
    expect(sendEmail).toHaveBeenCalledOnce()
  })

  it('returns 200 even when user does not exist (no enumeration)', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const req = makeRequest({ email: 'nonexistent@example.com' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.authToken.create).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('returns 500 for invalid email format', async () => {
    const req = makeRequest({ email: 'not-an-email' })
    const res = await POST(req)

    // Zod throws causing the catch block to return 500
    expect(res.status).toBe(500)
  })

  it('deletes old tokens before creating new one', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    } as any)
    vi.mocked(prisma.authToken.deleteMany).mockResolvedValue({ count: 1 })
    vi.mocked(prisma.authToken.create).mockResolvedValue({} as any)
    vi.mocked(sendEmail).mockResolvedValue(undefined)

    const req = makeRequest({ email: 'test@example.com' })
    await POST(req)

    expect(prisma.authToken.deleteMany).toHaveBeenCalledWith({
      where: { email: 'test@example.com', type: 'reset' },
    })

    // deleteMany should be called before create
    const deleteManyOrder = vi.mocked(prisma.authToken.deleteMany).mock.invocationCallOrder[0]
    const createOrder = vi.mocked(prisma.authToken.create).mock.invocationCallOrder[0]
    expect(deleteManyOrder).toBeLessThan(createOrder)
  })

  it('creates token with type "reset"', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    } as any)
    vi.mocked(prisma.authToken.deleteMany).mockResolvedValue({ count: 0 })
    vi.mocked(prisma.authToken.create).mockResolvedValue({} as any)
    vi.mocked(sendEmail).mockResolvedValue(undefined)

    const req = makeRequest({ email: 'test@example.com' })
    await POST(req)

    expect(prisma.authToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'reset',
          email: 'test@example.com',
        }),
      })
    )
  })
})
