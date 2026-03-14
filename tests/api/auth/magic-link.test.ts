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

import { POST } from '@/app/api/auth/magic-link/route'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/magic-link', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and creates magic token when user exists', async () => {
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

    const req = makeRequest({ email: 'nobody@example.com' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.authToken.create).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('creates token with type "magic"', async () => {
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
          type: 'magic',
          email: 'test@example.com',
        }),
      })
    )
  })

  it('sets token expiry to approximately 30 minutes from now', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    } as any)
    vi.mocked(prisma.authToken.deleteMany).mockResolvedValue({ count: 0 })

    let capturedExpiresAt: Date | undefined
    vi.mocked(prisma.authToken.create).mockImplementation(async (args: any) => {
      capturedExpiresAt = args.data.expiresAt
      return {} as any
    })
    vi.mocked(sendEmail).mockResolvedValue(undefined)

    const beforeCall = Date.now()
    const req = makeRequest({ email: 'test@example.com' })
    await POST(req)
    const afterCall = Date.now()

    expect(capturedExpiresAt).toBeDefined()
    const expiresAtMs = capturedExpiresAt!.getTime()

    // Should be between 29 and 31 minutes from now
    const twentyNineMin = beforeCall + 29 * 60 * 1000
    const thirtyOneMin = afterCall + 31 * 60 * 1000

    expect(expiresAtMs).toBeGreaterThan(twentyNineMin)
    expect(expiresAtMs).toBeLessThan(thirtyOneMin)
  })

  it('deletes existing magic tokens before creating a new one', async () => {
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
      where: { email: 'test@example.com', type: 'magic' },
    })
  })
})
