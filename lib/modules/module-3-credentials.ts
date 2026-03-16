import { TrainingModuleConfig } from "./types";
import {
  AMAZON_ACCOUNT_VERIFY,
  MICROSOFT_PASSWORD_RESET,
  PAYPAL_BILLING_ALERT,
  APPLE_SECURITY_ALERT,
  EBAY_ACCOUNT_CONFIRM,
} from "@/lib/email-templates";

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
      name: AMAZON_ACCOUNT_VERIFY.name,
      subject: AMAZON_ACCOUNT_VERIFY.subject,
      fromAddress: "security-alerts@amazon.com",
      body: AMAZON_ACCOUNT_VERIFY.body,
      difficulty: AMAZON_ACCOUNT_VERIFY.difficulty,
    },
    {
      name: MICROSOFT_PASSWORD_RESET.name,
      subject: MICROSOFT_PASSWORD_RESET.subject,
      fromAddress: "account-security@microsoft.com",
      body: MICROSOFT_PASSWORD_RESET.body,
      difficulty: MICROSOFT_PASSWORD_RESET.difficulty,
    },
    {
      name: APPLE_SECURITY_ALERT.name,
      subject: APPLE_SECURITY_ALERT.subject,
      fromAddress: "noreply@apple.com",
      body: APPLE_SECURITY_ALERT.body,
      difficulty: APPLE_SECURITY_ALERT.difficulty,
    },
    {
      name: EBAY_ACCOUNT_CONFIRM.name,
      subject: EBAY_ACCOUNT_CONFIRM.subject,
      fromAddress: "noreply@ebay.com",
      body: EBAY_ACCOUNT_CONFIRM.body,
      difficulty: EBAY_ACCOUNT_CONFIRM.difficulty,
    },
    {
      name: PAYPAL_BILLING_ALERT.name,
      subject: PAYPAL_BILLING_ALERT.subject,
      fromAddress: "security@paypal.com",
      body: PAYPAL_BILLING_ALERT.body,
      difficulty: PAYPAL_BILLING_ALERT.difficulty,
    },
  ],
};
