import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('$hashed'),
  compare: vi.fn(),
}))

import { POST } from '@/app/api/auth/register/route'
import { prisma } from '@/lib/db'
import * as bcryptjs from 'bcryptjs'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates user and returns 201 for valid data', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com', name: 'Test User' }
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any)

    const req = makeRequest({ name: 'Test User', email: 'test@example.com', password: 'password123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.user).toEqual(mockUser)
    expect(prisma.user.create).toHaveBeenCalledOnce()
  })

  it('returns 409 for duplicate email', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'existing-user',
      email: 'test@example.com',
    } as any)

    const req = makeRequest({ name: 'Test User', email: 'test@example.com', password: 'password123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(409)
    expect(data.error).toBe('Email already registered')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('returns 400 when email is missing', async () => {
    const req = makeRequest({ name: 'Test User', password: 'password123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('returns 400 when password is less than 8 characters', async () => {
    const req = makeRequest({ name: 'Test User', email: 'test@example.com', password: 'short' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toContain('8')
  })

  it('stores password as bcrypt hash', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    } as any)

    const req = makeRequest({ name: 'Test User', email: 'test@example.com', password: 'password123' })
    await POST(req)

    expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 12)
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ password: '$hashed' }),
      })
    )
  })

  it('returns 400 when name is too short', async () => {
    const req = makeRequest({ name: 'A', email: 'test@example.com', password: 'password123' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })
})
