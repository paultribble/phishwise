# Email Sending Validation Guide

This guide walks through validating that email sending works correctly for password reset, magic sign-in, and demo emails.

## Prerequisites

1. **Email Provider Configured**: Set one of these env vars:
   - `RESEND_API_KEY` (recommended for dev/staging)
   - `SENDGRID_API_KEY` (recommended for production)

2. **NEXTAUTH_URL Set**: Required for building correct email links
   - Local: `http://localhost:3000`
   - Staging: `https://phishwise-staging.vercel.app`
   - Production: `https://yourdomain.com`

## Quick Test: Demo Email Endpoint

The easiest way to validate email sending:

### 1. Sign in to the app
```bash
npm run dev
# Visit http://localhost:3000/login
# Sign in with test credentials (after seed)
```

### 2. Send a test email via API
```bash
curl -X POST http://localhost:3000/api/demo/send-test-email \
  -H "Content-Type: application/json" \
  -b "sessionToken=YOUR_SESSION_COOKIE" \
  -d '{"email":"your-test-email@example.com"}'
```

Or use the browser console (after signing in):
```javascript
const res = await fetch('/api/demo/send-test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
});
const data = await res.json();
console.log(data); // { success: true, message: "Email sent" }
```

### 3. Check for email
Look for an email with subject: **"Unusual Sign-In Attempt Detected"**

---

## Full Integration Test

### 1. Test Forgot Password Flow

**Step 1: Request password reset**
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"phishwise0@gmail.com"}'
```

✅ Response should be: `{ success: true }`

**Step 2: Check email**
- Look for subject: **"Reset your PhishWise password"**
- Check that:
  - ✅ Email contains "Reset your password" heading
  - ✅ Link contains `reset-password?token=...`
  - ✅ Link starts with your `NEXTAUTH_URL`
  - ✅ Branding: PhishWise logo, company footer

**Step 3: Click the link and reset password**
- Email link format: `http://localhost:3000/reset-password?token=<64-char-hex>`
- Page should load
- Set new password (min 8 chars)
- Click "Update Password"
- Should see "Password updated!" message
- Should redirect to login page in 3 seconds

**Step 4: Sign in with new password**
- Go to `/login`
- Enter email and new password
- Should successfully sign in

---

### 2. Test Magic Sign-In Flow

**Step 1: Request magic link**
```bash
curl -X POST http://localhost:3000/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"phishwise0@gmail.com"}'
```

✅ Response should be: `{ success: true }`

**Step 2: Check email**
- Look for subject: **"Your PhishWise sign-in link"**
- Check that:
  - ✅ Email contains "Sign in to PhishWise" heading
  - ✅ Link expires in 30 minutes message
  - ✅ Link can only be used once message
  - ✅ Link contains `magic-signin?token=...`
  - ✅ Link starts with your `NEXTAUTH_URL`

**Step 3: Click the link**
- Email link format: `http://localhost:3000/magic-signin?token=<64-char-hex>`
- Page should show loading spinner
- Should redirect to dashboard in 1-2 seconds
- Should see "Signed in!" message first

**Step 4: Verify session**
- Should be on `/dashboard`
- Session should show user as authenticated

---

## Email Provider Setup

### Using Resend (Recommended for Dev/Staging)

1. **Create account**: https://resend.com
2. **Get API key**: https://resend.com/api-keys
3. **Add to env**:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxxx
   ```
4. **Test**:
   ```bash
   npm run dev
   # Send test email from demo endpoint
   ```

**Note**: Resend free tier sends to verified domains only. For testing:
- Send to yourself (verify your email in Resend)
- Or send to delivery@resend.dev (Resend test inbox)

---

### Using SendGrid (Recommended for Production)

1. **Create account**: https://sendgrid.com
2. **Create API key**: https://app.sendgrid.com/settings/api_keys
3. **Verify sender**: https://app.sendgrid.com/settings/sender_auth
4. **Add to env**:
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxx
   ```
5. **Update sender email** in `lib/email.ts`:
   ```typescript
   const defaultFrom = "PhishWise <noreply@yourdomain.com>";
   ```

---

## Troubleshooting

### ❌ "No email provider configured. Email not sent:"
- **Problem**: Neither `RESEND_API_KEY` nor `SENDGRID_API_KEY` is set
- **Fix**: Add one to `.env.local`, restart dev server
- **Fallback**: In development, email logs to console

### ❌ Email not arriving from Resend
- **Problem**: Email domain not verified in Resend
- **Fix**:
  - Send to yourself (verify in Resend dashboard)
  - Or use `delivery@resend.dev` test inbox
  - Or verify your domain (see Resend docs)

### ❌ Email not arriving from SendGrid
- **Problem**: Sender email not verified
- **Fix**:
  - Go to https://app.sendgrid.com/settings/sender_auth
  - Add and verify your sender domain
  - Update `defaultFrom` in `lib/email.ts` to match verified domain

### ❌ Links in email are broken
- **Problem**: `NEXTAUTH_URL` not set correctly
- **Fix**: Check `.env.local`:
  ```bash
  NEXTAUTH_URL="http://localhost:3000"  # for local dev
  NEXTAUTH_URL="https://yourdomain.com" # for production
  ```

### ❌ "This link is invalid or has expired" on reset page
- **Problem**: Token expired (> 1 hour) or already used
- **Fix**: Request a new password reset link

### ❌ Magic link shows "Link expired or already used"
- **Problem**: Token expired (> 30 min) or clicked twice
- **Fix**: Request a new magic link

---

## Email Templates Review

### Template-Specific Sender Addresses

Each phishing simulation template can have its own "From" email address to make the training realistic.

**How it works:**
- `Template.fromAddress` field contains the spoofed sender email (e.g., `security@verify-account.com`)
- When a simulation is sent, it uses that address instead of generic PhishWise address
- Fallback chain: Template fromAddress → SENDER_EMAIL env var → default noreply@phishwise.app

**Example template scenarios:**
- "Account Security Alert" → `security@verify-account.com`
- "Password Expiration Notice" → `admin@company-domain.com`
- "Urgent Action Required" → `support@system-update.io`
- "Billing Issue" → `billing@payment-services.net`

---

### Reset Password Email (`/api/auth/forgot-password`)

**What to check:**
- ✅ Dark blue button with text "Reset Password"
- ✅ 1-hour expiration message
- ✅ "If you didn't request this..." disclaimer
- ✅ PhishWise logo and footer
- ✅ Professional dark theme layout

### Magic Sign-In Email (`/api/auth/magic-link`)

**What to check:**
- ✅ Dark blue button with text "Sign In to PhishWise"
- ✅ 30-minute expiration message
- ✅ "Can only be used once" message
- ✅ PhishWise logo and footer
- ✅ Professional dark theme layout

### Demo Email (`/api/demo/send-test-email`)

**What to check:**
- ✅ Subject: "Unusual Sign-In Attempt Detected"
- ✅ Phishing scenario copy
- ✅ CTA button: "Verify your account now"
- ✅ 24-hour warning
- ✅ Professional layout

---

## Verification Checklist

Use this checklist after implementing email changes:

- [ ] Run `npm test` — all 62 tests pass
- [ ] Run `npm run build` — clean build
- [ ] Set `RESEND_API_KEY` or `SENDGRID_API_KEY` in `.env.local`
- [ ] Set `NEXTAUTH_URL="http://localhost:3000"`
- [ ] `npm run dev`
- [ ] Send demo test email and verify it arrives
- [ ] Test full forgot-password flow (request → email → reset → sign in)
- [ ] Test full magic-link flow (request → email → sign in)
- [ ] Verify email HTML renders correctly (check for logo, colors, links)
- [ ] Verify links use correct base URL
- [ ] Verify tokens are random 64-char hex strings
- [ ] Verify tokens expire correctly:
  - Reset tokens: 1 hour
  - Magic tokens: 30 minutes

---

## Production Considerations

### Email Domain Setup

**Before going live:**

1. **SendGrid or Resend Verified Domain**
   - Update sender: `PhishWise <noreply@yourdomain.com>`
   - Verify DNS records in provider

2. **NEXTAUTH_URL for Production**
   - Set to your actual domain: `https://yourdomain.com`
   - Not the Vercel preview URL

3. **Environment Variables**
   - Never commit `.env.local`
   - Set in Vercel dashboard per environment
   - Use different API keys for staging/prod

### Testing in Staging

Before merging to production:

```bash
# In Vercel dashboard, set staging branch vars:
ENVIRONMENT=staging
NEXTAUTH_URL=https://phishwise-staging.vercel.app
SENDGRID_API_KEY=<staging-key>
```

Then manually test all email flows in staging deployment.

---

## Additional Resources

- Resend Docs: https://resend.com/docs
- SendGrid Docs: https://docs.sendgrid.com
- NextAuth Email: https://next-auth.js.org/providers/email
- Email Security: https://dkim.org, SPF, DMARC setup
