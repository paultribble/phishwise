import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    authToken: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('$hashed'),
  compare: vi.fn(),
}))

// Set required env var before importing auth
process.env.NEXTAUTH_SECRET = 'test-secret-for-unit-tests'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as bcryptjs from 'bcryptjs'

// Extract the authorize function from the credentials provider
const credentialsProvider = authOptions.providers.find(
  (p) => p.id === 'credentials'
) as any
const authorize = credentialsProvider?.options?.authorize ?? credentialsProvider?.authorize

describe('NextAuth authorize function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when credentials are missing', async () => {
    const result = await authorize(undefined, {})
    expect(result).toBeNull()
  })

  it('returns null when email is missing', async () => {
    const result = await authorize({ password: 'password123' }, {})
    expect(result).toBeNull()
  })

  it('returns null when password is missing', async () => {
    const result = await authorize({ email: 'test@example.com' }, {})
    expect(result).toBeNull()
  })

  it('returns null when user is not found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const result = await authorize({ email: 'notfound@example.com', password: 'password123' }, {})
    expect(result).toBeNull()
  })

  it('returns null when user has no password (OAuth-only account)', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: null,
      role: 'USER',
      schoolId: null,
    } as any)

    const result = await authorize({ email: 'test@example.com', password: 'password123' }, {})
    expect(result).toBeNull()
  })

  it('returns null when password does not match', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: '$hashed',
      role: 'USER',
      schoolId: null,
    } as any)
    vi.mocked(bcryptjs.compare).mockResolvedValue(false as any)

    const result = await authorize({ email: 'test@example.com', password: 'wrongpassword' }, {})
    expect(result).toBeNull()
  })

  it('returns user object with id, email, role, schoolId when credentials are valid', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: '$hashed',
      role: 'USER',
      schoolId: 'school-1',
    } as any)
    vi.mocked(bcryptjs.compare).mockResolvedValue(true as any)

    const result = await authorize({ email: 'test@example.com', password: 'correctpassword' }, {})

    expect(result).not.toBeNull()
    expect(result).toMatchObject({
      id: 'user-1',
      email: 'test@example.com',
      role: 'USER',
      schoolId: 'school-1',
    })
  })

  it('returns user when valid magic token is provided', async () => {
    const mockToken = {
      id: 'token-1',
      token: 'valid-magic-token',
      email: 'test@example.com',
      type: 'magic',
      usedAt: null,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    }

    vi.mocked(prisma.authToken.findUnique).mockResolvedValue(mockToken as any)
    vi.mocked(prisma.authToken.update).mockResolvedValue({ ...mockToken, usedAt: new Date() } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      schoolId: null,
    } as any)

    const result = await authorize({ magicToken: 'valid-magic-token' }, {})

    expect(result).not.toBeNull()
    expect(result).toMatchObject({
      id: 'user-1',
      email: 'test@example.com',
    })
    // Token should be marked as used
    expect(prisma.authToken.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'token-1' },
        data: expect.objectContaining({ usedAt: expect.any(Date) }),
      })
    )
  })

  it('returns null when magic token is not found', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue(null)

    const result = await authorize({ magicToken: 'nonexistent-token' }, {})
    expect(result).toBeNull()
  })

  it('returns null when magic token is expired', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue({
      id: 'token-1',
      token: 'expired-magic-token',
      email: 'test@example.com',
      type: 'magic',
      usedAt: null,
      expiresAt: new Date(Date.now() - 1000), // expired
    } as any)

    const result = await authorize({ magicToken: 'expired-magic-token' }, {})
    expect(result).toBeNull()
  })

  it('returns null when magic token has already been used', async () => {
    vi.mocked(prisma.authToken.findUnique).mockResolvedValue({
      id: 'token-1',
      token: 'used-magic-token',
      email: 'test@example.com',
      type: 'magic',
      usedAt: new Date(Date.now() - 5 * 60 * 1000), // used 5 minutes ago
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    } as any)

    const result = await authorize({ magicToken: 'used-magic-token' }, {})
    expect(result).toBeNull()
  })
})
