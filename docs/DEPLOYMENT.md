# PhishWise Deployment Guide

Complete guide for deploying PhishWise to production, including local development setup, third-party service configuration, and Vercel deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Database Setup](#database-setup)
- [Google OAuth Configuration](#google-oauth-configuration)
- [Email Provider Setup](#email-provider-setup)
- [Rate Limiting Setup](#rate-limiting-setup)
- [Vercel Deployment](#vercel-deployment)
- [Environment Separation](#environment-separation)
- [Scheduler Configuration](#scheduler-configuration)
- [Post-Deployment Verification](#post-deployment-verification)
- [Security Checklist](#security-checklist)
- [Maintenance and Updates](#maintenance-and-updates)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

You will need accounts and credentials for the following services:

| Service | Purpose | Required |
|---------|---------|----------|
| [Vercel](https://vercel.com) | Hosting and deployment | Yes |
| PostgreSQL database | Data storage | Yes |
| [Resend](https://resend.com) or [SendGrid](https://sendgrid.com) | Email sending | Yes (at least one) |
| [Google Cloud Console](https://console.cloud.google.com) | OAuth (optional, if using Google sign-in) | No |
| [Upstash](https://upstash.com) | Redis for rate limiting | Recommended |

**Software requirements:**

- Node.js 18+ (LTS recommended)
- npm 9+
- Git
- PostgreSQL client (for database inspection)

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_ORG/phishwise.git
cd phishwise
npm install
```

### 2. Create Environment File

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/phishwise

# NextAuth (required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Email (at least one required)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Rate Limiting (optional for dev, recommended for prod)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# Environment
ENVIRONMENT=development
```

### 3. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output into your `.env.local` file as the value for `NEXTAUTH_SECRET`.

### 4. Initialize Database

```bash
npm run db:push          # Apply Prisma schema to database
npm run db:seed          # Load demo data (8 modules, 20 templates, demo users)
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`. You should see the PhishWise landing page.

### 6. Test with Demo Accounts

After seeding, these demo accounts are available:

| Email | Role | Password |
|-------|------|----------|
| phishwise0@gmail.com | MANAGER | Set via registration or magic link |
| ptribble@outlook.com | USER | Set via registration or magic link |

Note: Demo accounts are created without passwords. Use the registration flow or magic link to set initial passwords.

---

## Database Setup

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** and select **Postgres**
4. Copy the `DATABASE_URL` from the connection details
5. Add it to your environment variables

Vercel Postgres includes connection pooling via pgBouncer automatically.

### Option B: External PostgreSQL

Use any PostgreSQL 14+ provider (Supabase, Neon, Railway, self-hosted):

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

Ensure your database:
- Accepts connections from Vercel's IP range (or allows all with SSL)
- Has SSL enabled for production
- Has sufficient connection limits (Vercel serverless can open many connections)

### Schema Management

PhishWise uses Prisma ORM. The schema is defined in `prisma/schema.prisma`.

```bash
npm run db:push       # Push schema changes (interactive, may prompt for data loss)
npm run db:generate   # Regenerate Prisma client (auto-runs on postinstall)
npm run db:studio     # Open Prisma Studio GUI at localhost:5555
```

**Important:** The build script (`npm run build`) runs `npm run db:migrate` which executes `npx prisma db push --force-reset`. In production, this will reset the database. See the [Environment Separation](#environment-separation) section for how to handle this.

### Seed Data

The seed script (`prisma/seed.ts`) creates:

- 8 training modules with structured content
- 20 phishing email templates across difficulty levels 1-5
- Demo school with invite code `DEMO2025`
- Demo users with simulated metrics
- 65 UserTraining records across demo users

Run manually:

```bash
npm run db:seed
```

The seed is idempotent -- it checks for existing data before inserting.

---

## Google OAuth Configuration

Note: PhishWise now uses email + password and magic link authentication by default. Google OAuth is optional.

If you want to add Google OAuth:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named "PhishWise"
3. Navigate to **APIs & Services > Credentials**

### 2. Configure OAuth Consent Screen

1. Click **OAuth consent screen**
2. Select **External** (or Internal for Google Workspace orgs)
3. Fill in:
   - App name: PhishWise
   - User support email: your email
   - Authorized domains: your domain
4. Add scopes: `email`, `profile`, `openid`

### 3. Create OAuth Client

1. Click **Create Credentials > OAuth Client ID**
2. Application type: **Web Application**
3. Add Authorized Redirect URIs:

```
# Local development
http://localhost:3000/api/auth/callback/google

# Production
https://your-domain.com/api/auth/callback/google

# Vercel preview deployments
https://phishwise-*.vercel.app/api/auth/callback/google
```

4. Copy **Client ID** and **Client Secret**

### 4. Add to Environment

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
```

For detailed instructions, see `OAUTH_SETUP.md` and `QUICKSTART.md` in the project root.

---

## Email Provider Setup

PhishWise sends emails for: simulations, invitations, magic links, password resets, and test emails. At least one email provider must be configured.

### Option A: Resend (Recommended for Development)

1. Create account at [resend.com](https://resend.com)
2. Create an API key in the dashboard
3. Add to environment:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
```

**For production:** Verify your sending domain in Resend:
1. Go to Resend dashboard > Domains
2. Add your domain (e.g., `phishwise.yourdomain.edu`)
3. Add the DNS records Resend provides (SPF, DKIM, DMARC)
4. Click Verify

### Option B: SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permission
3. Add to environment:

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

### Fallback Behavior

The email system (`lib/email.ts`) tries providers in order:
1. **Resend** (if `RESEND_API_KEY` is set)
2. **SendGrid** (if `SENDGRID_API_KEY` is set)
3. **Console** (logs email to terminal -- development only)

If no API keys are configured, emails are logged to the console instead of being sent.

### Testing Email

After configuration, test with:

```bash
# Start dev server
npm run dev

# Sign in, then send a test email from the dashboard
# Or use the API directly:
curl -X POST http://localhost:3000/api/demo/send-test-email \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-session-cookie>" \
  -d '{"email":"your@email.com"}'
```

You can also use the email validation tools:

```bash
npm run validate:email    # CLI tool to check configuration
```

See `docs/EMAIL_VALIDATION.md` for comprehensive email testing procedures.

---

## Rate Limiting Setup

Rate limiting protects sensitive endpoints from abuse. Two mechanisms are used:

### Middleware Rate Limiting (Built-in)

The middleware (`middleware.ts`) provides in-memory rate limiting for auth endpoints. This works without any external service but does not persist across serverless cold starts.

### Upstash Redis Rate Limiting (Recommended)

For persistent, distributed rate limiting:

1. Create account at [upstash.com](https://upstash.com)
2. Create a new Redis database (choose the region closest to your Vercel deployment)
3. Copy the REST API credentials:

```env
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxxxxxxxxx
```

### Rate Limits Applied

| Endpoint | Limit | Window | Mechanism |
|----------|-------|--------|-----------|
| `/api/auth/forgot-password` | 3 | 15 min | Middleware (in-memory) |
| `/api/auth/magic-link` | 3 | 15 min | Middleware (in-memory) |
| `/api/auth/register` | 10 | 15 min | Middleware (in-memory) |
| `/api/auth/reset-password` | 5 | 15 min | Middleware (in-memory) |
| `/api/manager/invite` | 5 | 1 hour | Upstash Redis |
| `/api/demo/send-test-email` | 10 | 24 hours | Upstash Redis |
| `/api/schools/join` | 10 | 1 hour | Upstash Redis |
| `/api/track/click/[token]` | 100 | 24 hours | Upstash Redis |
| `/api/training/caught-data` | 20 | 24 hours | Upstash Redis |

If Upstash is not configured, Redis-based rate limits fail open (requests are allowed).

---

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **New Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js framework

### 2. Configure Environment Variables

In Vercel Project Settings > Environment Variables, add all required variables:

**Required for all environments:**

```
DATABASE_URL          = <postgresql connection string>
NEXTAUTH_SECRET       = <random 32+ char string>
```

**Required for email sending:**

```
RESEND_API_KEY        = <resend api key>
```

**Recommended:**

```
UPSTASH_REDIS_REST_URL    = <upstash redis url>
UPSTASH_REDIS_REST_TOKEN  = <upstash redis token>
ENVIRONMENT               = production
```

**Optional (if using Google OAuth):**

```
GOOGLE_CLIENT_ID      = <oauth client id>
GOOGLE_CLIENT_SECRET  = <oauth client secret>
```

### 3. Configure Build Settings

The default build settings work for PhishWise. Vercel will use:

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

The `vercel.json` file in the repository may override these settings.

### 4. Deploy

```bash
git push origin main
```

Vercel automatically triggers a deployment on push to `main`. The build process:

1. `npm install` -- Install dependencies
2. `postinstall` -- Generate Prisma client
3. `npm run build`:
   - `npm run db:migrate` -- Push schema to database
   - `next build` -- Compile Next.js application
   - `postbuild` -> `npm run db:seed` -- Seed demo data

### 5. Verify Deployment

After deployment completes:

1. Visit your deployment URL
2. Verify the landing page loads
3. Test sign-up / sign-in flow
4. Check that the database is accessible (dashboard loads)

---

## Environment Separation

### Problem

By default, both `main` and feature branches deploy to the same database and use the same credentials. This causes data pollution between environments.

### Recommended Setup

#### Production (main branch)

```
ENVIRONMENT=production
DATABASE_URL=<production-postgresql-url>
NEXTAUTH_URL=https://phishwise.yourdomain.edu
NEXTAUTH_SECRET=<production-secret>
RESEND_API_KEY=<production-resend-key>
UPSTASH_REDIS_REST_URL=<production-redis>
UPSTASH_REDIS_REST_TOKEN=<production-token>
```

#### Staging (Preview deployments)

```
ENVIRONMENT=staging
DATABASE_URL=<staging-postgresql-url>
NEXTAUTH_SECRET=<staging-secret>
RESEND_API_KEY=<staging-resend-key>  (or same as production)
UPSTASH_REDIS_REST_URL=<staging-redis>
UPSTASH_REDIS_REST_TOKEN=<staging-token>
```

### Configuring in Vercel

1. Go to Project Settings > Environment Variables
2. For each variable, select which environments it applies to:
   - **Production** -- Only `main` branch deployments
   - **Preview** -- All other branch deployments
   - **Development** -- Local `vercel dev` only

3. Set different values for Production and Preview environments

### NEXTAUTH_URL Handling

Vercel automatically sets `VERCEL_URL` for each deployment. NextAuth uses this when `NEXTAUTH_URL` is not explicitly set. For production, always set `NEXTAUTH_URL` to your custom domain.

### Seed Behavior

The seed script (`prisma/seed.ts`) is production-safe:
- Checks for existing data before inserting
- Idempotent (safe to run multiple times)
- Creates demo data only if not already present

For true production environments, you may want to skip seeding entirely by removing the `postbuild` script.

---

## Scheduler Configuration

The scheduler sends automated phishing simulations to eligible users based on school frequency settings.

### Vercel Cron Jobs

Add cron configuration to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scheduler/send-simulations",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This runs daily at 9:00 AM UTC.

### Scheduler Security

The scheduler endpoint should be protected to prevent unauthorized triggering. Set a secret:

```env
SCHEDULER_SECRET=<random-string>
```

The endpoint validates this secret before processing.

### Monitoring

Check scheduler status:

- **API:** `GET /api/admin/scheduler-status` (ADMIN only)
- **Vercel Dashboard:** Functions > Cron Jobs tab
- **Logs:** Vercel dashboard > Logs tab

---

## Post-Deployment Verification

Run through this checklist after deploying:

### 1. Application Health

- [ ] Landing page loads at your domain
- [ ] No console errors in browser dev tools
- [ ] Page transitions work (navigation bar)

### 2. Authentication

- [ ] Sign up with email + password works
- [ ] Sign in with email + password works
- [ ] Magic link email is received and works
- [ ] Forgot password email is received and works
- [ ] Session persists after page refresh
- [ ] Role-based redirects work (USER -> user dashboard, MANAGER -> manager dashboard)

### 3. School Management

- [ ] Create a new school
- [ ] Invite code is generated and displayed
- [ ] Join school with invite code works
- [ ] School settings are editable

### 4. Simulations

- [ ] Send a test simulation email
- [ ] Email arrives in inbox
- [ ] Click tracking link works (redirects to training)
- [ ] Open tracking pixel loads
- [ ] Simulation appears in user's history

### 5. Training

- [ ] Training module content loads
- [ ] Quiz completion records score
- [ ] Pending training banner appears/disappears correctly

### 6. Manager Features

- [ ] Analytics page shows data
- [ ] CSV export downloads correctly
- [ ] Invitation email sends
- [ ] Training assignment works

### 7. Security

- [ ] Security headers present (check with browser dev tools > Network tab)
- [ ] Rate limiting works (send 4+ rapid requests to a limited endpoint)
- [ ] Dashboard routes redirect to login when not authenticated
- [ ] API routes return 401 when not authenticated

---

## Security Checklist

Before going live, verify:

### Secrets and Credentials

- [ ] `NEXTAUTH_SECRET` is unique, random, and at least 32 characters
- [ ] `DATABASE_URL` uses SSL (`?sslmode=require`)
- [ ] No secrets are committed to the repository
- [ ] `.env.local` is in `.gitignore`
- [ ] All API keys are stored as Vercel environment variables (not in code)

### Application Security

- [ ] CSP headers are present (check `middleware.ts`)
- [ ] HSTS header is present in production
- [ ] X-Frame-Options is set to SAMEORIGIN
- [ ] Referrer-Policy is set
- [ ] Permissions-Policy restricts geolocation, camera, microphone

### Authentication

- [ ] Passwords are hashed with bcryptjs (cost 12)
- [ ] JWT sessions expire after 30 days
- [ ] Rate limiting is active on auth endpoints
- [ ] Password reset tokens expire after 1 hour
- [ ] Magic link tokens expire after 30 minutes and are single-use

### Data Protection

- [ ] All database queries are scoped to authenticated user's permissions
- [ ] Managers can only access their own school's data
- [ ] Admin routes check for ADMIN role
- [ ] Input validation (Zod) is applied on all API routes
- [ ] CSV export only includes the manager's school users

---

## Maintenance and Updates

### Updating Dependencies

```bash
npm update                 # Update all packages
npm run build              # Verify build succeeds
npm test                   # Run tests
```

Commit and push to trigger deployment.

### Database Migrations

When modifying `prisma/schema.prisma`:

1. Make schema changes locally
2. Run `npm run db:push` to apply to dev database
3. Test thoroughly
4. Commit changes
5. On deployment, `npm run db:migrate` applies changes

**Warning:** The current `db:migrate` script uses `--force-reset` which drops all data. For production, switch to proper Prisma migrations:

```bash
npx prisma migrate dev --name your_migration_name  # Local
npx prisma migrate deploy                          # Production
```

### Viewing Logs

- **Vercel Dashboard:** Project > Logs tab (real-time)
- **Structured Logging:** Production logs are JSON-formatted for aggregation tools
- **Log Levels:** info, warn, error, debug (debug only in development)

### Database Inspection

```bash
npm run db:studio          # Opens Prisma Studio at localhost:5555
```

Or connect directly with a PostgreSQL client using your `DATABASE_URL`.

---

## Troubleshooting

### Build Failures

**"Could not connect to database"**
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Ensure database accepts connections from Vercel IPs
- Check that SSL is configured (`?sslmode=require`)

**"Module not found" errors**
- Run `npm install` locally and commit `package-lock.json`
- Check that all imports use the `@/` path alias correctly

**TypeScript errors**
- Run `npm run build` locally first to catch type errors
- The project uses strict mode -- all types must be explicit

### Runtime Errors

**"Unauthorized" on all API routes**
- Check that `NEXTAUTH_SECRET` matches between environments
- Verify `NEXTAUTH_URL` is set correctly for the deployment
- Clear browser cookies and sign in again

**Emails not sending**
- Check `RESEND_API_KEY` or `SENDGRID_API_KEY` is set
- Verify domain is verified in your email provider
- Check Resend/SendGrid dashboard for delivery status
- In development, emails are logged to the console if no API key is set

**Rate limit errors in development**
- Redis-based rate limits fail open in development
- Middleware rate limits still apply -- wait for the window to reset
- Or restart the dev server (clears in-memory store)

**"Too many connections" database errors**
- Use connection pooling (Vercel Postgres includes this)
- For external databases, add `?pgbouncer=true` to the connection string
- Reduce concurrent function count in Vercel settings

### Performance

**Slow page loads**
- Check Vercel Functions tab for cold start times
- Enable ISR or static generation for public pages
- Add `Cache-Control` headers for API responses that do not change frequently

**Database query timeouts**
- Check database indexes are in place (defined in `schema.prisma`)
- Use Prisma `select` to limit fetched fields
- Consider pagination for large result sets

---

## Architecture Reference

For detailed information about code patterns, component architecture, and API conventions, see:

- `CLAUDE.md` -- Comprehensive technical reference
- `.claude/docs/architectural_patterns.md` -- Component and API patterns
- `docs/API.md` -- Complete API documentation
- `docs/EMAIL_VALIDATION.md` -- Email testing procedures
