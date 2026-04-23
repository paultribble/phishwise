import { TrainingModuleConfig } from "./types";
import { TrainingModuleContent } from "@/types/training";

const moduleContent: TrainingModuleContent = {
  overview: `Social engineering is when someone manipulates a person into revealing information or taking an action they would not normally take. In email scams, that action might be clicking a link, opening an attachment, sending information, logging in to a fake site, or replying to a message.

The most important idea for users to understand is this: Social engineering works by pushing emotions and behavior, not by proving the message is true.`,
  tactics: [
    {
      name: "Urgency",
      description: "The message pressures the user to act immediately so there is less time to think, verify, or ask questions.",
    },
    {
      name: "Fear",
      description: "The message suggests something bad will happen if the user does not respond, such as losing an account, missing a deadline, or facing a penalty.",
    },
    {
      name: "Authority",
      description: "The message pretends to come from a boss, bank, school, government office, service provider, or other trusted source.",
    },
    {
      name: "Curiosity",
      description: "The message makes the user want to open a file, review a document, claim a refund, read a notice, or see a private message.",
    },
    {
      name: "Helpfulness",
      description: "The message offers a fast fix to a problem and makes the unsafe action feel like the easiest solution.",
    },
  ],
  redFlags: [
    "Message uses pressure tactics to influence the user",
    "Combines multiple tactics like urgency, fear, and authority together",
    "Asks for immediate action without time to verify",
    "Uses emotional language to push quick reactions",
    "Offers easy solutions that sound too good to be true",
  ],
  objective: `A social engineering email is usually trying to move the user toward one immediate action. Common actions scammers want include:
1. Clicking a link
2. Opening an attachment
3. Logging in through the email
4. Sending personal or financial information
5. Replying quickly without verifying the request
6. Sending money or approving a payment`,
  examples: [
    {
      title: "Final Notice from the School Office",
      body: "Subject: Final reminder: action needed before 5 p.m.\n\nThis is a reminder from the school office. We still need you to confirm student emergency contact information before the end of the day. Reply to this message with full name, date of birth, home address, and phone number so we can update the file and avoid processing issues.",
      redFlags: [
        "Uses authority by claiming to come from the school office",
        "Creates urgency with a same-day deadline",
        "Asks for personal information through email",
        "Sender address does not clearly match an official school domain",
      ],
    },
  ],
  preventionSteps: [
    "Notice the emotional reaction first - If the message makes you feel rushed, worried, guilty, curious, or pressured, slow down.",
    "Look at what the email is asking you to do - Is it asking for a click, a login, an attachment, a reply, or sensitive information?",
    "Check for the pressure tactics - Identify the social engineering technique being used",
    "Verify through a trusted source - Do not use the suspicious message itself to confirm whether it is real",
    "Take action safely - If you cannot verify, do not respond to the pressure",
  ],
  quiz: {
    question: "You receive an email that says your service account will be suspended today unless you open an attached form and respond immediately. What is the best first question to ask yourself?",
    options: [
      "Is this email written professionally?",
      "What is this message trying to make me feel and do?",
      "Should I open the attachment now or later?",
      "Would a real company ever send an email like this?",
    ],
    correctIndex: 1,
    explanation: "This question helps you identify the pressure behind the message before reacting to it. Recognizing the emotional pressure makes it easier to pause, check, and verify before taking action.",
  },
};

export const socialEngineeringModule: TrainingModuleConfig = {
  name: "Social Engineering Basics: How Scammers Push You",
  description: "Understand the psychological tactics that make phishing emails believable and pressurizing",
  orderIndex: 2,
  content: JSON.stringify(moduleContent),
  templates: [
    {
      name: "School Records Emergency",
      subject: "Final reminder: action needed before 5 p.m.",
      fromAddress: "school-services-update@gmail.com",
      body: `This is a reminder from the school office. We still need you to confirm student emergency contact information before the end of the day.

Reply to this message with full name, date of birth, home address, and phone number so we can update the file and avoid processing issues.

Thank you,
School Administration`,
      difficulty: 3,
    },
  ],
};
