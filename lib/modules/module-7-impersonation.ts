import { TrainingModuleConfig } from "./types";

export const impersonationModule: TrainingModuleConfig = {
  name: "Impersonation: Trusted Person or Organization",
  description: "Learn to recognize when attackers pretend to be someone you know or trust.",
  orderIndex: 7,
  content: `# Impersonation: Trusted Person or Organization

## Overview

Impersonation attacks succeed because they exploit trust. These phishing emails pretend to come from someone you know — a coworker, manager, family member, or trusted company.

The attacker uses this false identity to make you lower your guard. They might ask for sensitive information, money, credentials, or to complete an urgent task. Because the email appears to come from someone trustworthy, you're more likely to act without careful verification.

These attacks are increasingly sophisticated, using details stolen from social media, company directories, or previous data breaches to make the impersonation more convincing.

## Social Engineering Tactics

Impersonation attacks exploit established relationships. Here's how they manipulate you:

- **False Authority:** Pretending to be a manager, executive, or IT staff
- **Urgency:** Creating time pressure that prevents verification
- **Trust:** Using names and details that make the message seem legitimate
- **Secrecy:** Asking you not to tell others or go through normal channels
- **Personal Detail:** Including information that seems to prove they know you

They count on your natural tendency to trust people you recognize.

## Red Flags

Watch for these warning signs:

- The request is unusual or outside normal business processes
- The sender asks you to bypass normal approval procedures
- The message creates urgency that prevents verification
- You're asked to keep the request confidential
- The email address looks slightly different from the real person's address
- The tone or writing style seems different than usual
- Requests for passwords, financial information, or sensitive data
- Links to unfamiliar websites or login pages

## Attacker's Objective

In impersonation attacks, attackers typically want:

1. **Direct access:** Money transfers, wire payments, gift cards
2. **Credentials:** Passwords, authentication codes, login information
3. **Sensitive data:** Customer lists, financial records, project details
4. **Account takeover:** Using stolen credentials to access company systems
5. **Validation:** Getting you to confirm information they can use later

Impersonation is particularly dangerous because it bypasses technical security — it relies on human trust instead.

## Common Impersonation Scenarios

**CEO/Executive Fraud:**
- "Quick favor: wire $50k to vendor account [details]"
- Asks you not to notify finance or go through normal approval

**IT Department:**
- "We're updating security. Please confirm your password and two-factor code"
- "Your account needs immediate password reset. Click here"

**HR/Payroll:**
- "Urgent: Update your direct deposit information immediately"
- "Confidential: Verify your SSN and banking details for tax purposes"

**Trusted Vendor:**
- "Your invoice is overdue. Payment required by end of day"
- Uses company letterhead and realistic invoice numbers

**Coworker/Team Member:**
- "Hey, can you do me a favor? Need a quick approval on this"
- Uses informal tone and internal knowledge to seem legitimate

## Prevention Steps

1. **Verify through a known channel.** Don't reply to the email — call or message the person directly using a number/address you know is legitimate
2. **Check the email address carefully.** Look at the full address, not just the display name
3. **Never act on urgent requests.** Legitimate urgent needs can be verified before acting
4. **Question unusual requests.** Even if it seems to come from your boss, if the request is unusual, verify it
5. **Follow normal processes.** If it asks you to bypass approval chains or normal procedures, it's suspicious
6. **Be skeptical of secrecy.** Legitimate companies don't ask you to keep requests confidential
7. **Use multi-factor authentication.** This protects accounts even if passwords are compromised

## Key Takeaway

Always verify the identity of someone making an unusual request, especially for sensitive information or urgent action. Use trusted contact methods to confirm before acting.
`,
  templates: [
    {
      name: "CEO Wire Transfer Request",
      subject: "URGENT: Wire Transfer Needed",
      fromAddress: "ceo@company-internal.net",
      body: `Hi,

I need a quick favor. We have an urgent vendor payment that needs to go out today.

Wire $50,000 to:
Account: 4532-1098-5647
Routing: 021000021
Bank: First National

This needs to happen by 3pm today. Please handle this quietly and don't loop in accounting yet — I'll notify them after it's sent.

Thanks for your quick action on this.

[CEO Name]`,
      difficulty: 3,
    },
    {
      name: "IT Password Verification",
      subject: "URGENT: Security Update - Verify Your Account",
      fromAddress: "it-security@company-auth.com",
      body: `Hello,

As part of our new security requirements, we need you to verify your account credentials immediately.

Please provide:
- Your username
- Your current password
- Your two-factor authentication code

Verify here: [Verify Account Credentials]

This is required for all employees by end of business today. Failure to verify may result in account suspension.

IT Security Team`,
      difficulty: 2,
    },
    {
      name: "HR Direct Deposit Change",
      subject: "ACTION REQUIRED: Update Your Direct Deposit Information",
      fromAddress: "payroll@hr-benefits.company.com",
      body: `Dear [Name],

We are migrating our payroll system and need you to re-enter your direct deposit information to avoid missed paychecks.

Update your information now: [Update Direct Deposit]

Required fields:
- Bank name
- Account number
- Routing number
- SSN (last 4)

This must be completed by Friday. Payroll will be delayed if not updated.

HR/Payroll Department`,
      difficulty: 2,
    },
    {
      name: "Coworker Approval Request",
      subject: "Quick favor - need your approval on this",
      fromAddress: "jsmith@company.com",
      body: `Hey,

Sorry to bother you, but I need a quick approval on something. Budget request got stuck in the system and I need it processed by end of day.

Can you approve this for me? It's just a formality.

[Approve Budget Request]

Thanks for your help. Let me know if you need anything from me.

John Smith
Finance Team`,
      difficulty: 3,
    },
    {
      name: "Vendor Invoice Payment",
      subject: "OVERDUE INVOICE - PAYMENT REQUIRED IMMEDIATELY",
      fromAddress: "accounts@vendor-services.biz",
      body: `Attention: Payment Required

Invoice #INV-2024-8847
Amount: $12,547.50
Due Date: OVERDUE

Your company has not paid this invoice. Our records show it was sent on [date].

Please process payment immediately to avoid service suspension and late fees.

Pay now: [Process Payment]

If you have questions, contact our billing department.

[Vendor Name]
Accounts Receivable`,
      difficulty: 2,
    },
  ],
};
