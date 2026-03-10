# OAuth Quick Start - Get It Working in 10 Minutes

## ✅ Pre-Setup Checklist

Before you start, you need:
- [ ] Google account (for Google Cloud Console)
- [ ] Vercel account (already have it)
- [ ] `NEXTAUTH_SECRET` generated locally

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
# Output: something like "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz..."
# Keep this value - you'll use it everywhere
```

---

## Step 1: Google Cloud Console Setup (5 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project: **PhishWise**
3. Search for: **Google+ API** → Enable it
4. Go to **Credentials**:
   - Click **+ Create Credentials** → **OAuth 2.0 Client ID**
   - Choose: **Web application**
   - Application name: PhishWise

5. **Authorized JavaScript origins** (add ALL):
   ```
   http://localhost:3000
   https://*.vercel.app
   ```

6. **Authorized redirect URIs** (add ALL):
   ```
   http://localhost:3000/api/auth/callback/google
   https://*.vercel.app/api/auth/callback/google
   ```

7. Click **Create** → Copy **Client ID** and **Client Secret**

---

## Step 2: Local Environment Setup (2 min)

Create `.env.local` in project root:

```bash
# Copy the template
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-32-byte-secret-from-step-1>
GOOGLE_CLIENT_ID=<copy-from-google-console>
GOOGLE_CLIENT_SECRET=<copy-from-google-console>
DATABASE_URL=postgresql://user:pass@localhost:5432/phishwise
```

---

## Step 3: Test Locally (2 min)

```bash
npm run dev
# Go to: http://localhost:3000/login
# Click "Continue with Google"
# You should be logged in!
```

**If it fails:**
- Check `.env.local` has all 5 variables
- Verify `NEXTAUTH_SECRET` is 32 bytes (openssl output)
- Check browser console (F12) for errors
- Read OAUTH_SETUP.md troubleshooting section

---

## Step 4: Vercel Production Setup (1 min)

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → **Settings** → **Environment Variables**

Add these variables for **All** (Production, Preview, Development):

| Variable | Value |
|----------|-------|
| `NEXTAUTH_SECRET` | `<your-32-byte-secret>` |
| `GOOGLE_CLIENT_ID` | `<from-google-console>` |
| `GOOGLE_CLIENT_SECRET` | `<from-google-console>` |

**Important:** Do NOT set `NEXTAUTH_URL` - Vercel auto-detects it per deployment.

---

## Step 5: Deploy & Test (1 min)

```bash
git add -A
git commit -m "Configure OAuth for all environments"
git push origin Pauls-Branch
# Vercel auto-deploys...
```

Wait for deployment, then click the deployment URL and test OAuth login.

---

## How It Works Across Environments

```
┌─────────────────────────────────────────────────────────┐
│ Environment         │ NEXTAUTH_URL Auto-Set             │
├─────────────────────┼───────────────────────────────────┤
│ Local Dev           │ http://localhost:3000              │
│ Preview (any PR)    │ https://phishwise-xxx.vercel.app   │
│ Production          │ https://yourdomain.com (if set)    │
└─────────────────────────────────────────────────────────┘
```

**Key:** Vercel automatically sets `NEXTAUTH_URL` to match the deployment URL. No manual configuration needed!

---

## Testing Multiple Branches

Each branch gets its own preview URL:

```
main:               https://phishwise-main-xxxxx.vercel.app
Pauls-Branch:       https://phishwise-pauls-branch-xxxxx.vercel.app
feature/new-auth:   https://phishwise-feature-new-auth-xxxxx.vercel.app
```

All work automatically because Google OAuth is configured for `*.vercel.app` wildcard.

---

## Security Notes

✅ **What's secure:**
- `NEXTAUTH_SECRET` is hidden from logs/UI
- Google OAuth tokens never exposed to client
- Session cookies are HttpOnly and Secure
- Different env vars per environment

❌ **What's NOT secure:**
- Don't commit `.env.local`
- Don't share secrets in Slack/GitHub
- Don't use same secret across companies
- Don't log or print secrets

---

## Troubleshooting

### `redirect_uri_mismatch` error
```
→ Google OAuth URL doesn't match console configuration
→ Check browser URL vs Google Console redirect URIs
→ Ensure *.vercel.app is in Google Console
```

### `NEXTAUTH_SECRET not configured`
```
→ Add NEXTAUTH_SECRET to Vercel environment variables
→ Make sure it's the same 32-byte value everywhere
```

### OAuth works locally but not on Vercel
```
→ Pull latest env vars: vercel env pull
→ Check all 3 vars set on Vercel (CLIENT_ID, CLIENT_SECRET, SECRET)
→ Wait for redeploy to complete
```

### Infinite redirect loop on Vercel
```
→ NEXTAUTH_URL is set wrong on Vercel (should NOT be set manually)
→ Remove NEXTAUTH_URL from Vercel env vars - let it auto-detect
→ Redeploy
```

---

## Verification

After all steps, you should see:

✅ `npm run build` - compiles without errors
✅ `npm run dev` - login works on localhost:3000
✅ Preview deployment URL - OAuth works
✅ Browser console - no auth errors

If all ✅, you're done! OAuth is properly configured.

---

## Next Steps

- [ ] Follow steps 1-5 above
- [ ] Test OAuth on all environments
- [ ] Share your Vercel URL for team testing
- [ ] Start using PhishWise!

Questions? See `OAUTH_SETUP.md` for detailed documentation.
