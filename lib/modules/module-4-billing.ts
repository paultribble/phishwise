import { TrainingModuleConfig } from "./types";

export const billingModule: TrainingModuleConfig = {
  name: "Billing, Invoices, and Refund Scams",
  description: "Learn to recognize phishing emails that use financial pressure and payment confusion to trick you.",
  orderIndex: 4,
  content: `# Billing, Invoices, and Refund Scams

## Overview

Billing scams are some of the most common phishing emails people receive. These emails claim you were charged for something, that a payment failed, or that you are owed a refund. They want you to panic. They want you to act fast.

The message usually includes a link to "review the charge," "download the invoice," or "claim your refund." If you click, you may be sent to a fake login page or asked to enter payment details. The goal is simple: get your money or your account access.

## Social Engineering Tactics

Billing scams work because money gets attention. Here's how scammers push you:

- **Urgency:** "You must respond within 24 hours."
- **Fear:** "Your account will be suspended."
- **Confusion:** "You were charged $487.63 for a service you don't recognize."
- **Authority:** The email looks like it came from a trusted company.
- **Distraction:** Long invoice numbers and order details to make it feel real.

They want you reacting emotionally instead of thinking clearly.

## Red Flags

Watch for these warning signs:

- You do not recognize the charge or company
- The sender's email address looks slightly off
- The message pressures you to act immediately
- The link says "review payment" instead of sending you to the company's official website
- The greeting is generic: "Dear Customer"
- The email includes spelling or formatting mistakes
- You are asked to enter login or payment details through a link

## Attacker's Objective

In billing scams, attackers usually want one of three things:

1. **Your login credentials** (email, Amazon, PayPal, bank account)
2. **Your credit card or banking information**
3. **A direct money transfer** to "fix" the issue

Sometimes they ask you to call a fake support number. Sometimes they send you to a fake website that looks real. Once they have your information or money, it can be hard to recover it.

## Prevention Steps

1. **Do not click links** in billing emails
2. **Open a new browser** and go directly to the company's official website
3. **Log in from there** to check your account
4. **Call the official number** listed on the company's website — not the number in the email
5. **If you don't have an account** with that company, delete the email
6. **When unsure, pause** and verify before acting
7. **Never send payment** or login information through an email link

## Key Takeaway

Always verify charges and payments by going directly to the company's official website, never through an email link.
`,
  templates: [
    {
      name: "Payment Issue Detected",
      subject: "Urgent: Payment Issue Detected",
      fromAddress: "billing-support@account-update-center.com",
      body: `Dear Customer,

We were unable to process your recent payment of $528.17 for your subscription renewal.

Your service will be suspended within 24 hours unless payment is confirmed.

Please review your invoice and update your billing information below:

[Review and Update Payment]

Thank you,
Billing Department`,
      difficulty: 2,
    },
    {
      name: "Invoice Verification Required",
      subject: "Invoice #88421 – Payment Confirmation Required",
      fromAddress: "invoices@billing-confirmation.com",
      body: `Dear Customer,

Thank you for your payment of $479.99 for your Premium Protection Plan.

If you did not authorize this charge, click below within 24 hours to cancel:

[Review Invoice]

Please respond promptly to avoid any service interruption.

Billing Team`,
      difficulty: 2,
    },
    {
      name: "Refund Available Notice",
      subject: "Refund Available – Action Required",
      fromAddress: "refunds@account-services.com",
      body: `Hello,

We attempted to process your refund of $312.40.

Due to a verification issue, your refund is on hold.

Confirm your billing details here to release funds:

[Confirm Refund]

Please act quickly as refunds expire after 30 days.

Refund Processing Center`,
      difficulty: 2,
    },
    {
      name: "Unexpected Charge Notice",
      subject: "Suspicious Transaction on Your Account",
      fromAddress: "fraud-alert@billing-center.com",
      body: `Hi there,

We detected an unexpected charge of $99.99 on your account for "Premium Subscription."

If you don't recognize this charge, please click below to dispute it immediately:

[Dispute Charge]

Our fraud team is standing by to help resolve this issue.

Account Security Team`,
      difficulty: 3,
    },
    {
      name: "Limited Time Refund Offer",
      subject: "Last Chance: $50 Refund Available Today Only",
      fromAddress: "promotions@payment-update-center.com",
      body: `Great news!

You qualify for a one-time refund of $50 from your recent purchase.

This offer expires in 24 hours. Claim your refund now:

[Claim Your Refund]

Don't miss out on this limited-time offer!

Payment Services`,
      difficulty: 3,
    },
  ],
};
