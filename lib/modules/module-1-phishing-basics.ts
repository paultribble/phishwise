import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";

const moduleContent: TrainingModuleContent = {
  overview: `Phishing is a type of scam where someone sends a message that looks real in order to trick you into doing something unsafe. That "something" is usually clicking a harmful link, opening a dangerous attachment, logging in to a fake website, or sharing personal information that should not be sent through email.

The most important idea for users to understand is this: Phishing is not just a strange-looking email. It is a message designed to push you into action before you have time to think.`,
  tactics: [
    {
      name: "Urgency",
      description: "The message says something must be done right now.",
    },
    {
      name: "Fear",
      description: "The message suggests there will be a problem if you do not respond.",
    },
    {
      name: "Authority",
      description: "The message pretends to come from someone important or trustworthy.",
    },
    {
      name: "Curiosity",
      description: "The message tries to make you want to see a file, notice, refund, message, or update.",
    },
  ],
  redFlags: [
    "Unexpected or unusual request - If the email asks for something you were not expecting, that should slow you down.",
    "Urgent language - Phishing messages often try to rush you with phrases like 'act now,' 'final notice,' 'verify immediately,' or 'your account will be locked.'",
    "Suspicious link or attachment - A phishing email often wants you to click something or open something.",
    "Request for sensitive information - Legitimate organizations generally do not ask users to send sensitive personal information through email.",
    "Sender does not look right - The display name may look familiar, but the actual sender address may be strange, misspelled, or unrelated.",
    "Tone feels off - Even if the email looks polished, the tone may feel unusually aggressive, demanding, threatening, or out of character.",
  ],
  objective: `Most phishing emails are trying to get one of four things:
1. Your login information - usernames, passwords, verification codes, account recovery details
2. Your personal or financial information - bank details, card numbers, Social Security numbers, birthdates
3. Access to your device or account - through a harmful link, dangerous attachment, or fake login page
4. A quick response that starts a larger scam - to get you to reply, confirm you are active, or trust the sender`,
  examples: [
    {
      title: "Your Package Could Not Be Delivered",
      body: "Subject: Delivery failed: confirm your address now\n\nWe attempted to deliver your package today but were unable to complete delivery because your address information could not be verified. To avoid return of the package, confirm your shipping details within the next 30 minutes using the secure link below.\n\n[Confirm Delivery Address]",
      redFlags: [
        "Creates urgency with a 30-minute deadline",
        "Asks the user to click a link (one of the most common phishing actions)",
        "Sender address looks generic and unusual",
        "Tries to create a problem the user feels forced to solve immediately",
      ],
    },
  ],
  preventionSteps: [
    "Pause - Do not react immediately, especially when the email feels urgent, upsetting, or unusually important.",
    "Check - Look at the request itself. Is it asking you to click, open, reply, pay, log in, or share information?",
    "Verify - Do not verify using the email itself. Instead, verify through a contact method you already trust, such as the official website, mobile app, known phone number, or saved contact.",
    "Then act - If you cannot verify it safely, do not click, do not open, and do not send information.",
  ],
  quiz: {
    question: "You receive an email saying your account will be restricted unless you confirm your information immediately. The email includes a link and asks you to act within 20 minutes. What should you do?",
    options: [
      "Click the link quickly so the account is not restricted",
      "Reply to the email and ask if it is real",
      "Go to the official website or app directly and check the account there",
      "Forward the email to a friend and ask what they think",
    ],
    correctIndex: 2,
    explanation: "This message shows two common phishing warning signs: urgency and a push to click a link. The safest response is to verify the issue through a trusted source you already know, not through the suspicious email.",
  },
};

export const phishingBasicsModule: TrainingModuleConfig = {
  name: "Phishing Basics: How Email Scams Work",
  description: "Learn what phishing is, how it works, and the PhishWise Response Routine",
  orderIndex: 1,
  content: JSON.stringify(moduleContent),
  templates: [
    {
      name: "Package Delivery Scam",
      subject: "Delivery failed: confirm your address now",
      fromAddress: "updates@delivery-notice.com",
      body: `Dear Valued Customer,

We attempted to deliver your package today but were unable to complete delivery due to an address verification issue.

To avoid return of your package, please confirm your shipping details within the next 30 minutes:

[CONFIRM DELIVERY DETAILS]

Thank you,
Shipping Services`,
      difficulty: 2,
    },
  ],
};
