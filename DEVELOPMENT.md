# PhishWise Vercel Deployment & Testing Guide

This guide covers deploying PhishWise to Vercel with separate databases for `main` (production) and `Pauls-Branch` (staging), plus Google OAuth configuration.

---

## Quick Start: Vercel Deployment (One-Time Setup)

### 1. Create Prisma Postgres Databases

1. **Go to Vercel Dashboard** → Select PhishWise project
2. **Storage** → **Create** → **Prisma Postgres**
3. **Create first database:**
   - Name: `phishwise-prod`
   - Region: Closest to you
   - Copy `PRISMA_DATABASE_URL` value → Save as `DB_PROD`
4. **Create second database:**
   - Name: `phishwise-staging`
   - Region: Same as prod
   - Copy `STAGING_PRISMA_DATABASE_URL` value → Save as `DB_STAGING`

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

**Project Settings** → **Environment Variables** → Add these:

**For `main` branch (applies to Production environment):**
```
DATABASE_URL_PROD = [DB_PROD value from phishwise-prod]
ENVIRONMENT = production
GOOGLE_CLIENT_ID = [your Client ID]
GOOGLE_CLIENT_SECRET = [your Client Secret]
NEXTAUTH_SECRET = [NEXTAUTH_SECRET_PROD]
SCHEDULER_SECRET = [SCHEDULER_SECRET_PROD]
RESEND_API_KEY = [your Resend API key]
ADMIN_EMAILS = phishwise0@gmail.com
```

**For `Pauls-Branch` (applies to Preview environment):**
```
DATABASE_URL_STAGING = [DB_STAGING value from phishwise-staging]
ENVIRONMENT = staging
GOOGLE_CLIENT_ID = [same as main]
GOOGLE_CLIENT_SECRET = [same as main]
NEXTAUTH_SECRET = [NEXTAUTH_SECRET_STAGING]
SCHEDULER_SECRET = [SCHEDULER_SECRET_STAGING]
RESEND_API_KEY = [your Resend API key]
ADMIN_EMAILS = phishwise0@gmail.com
```

**For ALL branches (shared):**
```
GOOGLE_CLIENT_ID = [your Client ID]
GOOGLE_CLIENT_SECRET = [your Client Secret]
RESEND_API_KEY = [your Resend API key]
ADMIN_EMAILS = phishwise0@gmail.com
```

### 5. Deploy Both Branches

```bash
# Push main branch
git push origin main
# Vercel auto-deploys to https://phishwise.vercel.app
# Uses phishwise-prod database + production env vars

# Push Pauls-Branch
git push origin Pauls-Branch
# Vercel auto-deploys to https://phishwise-[hash].vercel.app
# Uses phishwise-staging database + staging env vars
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
ENVIRONMENT=production  → Uses DATABASE_URL_PROD (phishwise-prod)
ENVIRONMENT=staging     → Uses DATABASE_URL_STAGING (phishwise-staging)
ENVIRONMENT=development → Uses DATABASE_URL (local only)
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
- Verify DATABASE_URL_PROD and DATABASE_URL_STAGING are set in Vercel
- Check ENVIRONMENT variable is set correctly (production vs staging)
- Confirm Prisma Postgres databases are created in Vercel Storage

### Demo accounts missing
- Check `/api/scheduler/send-simulations` for errors (Vercel Logs)
- Verify Resend API key is valid
- Manually seed: `npm run db:seed` (local environment)

### Scheduler not sending emails
- Verify SCHEDULER_SECRET is set in Vercel
- Check Vercel Logs for `/api/scheduler/send-simulations` errors
- Test manually with curl (see Scheduler section above)

---

## Environment Variables Reference

| Variable | Dev | Main (Prod) | Pauls-Branch (Staging) |
|----------|-----|-------------|----------------------|
| `ENVIRONMENT` | development | production | staging |
| `DATABASE_URL` | From DB_PROD | (auto-selected) | (auto-selected) |
| `DATABASE_URL_PROD` | DB_PROD | DB_PROD | DB_PROD |
| `DATABASE_URL_STAGING` | DB_PROD | — | DB_STAGING |
| `GOOGLE_CLIENT_ID` | Your Client ID | Same | Same |
| `GOOGLE_CLIENT_SECRET` | Your Secret | Same | Same |
| `NEXTAUTH_SECRET` | Unique 32-byte | Unique value | Different unique value |
| `SCHEDULER_SECRET` | Unique 32-byte | Unique value | Different unique value |
| `RESEND_API_KEY` | Your API key | Same | Same |
| `ADMIN_EMAILS` | phishwise0@gmail.com | Same | Same |

---

## Next Steps

- ✅ Vercel project created
- ✅ Databases set up (prod + staging)
- ✅ Google OAuth configured
- ✅ Environment variables configured
- ⏳ Deploy and test

**Test the deployments:**
1. Push `main` → Test at https://phishwise.vercel.app
2. Push `Pauls-Branch` → Test at https://phishwise-[hash].vercel.app
3. Both should use different databases and not interfere with each other

---

**Last Updated:** March 13, 2026
**Deployment Model:** Vercel Postgres with branch-specific auto-detection
