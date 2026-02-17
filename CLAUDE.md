# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PhishWise

Web-based phishing awareness training platform. Users receive simulated phishing emails at randomized intervals. Clicking a malicious link redirects to targeted educational modules. Three roles: USER (receives simulations), MANAGER (oversees "schools", views analytics), ADMIN (maintains templates/system).

University of Arkansas CSCE Capstone - Team 20.

## Tech Stack

- **Framework**: Next.js 14 App Router + TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components (Radix UI primitives)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js v4 with Google OAuth 2.0 + Prisma adapter
- **Email**: Resend (dev) / SendGrid (prod) — see `lib/email.ts`
- **Validation**: Zod
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Hosting**: Vercel (serverless)

## Project Structure

```
app/                        # Next.js App Router pages
  (dashboard)/              # Route group — shared layout with Navbar + SessionProvider
    dashboard/user/         # User dashboard (stats, simulation history)
    dashboard/manager/      # Manager dashboard (school overview, user performance)
  api/                      # REST API routes
    auth/[...nextauth]/     # NextAuth handler
    simulations/            # GET history, POST click events
    users/                  # GET profile + metrics
  training/[moduleId]/      # Training module viewer (sections + quiz)
  login/ signup/ learn-more/ # Public pages
components/
  ui/                       # shadcn/ui primitives (button, card, badge, progress, avatar, separator)
  dashboard/                # Dashboard-specific components (Navbar)
  providers/                # React context providers (SessionProvider)
lib/
  auth.ts                   # NextAuth config + session callbacks
  db.ts                     # Prisma client singleton
  email.ts                  # Email abstraction (Resend/SendGrid/console fallback)
  utils.ts                  # cn() class merge utility
prisma/
  schema.prisma             # Database schema (8 models + 3 NextAuth models)
types/
  next-auth.d.ts            # Session type augmentation (id, role, schoolId)
```

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (runs linting + type checking)
npm run lint         # ESLint
npm run format       # Prettier

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema to database (no migrations)
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed database (runs prisma/seed.ts via tsx)
```

## Environment Setup

Copy `.env.local.example` to `.env.local`. Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — App URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `RESEND_API_KEY` or `SENDGRID_API_KEY` — At least one for email

## Database Models

Core domain models defined in `prisma/schema.prisma`:
- **User** — role enum (USER/MANAGER/ADMIN), belongs to optional School
- **School** — group of users with invite code, has Campaigns
- **Campaign** — schedule config (random/weekly/custom), has SimulationEmails
- **Template** — email content (subject/body/difficulty), linked to TrainingModule
- **SimulationEmail** — tracks sent/opened/clicked/completed per user
- **TrainingModule** — educational content (MDX-ready), has Templates
- **UserTraining** — per-user module completion tracking with score
- **UserMetrics** — denormalized counters (totalSent/Clicked/Completed)

## Key Conventions

- Path alias: `@/*` maps to project root — use `@/lib/...`, `@/components/...`
- All dashboard pages are client components (`"use client"`) using `useSession()`
- API routes authenticate via `getServerSession(authOptions)` — see `lib/auth.ts:5`
- UI components use `cn()` from `lib/utils.ts` for conditional class merging
- Design tokens use CSS custom properties in `app/globals.css` (HSL format for shadcn/ui)
- Custom color scales: `primary`, `danger`, `success`, `warning` + legacy `phish-*` aliases

## Maintaining This Documentation

After making changes to the codebase, update these context files to stay in sync:

**Update `CLAUDE.md` when:**
- Adding/removing dependencies from the tech stack
- Creating new top-level directories or significant new file paths
- Adding npm scripts to `package.json`
- Adding new environment variables to `.env.local.example`
- Adding/renaming/removing Prisma models
- Changing key conventions (auth approach, styling patterns, etc.)

**Update `.claude/docs/architectural_patterns.md` when:**
- Introducing a new cross-cutting pattern used in 2+ files (e.g., new API middleware, new component convention)
- Modifying an existing documented pattern (e.g., changing the auth guard flow)
- File:line references drift due to code changes — update the reference numbers

**Skip updates for:**
- Routine feature work that follows existing patterns (e.g., new page using the dashboard template)
- Bug fixes that don't change architectural conventions
- Content-only changes (copy, training module text, template emails)

**How:** Make minimal, surgical edits to the affected section. Don't rewrite entire files.

## Additional Documentation

When working on specific areas, check these files for detailed patterns:

- `.claude/docs/architectural_patterns.md` — Component architecture, API route patterns, auth flow, role-based access, state management approach
