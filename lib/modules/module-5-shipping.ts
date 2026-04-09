import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";
import {
  SHIPPING_DELIVERY_FAILED,
  SHIPPING_PACKAGE_ON_HOLD,
} from "@/lib/email-templates-generic";

const moduleContent: TrainingModuleContent = {
  overview: `Shipping scams are common because many people receive packages regularly. These emails claim there is a problem with a delivery, that a package could not be delivered, or that you must confirm your address to receive it. They want you to worry about missing something important and click quickly.`,
  tactics: [
    {
      name: "Urgency",
      description: "Your package will be returned today",
    },
    {
      name: "Curiosity",
      description: "You have a pending delivery",
    },
    {
      name: "Confusion",
      description: "Address verification required",
    },
    {
      name: "Fear",
      description: "Delivery suspended due to incomplete details",
    },
    {
      name: "Trust",
      description: "The email looks like it came from a known shipping company",
    },
  ],
  redFlags: [
    "The sender's email address looks slightly different from the real company",
    "The message pressures you to act immediately",
    "The tracking link does not go to the company's official website",
    "The greeting is generic: 'Dear Customer'",
    "The email asks you to confirm personal or payment details",
    "There are small spelling or formatting mistakes",
    "If you are unsure, pause before clicking",
  ],
  objective: `In shipping scams, attackers usually want one of these:
1. Your login credentials (email, shopping accounts)
2. Your home address and personal information
3. Your credit card details for a fake "delivery fee"

Once they have your information, they may use it for fraud or identity theft.`,
  examples: [
    {
      title: "Delivery Attempt Failed",
      body: "We attempted to deliver your package today but were unable to complete delivery due to an address issue. Confirm your shipping details within 24 hours to avoid return to sender.\n\n[Confirm Delivery]",
      redFlags: [
        "You were not expecting a package",
        "Generic greeting",
        "Pressure to act within 24 hours",
        "Link asking you to confirm details",
      ],
    },
    {
      title: "Package on Hold",
      body: "Your parcel is currently on hold due to unpaid shipping fees of $2.99. To release your package, submit payment using the secure link below.\n\n[Pay Shipping Fee]",
      redFlags: [
        "Unexpected delivery fee",
        "Very small amount to lower suspicion",
        "Link asking for payment information",
        "No official order number tied to your account",
      ],
    },
  ],
  preventionSteps: [
    "Open a new browser and go directly to the shipping company's official website",
    "Enter your tracking number manually if you have one",
    "Check your online shopping account to confirm real orders",
    "Never pay shipping fees through a link in an email",
    "When unsure, pause and verify before acting",
    "Real delivery companies do not ask for payment through random email links",
  ],
  quiz: {
    question: "You receive an email saying your package cannot be delivered unless you confirm your address within 12 hours. What should you do?",
    options: [
      "Click the link to confirm your address immediately",
      "Reply to the email asking which package it is about",
      "Open a new browser and check the official shipping website directly",
      "Forward the email to a friend to ask if it looks real",
    ],
    correctIndex: 2,
    explanation: "Always check deliveries through the official website. Never confirm personal information through email links or unknown websites.",
  },
};

export const shippingModule: TrainingModuleConfig = {
  name: "Shipping Scams: Verifying Delivery",
  description: "Learn how to identify and avoid shipping and delivery scams",
  orderIndex: 5,
  content: JSON.stringify(moduleContent),
  templates: [
    SHIPPING_DELIVERY_FAILED,
    SHIPPING_PACKAGE_ON_HOLD,
  ],
};
