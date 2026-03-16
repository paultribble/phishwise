import { TrainingModuleConfig } from "./types";
import {
  SECURITY_ACCOUNT_LOCKOUT,
  SECURITY_PASSWORD_RESET,
  SECURITY_VERIFY_IDENTITY,
} from "@/lib/email-templates-generic";

export const securityAlertModule: TrainingModuleConfig = {
  name: "Security Alerts & Account Warnings",
  description: "Learn to recognize fake security alerts that use fear and urgency to steal your credentials.",
  orderIndex: 6,
  content: `# Security Alerts & Account Warnings

## Overview

Security alert scams are phishing emails that claim something is wrong with your account or device. These emails may say your account was hacked, that someone tried to sign in, or that your account will be locked.

They want you to panic. They want you to act fast. The message usually includes a link to "secure your account," "verify your identity," or "review recent activity."

If you click, you may be sent to a fake login page that steals your username, password, or verification code. The goal is simple: get into your account.

## Social Engineering Tactics

Security alert scams work because fear makes people rush. Here's how scammers push you:

- **Fear:** "Suspicious activity detected."
- **Urgency:** "Action required within 1 hour."
- **Authority:** The email looks like it came from a real security team.
- **Loss threat:** "Your account will be locked."
- **Convenience:** "One click to fix it."

They want you reacting quickly instead of checking carefully.

## Red Flags

Watch for these warning signs:

- The email demands you click a link to fix a security issue
- The message creates panic but gives little detail
- The sender address looks slightly off or unfamiliar
- The greeting is generic: "Dear user" or "Hello"
- The email threatens immediate lockout or suspension
- The link does not clearly go to the official website
- You are asked to enter a password or verification code from the link
- If the email makes you feel rushed, slow down

## Attacker's Objective

In security alert scams, attackers usually want:

1. **Your login credentials** (username and password)
2. **Your one-time code** (verification code)
3. **Access to your email, banking, shopping, or social media accounts**

Once they get into one account, they often try to reset passwords on others. Your email account is a common target because it can be used to reset many other accounts.

## Prevention Steps

1. **Do not click** the link in the email
2. **Open a new browser** and go to the official website directly
3. **Log in from there** and check your account security settings
4. **If you are worried, change your password** from inside the real site
5. **Turn on multi-factor authentication** if it is available
6. **If the email looks suspicious, report it** and delete it
7. **Security problems** should be checked through trusted steps, not email links

## Key Takeaway

Always check account security issues by going directly to the website yourself, never through an email link.
`,
  templates: [
    SECURITY_ACCOUNT_LOCKOUT,
    SECURITY_PASSWORD_RESET,
    SECURITY_VERIFY_IDENTITY,
  ],
};
