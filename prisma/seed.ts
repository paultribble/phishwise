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

const MODULE_ID = "module-3-account-password-traps";

async function main() {
  console.log("Seeding database...");

  // Create training module
  const module3 = await prisma.trainingModule.upsert({
    where: { id: MODULE_ID },
    update: {
      name: "Module 3: Account & Password Traps",
      description:
        "Learn to identify phishing emails that attempt to steal your login credentials.",
      content: JSON.stringify(module3Content),
      isActive: true,
    },
    create: {
      id: MODULE_ID,
      name: "Module 3: Account & Password Traps",
      description:
        "Learn to identify phishing emails that attempt to steal your login credentials.",
      content: JSON.stringify(module3Content),
      isActive: true,
    },
  });
  console.log("Created training module:", module3.name);

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "phishwise0@gmail.com" },
    update: {},
    create: {
      email: "phishwise0@gmail.com",
      name: "Demo User",
      role: "USER",
    },
  });
  console.log("Created demo user:", demoUser.email);

  // Create demo school
  const demoSchool = await prisma.school.upsert({
    where: { inviteCode: "DEMO2025" },
    update: {},
    create: {
      name: "PhishWise Demo School",
      inviteCode: "DEMO2025",
      createdBy: demoUser.id,
    },
  });
  console.log("Created demo school:", demoSchool.name);

  // Link user to school
  await prisma.user.update({
    where: { id: demoUser.id },
    data: { schoolId: demoSchool.id },
  });

  // Create demo campaign
  const demoCampaign = await prisma.campaign.upsert({
    where: { id: "demo-campaign-001" },
    update: {},
    create: {
      id: "demo-campaign-001",
      name: "Demo Campaign",
      schoolId: demoSchool.id,
      scheduleType: "random",
      status: "active",
    },
  });
  console.log("Created demo campaign:", demoCampaign.name);

  // Create demo template
  const demoTemplate = await prisma.template.upsert({
    where: { id: "demo-template-001" },
    update: {},
    create: {
      id: "demo-template-001",
      moduleId: MODULE_ID,
      name: "Security Alert Template",
      subject: "Unusual Sign-In Attempt Detected",
      body: `<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <p>Hello,</p>
        <p>We detected an unusual sign-in attempt on your account from a new device.</p>
        <p>For your protection, access to your account has been temporarily limited. 
        Please verify your identity to restore full access.</p>
        <p><a href="{{tracking_url}}" style="background:#1d4ed8;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">
          Verify your account now
        </a></p>
        <p>If no action is taken within 24 hours, your account may be suspended.</p>
        <p>Account Security Team</p>
      </div>`,
      difficulty: 1,
      isActive: true,
    },
  });
  console.log("Created demo template:", demoTemplate.name);

  // Create demo simulation email (already clicked)
  const existingSimEmail = await prisma.simulationEmail.findFirst({
    where: { token: "demo-token-001" },
  });

  if (!existingSimEmail) {
    await prisma.simulationEmail.create({
      data: {
        userId: demoUser.id,
        campaignId: demoCampaign.id,
        templateId: demoTemplate.id,
        token: "demo-token-001",
        clicked: true,
        clickedAt: new Date("2025-02-10T10:23:00Z"),
        sentAt: new Date("2025-02-10T08:00:00Z"),
        opened: true,
      },
    });
    console.log("Created demo simulation email (clicked)");
  }

  // Create additional demo simulation emails (not clicked) for history
  const additionalEmails = [
    { token: "demo-token-002", sentAt: new Date("2025-02-15T08:00:00Z"), clicked: false },
    { token: "demo-token-003", sentAt: new Date("2025-02-20T08:00:00Z"), clicked: false },
    { token: "demo-token-004", sentAt: new Date("2025-02-25T08:00:00Z"), clicked: false },
  ];

  for (const email of additionalEmails) {
    const existing = await prisma.simulationEmail.findFirst({
      where: { token: email.token },
    });
    if (!existing) {
      await prisma.simulationEmail.create({
        data: {
          userId: demoUser.id,
          campaignId: demoCampaign.id,
          templateId: demoTemplate.id,
          token: email.token,
          clicked: email.clicked,
          sentAt: email.sentAt,
          opened: false,
        },
      });
    }
  }
  console.log("Created additional demo simulation emails");

  // Create demo user training (incomplete - pending)
  const existingTraining = await prisma.userTraining.findFirst({
    where: { userId: demoUser.id, moduleId: MODULE_ID },
  });

  if (!existingTraining) {
    await prisma.userTraining.create({
      data: {
        userId: demoUser.id,
        moduleId: MODULE_ID,
        assignedAt: new Date("2025-02-10T10:30:00Z"),
        completedAt: null,
      },
    });
    console.log("Created demo user training (incomplete)");
  }

  // Create demo user metrics
  const existingMetrics = await prisma.userMetrics.findUnique({
    where: { userId: demoUser.id },
  });

  if (!existingMetrics) {
    await prisma.userMetrics.create({
      data: {
        userId: demoUser.id,
        totalSent: 4,
        totalClicked: 1,
        totalReported: 0,
        totalCompleted: 0,
        lastActivity: new Date("2025-02-10T10:23:00Z"),
      },
    });
    console.log("Created demo user metrics");
  } else {
    // Update existing metrics
    await prisma.userMetrics.update({
      where: { userId: demoUser.id },
      data: {
        totalSent: 4,
        totalClicked: 1,
        totalReported: 0,
        totalCompleted: 0,
      },
    });
    console.log("Updated demo user metrics");
  }

  // Create another demo user for associated users display
  const demoUser2 = await prisma.user.upsert({
    where: { email: "john.doe@uark.edu" },
    update: {},
    create: {
      email: "john.doe@uark.edu",
      name: "John Doe",
      role: "USER",
      schoolId: demoSchool.id,
    },
  });

  const demoUser3 = await prisma.user.upsert({
    where: { email: "jane.smith@uark.edu" },
    update: {},
    create: {
      email: "jane.smith@uark.edu",
      name: "Jane Smith",
      role: "MANAGER",
      schoolId: demoSchool.id,
    },
  });
  console.log("Created additional demo users for team display");

  console.log("\n=== Demo data seeding complete! ===");
  console.log("Demo user email: phishwise0@gmail.com");
  console.log("Demo school invite code: DEMO2025");
  console.log("Demo tracking token: demo-token-001");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
