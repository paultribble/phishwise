import { TrainingModuleConfig } from "./types";
import {
  IMPERSONATION_URGENT_REQUEST,
  IMPERSONATION_BUDGET_APPROVAL,
} from "@/lib/email-templates-generic";

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
    IMPERSONATION_URGENT_REQUEST,
    IMPERSONATION_BUDGET_APPROVAL,
  ],
};
