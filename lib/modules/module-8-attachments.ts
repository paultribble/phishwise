import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";
import {
  ATTACHMENTS_SHARED_DOCUMENT,
  ATTACHMENTS_FORM_SUBMISSION,
} from "@/lib/email-templates-generic";

const moduleContent: TrainingModuleContent = {
  overview: `Some phishing emails try to get you to open a file or click a document link. These messages may look like a receipt, a scanned document, a shared file, or a "secure message." They often say you need to view something important right away.`,
  tactics: [
    {
      name: "Curiosity",
      description: "See the attached invoice",
    },
    {
      name: "Urgency",
      description: "Document expires today",
    },
    {
      name: "Trust",
      description: "Shared with you via Google Docs / OneDrive",
    },
    {
      name: "Authority",
      description: "HR policy update or secure message",
    },
    {
      name: "Confusion",
      description: "They use vague titles so you open it to find out",
    },
  ],
  redFlags: [
    "You were not expecting a document or attachment",
    "The email is vague: 'Please review' with no context",
    "The file name is generic or weird",
    "The link says you must sign in again to view a document",
    "The sender is unfamiliar or slightly off",
    "The message pressures you to open it quickly",
    "The email asks you to enable something like 'macros' or 'editing'",
  ],
  objective: `These scams usually aim for one of two outcomes:
1. Credential theft - A fake document link leads to a fake login page that steals your username, password, or code
2. Malware - The attachment or download tries to install harmful software on your device

If attackers get into your email, they can reset passwords for many other accounts.`,
  examples: [
    {
      title: "Shared Document",
      body: "A document has been shared with you securely. Please review and sign today to avoid delay.\n\n[View Secure Document]",
      redFlags: [
        "You did not expect a shared document",
        "Vague request with no details",
        "Urgent deadline",
        "Link to view the document",
      ],
    },
    {
      title: "Invoice Attached",
      body: "Your invoice is attached. Your payment is past due. Open the attachment to review charges and avoid late fees.\n\nAttachment: Invoice_10492.pdf",
      redFlags: [
        "Unexpected invoice",
        "Pressure to avoid fees",
        "Generic greeting",
        "Attachment you did not request",
      ],
    },
  ],
  preventionSteps: [
    "Do not open unexpected attachments",
    "Do not click document links you were not expecting",
    "Verify the sender using a trusted method",
    "If it's from a company, go to the official website directly instead of using the email link",
    "If it's from a person you know, confirm through a separate message thread",
    "Never sign in through a document link in an email unless you expected it",
    "If it looks suspicious, report it as phishing (or mark as spam), then delete it",
  ],
  quiz: {
    question: "You receive an email saying 'Invoice attached' from a sender you do not recognize. What should you do?",
    options: [
      "Open the attachment to see what it is",
      "Click reply and ask them to explain",
      "Delete the email or verify through a trusted method before opening anything",
      "Forward it to your contacts to warn them",
    ],
    correctIndex: 2,
    explanation: "Never open unexpected attachments or document links. Delete suspicious emails or verify through a trusted method before opening anything.",
  },
};

export const attachmentsModule: TrainingModuleConfig = {
  name: "Attachments & Document Links: Safe File Handling",
  description: "Learn how to safely handle unexpected attachments and document links",
  orderIndex: 8,
  content: JSON.stringify(moduleContent),
  templates: [
    ATTACHMENTS_SHARED_DOCUMENT,
    ATTACHMENTS_FORM_SUBMISSION,
  ],
};
