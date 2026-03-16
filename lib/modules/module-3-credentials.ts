import { TrainingModuleConfig } from "./types";

export const accountPasswordModule: TrainingModuleConfig = {
  name: "Account & Password Traps",
  description: "Learn to identify phishing emails that try to steal your username, password, or login codes.",
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
      name: "Unusual Sign-In Attempt",
      subject: "Unusual Sign-In Attempt Detected",
      fromAddress: "security@account-support-alerts.com",
      body: `We detected an unusual sign-in attempt on your account from a new device.

For your protection, access to your account has been temporarily limited. Please verify your identity to restore full access.

[Verify your account now]

If no action is taken within 24 hours, your account may be suspended to prevent unauthorized use.

Thank you for helping us keep your account secure.

Account Security Team`,
      difficulty: 2,
    },
    {
      name: "Password Reset Required",
      subject: "Password Reset Required - Action Needed",
      fromAddress: "support@account-services.com",
      body: `Your account password has expired and must be reset immediately. Failure to reset your password within 24 hours will result in account suspension.

Click the link below to reset your password:

[Reset Your Password]

This is a security measure to protect your account. Do not share this message with anyone.

Account Support Team`,
      difficulty: 2,
    },
    {
      name: "Verify Your Identity Now",
      subject: "URGENT: Verify Your Identity Now",
      fromAddress: "verify@identity-confirmation.com",
      body: `Your account access has been restricted due to suspicious activity.

We need to verify your identity to restore full access to your account.

Please verify now: [Verify Identity]

Time is running out - you have 12 hours to complete this verification.

Security Team`,
      difficulty: 1,
    },
    {
      name: "Confirm Your Account Login",
      subject: "Confirm Your Account Login Information",
      fromAddress: "security-check@account-verify.net",
      body: `We noticed an unusual login attempt on your account. To keep your account secure, please confirm your login information by clicking below:

[Confirm Login Details]

Your cooperation is important to us. If you did not attempt to log in, please secure your account immediately by resetting your password.

Best regards,
Account Security Department`,
      difficulty: 3,
    },
    {
      name: "Account Review Required",
      subject: "Please Review Your Account Settings",
      fromAddress: "review@account-update-center.com",
      body: `We're conducting a routine security review of your account. To continue using our service, you'll need to review and confirm your account details.

[Review Account Now]

This is part of our ongoing security improvements. Your prompt response is appreciated.

Account Management Team`,
      difficulty: 3,
    },
  ],
};
