import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";
import {
  BILLING_PAYMENT_FAILED,
  BILLING_INVOICE_VERIFICATION,
  BILLING_REFUND_AVAILABLE,
  BILLING_UNEXPECTED_CHARGE,
  BILLING_LIMITED_REFUND,
} from "@/lib/email-templates-generic";

const moduleContent: TrainingModuleContent = {
  overview: `Billing scams are some of the most common phishing emails people receive. These emails claim you were charged for something, that a payment failed, or that you are owed a refund. They want you to panic and act fast. The message usually includes a link to "review the charge," "download the invoice," or "claim your refund."`,
  tactics: [
    {
      name: "Urgency",
      description: "You must respond within 24 hours",
    },
    {
      name: "Fear",
      description: "Your account will be suspended",
    },
    {
      name: "Confusion",
      description: "You were charged for something you do not recognize",
    },
    {
      name: "Authority",
      description: "The email looks like it came from a trusted company",
    },
    {
      name: "Distraction",
      description: "Long invoice numbers and order details to make it feel real",
    },
  ],
  redFlags: [
    "You do not recognize the charge or company",
    "The sender's email address looks slightly off",
    "The message pressures you to act immediately",
    "The link says 'review payment' instead of going to the official website",
    "The greeting is generic: 'Dear Customer'",
    "The email includes spelling or formatting mistakes",
    "You are asked to enter login or payment details through a link",
  ],
  objective: `In billing scams, attackers usually want one of three things:
1. Your login credentials (email, Amazon, PayPal, bank account)
2. Your credit card or banking information
3. A direct money transfer to "fix" the issue

Once they have your information or money, it can be hard to recover it.`,
  examples: [
    {
      title: "Fake Charge Notification",
      body: "Thank you for your payment of $479.99 for your Premium Protection Plan. If you did not authorize this charge, click below within 24 hours to cancel.\n\n[Review Invoice]",
      redFlags: [
        "You do not remember buying this",
        "Generic greeting",
        "Pressure to act within 24 hours",
        "Link instead of directing you to the official website",
      ],
    },
    {
      title: "Refund Scam",
      body: "We attempted to process your refund of $312.40. Due to a verification issue, your refund is on hold. Confirm your billing details here to release funds.\n\n[Confirm Refund]",
      redFlags: [
        "Unexpected refund",
        "Asks you to 'confirm billing details'",
        "Vague explanation of the problem",
        "No clear company contact information",
      ],
    },
  ],
  preventionSteps: [
    "Do not click links in billing emails",
    "Open a new browser and go directly to the company's official website",
    "Log in from there to check your account",
    "Call the official phone number listed on the company's website — not the number in the email",
    "If you do not have an account with that company, delete the email",
    "When unsure, pause and verify before acting",
    "Never send payment or login information through an email link",
  ],
  quiz: {
    question: "You receive an email saying you were charged $399 for a service you do not recognize. The email says you must click within 12 hours to cancel. What should you do?",
    options: [
      "Click the link to cancel immediately",
      "Reply to the email asking for more details",
      "Open a new browser and log into your account from the official website",
      "Forward the email to a friend to ask if it looks real",
    ],
    correctIndex: 2,
    explanation: "Always go directly to the company's official website to check charges. Never click payment links in emails or enter payment information through email links.",
  },
};

export const billingModule: TrainingModuleConfig = {
  name: "Billing Scams: Protecting Your Payment Information",
  description: "Learn how to spot and avoid billing and payment scams",
  orderIndex: 4,
  content: JSON.stringify(moduleContent),
  templates: [
    BILLING_PAYMENT_FAILED,
    BILLING_INVOICE_VERIFICATION,
    BILLING_REFUND_AVAILABLE,
    BILLING_UNEXPECTED_CHARGE,
    BILLING_LIMITED_REFUND,
  ],
};
