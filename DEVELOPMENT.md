# PhishWise Development Setup & Testing Guide

This guide helps you set up PhishWise for local development with a working database, OAuth, and demo accounts so you can focus on building features without worrying about authentication.

---

## Quick Start (5 minutes)

### 1. Local Environment Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your values:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-byte-secret-here (generate: openssl rand -base64 32)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=postgresql://user:password@localhost:5432/phishwise
RESEND_API_KEY=your-resend-key
SCHEDULER_SECRET=your-scheduler-secret-here (generate: openssl rand -base64 32)
```

### 2. Start Development Server

```bash
npm run dev
# Server runs at http://localhost:3000
```

### 3. Seed Demo Database

```bash
npm run db:seed
# Creates:
# - Manager account: phishwise0@gmail.com
# - User account: ptribble@outlook.com
# - Demo school: PhishWise Demo School (DEMO2025)
# - 8 training modules + 20 templates
# - Simulated email history
```

### 4. Test OAuth Login

Open http://localhost:3000/login and click "Continue with Google"
- Login as: **phishwise0@gmail.com** (Manager)
- Or login as: **ptribble@outlook.com** (User)

---

## Development Workflow: Adding Features

### Typical Feature Development Flow:

```
1. Start dev server: npm run dev
2. Keep logged in as demo account (phishwise0@gmail.com or ptribble@outlook.com)
3. Make code changes → Auto-reload in browser
4. Test feature with demo data (no re-login needed!)
5. Database stays stable between session restarts
```

### Key: Don't Lose Your Session!

The demo accounts are seeded in the database. Once you're logged in:
- You can restart the dev server → **You stay logged in** ✅
- You can make code changes → **You stay logged in** ✅
- Your session persists across restarts

**Don't run `npm run db:seed` again** unless you want to reset demo data.

---

## Database Management

### Reset Demo Data (Clears Everything)

```bash
npm run db:reset
# Runs: prisma db push --force-reset && npm run db:seed
# Use this if you need a fresh database
```

### Safe Database Updates (Preserves Data)

```bash
npm run db:migrate
# Uses proper migrations (doesn't force reset)
# Safe for production
```

### View Database in Prisma Studio

```bash
npm run db:studio
# Opens GUI at http://localhost:5555
# Can browse/edit tables directly
```

### Push Schema Changes (No Data Loss)

```bash
npm run db:push
# Updates schema without deleting data
# Use after modifying schema.prisma
```

---

## Vercel Deployment: Main vs Branch Setup

### Goal: Prevent Data Pollution

**Current problem:** Both `main` and `Pauls-Branch` use the same database, so branch deployments overwrite main data.

**Solution:** Separate databases per environment.

### Step 1: Create Second Vercel Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Storage → Create
3. Create new Postgres database named: `phishwise-staging`
4. Copy connection string: `POSTGRES_PRISMA_URL` (pooled)
5. Copy non-pooled URL: `POSTGRES_URL_NON_POOLING`

### Step 2: Configure Vercel Environment Variables

**For `main` branch (Production):**
- DATABASE_URL = `phishwise-prod` database connection
- ENVIRONMENT = `production`
- GOOGLE_CLIENT_ID = prod OAuth credentials
- GOOGLE_CLIENT_SECRET = prod OAuth credentials
- NEXTAUTH_SECRET = prod secret
- SCHEDULER_SECRET = prod scheduler secret

**For `Pauls-Branch` (Staging):**
- DATABASE_URL = `phishwise-staging` database connection
- ENVIRONMENT = `staging`
- GOOGLE_CLIENT_ID = same or staging credentials
- GOOGLE_CLIENT_SECRET = same or staging credentials
- NEXTAUTH_SECRET = staging secret
- SCHEDULER_SECRET = staging scheduler secret

**For ALL branches (shared):**
- RESEND_API_KEY = development key
- ADMIN_EMAILS = phishwise0@gmail.com

### Step 3: Update seed.ts for Environment

The seed script should:
- **Staging:** Always seed demo data
- **Production:** Conditional seed (optional)

```typescript
// In prisma/seed.ts, add at start of main():
if (process.env.ENVIRONMENT === "production") {
  console.log("ℹ️  Production environment - skipping seed");
  return;
}
```

### Step 4: Deploy & Test

```bash
# Deploy staging (Pauls-Branch)
git push origin Pauls-Branch
# Vercel auto-deploys to phishwise-staging-*.vercel.app
# Uses staging database with fresh demo data

# Deploy production (main)
git push origin main
# Vercel auto-deploys to phishwise.vercel.app
# Uses production database
```

---

## Google OAuth Configuration

### For Local Development:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credential (Web application)
3. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
4. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Copy Client ID and Secret → `.env.local`

### For Vercel (All Branches):

1. **Authorized JavaScript origins:**
   ```
   https://*.vercel.app
   ```
2. **Authorized redirect URIs:**
   ```
   https://*.vercel.app/api/auth/callback/google
   ```
3. Set environment variables in Vercel dashboard (per branch)

---

## Automatic Email Scheduling

### How It Works:

1. **Vercel Cron Job** (in `vercel.json`):
   ```json
   {
     "path": "/api/scheduler/send-simulations",
     "schedule": "0 */6 * * *"
   }
   ```
   Runs every 6 hours automatically.

2. **Scheduler Endpoint** (`/api/scheduler/send-simulations`):
   - Selects eligible users
   - Picks random template
   - Generates tracking token
   - Sends via SendGrid
   - Logs to database

3. **Local Testing:**
   ```bash
   # Manually trigger (requires SCHEDULER_SECRET header)
   curl -X POST http://localhost:3000/api/scheduler/send-simulations \
     -H "Authorization: Bearer your-scheduler-secret" \
     -H "Content-Type: application/json"
   ```

### Monitoring Scheduler:

Check `/api/scheduler/send-simulations` (GET) for health status:
```bash
curl http://localhost:3000/api/scheduler/send-simulations
# Returns: { "status": "ok", "timestamp": "..." }
```

---

## Testing Checklist: Before Adding Features

- [ ] `npm run dev` starts without errors
- [ ] Can login at http://localhost:3000/login
- [ ] Login redirects to dashboard
- [ ] Manager (phishwise0@gmail.com) sees manager dashboard
- [ ] User (ptribble@outlook.com) sees user dashboard
- [ ] Simulation history loads
- [ ] Metrics display correctly
- [ ] Session persists across page refresh

---

## Common Troubleshooting

### "Unauthorized" on login
- Check `NEXTAUTH_SECRET` is set (and same across restarts)
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Verify Google Console has correct redirect URIs

### "Database connection failed"
- Check `DATABASE_URL` is set correctly
- Verify Postgres is running (if using local DB)
- Check Vercel Postgres credentials if using remote

### Demo accounts missing
- Run `npm run db:seed` to recreate them
- Or check Prisma Studio (`npm run db:studio`) to verify they exist

### Scheduler not sending emails
- Check `SCHEDULER_SECRET` is set
- Verify `RESEND_API_KEY` is valid
- Check email logs in Resend dashboard
- Manual test: `curl -X POST` with correct header

### Session lost after restart
- Session is stored in database, should persist
- If lost, try: Delete browser cookies for localhost:3000 and re-login
- Or: Run `npm run db:reset` and `npm run db:seed` again

---

## Environment Variables Reference

| Variable | Local | Vercel | Notes |
|----------|-------|--------|-------|
| `NEXTAUTH_URL` | http://localhost:3000 | Auto-detected | Don't set on Vercel |
| `NEXTAUTH_SECRET` | Generate locally | Set in Vercel | Same 32-byte value |
| `DATABASE_URL` | Local Postgres | Vercel Postgres | Different per branch |
| `GOOGLE_CLIENT_ID` | From Google Console | From Google Console | Can be same for all |
| `GOOGLE_CLIENT_SECRET` | From Google Console | From Google Console | Keep secret! |
| `RESEND_API_KEY` | Dev key | Dev/Prod key | For email sending |
| `SCHEDULER_SECRET` | Generate locally | Set in Vercel | For cron auth |
| `ENVIRONMENT` | development | staging/production | Conditional logic |

---

## Next Steps: Adding Features

Now that you have:
- ✅ Working database with demo accounts
- ✅ OAuth login that stays persistent
- ✅ Automatic scheduler (every 6 hours)
- ✅ Separated databases (main vs branch)

You can focus on:
1. **GraphQL API migration** (not critical immediately)
2. **Adaptive difficulty** (user performance-based)
3. **Admin dashboard** (template/module management)
4. **2FA** (two-factor authentication)
5. **TalentLMS integration** (content management)

---

**Last Updated:** March 13, 2026
**Author:** Claude Code
