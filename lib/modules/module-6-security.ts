import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";
import {
  SECURITY_ACCOUNT_LOCKOUT,
  SECURITY_PASSWORD_RESET,
  SECURITY_VERIFY_IDENTITY,
} from "@/lib/email-templates-generic";

const moduleContent: TrainingModuleContent = {
  overview: `Security alert scams are phishing emails that claim something is wrong with your account or device. These emails may say your account was hacked, that someone tried to sign in, or that your account will be locked. They want you to panic and act fast.`,
  tactics: [
    {
      name: "Fear",
      description: "Suspicious activity detected",
    },
    {
      name: "Urgency",
      description: "Action required within 1 hour",
    },
    {
      name: "Authority",
      description: "The email looks like it came from a real security team",
    },
    {
      name: "Loss threat",
      description: "Your account will be locked",
    },
    {
      name: "Convenience",
      description: "One click to fix it",
    },
  ],
  redFlags: [
    "The email demands you click a link to fix a security issue",
    "The message creates panic but gives little detail",
    "The sender address looks slightly off or unfamiliar",
    "The greeting is generic: 'Dear user' or 'Hello'",
    "The email threatens immediate lockout or suspension",
    "The link does not clearly go to the official website",
    "You are asked to enter a password or verification code from the link",
  ],
  objective: `In security alert scams, attackers usually want:
1. Your login credentials (username and password)
2. Your one-time code (verification code)
3. Access to your email, banking, shopping, or social media accounts

Once they get into one account, they often try to reset passwords on others.`,
  examples: [
    {
      title: "Security Alert - Unusual Sign-In",
      body: "We detected an unusual sign-in attempt on your account from a new device. For your protection, verify your identity immediately to prevent account lock.\n\n[Secure Account Now]",
      redFlags: [
        "Urgent 'verify immediately'",
        "Vague details about the sign-in attempt",
        "Link to 'secure account'",
        "Threat of lockout",
      ],
    },
    {
      title: "Password Expired",
      body: "Your password has expired due to updated security requirements. Update your password now to restore full access.\n\n[Update Password]",
      redFlags: [
        "Unexpected password expiration notice",
        "Generic greeting",
        "Link asks you to update credentials",
        "No reference to how to verify safely",
      ],
    },
  ],
  preventionSteps: [
    "Do not click the link in the email",
    "Open a new browser and go to the official website directly",
    "Log in from there and check your account security settings",
    "If you are worried, change your password from inside the real site",
    "Turn on multi-factor authentication if it is available",
    "If the email looks suspicious, report it and delete it",
  ],
  quiz: {
    question: "You receive an email saying 'Suspicious activity detected' and it asks you to click a link to verify your identity. What should you do?",
    options: [
      "Click the link quickly to stop the hacker",
      "Reply to the email asking what happened",
      "Open a new browser and sign in through the official website directly",
      "Forward the email to friends to warn them",
    ],
    correctIndex: 2,
    explanation: "Always verify account issues through the official website by opening a new browser tab, not by clicking email links.",
  },
};

export const securityAlertModule: TrainingModuleConfig = {
  name: "Security Alert Scams: Avoiding False Warnings",
  description: "Learn how to recognize fake security alerts and protect your accounts",
  orderIndex: 6,
  content: JSON.stringify(moduleContent),
  templates: [
    SECURITY_ACCOUNT_LOCKOUT,
    SECURITY_PASSWORD_RESET,
    SECURITY_VERIFY_IDENTITY,
  ],
};
