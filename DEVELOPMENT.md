# PhishWise Vercel Deployment & Testing Guide

This guide covers deploying PhishWise to Vercel with separate databases for `main` (production) and `Pauls-Branch` (staging), plus Google OAuth configuration.

---

## Quick Start: Vercel Deployment (One-Time Setup)

### 1. Prisma Postgres Databases Already Created

Vercel Prisma Postgres has created these environment variables for both databases:

**Production (phishwise-prod):**
- `PRISMA_DATABASE_URL` — Connection string
- `POSTGRES_URL` — Alternative connection string
- `DATABASE_URL` — Standard Prisma env var

**Staging (phishwise-staging):**
- `STAGING_PRISMA_DATABASE_URL` — Connection string
- `STAGING_POSTGRES_URL` — Alternative connection string
- `STAGING_DATABASE_URL` — Standard env var

The project auto-selects based on `ENVIRONMENT` variable (see Step 3).

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials** → **Create OAuth 2.0 Web Application**
3. **Authorized JavaScript origins:**
   ```
   https://*.vercel.app
   ```
4. **Authorized redirect URIs:**
   ```
   https://*.vercel.app/api/auth/callback/google
   ```
5. Copy `Client ID` and `Client Secret` → Save as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### 3. Generate Secrets

Run these commands and save the output:
```bash
openssl rand -base64 32  # NEXTAUTH_SECRET_PROD
openssl rand -base64 32  # NEXTAUTH_SECRET_STAGING
openssl rand -base64 32  # SCHEDULER_SECRET_PROD
openssl rand -base64 32  # SCHEDULER_SECRET_STAGING
```

### 4. Set Environment Variables in Vercel

**Project Settings** → **Environment Variables**

The production and staging database variables are already created. Just add the rest:

**For `main` branch (Production environment):**
```
ENVIRONMENT = production
GOOGLE_CLIENT_ID = [your Client ID]
GOOGLE_CLIENT_SECRET = [your Client Secret]
NEXTAUTH_SECRET = [NEXTAUTH_SECRET_PROD]
SCHEDULER_SECRET = [SCHEDULER_SECRET_PROD]
RESEND_API_KEY = [your Resend API key]
ADMIN_EMAILS = phishwise0@gmail.com
```

**For `Pauls-Branch` (Preview environment):**
```
ENVIRONMENT = staging
GOOGLE_CLIENT_ID = [same as main]
GOOGLE_CLIENT_SECRET = [same as main]
NEXTAUTH_SECRET = [NEXTAUTH_SECRET_STAGING]
SCHEDULER_SECRET = [SCHEDULER_SECRET_STAGING]
RESEND_API_KEY = [your Resend API key]
ADMIN_EMAILS = phishwise0@gmail.com
```

### 5. Deploy Both Branches

```bash
# Push main branch
git push origin main
# Vercel auto-deploys to https://phishwise.vercel.app
# Uses PRISMA_DATABASE_URL (phishwise-prod) + production env vars

# Push Pauls-Branch
git push origin Pauls-Branch
# Vercel auto-deploys to https://phishwise-[hash].vercel.app
# Uses STAGING_PRISMA_DATABASE_URL (phishwise-staging) + staging env vars
```

---

## Testing Deployed App

Once deployed, test at:
- **Production:** https://phishwise.vercel.app/login
- **Staging:** https://phishwise-[branch].vercel.app/login

**Demo Accounts** (auto-seeded on first deployment):
- **Manager:** phishwise0@gmail.com
- **User:** ptribble@outlook.com

Click **Continue with Google** and sign in with either account.

---

## Database Auto-Detection

The project automatically detects which database to use based on the `ENVIRONMENT` variable:

```
ENVIRONMENT=production  → Uses PRISMA_DATABASE_URL (phishwise-prod)
ENVIRONMENT=staging     → Uses STAGING_PRISMA_DATABASE_URL (phishwise-staging)
ENVIRONMENT=development → Uses PRISMA_DATABASE_URL (local only)
```

**No code changes needed.** Set the environment variables per branch in Vercel, and the app connects to the right database automatically.

See `lib/db.ts` for the auto-detection logic.

---

## Database Management

### View Database in Prisma Studio (Vercel)

1. **Vercel Dashboard** → **Storage** → Select database
2. **Data Studio** tab → Browse/edit tables
3. Can see demo accounts, modules, templates, and simulations

### Seeding Demo Data

Demo data seeds automatically on **first deployment** of each branch:
- 8 training modules
- 20 email templates
- 2 demo accounts
- 80-150 simulated emails per user

**To manually re-seed:**
```bash
npm run db:seed
```

### Reset All Data

Deletes everything and re-seeds (use sparingly):
```bash
npm run db:reset
```

### Safe Schema Updates

Use migrations instead of force-reset:
```bash
npm run db:migrate
```

---

## Scheduler: Automatic Email Sending

**How it works:**
- Vercel Cron runs every 6 hours (configured in `vercel.json`)
- Calls `/api/scheduler/send-simulations` endpoint
- Selects eligible users, picks random template, sends email
- Logs to database for history

**To check scheduler health:**
```bash
curl https://phishwise.vercel.app/api/scheduler/send-simulations
# Returns: { "status": "ok", "timestamp": "..." }
```

**To manually trigger (for testing):**
```bash
curl -X POST https://phishwise.vercel.app/api/scheduler/send-simulations \
  -H "Authorization: Bearer [SCHEDULER_SECRET]" \
  -H "Content-Type: application/json"
```

---

## Troubleshooting

### "Unauthorized" on login
- Check Google OAuth credentials in Vercel → Environment Variables
- Verify redirect URIs include *.vercel.app in Google Cloud Console
- Check NEXTAUTH_SECRET is set (and different per branch)

### "Database connection failed"
- Verify PRISMA_DATABASE_URL and STAGING_PRISMA_DATABASE_URL are available in Vercel
- Check ENVIRONMENT variable is set correctly (production vs staging)
- Confirm Prisma Postgres databases are created in Vercel Storage

### Demo accounts missing
- Check Vercel Logs for `/api/scheduler/send-simulations` errors
- Verify Resend API key is valid
- Manually seed: `npm run db:seed` (requires local .env.local setup)

### Scheduler not sending emails
- Verify SCHEDULER_SECRET is set in Vercel
- Check Vercel Logs for `/api/scheduler/send-simulations` errors
- Test manually with curl (see Scheduler section above)

---

## Environment Variables Reference

| Variable | Purpose | Prod Value | Staging Value |
|----------|---------|-----------|---------------|
| `ENVIRONMENT` | Env selector | `production` | `staging` |
| `PRISMA_DATABASE_URL` | Prod database | Auto-created | Available |
| `STAGING_PRISMA_DATABASE_URL` | Staging database | Available | Auto-created |
| `GOOGLE_CLIENT_ID` | OAuth | Your Client ID | Same |
| `GOOGLE_CLIENT_SECRET` | OAuth | Your Secret | Same |
| `NEXTAUTH_SECRET` | Session encryption | Unique 32-byte | Different 32-byte |
| `SCHEDULER_SECRET` | Cron auth | Unique 32-byte | Different 32-byte |
| `RESEND_API_KEY` | Email sending | Your API key | Same |
| `ADMIN_EMAILS` | Admin access | phishwise0@gmail.com | Same |

---

## Next Steps

- ✅ Prisma Postgres databases created
- ✅ Database env variables auto-created by Vercel
- ⏳ Configure remaining environment variables
- ⏳ Deploy and test

**To complete setup:**
1. Set ENVIRONMENT, NEXTAUTH_SECRET, SCHEDULER_SECRET for each branch
2. Set GOOGLE_CLIENT_ID/SECRET (same for both)
3. Set RESEND_API_KEY and ADMIN_EMAILS
4. Push main and Pauls-Branch
5. Test login at both deployment URLs

---

**Last Updated:** March 13, 2026
**Deployment Model:** Vercel Prisma Postgres with branch-specific auto-detection

---

## GitHub Actions Scheduler Setup

Instead of Vercel Cron (limited on Hobby plan), the scheduler runs via **GitHub Actions** — free and unlimited.

### How it Works

1. **GitHub Actions workflow** (`.github/workflows/scheduler.yml`) runs every 6 hours
2. Makes HTTP request to `/api/scheduler/send-simulations` endpoint
3. Passes `SCHEDULER_SECRET` in Authorization header
4. Works on Hobby plan (no upgrade needed)

### Setup (One-Time)

1. **Add GitHub Secrets**
   - Go to: **GitHub repo** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Create two secrets:
     - `SCHEDULER_SECRET_PROD` = [your production 32-byte secret]
     - `SCHEDULER_SECRET_STAGING` = [your staging 32-byte secret]

2. **Verify Workflow**
   - Go to **Actions** tab in GitHub
   - See "PhishWise Email Scheduler" workflow
   - It runs automatically every 6 hours (UTC)

3. **Manual Trigger** (for testing)
   - Go to **Actions** → **PhishWise Email Scheduler**
   - Click **Run workflow** → **Run workflow**
   - Check results in workflow logs

### What the Workflow Does

- **On `main` branch**: Calls `https://phishwise.vercel.app/api/scheduler/send-simulations` with `SCHEDULER_SECRET_PROD`
- **On `Pauls-Branch`**: Calls `https://phishwise-pauls-branch.vercel.app/api/scheduler/send-simulations` with `SCHEDULER_SECRET_STAGING`
- Runs every 6 hours automatically
- Can be triggered manually from Actions tab

### Monitoring

1. Go to **GitHub** → **Actions** tab
2. Click **PhishWise Email Scheduler**
3. See past runs and their status
4. Click a run to see logs and API response

### If Emails Aren't Sending

1. Check **Actions** logs for errors
2. Verify `SCHEDULER_SECRET_PROD` and `SCHEDULER_SECRET_STAGING` are set in GitHub Secrets
3. Confirm Vercel deployment URLs are correct
4. Check Vercel logs for `/api/scheduler/send-simulations` errors

---

**Scheduler Summary**
- ✅ No Vercel Cron subscription needed
- ✅ Free and unlimited on GitHub Actions
- ✅ Runs every 6 hours automatically
- ✅ Can be triggered manually anytime
- ✅ Works on Hobby plan
