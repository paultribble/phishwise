import { TrainingModuleConfig } from "./types";

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
    {
      name: "Delivery Attempt Failed",
      subject: "Delivery Attempt Failed – Action Needed",
      fromAddress: "support@delivery-update-center.com",
      body: `Dear Customer,

We attempted to deliver your package today but were unable to complete delivery due to an address issue.

Confirm your shipping details within 24 hours to avoid return to sender:

[Confirm Delivery]

Thank you for your business.

Shipping Support Team`,
      difficulty: 2,
    },
    {
      name: "Package On Hold Notice",
      subject: "Final Notice – Package Pending",
      fromAddress: "notifications@shipping-alerts.com",
      body: `Your package is currently pending due to incomplete delivery information.

Failure to confirm your address today may result in the package being returned.

Please verify your details below:

[Verify Delivery Information]

Thank you,
Shipping Support Team`,
      difficulty: 2,
    },
    {
      name: "Shipping Fee Required",
      subject: "Package On Hold – Small Fee Required",
      fromAddress: "billing@shipping-services.com",
      body: `Your parcel is currently on hold due to unpaid shipping fees of $2.99.

To release your package, submit payment using the secure link below:

[Pay Shipping Fee]

Do not delay – packages are held for 30 days only.

Delivery Services`,
      difficulty: 2,
    },
    {
      name: "Reschedule Delivery Request",
      subject: "Action Required: Reschedule Your Delivery",
      fromAddress: "trackpkg@delivery-services.com",
      body: `We have a package for you, but we need to confirm your availability before we can deliver it.

Please reschedule your delivery within 24 hours or the package will be returned:

[Reschedule Delivery]

Click the link above to choose a new delivery date.

Package Tracking Center`,
      difficulty: 3,
    },
    {
      name: "Package Clearance Notice",
      subject: "Customs Clearance Required for Your Package",
      fromAddress: "customs@international-shipping.com",
      body: `Dear Recipient,

Your international package requires customs clearance. A small processing fee of $15 is required to proceed.

Authorize payment now to receive your package:

[Authorize Payment]

Your package is currently in our facility awaiting your response.

International Shipping Services`,
      difficulty: 4,
    },
  ],
};
