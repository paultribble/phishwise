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
      name: "Amazon - Unusual Sign-In Attempt",
      subject: "Amazon.com: Unusual sign-in activity",
      fromAddress: "security-alerts@amazon.com",
      body: `<div style="font-family: Arial, sans-serif; color: #333;">
<p>Hello {{USER_NAME}},</p>

<p>We detected an unusual sign-in attempt on your Amazon account from a new device in an unfamiliar location.</p>

<p>For your security, we've temporarily restricted access to your account. To regain access, please verify your identity:</p>

<p style="text-align: center;">
  <a href="#" style="background-color: #FF9900; color: white; padding: 12px 30px; text-decoration: none; border-radius: 3px; font-weight: bold; display: inline-block;">Verify Your Identity</a>
</p>

<p>If you don't recognize this sign-in attempt, we recommend changing your password immediately.</p>

<p style="font-size: 12px; color: #666;">
Amazon.com, Inc.<br>
410 Terry Avenue North<br>
Seattle, WA 98109<br>
United States
</p>
</div>`,
      difficulty: 2,
    },
    {
      name: "Microsoft - Password Reset Required",
      subject: "Microsoft account password reset",
      fromAddress: "account-security@microsoft.com",
      body: `<div style="font-family: Segoe UI, Arial, sans-serif; color: #333;">
<p>Hi {{USER_NAME}},</p>

<p>For security reasons, you need to reset your Microsoft account password.</p>

<p>Someone may have tried to use your account. As a precaution, we've restricted it.</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="#" style="background-color: #0078d4; color: white; padding: 12px 35px; text-decoration: none; border-radius: 2px; font-weight: bold; display: inline-block;">Reset Your Password Now</a>
</p>

<p>If you didn't request this change, your account may be compromised. Change your password immediately.</p>

<p style="font-size: 12px; color: #666; margin-top: 30px;">
Microsoft Corporation<br>
One Microsoft Way<br>
Redmond, WA 98052<br>
USA
</p>
</div>`,
      difficulty: 2,
    },
    {
      name: "Apple - Account Verification Required",
      subject: "Your Apple ID has been restricted",
      fromAddress: "noreply@apple.com",
      body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333;">
<p>Hello {{USER_NAME}},</p>

<p>Your Apple ID has been temporarily restricted due to unusual sign-in activity.</p>

<p>To restore full access to your account and prevent unauthorized use, please verify your identity:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="#" style="background-color: #007AFF; color: white; padding: 12px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Apple ID</a>
</p>

<p style="font-size: 12px; color: #666; margin-top: 30px;">
Apple Inc.<br>
One Apple Park Way<br>
Cupertino, CA 95014<br>
United States
</p>
</div>`,
      difficulty: 1,
    },
    {
      name: "eBay - Login Confirmation Required",
      subject: "eBay: Confirm your password",
      fromAddress: "noreply@ebay.com",
      body: `<div style="font-family: Arial, Helvetica, sans-serif; color: #333;">
<p>Hello {{USER_NAME}},</p>

<p>We've noticed unusual activity on your eBay account and need you to confirm your account information.</p>

<p>For your protection, click below to confirm your account:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="#" style="background-color: #E53238; color: white; padding: 12px 35px; text-decoration: none; border-radius: 3px; font-weight: bold; display: inline-block; font-size: 14px;">Confirm Account</a>
</p>

<p style="font-size: 12px; color: #666; margin-top: 30px;">
eBay Inc.<br>
2025 Hamilton Avenue<br>
San Jose, CA 95125<br>
United States
</p>
</div>`,
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
