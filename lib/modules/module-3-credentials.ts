import { TrainingModuleConfig } from "./types";
import {
  AMAZON_MODERN,
  MICROSOFT_MODERN,
  PAYPAL_MODERN,
  APPLE_MODERN,
  EBAY_MODERN,
} from "@/lib/email-templates-modern";

export const accountPasswordModule: TrainingModuleConfig = {
  name: "Account & Password Traps",
  description:
    "Learn to identify phishing emails that try to steal your username, password, or login codes.",
  orderIndex: 3,
  content: `# Account & Password Traps

## Overview

Some phishing emails try to steal your username, password, or login codes. These messages usually pretend there is a problem with one of your accounts and ask you to "fix it" right away.

These scams are common because passwords give attackers direct access to email, banking, shopping, and social media accounts. Once attackers get one account, they often try the same password on others.

## Social Engineering Tactics

Attackers rely on pressure to make you act quickly instead of carefully. Common tactics in these emails include:

- **Urgency:** "Immediate action required" or "Your account will be locked."
- **Fear:** Claims of suspicious activity or unauthorized sign-ins.
- **Authority:** Pretending to be a security team, IT department, or trusted company.
- **Convenience:** Promising a fast, one-click solution to the problem.

## Red Flags

Watch for these warning signs:

- The email asks you to click a link to log in or reset your password
- The sender's address looks slightly off or unfamiliar
- The message does not use your name
- The link leads to a page that looks real but has a strange web address
- The email creates panic or demands immediate action

## Attacker's Objective

The goal is to steal your login information. If you enter your username and password on a fake page, the attacker can:

- Take over your account
- Lock you out
- Use your account to scam others
- Access personal or financial information

## Prevention Steps

1. **Pause before clicking.** Do not act on fear or urgency.
2. **Check the sender.** Look closely at the email address.
3. **Verify safely.** Open a new browser tab and go to the website directly instead of clicking the email link.
4. **Use strong security.** Enable multi-factor authentication (MFA) where available.
5. **Report and delete.** If it looks suspicious, report it and remove the email.

## Key Takeaway

Always verify account issues by going directly to the website yourself, never through an email link.
`,
  templates: [
    {
      name: AMAZON_MODERN.name,
      subject: AMAZON_MODERN.subject,
      fromAddress: "security-alerts@amazon.com",
      body: AMAZON_MODERN.body,
      difficulty: AMAZON_MODERN.difficulty,
    },
    {
      name: MICROSOFT_MODERN.name,
      subject: MICROSOFT_MODERN.subject,
      fromAddress: "account-security@microsoft.com",
      body: MICROSOFT_MODERN.body,
      difficulty: MICROSOFT_MODERN.difficulty,
    },
    {
      name: APPLE_MODERN.name,
      subject: APPLE_MODERN.subject,
      fromAddress: "noreply@apple.com",
      body: APPLE_MODERN.body,
      difficulty: APPLE_MODERN.difficulty,
    },
    {
      name: EBAY_MODERN.name,
      subject: EBAY_MODERN.subject,
      fromAddress: "noreply@ebay.com",
      body: EBAY_MODERN.body,
      difficulty: EBAY_MODERN.difficulty,
    },
    {
      name: PAYPAL_MODERN.name,
      subject: PAYPAL_MODERN.subject,
      fromAddress: "security@paypal.com",
      body: PAYPAL_MODERN.body,
      difficulty: PAYPAL_MODERN.difficulty,
    },
  ],
};
