# OAuth 2.0 Setup Guide - PhishWise

This guide explains how to set up Google OAuth for all environments: local development, preview deployments, and production.

## Overview

PhishWise uses **NextAuth.js** with Google OAuth 2.0. The key to making it work across environments is setting `NEXTAUTH_URL` correctly for each deployment.

---

## Environment Variables Required

You need these environment variables set in every environment:

```env
# Required for all environments
NEXTAUTH_URL=<automatically-determined-per-environment>
NEXTAUTH_SECRET=<random-32-byte-secret>
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
DATABASE_URL=<postgresql-connection-string>
```

---

## Setup Steps

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "PhishWise"
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credential** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. **Authorized JavaScript origins** (add all):
   - `http://localhost:3000` (local dev)
   - `https://*.vercel.app` (all Vercel preview deployments)
   - Your production domain (when ready)

7. **Authorized redirect URIs** (add all):
   - `http://localhost:3000/api/auth/callback/google`
   - `https://*.vercel.app/api/auth/callback/google`
   - Your production redirect URI (when ready)

8. Copy your **Client ID** and **Client Secret**

### 2. Local Development Setup

Create `.env.local` in project root:

```env
# Local development ONLY
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<your-client-id-from-google>
GOOGLE_CLIENT_SECRET=<your-client-secret-from-google>
DATABASE_URL=postgresql://user:pass@localhost:5432/phishwise
```

Run locally:
```bash
npm run dev
```

Go to: `http://localhost:3000/login` and test Google login

### 3. Vercel Production & Preview Setup

Set these environment variables in Vercel project settings:

**Settings → Environment Variables**

| Variable | Value | Environments |
|----------|-------|---|
| `NEXTAUTH_SECRET` | `<same-32-byte-secret>` | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | `<your-client-id>` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `<your-client-secret>` | Production, Preview, Development |
| `DATABASE_URL` | `<production-db-url>` | Production only |
| `DATABASE_URL` | `<staging-db-url>` | Preview only |

**Important**: Do NOT set `NEXTAUTH_URL` on Vercel. Let it auto-detect based on deployment URL.

### 4. How NEXTAUTH_URL Auto-Detection Works

**Local (localhost:3000):**
```
NEXTAUTH_URL=http://localhost:3000
```

**Vercel Preview (any branch):**
```
Automatically uses: https://phishwise-<random-id>-<org>.vercel.app
```

**Vercel Production:**
```
Automatically uses: your-custom-domain.com (when configured)
```

---

## Troubleshooting

### Error: `redirect_uri_mismatch`

**Cause:** The URL NextAuth is using doesn't match Google OAuth configuration.

**Solution:**
1. Check what URL you're actually on (browser address bar)
2. Verify that exact URL is in Google Cloud Console → **Authorized redirect URIs**
3. Remember the format: `https://your-url/api/auth/callback/google`

**For Vercel preview deployments:**
- Each branch gets a different preview URL
- Google OAuth is configured for `*.vercel.app` (wildcard)
- This allows any Vercel deployment to work automatically

### Error: `NEXTAUTH_SECRET not configured`

**Cause:** Missing `NEXTAUTH_SECRET` environment variable.

**Solution:**
1. Generate: `openssl rand -base64 32`
2. Add to Vercel: Settings → Environment Variables
3. Redeploy

### OAuth works locally but not on Vercel

**Cause:** Environment variables not synced to Vercel.

**Solution:**
```bash
vercel env pull
# This pulls Vercel's env vars into local .env.local
```

---

## Security Best Practices

✅ **DO:**
- Keep `NEXTAUTH_SECRET` random and unique (32 bytes minimum)
- Use different `DATABASE_URL` for production vs preview
- Rotate secrets periodically
- Use HTTPS only (Vercel handles this)

❌ **DON'T:**
- Commit `.env.local` to git
- Share secrets in pull requests
- Use same secret across environments if possible
- Expose `NEXTAUTH_SECRET` in client-side code (it's server-only)

---

## How It Works (Technical)

1. **User clicks "Continue with Google"** → sent to Google login
2. **Google redirects to** `{NEXTAUTH_URL}/api/auth/callback/google?code=...`
3. **NextAuth validates the code** with Google OAuth servers
4. **User created/found in database** via PrismaAdapter
5. **JWT token created** with user role & school ID
6. **User redirected to** `/dashboard` or `/login?error=...`

The key is step 2: the URL must match exactly with Google's configuration.

---

## Testing Across Branches

Each branch on Vercel gets its own preview URL:

```
main branch:           https://phishwise-main-xxx.vercel.app
Pauls-Branch:          https://phishwise-pauls-branch-xxx.vercel.app
feature/new-feature:   https://phishwise-feature-xxx.vercel.app
```

All automatically work because:
1. Google OAuth is set to `*.vercel.app` wildcard
2. `NEXTAUTH_URL` auto-detects the actual deployment URL
3. No manual URL changes needed per branch

---

## Checklist Before Testing

- [ ] Google OAuth credentials created
- [ ] `NEXTAUTH_SECRET` generated and set on Vercel
- [ ] `GOOGLE_CLIENT_ID` set on Vercel
- [ ] `GOOGLE_CLIENT_SECRET` set on Vercel
- [ ] Google Console has `https://*.vercel.app/api/auth/callback/google` in redirect URIs
- [ ] Google Console has `https://*.vercel.app` in authorized origins
- [ ] Local `.env.local` set for development
- [ ] `npm run dev` works locally with Google login
- [ ] Branch pushed to Vercel and deployed
- [ ] Preview deployment URL tested with Google login

---

## Support

If OAuth still fails:
1. Check browser console (F12) for errors
2. Check Vercel deployment logs
3. Verify `NEXTAUTH_URL` matches your current URL
4. Test on localhost with `.env.local` first
5. Google OAuth URI must have trailing slash? No - NextAuth handles this
