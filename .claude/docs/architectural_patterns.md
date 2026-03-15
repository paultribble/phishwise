# Architectural Patterns

## Route Groups for Layout Isolation

The `app/(dashboard)/` route group provides a shared layout (`app/(dashboard)/layout.tsx`) that wraps all authenticated pages with:
1. `SessionProvider` (NextAuth client-side session context)
2. `Navbar` component (role-aware navigation)
3. Consistent page chrome (max-width container, footer)

Public pages (`/`, `/login`, `/signup`, `/learn-more`) live outside this group and have no shared layout beyond the root `app/layout.tsx`.

Reference: `app/(dashboard)/layout.tsx:1-16`

## API Route Authentication Pattern

Every API route follows the same auth guard:

1. Call `getServerSession(authOptions)` from `next-auth`
2. Check `session?.user?.id` — return 401 if missing
3. Use `session.user.id` to scope all database queries to the authenticated user
4. Role checks (MANAGER/ADMIN) happen after auth, not before

This pattern is consistent across:
- `app/api/simulations/route.ts:10-15`
- `app/api/users/route.ts:11-16`

New API routes must follow this same pattern. Never trust client-provided user IDs — always derive from the session.

## Session Augmentation

NextAuth session is extended with custom fields via:
- Callback in `lib/auth.ts:14-26` — fetches `role` and `schoolId` from DB on every session read
- Type declaration in `types/next-auth.d.ts` — adds `id`, `role`, `schoolId` to `session.user`

When adding new user fields to the session, update both files.

## Role-Based UI Rendering

Components conditionally render based on `session.user.role`:

- `components/dashboard/Navbar.tsx:35-37` — switches between `userNav` and `managerNav` arrays
- `app/(dashboard)/dashboard/manager/page.tsx` — manager-only page
- `app/api/users/route.ts:31-33` — managers get `schoolUsers` in API response

Pattern: Define role-specific data as static arrays/configs, select at render time. Avoid deeply nested role conditionals.

## Component Architecture

### UI Primitives (`components/ui/`)
shadcn/ui pattern: each file exports a single component built on Radix UI primitives, styled with `cva` (class-variance-authority) for variants. All accept `className` prop merged via `cn()`.

Example variant pattern from `components/ui/button.tsx:8-28`:
- Define variants with `cva()`
- Export both the component and the `variants` const
- Use `asChild` prop (via Radix `Slot`) for composable rendering

### Feature Components (`components/dashboard/`, `components/providers/`)
Organized by feature domain. Always `"use client"` when using hooks. Keep component files focused — one exported component per file.

### Page Components (`app/**/page.tsx`)
Dashboard pages follow this structure:
1. `"use client"` directive
2. `useSession()` hook with loading state and redirect
3. Mock data constants (to be replaced with API calls)
4. Stats grid using `Card` components
5. Data table with `Badge` status indicators

Reference: `app/(dashboard)/dashboard/user/page.tsx` and `app/(dashboard)/dashboard/manager/page.tsx`

## Database Access Pattern

### Singleton Prisma Client
`lib/db.ts` uses the global singleton pattern to prevent connection pool exhaustion during Next.js hot reloads. Always import from `@/lib/db`, never instantiate `PrismaClient` directly.

### Denormalized Metrics
`UserMetrics` stores pre-computed counters (totalSent, totalClicked, etc.) updated via `prisma.userMetrics.upsert()` on events. This avoids expensive aggregate queries on the dashboard.

Reference: `app/api/simulations/route.ts:72-81` — upsert pattern for incrementing counters.

### Selective Includes
API routes use Prisma `include` with `select` to limit returned fields:
```
include: {
  template: { select: { name: true, subject: true, difficulty: true } },
  campaign: { select: { name: true } },
}
```
Reference: `app/api/simulations/route.ts:26-29`

Always use `select` within `include` to avoid over-fetching related data.

## Email Abstraction

`lib/email.ts` implements a provider-agnostic email function with automatic fallback:
1. If `RESEND_API_KEY` is set → use Resend
2. Else if `SENDGRID_API_KEY` is set → use SendGrid
3. Else → log to console (development fallback)

Providers are dynamically imported to avoid bundling unused SDKs. New email providers should follow this cascading pattern.

## Design System

### Color Semantics (Glassmorphism Theme)
- `primary-*` (blue) — brand, navigation, interactive elements
- `danger-*` (red) — phishing alerts, clicked indicators
- `success-*` (green) — training completion, safe status
- `warning-*` (amber) — medium risk, pending states
- `phish-*` — legacy aliases (deprecated, replaced by glassmorphism in dashboards)

### Glassmorphism Theme (Phases 1-4)
Dashboard pages now use:
- Page background: `bg-[#0f0f1a]`
- Cards: `rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6`
- Shimmer top-line: `absolute top-0 left-6 right-6 h-px` with `linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)`
- Buttons: `bg-blue-700 hover:bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)]`
- Inputs: `bg-[#252540] border border-white/10 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50`
- Text: headings `text-white`, body `text-slate-300`, muted `text-slate-500`
- Eyebrows: `text-xs uppercase tracking-[0.18em] font-semibold text-blue-400`

Reference: `app/(dashboard)/dashboard/user/page.tsx`, `app/(dashboard)/dashboard/manager/page.tsx`

### shadcn/ui CSS Variables
Component tokens use HSL values without the `hsl()` wrapper in CSS custom properties (`app/globals.css:6-35`). Tailwind classes reference them as `hsl(var(--token))` in `tailwind.config.ts`.

---

## Security Patterns (Phase 5)

### Security Headers Middleware
**File:** `middleware.ts` (root level)

All responses include security headers:
1. **Content-Security-Policy** — Prevents XSS attacks
   - `default-src 'self'` — only same-origin by default
   - `script-src 'self' 'unsafe-inline' 'unsafe-eval'` — required for NextAuth + analytics
   - `style-src 'self' 'unsafe-inline'` — required for Tailwind CSS
   - `img-src 'self' https: data:` — allow images from self and data URIs
   - `font-src 'self' data:` — allow fonts from self and data URIs
   - `connect-src 'self' https:` — API calls to self or HTTPS

2. **X-Frame-Options: SAMEORIGIN** — Prevents clickjacking (same-origin iframes only)

3. **X-Content-Type-Options: nosniff** — Prevents MIME sniffing attacks

4. **Referrer-Policy: strict-origin-when-cross-origin** — Controls referrer header leakage

5. **Permissions-Policy** — Restricts browser features
   - `geolocation=(), microphone=(), camera=(), payment=()` — all disabled

6. **Strict-Transport-Security (HSTS)** — Production only
   - `max-age=31536000; includeSubDomains` — 1 year, subdomains included
   - Only sent in production (`process.env.NODE_ENV === 'production'`)

Matcher pattern: Apply to all routes except `/api/*` (API routes return early).

### Rate Limiting
**File:** `lib/rate-limit.ts`

Provides `checkRateLimit(key, limit, windowMs)` helper using Upstash Redis:
- Development fallback: if env vars missing, skips rate limiting (console warning)
- Production fallback: if Redis unavailable, fails open (returns success)

**Protected endpoints:**
- `/api/manager/invite` — 5 per hour per IP
- `/api/demo/send-test-email` — 10 per day per user
- `/api/track/click/[token]` — 100 per day per IP (public endpoint)
- `/api/training/caught-data` — 20 per day per IP
- `/api/schools/join` — 10 per hour per IP

Get IP from request: `const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown'`

Returns 429 with `{ error: "Too many requests. Try again later" }` when limit exceeded.

### Error Handling Standards
**File:** `lib/errors.ts`

15 standardized error codes:
- `ERR_UNAUTHORIZED` (401)
- `ERR_INVALID_INPUT` (400)
- `ERR_NOT_FOUND` (404)
- `ERR_RATE_LIMIT` (429)
- `ERR_INTERNAL` (500)
- `ERR_INVALID_INVITE` (400)
- `ERR_SCHOOL_NOT_FOUND` (404)
- `ERR_INVALID_EMAIL` (400)
- And 7 more domain-specific errors

Each has: `code` (string), `status` (number), `message` (string)

Usage in API routes:
```typescript
import { ApiError, errors } from '@/lib/errors';

// Throw standardized error
throw errors.invalidInvite();  // Returns 400 with code + message

// Return from handler
return NextResponse.json(errors.unauthorized().toJSON(), { status: 401 });
```

### Structured Logging
**File:** `lib/logger.ts`

Logger provides methods: `info()`, `warn()`, `error()`, `debug()`

Format in production: JSON with `{ timestamp, level, message, context }`

Format in development: Pretty-printed console logs with context

Never logs sensitive data (passwords, tokens, secrets).

Usage:
```typescript
import { logger } from '@/lib/logger';

logger.info('Operation completed', { userId: user.id, schoolId: school.id });
logger.warn('Unauthorized attempt', { userId, action: 'invite' });
logger.error('Database error', { error: err.message, route: '/api/schools' });
```

Integrated in 5 critical routes: invite, export, test-email, profile, password

### Input Validation with Zod
**Pattern across all API routes:**

```typescript
import { z } from 'zod';
import { ApiError, errors } from '@/lib/errors';

const schema = z.object({
  inviteCode: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw errors.unauthorized();

  const body = await request.json();

  try {
    schema.parse(body);
  } catch (error) {
    logger.warn('Validation error', { route: '/api/schools/join', error: String(error) });
    return NextResponse.json(errors.invalidInput('inviteCode').toJSON(), { status: 400 });
  }

  // Process validated input
}
```

All 15+ API routes now have Zod schemas for request validation.

### Environment Configuration
**File:** `lib/config.ts`

Centralized configuration flags:
```typescript
export const config = {
  isProduction: process.env.ENVIRONMENT === 'production',
  isStaging: process.env.ENVIRONMENT === 'staging',
  isDevelopment: process.env.ENVIRONMENT === 'development',
  enableScheduler: process.env.ENVIRONMENT !== 'development',
  enableSeedDatabase: process.env.ENVIRONMENT !== 'production',
};
```

**Usage in seed.ts:**
```typescript
import { config } from '@/lib/config';

async function main() {
  if (config.isProduction) {
    console.log('🚫 Skipping seed in production');
    return;
  }
  // Seed logic
}
```

**Branch-based environment (Vercel Dashboard):**

Set environment variables per environment in Vercel Project Settings → Environment Variables:

Production branch (main):
- `ENVIRONMENT` = `production`
- `DATABASE_URL` = `<prod-url>`
- `UPSTASH_REDIS_REST_URL` = `<prod-redis>`
- All other secrets (NEXTAUTH_SECRET, OAuth creds, API keys)

Staging/Preview (feature branches):
- `ENVIRONMENT` = `staging`
- `DATABASE_URL` = `<staging-url>`
- `UPSTASH_REDIS_REST_URL` = `<staging-redis>`
- Same secrets OR separate staging credentials

See [Vercel Environment Variables docs](https://vercel.com/docs/projects/environment-variables)

---

## Mobile Responsiveness (Phase 4)

### Dashboard Layout
`app/(dashboard)/layout.tsx` — Container with responsive padding:
- `px-4 md:px-6` — 4px padding mobile, 6px tablet+
- `max-w-7xl mx-auto` — max width cap

### Stat Cards Grid
All stat card grids use:
- `grid grid-cols-2 md:grid-cols-4` — 2 columns mobile, 4 columns desktop

Reference: `app/(dashboard)/dashboard/user/page.tsx:45-70`

### Tables
Wrapped in `overflow-x-auto` container for mobile scrolling:
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    {/* table content */}
  </table>
</div>
```

Reference: `app/(dashboard)/dashboard/manager/page.tsx:180-220`
