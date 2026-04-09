import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";
import {
  IMPERSONATION_URGENT_REQUEST,
  IMPERSONATION_BUDGET_APPROVAL,
} from "@/lib/email-templates-generic";

const moduleContent: TrainingModuleContent = {
  overview: `Impersonation scams are phishing emails that pretend to be someone you trust. It might look like a family member, a coworker, a boss, a bank, a school, or a company you use. The email usually asks for something simple at first: a quick favor, a payment, personal information, or a code.`,
  tactics: [
    {
      name: "Trust",
      description: "It's me. I need help.",
    },
    {
      name: "Urgency",
      description: "I need this right now",
    },
    {
      name: "Authority",
      description: "I'm with your bank / support team / manager",
    },
    {
      name: "Guilt",
      description: "Please don't tell anyone. I'm in a situation.",
    },
    {
      name: "Confusion",
      description: "They keep it vague so you fill in the gaps",
    },
  ],
  redFlags: [
    "The request is unusual for that person or organization",
    "They ask for money, gift cards, or a quick payment",
    "They ask for personal information or login codes",
    "They pressure you to act immediately",
    "They ask you to keep it secret",
    "The email address is slightly different than normal",
    "The message avoids details and pushes you to reply quickly",
  ],
  objective: `In impersonation scams, attackers often want:
1. A money transfer (gift cards, wire transfer, payment app)
2. Personal information (address, phone number, account details)
3. Verification codes (used to break into accounts)

Sometimes they are trying to take over your email or a family member's account.`,
  examples: [
    {
      title: "Quick Favor Needed",
      body: "Hey, are you free right now? I need you to pick something up for me. I'm in a meeting and can't talk. Can you grab two gift cards and send me the codes? I'll pay you back later.",
      redFlags: [
        "Gift card request",
        "'Can't talk' to avoid verification",
        "Urgency and pressure",
        "Unusual request",
      ],
    },
    {
      title: "Account Verification Needed",
      body: "Hello, this is the Security Department. We noticed unusual activity on your account. Reply with your full name, date of birth, and the code you just received to confirm your identity.",
      redFlags: [
        "Asks for sensitive personal details",
        "Requests a verification code",
        "Authority language without proof",
        "Pushes reply instead of safe verification steps",
      ],
    },
  ],
  preventionSteps: [
    "Pause before responding to unexpected requests",
    "Verify using a trusted method - Call the person using a saved number",
    "Text them using your normal conversation thread",
    "If it claims to be a company, go to the official website directly",
    "Never send gift card codes, login codes, or personal information by email",
    "If the message feels urgent or secret, treat that as a warning sign",
    "If you are unsure, ask a second person for a quick reality check",
  ],
  quiz: {
    question: "You receive an email from someone you know asking you to buy gift cards and send the codes immediately. What should you do?",
    options: [
      "Buy the gift cards to help them quickly",
      "Reply asking what brand of gift cards they want",
      "Verify the request by calling or texting them using a known number or existing thread",
      "Send them your bank login so they can pay you back",
    ],
    correctIndex: 2,
    explanation: "Always verify unusual requests before acting, especially requests for money or gift cards. Use a trusted communication method like a phone call or existing text thread, not the email.",
  },
};

export const impersonationModule: TrainingModuleConfig = {
  name: "Impersonation Scams: Verifying Who's Really Asking",
  description: "Learn how to spot scams that pretend to be people you trust",
  orderIndex: 7,
  content: JSON.stringify(moduleContent),
  templates: [
    IMPERSONATION_URGENT_REQUEST,
    IMPERSONATION_BUDGET_APPROVAL,
  ],
};
