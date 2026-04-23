import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";
import {
  AMAZON_BULLETPROOF,
  MICROSOFT_BULLETPROOF,
  PAYPAL_BULLETPROOF,
  APPLE_BULLETPROOF,
  EBAY_BULLETPROOF,
} from "@/lib/email-templates-bulletproof";

const moduleContent: TrainingModuleContent = {
  overview: `Some phishing emails try to steal your username, password, or login codes. These messages usually pretend there is a problem with one of your accounts and ask you to "fix" it right away. These scams are common because passwords give attackers direct access to email, banking, shopping, and social media accounts.`,
  tactics: [
    {
      name: "Urgency",
      description: "Immediate action required or your account will be locked",
    },
    {
      name: "Fear",
      description: "Claims of suspicious activity or unauthorized sign-ins",
    },
    {
      name: "Authority",
      description: "Pretending to be a security team, IT department, or trusted company",
    },
    {
      name: "Convenience",
      description: "Promising a fast, one-click solution to the problem",
    },
  ],
  redFlags: [
    "The email asks you to click a link to log in or reset your password",
    "The sender's address looks slightly off or unfamiliar",
    "The message does not use your name",
    "The link leads to a page that looks real but has a strange web address",
    "The email creates panic or demands immediate action",
    "No specific account details are mentioned",
  ],
  objective: `The goal is to steal your login information. If you enter your username and password on a fake page, the attacker can:
1. Take over your account
2. Lock you out
3. Use your account to scam others
4. Access personal or financial information`,
  examples: [
    {
      title: "Fake Security Alert",
      body: "We detected unusual activity on your account. For your protection, please verify your identity immediately to avoid suspension.",
      redFlags: [
        "Urgency - warning about account suspension",
        "Vague - 'unusual activity' with no details",
        "Login link - asks you to verify through email link",
      ],
    },
    {
      title: "Password Reset Request",
      body: "Your password expires today. Click here to reset now.",
      redFlags: [
        "Pressure to act quickly",
        "Generic language",
        "Unexpected reset request",
      ],
    },
  ],
  preventionSteps: [
    "Pause before clicking - Do not act on fear or urgency",
    "Check the sender - Look closely at the email address",
    "Verify safely - Open a new browser tab and go to the website directly instead of clicking the email link",
    "Use strong security - Enable multi-factor authentication (MFA) where available",
    "Report and delete - If it looks suspicious, report it and remove the email",
  ],
  quiz: {
    question: "You receive an email saying your account has suspicious activity and asking you to click a link to log in. What is the safest action?",
    options: [
      "Click the link and log in quickly",
      "Reply to the email asking for more details",
      "Open a new browser tab and sign in directly to the official website",
      "Forward the email to friends to warn them",
    ],
    correctIndex: 2,
    explanation: "Always verify account issues through the official website by opening a new browser tab and typing the address manually, not by clicking email links.",
  },
};

export const accountPasswordModule: TrainingModuleConfig = {
  name: "Credential Theft: Protecting Your Login Information",
  description: "Learn how attackers steal passwords and how to protect your accounts",
  orderIndex: 3,
  content: JSON.stringify(moduleContent),
  templates: [
    {
      name: AMAZON_BULLETPROOF.name,
      subject: AMAZON_BULLETPROOF.subject,
      fromAddress: "security-alerts@amazon.com",
      body: AMAZON_BULLETPROOF.body,
      difficulty: AMAZON_BULLETPROOF.difficulty,
    },
    {
      name: MICROSOFT_BULLETPROOF.name,
      subject: MICROSOFT_BULLETPROOF.subject,
      fromAddress: "account-security@microsoft.com",
      body: MICROSOFT_BULLETPROOF.body,
      difficulty: MICROSOFT_BULLETPROOF.difficulty,
    },
    {
      name: APPLE_BULLETPROOF.name,
      subject: APPLE_BULLETPROOF.subject,
      fromAddress: "noreply@apple.com",
      body: APPLE_BULLETPROOF.body,
      difficulty: APPLE_BULLETPROOF.difficulty,
    },
    {
      name: EBAY_BULLETPROOF.name,
      subject: EBAY_BULLETPROOF.subject,
      fromAddress: "noreply@ebay.com",
      body: EBAY_BULLETPROOF.body,
      difficulty: EBAY_BULLETPROOF.difficulty,
    },
    {
      name: PAYPAL_BULLETPROOF.name,
      subject: PAYPAL_BULLETPROOF.subject,
      fromAddress: "security@paypal.com",
      body: PAYPAL_BULLETPROOF.body,
      difficulty: PAYPAL_BULLETPROOF.difficulty,
    },
  ],
};
