import { TrainingModuleConfig } from "./types";
import {
  BILLING_PAYMENT_FAILED,
  BILLING_INVOICE_VERIFICATION,
  BILLING_REFUND_AVAILABLE,
  BILLING_UNEXPECTED_CHARGE,
  BILLING_LIMITED_REFUND,
} from "@/lib/email-templates-generic";

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
    BILLING_PAYMENT_FAILED,
    BILLING_INVOICE_VERIFICATION,
    BILLING_REFUND_AVAILABLE,
    BILLING_UNEXPECTED_CHARGE,
    BILLING_LIMITED_REFUND,
  ],
};
