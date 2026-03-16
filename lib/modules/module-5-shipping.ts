import { TrainingModuleConfig } from "./types";
import {
  SHIPPING_DELIVERY_FAILED,
  SHIPPING_PACKAGE_ON_HOLD,
} from "@/lib/email-templates-generic";

export const shippingModule: TrainingModuleConfig = {
  name: "Shipping, Delivery, and Order Problems",
  description: "Learn to recognize delivery scams that use package tracking and address verification to trick you.",
  orderIndex: 5,
  content: `# Shipping, Delivery, and Order Problems

## Overview

Shipping scams are common because many people receive packages regularly. These emails claim there is a problem with a delivery, that a package could not be delivered, or that you must confirm your address to receive it.

They want you to worry about missing something important. They want you to click quickly. The message usually includes a link to "track your package," "confirm delivery," or "reschedule shipment."

If you click, you may be sent to a fake login page or asked to enter personal information. The goal is simple: get your account access or payment details.

## Social Engineering Tactics

Shipping scams work because packages feel personal. Here's how scammers push you:

- **Urgency:** "Your package will be returned today."
- **Curiosity:** "You have a pending delivery."
- **Confusion:** "Address verification required."
- **Fear:** "Delivery suspended due to incomplete details."
- **Trust:** The email looks like it came from a known shipping company.

They want you reacting emotionally instead of thinking clearly.

## Red Flags

Watch for these warning signs:

- The sender's email address looks slightly different from the real company
- The message pressures you to act immediately
- The tracking link does not go to the company's official website
- The greeting is generic: "Dear Customer"
- The email asks you to confirm personal or payment details
- There are small spelling or formatting mistakes
- If you are unsure, pause before clicking

## Attacker's Objective

In shipping scams, attackers usually want one of these:

1. **Your login credentials** (email, shopping accounts)
2. **Your home address and personal information**
3. **Your credit card details** for a fake "delivery fee"

Sometimes they claim you owe a small shipping charge. Sometimes they send you to a fake tracking page that asks you to log in. Once they have your information, they may use it for fraud or identity theft.

## Prevention Steps

1. **Open a new browser** and go directly to the shipping company's official website
2. **Enter your tracking number** manually if you have one
3. **Check your online shopping account** to confirm real orders
4. **Never pay shipping fees** through a link in an email
5. **When unsure, pause** and verify before acting
6. **Real delivery companies** do not ask for payment or personal information through random email links

## Key Takeaway

Always verify delivery information by going directly to the shipping company's official website, never through an email link.
`,
  templates: [
    SHIPPING_DELIVERY_FAILED,
    SHIPPING_PACKAGE_ON_HOLD,
  ],
};
