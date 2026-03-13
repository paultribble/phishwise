# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PhishWise

Web-based phishing awareness training platform. Users receive simulated phishing emails at randomized intervals. Clicking a malicious link redirects to targeted educational modules. Three roles: USER (receives simulations), MANAGER (oversees "schools", views analytics), ADMIN (maintains templates/system).

University of Arkansas CSCE Capstone - Team 20.

## Tech Stack (Current Implementation)

- **Framework**: Next.js 14 App Router + TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components (Radix UI primitives)
- **Database**: PostgreSQL via Vercel Postgres + Prisma ORM (v6.19.2)
- **Auth**: NextAuth.js v4 with Google OAuth 2.0 + @auth/prisma-adapter (v2.7.0)
- **Email**: Resend (dev) / SendGrid (prod) — configured in `lib/email.ts`, uses dynamic imports
- **Validation**: Zod (v3.24.1)
- **Forms**: React Hook Form (v7.54.2)
- **Charts**: Recharts (v2.15.0)
- **Icons**: Lucide React (v0.473.0)
- **Hosting**: Vercel (serverless, auto-deployment from GitHub)
- **Missing**: Testing framework (Jest/Vitest), API documentation, security middleware

## Project Structure (Current)

```
app/                                    # Next.js App Router pages
  (dashboard)/                          # Route group — shared Navbar + SessionProvider
    dashboard/
      user/page.tsx                     # User dashboard (stats, simulation history)
      manager/page.tsx                  # Manager dashboard (school analytics, user performance)
      settings/page.tsx                 # User settings
      onboarding/page.tsx               # User onboarding flow
    layout.tsx                          # Dashboard layout (Navbar + SessionProvider)
  api/                                  # REST API routes
    auth/[...nextauth]/route.ts         # NextAuth handler
    simulations/route.ts                # GET history (paginated), POST click events
    track/click/[token]/route.ts        # Click tracking webhook, redirects to training
    track/open/[token]/route.ts         # Open tracking webhook
    training/[moduleId]/route.ts        # Training module content
    training/[moduleId]/complete/route.ts # Mark module complete, record score
    training/caught-data/route.ts       # Handle user "I caught this" submission
    users/route.ts                      # GET profile + metrics, includes pending training
    schools/route.ts                    # POST create school, GET school data
    schools/[id]/route.ts               # GET/PUT school, manage settings
    schools/[id]/frequency/route.ts     # PUT simulation frequency
    schools/join/route.ts               # POST join school with invite code
    manager/analytics/route.ts          # GET school analytics (MANAGER only)
    manager/assign-training/route.ts    # POST assign training modules (MANAGER only)
    admin/trigger-simulation/route.ts   # POST manually trigger simulation (ADMIN only)
    admin/scheduler-status/route.ts     # GET scheduler status (ADMIN only)
    scheduler/send-simulations/route.ts # POST cron job to send scheduled simulations
    demo/send-test-email/route.ts       # POST send demo email (for testing)
  training/[moduleId]/page.tsx          # Training module viewer
  training/[moduleId]/caught/page.tsx   # "I caught this" submission page
  training/page.tsx                     # Training modules list
  page.tsx                              # Home page (public)
  login/page.tsx                        # Login page (public, Google OAuth)
  signup/page.tsx                       # Signup page (public, redirects to login)
  learn-more/page.tsx                   # Learn more page (public)
  layout.tsx                            # Root layout (metadata, SessionProvider)
  globals.css                           # Design tokens, dark mode setup
components/
  ui/                                   # shadcn/ui primitives
    button.tsx, card.tsx, badge.tsx, progress.tsx, etc.
    PhishWiseLogo.tsx                   # Custom logo component
  dashboard/
    Navbar.tsx                          # Role-aware navigation component
    PendingTrainingBanner.tsx           # Banner for pending training modules
  providers/
    SessionProvider.tsx                 # NextAuth session wrapper (client)
lib/
  auth.ts                               # NextAuth config, session callbacks
  db.ts                                 # Prisma singleton client (global pattern)
  email.ts                              # Email abstraction (Resend → SendGrid → console)
  utils.ts                              # cn() utility for classname merging
  fonts.ts                              # Font imports (Bebas, Playfair, Inter)
prisma/
  schema.prisma                         # Database schema (11 models)
  seed.ts                               # Seed script (8 modules, 20 templates, demo data)
types/
  next-auth.d.ts                        # Session type augmentation (id, role, schoolId)
public/
  logo.webp                             # Brand logo
vercel.json                             # Vercel build config
tsconfig.json                           # TypeScript strict mode
package.json                            # Dependencies, build scripts, auto-migration
.env.local.example                      # Environment template
CLAUDE.md                               # This file
OAUTH_SETUP.md                          # OAuth detailed setup guide
QUICKSTART.md                           # OAuth quick start (5 min)
.claude/docs/
  architectural_patterns.md             # Documented patterns in codebase
```
```

## Commands (npm scripts in package.json)

```bash
npm run dev              # Start dev server (localhost:3000, hot reload)
npm run build            # Production build: db:migrate → next build → postbuild (seed)
npm run postbuild        # Auto-runs after build: db:seed (re-seeds if needed)
npm run start            # Start production server (runs built app)
npm run lint             # ESLint + Next.js linting

npm run db:migrate       # Push schema with --force-reset (CAUTION: deletes data), uses || true fallback
npm run db:generate      # Regenerate Prisma client (auto-runs on postinstall)
npm run db:push          # Interactive schema push with --accept-data-loss confirmation
npm run db:studio        # Open Prisma Studio GUI (localhost:5555)
npm run db:seed          # Seed database (via tsx, runs prisma/seed.ts)
npm run seed:demo        # Alias for db:seed

npm run format           # Prettier format entire project
```

### Build Process (Auto-Migration on Deploy)

**Local (`npm run dev`):**
- No auto-migration, manual schema changes only

**Vercel Deployment (`npm run build`):**
1. `npm run db:migrate` — Forces schema push (resets if conflict) or continues if fails
2. `next build` — Compiles Next.js, generates types
3. `postbuild` hook → `npm run db:seed` — Re-seeds demo data

This ensures fresh schema + seeded data on every deploy.

## Environment Setup

Copy `.env.local.example` to `.env.local`. Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — App URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `RESEND_API_KEY` or `SENDGRID_API_KEY` — At least one for email

## Database Models (11 models in prisma/schema.prisma)

### NextAuth System Models (required by @auth/prisma-adapter)
- **Account** — OAuth provider credentials (provider, providerAccountId, access_token)
- **Session** — user session tokens (sessionToken, expires)
- **VerificationToken** — password reset / email verification tokens

### PhishWise Core Models
- **User** — email, name, image, role (USER/MANAGER/ADMIN), schoolId
  - Relations: accounts, sessions, simulations, trainingHistory, history, metrics
  - Indexes: email, schoolId

- **School** — name, inviteCode (unique), frequency (weekly/random/custom), createdBy timestamp
  - Relations: users, campaigns
  - Indexes: inviteCode

- **TrainingModule** — name, description, content (MDX), orderIndex, isActive
  - Relations: templates, userProgress (UserTraining)
  - Indexes: isActive, orderIndex

- **Template** — moduleId, name, subject, body, fromAddress, difficulty (1-5), isActive
  - Relations: module, simulations
  - Indexes: moduleId, isActive, difficulty

- **SimulationEmail** — userId, templateId, campaignId
  - Tracking: trackingToken (unique), sentAt, opened/openedAt, clicked/clickedAt, status
  - Relations: user, template, campaign
  - Indexes: userId, templateId, trackingToken, sentAt

- **UserTraining** — userId, moduleId, assignedAt, completedAt, score
  - Composite unique: (userId, moduleId)
  - Relations: user, module
  - Indexes: userId, moduleId

- **Campaign** — schoolId, name, scheduleType (random/weekly/custom), status (active/paused)
  - Relations: school, simulations
  - Indexes: schoolId, status

- **UserMetrics** — userId (unique), totalSent, totalClicked, totalCompleted, lastActivity
  - Denormalized counters, updated via upsert on simulation events
  - Relations: user
  - Indexes: userId

- **UserHistory** — userId, actionType, detail, createdAt (for audit trail)
  - Records: simulation_clicked, training_completed, account_created
  - Relations: user
  - Indexes: userId, actionType, createdAt

## Key Conventions (Current Implementation)

### Path & Imports
- **Path alias:** `@/*` maps to project root → use `@/lib/...`, `@/components/...`
- **Never:** Create new files without updating CLAUDE.md or architectural patterns doc

### Client Components
- **All dashboard pages:** `"use client"` directive + `useSession()` + redirect if not authenticated
- Example: `app/(dashboard)/dashboard/user/page.tsx:1-3`

### API Route Auth Pattern
**Every API route MUST follow this pattern:**
```typescript
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // All queries scoped to session.user.id
}
```
- Reference: `app/api/simulations/route.ts:10-15`, `app/api/track/click/[token]/route.ts:9-20`

### Input Validation (INCONSISTENT - NEEDS FIX)
- **Status:** Not consistently applied across all API routes
- **Current:** Some routes use Zod, some use manual validation, some accept body without checking
- **TODO:** Create request/response Zod schemas for all API endpoints
- **Example:** `POST /api/schools/join` should validate: `inviteCode: string; length > 0`

### Session Augmentation
- JWT callback fetches `role` and `schoolId` from database on signin
- Session callback populates `session.user` with `id`, `role`, `schoolId`
- Reference: `lib/auth.ts:68-122`, `types/next-auth.d.ts`
- **When adding user fields:** Update both `lib/auth.ts` callbacks AND `types/next-auth.d.ts`

### Role-Based Rendering
- Define role-specific data as static arrays, select at render time (not deeply nested conditionals)
- Reference: `components/dashboard/Navbar.tsx:35-37` (switches userNav vs managerNav)

### Styling
- **UI Primitives:** shadcn/ui with `cva()` for variants, `cn()` for conditional classes
- **Design Tokens:** CSS custom properties in `app/globals.css` (HSL format for Radix/shadcn)
- **Color System:**
  - `primary-*` (blue) — brand, interactive
  - `danger-*` (red) — alerts, phishing
  - `success-*` (green) — completion, safe
  - `warning-*` (amber) — pending, medium risk
  - `phish-*` (legacy) — used in public pages (`phish-navy`, `phish-blue`, `phish-accent`)

### Database
- **Singleton pattern:** Always import from `@/lib/db`, never instantiate PrismaClient
- **Denormalized Metrics:** Use `userMetrics.upsert()` to keep counters fresh
- **Selective includes:** Use Prisma `select` within `include` to avoid over-fetching
- Reference: `app/api/simulations/route.ts:26-29`

### Email
- **Abstraction:** `lib/email.ts` auto-selects Resend → SendGrid → console (dev fallback)
- **Dynamic import:** Providers imported at runtime to avoid bundling unused SDKs

## Maintaining This Documentation

### When to Update CLAUDE.md
Update CLAUDE.md **immediately after** making these types of changes:

1. **Dependencies** — Adding/removing/upgrading packages in `package.json`
2. **Database** — Adding/renaming/removing Prisma models
3. **Environment variables** — Adding to `.env.local.example`
4. **npm scripts** — Adding/changing scripts
5. **File structure** — New top-level directories, significant path changes
6. **Conventions** — Changes to auth pattern, styling, validation approach
7. **Architecture** — New patterns, middleware, or cross-cutting concerns

### When to Update `.claude/docs/architectural_patterns.md`
Update when introducing/modifying patterns used in 2+ files:
- New API middleware
- New component convention (beyond existing shadcn pattern)
- Changing auth flow or role-based access logic
- Fix stale file:line references due to code changes

### Skip Updates for
- Routine feature pages (follow existing dashboard template)
- Bug fixes that don't change how things work
- Content-only changes (email text, module content, seed data)
- Minor code changes in single files

### Style
- Keep descriptions brief and actionable
- Always include file:line references so Claude can navigate
- Use code examples for complex patterns
- Explain "why" when conventions differ from Next.js defaults

## Standards Compliance & Implementation Status

### ✅ WORKING FEATURES
1. **Google OAuth 2.0** — Fully functional, auto-detects NEXTAUTH_URL per environment
2. **Database Schema** — All 11 models created, indices in place, auto-migration on build
3. **API Routes** — Basic CRUD, auth guards, denormalized metrics
4. **Dashboard Pages** — User & Manager dashboards with role-based rendering
5. **Component Library** — shadcn/ui implemented, dark mode complete
6. **Email** — Resend/SendGrid abstraction with fallback

### ⚠️ PARTIALLY WORKING / INCOMPLETE
1. **Input Validation** — Zod used in some places, but not consistently across all API routes
   - `POST /api/simulations` doesn't validate body shape
   - `POST /api/schools/join` lacks invite code length validation
   - `/api/training/caught-data` has minimal validation

2. **Error Handling** — Basic try-catch blocks, but inconsistent error codes
   - No standardized error response format
   - Generic 400/401/404 without descriptive error types
   - No client error codes (e.g., ERR_INVALID_INVITE, ERR_SCHOOL_FULL)

3. **API Response Types** — No TypeScript types for API responses
   - No OpenAPI/Swagger documentation
   - Frontend assumes response shape, fragile to schema changes
   - Consider zod-to-ts or tRPC for type safety

### ❌ MISSING / SECURITY ISSUES

#### 1. **Testing (CRITICAL)**
- No test framework installed (Jest/Vitest)
- No unit tests, integration tests, or E2E tests
- No test scripts in build pipeline
- **Impact:** Difficult to verify changes don't break existing code
- **Fix:** Add `jest` or `vitest`, write tests for:
  - Auth callbacks and role-based redirects
  - API route input validation
  - Database operations (seed, upsert, cascade deletes)
  - Component rendering with different user roles

#### 2. **Security Middleware (CRITICAL)**
- No CSRF protection (NextAuth provides default, verify it's enabled)
- No Rate Limiting on endpoints (anyone can spam `/api/track/click`)
- No Security Headers (no helmet, no CSP, no X-Frame-Options)
- No request logging / monitoring
- **Fix:** Add rate-limiter middleware, security headers, request tracing

#### 3. **Input Validation (HIGH)**
- Many API routes accept request.json() without schema validation
- Missing checks for: empty strings, SQL injection via Prisma (safe), XSS in email subjects
- File upload not implemented (only for logos/avatars, not critical now)
- **Fix:** Create request/response schemas with Zod for all API routes

#### 4. **Database Connection Pooling (HIGH)**
- Vercel Postgres uses pgBouncer (connection pooling)
- `db:push --force-reset` flushes all data on conflict (dangerous in production)
- No transaction handling for multi-step operations (e.g., create School + User relationship)
- **Fix:** Use `POSTGRES_PRISMA_URL` for pooled connections, avoid --force-reset in prod

#### 5. **Error Messages (MEDIUM)**
- Generic "error" messages don't help frontend debugging
- Example: `/api/schools/join` returns "School not found" but doesn't indicate if invite code is invalid
- **Fix:** Use error enums with standardized codes: `{ code: "ERR_INVALID_INVITE", message: "..." }`

#### 6. **Logging & Observability (MEDIUM)**
- Console logs in development mode, nothing in production
- No structured logging (JSON logs with context)
- No error tracking (Sentry, LogRocket, etc.)
- **Fix:** Add structured logging for API requests, auth events, database errors

#### 7. **Environment-Specific Config (MEDIUM)**
- Same DATABASE_URL used for all environments (see deployment strategy below)
- ENABLE_SCHEDULER flag exists but not wired to actual scheduler
- No feature flags for gradual rollout

#### 8. **Session / Cookie Security (LOW)**
- NextAuth provides HttpOnly, Secure, SameSite by default ✅
- Verify `Secure` flag in production (HTTPS only)

### Vercel Deployment Strategy: Branch vs Main (CRITICAL CONFIG)

**Current State:** Both `Pauls-Branch` and `main` push to same database, same Google OAuth credentials. This causes:
- Shared demo data between branches (confusion, test pollution)
- Branch deployments overwrite main data on seed
- Can't test data migrations independently
- Demo accounts mixed between environments

**Recommended Setup:**

#### Environment Variables per Branch
Create separate Vercel Projects or use environment overrides:

```
Project: phishwise (main branch)
  ENVIRONMENT: production
  DATABASE_URL: <prod-postgresql-url>
  GOOGLE_CLIENT_ID: <prod-oauth-id>
  GOOGLE_CLIENT_SECRET: <prod-oauth-secret>
  NEXTAUTH_SECRET: <prod-secret>
  ENABLE_SCHEDULER: true

Project: phishwise-staging (Pauls-Branch, feature branches)
  ENVIRONMENT: staging
  DATABASE_URL: <staging-postgresql-url>
  GOOGLE_CLIENT_ID: <staging-oauth-id> (or same wildcard)
  GOOGLE_CLIENT_SECRET: <staging-oauth-secret>
  NEXTAUTH_SECRET: <staging-secret>
  ENABLE_SCHEDULER: false
```

#### Google OAuth Redirect URIs
Update Google Cloud Console to accept both:
```
Production:
  https://yourdomain.com/api/auth/callback/google
  https://yourdomain.com

Staging/Preview:
  https://phishwise-staging-*.vercel.app/api/auth/callback/google
  https://phishwise-*.vercel.app/api/auth/callback/google
```

#### Seed Behavior
- Staging: Always seed demo data (`npm run db:seed`)
- Production: Seed only on first deploy (conditional check in seed.ts)

#### Build Hooks
Update `vercel.json` to conditionally migrate:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@db_url"
  }
}
```

Set env vars differently per environment in Vercel dashboard.

#### Testing Workflow
1. **Feature Branch** → Vercel Preview (staging DB, fresh seed)
2. **Pull Request** → Run tests (if tests exist), verify in preview
3. **Merge to main** → Vercel Production (production DB, conditional seed)
4. **Hotfix** → Cherry-pick to main, same flow

## Additional Documentation

When working on specific areas, check these files for detailed patterns:

- `.claude/docs/architectural_patterns.md` — Component architecture, API route patterns, auth flow, role-based access, state management approach
- `OAUTH_SETUP.md` — Detailed OAuth setup for all environments
- `QUICKSTART.md` — 10-minute OAuth setup quickstart
