import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ─── In-memory rate limiter ───────────────────────────────────────────────────
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

// Purge expired entries (called on each request to avoid setInterval in edge/serverless)
function purgeExpired() {
  const now = Date.now()
  Array.from(rateLimitStore.keys()).forEach((key) => {
    const val = rateLimitStore.get(key)
    if (val && val.resetAt < now) rateLimitStore.delete(key)
  })
}

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/auth/forgot-password': { max: 3,  windowMs: 15 * 60 * 1000 },
  '/api/auth/magic-link':      { max: 3,  windowMs: 15 * 60 * 1000 },
  '/api/auth/register':        { max: 10, windowMs: 15 * 60 * 1000 },
  '/api/auth/reset-password':  { max: 5,  windowMs: 15 * 60 * 1000 },
}

function checkRateLimit(ip: string, path: string): boolean {
  const limit = RATE_LIMITS[path]
  if (!limit) return true

  const key = `${ip}:${path}`
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + limit.windowMs })
    return true
  }

  if (entry.count >= limit.max) return false

  entry.count++
  return true
}

// ─── Security headers ─────────────────────────────────────────────────────────
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  )
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  // HSTS only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  return response
}

// ─── Middleware ───────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  purgeExpired()

  // Rate limit sensitive API endpoints
  if (RATE_LIMITS[pathname]) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    if (!checkRateLimit(ip, pathname)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '900' } }
        )
      )
    }
  }

  // Protect dashboard routes — require valid JWT
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/auth/forgot-password',
    '/api/auth/magic-link',
    '/api/auth/register',
    '/api/auth/reset-password',
    '/((?!_next/static|_next/image|favicon.ico|logo.jpg|landing/).*)',
  ],
}
