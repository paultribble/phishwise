# Professional Email Templates for Phishing Simulations

## Overview

PhishWise includes **7 professional, company-branded HTML email templates** with realistic styling and working redirect links. Each template mimics a real company's communication style and is designed for effective security awareness training.

**All templates automatically redirect users back to PhishWise** when they click the phishing link, triggering the training module.

---

## Available Templates

### 1. **Amazon Account Verification**
- **Company:** Amazon
- **Subject:** "Your Amazon.com account requires verification"
- **Difficulty:** 3/5
- **Scenario:** Unusual sign-in attempt from new location
- **Styling:** Amazon's orange gradient header (#FF9900), clean card design
- **Link Text:** "Verify My Account"

### 2. **Microsoft Password Reset**
- **Company:** Microsoft
- **Subject:** "Confirm your recent password change"
- **Difficulty:** 3/5
- **Scenario:** Password reset verification request
- **Styling:** Microsoft's blue gradient (#0078D4), professional Segoe UI font
- **Link Text:** "Verify Your Identity"

### 3. **PayPal Billing Alert**
- **Company:** PayPal
- **Subject:** "Action Required: Verify Your PayPal Account"
- **Difficulty:** 4/5 (most convincing)
- **Scenario:** Suspicious account activity and payment security
- **Styling:** PayPal's navy blue (#003087), urgent warning box
- **Link Text:** "Restore Your Account Now"

### 4. **FedEx Delivery Notification**
- **Company:** FedEx
- **Subject:** "FedEx Delivery Exception - Action Required"
- **Difficulty:** 2/5
- **Scenario:** Address verification for delivery
- **Styling:** FedEx purple (#4D148C), shipping/tracking context
- **Link Text:** "Confirm Delivery Address"

### 5. **Apple Security Alert**
- **Company:** Apple
- **Subject:** "Your Apple ID security code"
- **Difficulty:** 4/5
- **Scenario:** 2FA security code and sign-in verification
- **Styling:** Apple's minimal black design, clean typography
- **Link Text:** "Secure Your Account"

### 6. **eBay Account Confirmation**
- **Company:** eBay
- **Subject:** "Confirm your eBay account"
- **Difficulty:** 2/5
- **Scenario:** Unusual account activity confirmation
- **Styling:** eBay's red (#E53238), commerce-focused messaging
- **Link Text:** "Confirm Your Account"

### 7. **Google 2-Factor Authentication**
- **Company:** Google
- **Subject:** "Unusual activity in your Google Account"
- **Difficulty:** 4/5
- **Scenario:** Unusual sign-in activity and security verification
- **Styling:** Google's blue gradient and clean design
- **Link Text:** "Check Your Account Activity"

---

## How Links Work

### Template Placeholder: `{{PHISHING_LINK}}`

Each template contains the placeholder `{{PHISHING_LINK}}` which is **automatically replaced** with the actual tracking URL before sending.

**Example transformation:**

```
Template contains:   {{PHISHING_LINK}}
Gets replaced with:  https://yourapp.com/api/track/click/token_abc123xyz
User sees:           [Verify My Account] button pointing to masked domain
User clicks:         Redirects to tracking endpoint
Tracking endpoint:   Records click, then redirects to training module
```

### User Experience Flow

1. **User receives email** — appears to be from real company (Amazon, Microsoft, etc.)
2. **User clicks link** — could be "Verify Account," "Reset Password," etc.
3. **Redirect to PhishWise** — `/api/track/click/[token]` endpoint
4. **Tracking recorded** — click registered in database
5. **Training module loads** — user sees educational content about phishing

---

## Placeholder Variables

All templates support these personalization placeholders:

| Placeholder | Description | Example |
|---|---|---|
| `{{USER_NAME}}` | User's first/full name | "John" → "Hello John," |
| `{{PHISHING_LINK}}` | Click-tracking redirect URL | Auto-filled, links back to PhishWise |
| `{{DATE}}` | Current date | "March 15, 2026" |
| `{{TIME}}` | Current time | "2:30 PM" |
| `{{LOCATION}}` | Simulated location | "Ashburn, VA" (random) |
| `{{DEVICE}}` | Simulated device | "Windows 10", "Chrome Browser" |

---

## Implementation Details

### File Location
```
lib/email-templates.ts
```

### Import & Usage

**In your modules:**
```typescript
import {
  AMAZON_ACCOUNT_VERIFY,
  MICROSOFT_PASSWORD_RESET,
  PAYPAL_BILLING_ALERT,
  // ... etc
} from "@/lib/email-templates";
```

**In email sending:**
```typescript
import { sendPhishingEmail } from "@/lib/email/send";

const trackingUrl = `${process.env.NEXTAUTH_URL}/api/track/click/${trackingToken}`;

await sendPhishingEmail({
  to: "user@example.com",
  userName: "John Doe",
  subject: AMAZON_ACCOUNT_VERIFY.subject,
  htmlBody: AMAZON_ACCOUNT_VERIFY.body, // HTML with {{PHISHING_LINK}} placeholder
  trackingToken: trackingToken,
  fromAddress: "security-alerts@amazon.com", // Spoofed sender
});
```

### How Replacement Works

The `sendPhishingEmail` function in `lib/email/send.ts`:

1. Takes the HTML template body
2. Replaces `{{USER_NAME}}` with actual user name
3. Replaces `{{PHISHING_LINK}}` with the tracking URL
4. Replaces other date/time/location placeholders
5. Injects open-tracking pixel (invisible 1x1 image)
6. Sends via SendGrid

---

## HTML/CSS Design Pattern

All templates use:

**Header**
- Company-branded gradient background
- Company name/logo display
- Color scheme matching brand

**Content Section**
- Greeting with user personalization
- Problem statement (urgency)
- Alert/warning box (visual emphasis)
- Call-to-action button
- Fallback link text (for email clients that don't render buttons)
- Footer with company info

**CSS Features**
- Inline styles (for email client compatibility)
- Table-based layout (older email clients)
- Responsive text sizing
- Brand-accurate color palettes
- Professional typography

---

## Customization

### Adding a New Template

```typescript
// lib/email-templates.ts
export const MYCOMPANY_TEMPLATE: EmailTemplate = {
  id: "mycompany_template",
  name: "My Company - [Scenario]",
  company: "My Company",
  subject: "Email subject line",
  difficulty: 3, // 1-5 scale
  category: "credential", // credential | shipping | billing | security | social
  body: `<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <div>
    Hello {{USER_NAME}},
    ...
    <a href="{{PHISHING_LINK}}">Click here</a>
    ...
  </div>
</body>
</html>`,
};

// Add to ALL_TEMPLATES export
export const ALL_TEMPLATES: EmailTemplate[] = [
  // ... existing
  MYCOMPANY_TEMPLATE,
];
```

### Modifying an Existing Template

Edit the template object in `lib/email-templates.ts` and update:
- `subject` — email subject line
- `body` — HTML content (keep `{{PHISHING_LINK}}` placeholder)
- `difficulty` — 1-5 difficulty rating
- `fromAddress` — spoofed sender address (in module config)

---

## Security & Compliance

### Disclaimer
All templates are **designed for authorized security training only**. PhishWise is meant to:
- Train users to recognize phishing
- Improve organizational security awareness
- Test incident response procedures

### Sender Address
Each template includes a `fromAddress` field that's used as the "From" address. These should:
- **NOT impersonate** actual company domains without authorization
- **Be clearly labeled** in training context as simulations
- **Include** company/organization security team contact info

### Open Tracking
Templates include a 1x1 tracking pixel (`<img src="...">`) to detect opens. This:
- Records when user opens the email (for training analytics)
- Is invisible to the user
- Works in most modern email clients

---

## Testing Templates

### Manual Test
1. Go to `/api/demo/send-test-email`
2. Send yourself a test email
3. Check your inbox for one of the templates
4. Click the link to verify it redirects properly

### Programmatic Test
```typescript
import { AMAZON_ACCOUNT_VERIFY, processTemplate } from "@/lib/email-templates";

const html = processTemplate(
  AMAZON_ACCOUNT_VERIFY,
  "John Doe",
  "https://yourapp.com/api/track/click/test_token_123"
);

console.log(html); // See full HTML with all placeholders filled
```

---

## Browser Compatibility

Templates use:
- Standard HTML5
- Inline CSS (for email client compatibility)
- Web-safe fonts (Arial, Segoe UI, system fonts)
- No JavaScript (not supported in email)
- No external images/CDN (SendGrid handles images)

**Tested in:**
- Gmail
- Outlook
- Apple Mail
- Yahoo Mail
- Mobile email clients

---

## Troubleshooting

### Links Not Working
- Check `NEXTAUTH_URL` environment variable is set correctly
- Verify `/api/track/click/[token]` route exists and is accessible
- Check that SendGrid has `SENDGRID_API_KEY` configured

### Templates Not Rendering
- Check `lib/email-templates.ts` file exists
- Verify imports in modules are correct
- Run build: `npm run build` (should show no TypeScript errors)

### User Name Not Personalizing
- Ensure `userName` parameter is passed to `sendPhishingEmail()`
- Check that user's name exists in database

### HTML Not Displaying Correctly
- Email client may strip CSS or styles
- Fallback text link is always visible (good for compatibility)
- Test in multiple email clients during training setup

---

## Categories

Templates are organized by **scenario type**:

| Category | Use Case | Templates |
|----------|----------|-----------|
| **credential** | Password/login phishing | Amazon, Microsoft, Apple, eBay, PayPal |
| **shipping** | Delivery/package phishing | FedEx |
| **billing** | Payment/invoicing phishing | PayPal |
| **security** | 2FA/security alert phishing | Apple, Google |
| **social** | Social engineering phishing | (Planned for future) |

---

## Integration with Training Modules

Templates are automatically integrated into **training modules** via `module-*.ts` files:

```typescript
// module-3-credentials.ts
export const accountPasswordModule: TrainingModuleConfig = {
  name: "Account & Password Traps",
  templates: [
    {
      name: AMAZON_ACCOUNT_VERIFY.name,
      subject: AMAZON_ACCOUNT_VERIFY.subject,
      body: AMAZON_ACCOUNT_VERIFY.body,
      // ... etc
    },
  ],
};
```

When the seed script runs, templates are created in the database and paired with modules.

---

## Future Enhancements

Planned improvements:
- A/B testing (multiple versions of same template)
- Template preview UI in dashboard
- Custom template builder for managers
- Localization (templates in multiple languages)
- Additional companies (more realistic variety)
