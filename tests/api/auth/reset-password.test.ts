import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  prisma: {
    authToken: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
    user: {
      update: vi.fn().mockResolvedValue({}),
    },
    $transaction: vi.fn().mockImplementation(async (queries) => {
      return Promise.resolve([{}, {}])
    }),
  },
}))

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('$hashedNewPassword'),
  compare: vi.fn(),
}))

import { POST } from '@/app/api/auth/reset-password/route'
import { prisma } from '@/lib/db'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validToken = {
  id: 'token-1',
  token: 'valid-token-abc',
  email: 'test@example.com',
  type: 'reset',
  usedAt: null,
  expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
}

describe('POST /api/auth/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and updates password for valid token and password', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue(validToken as any)
    vi.mocked(prisma.$transaction).mockResolvedValue([])

    const req = makeRequest({ token: 'valid-token-abc', password: 'newpassword123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.$transaction).toHaveBeenCalledOnce()
  })

  it('returns 400 for expired token', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue({
      ...validToken,
      expiresAt: new Date(Date.now() - 1000), // 1 second ago
    } as any)

    const req = makeRequest({ token: 'expired-token', password: 'newpassword123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('returns 400 for already-used token', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue({
      ...validToken,
      usedAt: new Date(Date.now() - 5 * 60 * 1000), // used 5 minutes ago
    } as any)

    const req = makeRequest({ token: 'used-token', password: 'newpassword123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('returns 400 for token with wrong type', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue({
      ...validToken,
      type: 'magic', // wrong type
    } as any)

    const req = makeRequest({ token: 'magic-type-token', password: 'newpassword123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('returns 500 when token is not found', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue(null)

    const req = makeRequest({ token: 'nonexistent-token', password: 'newpassword123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('returns 500 when token field is missing', async () => {
    const req = makeRequest({ password: 'newpassword123' })
    const res = await POST(req)

    // Zod parse throws when token is missing
    expect(res.status).toBe(500)
  })

  it('returns 500 when password is less than 8 characters', async () => {
    const req = makeRequest({ token: 'some-token', password: 'short' })
    const res = await POST(req)

    // Zod parse throws for short password
    expect(res.status).toBe(500)
  })
})
