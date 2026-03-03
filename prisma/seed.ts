import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const module3Content = {
  overview:
    "Some phishing emails try to steal your username, password, or login codes. These messages usually pretend there is a problem with one of your accounts and ask you to fix it right away. These scams are common because passwords give attackers direct access to email, banking, shopping, and social media accounts.",
  tactics: [
    {
      name: "Urgency",
      description:
        "Phrases like 'Immediate action required' or 'Your account will be locked.'",
    },
    {
      name: "Fear",
      description: "Claims of suspicious activity or unauthorized sign-ins.",
    },
    {
      name: "Authority",
      description:
        "Pretending to be a security team, IT department, or trusted company.",
    },
    {
      name: "Convenience",
      description: "Promising a fast, one-click solution to the problem.",
    },
  ],
  redFlags: [
    "The email asks you to click a link to log in or reset your password.",
    "The sender's address looks slightly off or unfamiliar.",
    "The message does not use your name.",
    "The link leads to a page that looks real but has a strange web address.",
    "The email creates panic or demands immediate action.",
  ],
  objective:
    "The goal is to steal your login information. If you enter your username and password on a fake page, the attacker can take over your account, lock you out, use your account to scam others, or access personal or financial information.",
  examples: [
    {
      title: "Fake Security Alert",
      body: '"We detected unusual activity on your account. For your protection, please verify your identity immediately to avoid suspension."',
      redFlags: [
        "Urgency",
        "Vague 'unusual activity'",
        "Login link in the email",
      ],
    },
    {
      title: "Password Reset Request",
      body: '"Your password expires today. Click here to reset now."',
      redFlags: [
        "Pressure to act quickly",
        "Generic language",
        "Unexpected reset request",
      ],
    },
  ],
  preventionSteps: [
    "Pause before clicking. Do not act on fear or urgency.",
    "Check the sender. Look closely at the email address.",
    "Verify safely. Open a new browser tab and go directly to the website instead of using the email link.",
    "Use strong security. Enable multi-factor authentication (MFA) where available.",
    "Report and delete. If it looks suspicious, report it and remove the email.",
  ],
  quiz: {
    question:
      "You receive an email saying your account has suspicious activity and asking you to click a link to log in. What is the safest action?",
    options: [
      "Click the link and log in quickly",
      "Reply to the email asking for more details",
      "Open a new browser tab and sign in directly to the official website",
      "Forward the email to friends to warn them",
    ],
    correctIndex: 2,
    explanation:
      "Going directly to the website in a new tab avoids any fake login pages. Never click links in security alert emails.",
  },
};

async function main() {
  console.log("Seeding training modules...");

  const module3 = await prisma.trainingModule.upsert({
    where: { id: "module-3-account-password-traps" },
    update: {
      name: "Module 3: Account & Password Traps",
      description:
        "Learn to identify phishing emails that attempt to steal your login credentials.",
      content: JSON.stringify(module3Content),
      isActive: true,
    },
    create: {
      id: "module-3-account-password-traps",
      name: "Module 3: Account & Password Traps",
      description:
        "Learn to identify phishing emails that attempt to steal your login credentials.",
      content: JSON.stringify(module3Content),
      isActive: true,
    },
  });

  console.log("Created training module:", module3.name);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
