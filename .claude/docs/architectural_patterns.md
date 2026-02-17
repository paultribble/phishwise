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

### Color Semantics
- `primary-*` (blue) — brand, navigation, interactive elements
- `danger-*` (red) — phishing alerts, clicked indicators
- `success-*` (green) — training completion, safe status
- `warning-*` (amber) — medium risk, pending states
- `phish-*` — legacy aliases used in public pages (`phish-navy`, `phish-blue`, `phish-accent`)

### Dark-First Design
All pages use a dark navy gradient background (`app/globals.css:46-49`). Text colors use gray scale (gray-200 for headings, gray-400 for body, gray-500 for muted). Cards use `bg-phish-blue/30` with `border-gray-700`.

### shadcn/ui CSS Variables
Component tokens use HSL values without the `hsl()` wrapper in CSS custom properties (`app/globals.css:6-35`). Tailwind classes reference them as `hsl(var(--token))` in `tailwind.config.ts`.
