import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const trainingModuleContent = {
  overview:
    "Learn to identify phishing emails that attempt to steal your login credentials through fake security alerts and urgent requests.",
  tactics: [
    {
      name: "Urgency",
      description: "Creates pressure with phrases like 'Immediate action required' or 'Your account will be locked.'",
    },
    {
      name: "Fear & Authority",
      description: "Uses official-sounding company names and security team impersonation.",
    },
  ],
  redFlags: [
    "Email asks you to click a link to log in or verify identity",
    "Sender address looks slightly different from the real company",
    "Generic greeting instead of your name",
    "Suspicious URL that doesn't match the company domain",
  ],
  objective:
    "Steal your login credentials to access your accounts and personal information.",
  examples: [
    {
      title: "Fake Security Alert",
      body: '"Unusual activity detected. Verify your account now."',
      redFlags: ["Urgency", "Login link"],
    },
  ],
  preventionSteps: [
    "Pause before clicking any links",
    "Verify the sender by checking the email address carefully",
    "Go directly to the website instead of clicking email links",
    "Enable two-factor authentication for extra security",
  ],
  quiz: {
    question: "You get an email asking you to verify your account. What should you do?",
    options: [
      "Click the link immediately",
      "Open a new browser tab and go directly to the official website",
      "Reply to the email asking for more details",
      "Forward it to your contacts",
    ],
    correctIndex: 1,
    explanation: "Always verify by going directly to the official website in a new tab, never clicking email links.",
  },
};

async function main() {
  console.log("🌱 Seeding database...");

  // Create training module
  const module = await prisma.trainingModule.upsert({
    where: { id: "module-1-phishing-basics" },
    update: {},
    create: {
      id: "module-1-phishing-basics",
      name: "Module 1: Phishing Basics",
      description: "Learn to identify phishing emails and protect your accounts.",
      content: JSON.stringify(trainingModuleContent),
      isActive: true,
    },
  });
  console.log("✅ Created training module:", module.name);

  // Create demo manager
  const manager = await prisma.user.upsert({
    where: { email: "phishwise0@gmail.com" },
    update: { role: "MANAGER" },
    create: {
      email: "phishwise0@gmail.com",
      name: "Sarah Johnson",
      role: "MANAGER",
    },
  });
  console.log("✅ Created manager:", manager.email);

  // Create demo school
  const school = await prisma.school.upsert({
    where: { inviteCode: "SPRINGDALE25" },
    update: {},
    create: {
      name: "Springdale Community Group",
      inviteCode: "SPRINGDALE25",
      createdBy: manager.id,
      frequency: "weekly",
    },
  });
  console.log("✅ Created school:", school.name);

  // Link manager to school
  await prisma.user.update({
    where: { id: manager.id },
    data: { schoolId: school.id },
  });

  // Create demo campaign
  const campaign = await prisma.campaign.upsert({
    where: { id: "campaign-1" },
    update: {},
    create: {
      id: "campaign-1",
      name: "Ongoing Security Awareness",
      schoolId: school.id,
      scheduleType: "weekly",
      status: "active",
    },
  });
  console.log("✅ Created campaign:", campaign.name);

  // Create email templates
  const template1 = await prisma.template.upsert({
    where: { id: "template-1" },
    update: {},
    create: {
      id: "template-1",
      moduleId: module.id,
      name: "Security Alert Template",
      subject: "Unusual Sign-In Attempt Detected",
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Security Alert</h2>
        <p>We detected an unusual sign-in attempt on your account from a new location.</p>
        <p>For your protection, please verify your identity:</p>
        <p><a href="{{tracking_url}}" style="background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;">
          Verify Account
        </a></p>
        <p style="color:#666;font-size:12px;">If you did not make this request, ignore this email.</p>
      </div>`,
      difficulty: 1,
      isActive: true,
    },
  });

  const template2 = await prisma.template.upsert({
    where: { id: "template-2" },
    update: {},
    create: {
      id: "template-2",
      moduleId: module.id,
      name: "Password Reset Template",
      subject: "Your password has expired",
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Update Required</h2>
        <p>Your password will expire today. Please update it now.</p>
        <p><a href="{{tracking_url}}" style="background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;">
          Reset Password
        </a></p>
      </div>`,
      difficulty: 1,
      isActive: true,
    },
  });

  console.log("✅ Created email templates");

  // Create 7 demo students (including ptribble@outlook.com)
  const students = [
    { email: "ptribble@outlook.com", name: "Your Demo Account", clickRate: 0.4 },
    { email: "alice.thompson@springdale.org", name: "Alice Thompson", clickRate: 0.6 },
    { email: "bob.martinez@springdale.org", name: "Bob Martinez", clickRate: 0.2 },
    { email: "carol.williams@springdale.org", name: "Carol Williams", clickRate: 0.4 },
    { email: "david.chen@springdale.org", name: "David Chen", clickRate: 0.1 },
    { email: "emma.taylor@springdale.org", name: "Emma Taylor", clickRate: 0.5 },
    { email: "frank.johnson@springdale.org", name: "Frank Johnson", clickRate: 0.3 },
  ];

  for (const studentData of students) {
    const user = await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        email: studentData.email,
        name: studentData.name,
        role: "USER",
        schoolId: school.id,
      },
    });

    // Create 8 simulations over 45 days
    const now = new Date();
    let sent = 0;
    let clicked = 0;

    for (let i = 0; i < 8; i++) {
      const daysAgo = Math.floor(Math.random() * 45);
      const sentAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const isClicked = Math.random() < studentData.clickRate;
      const template = i % 2 === 0 ? template1 : template2;

      await prisma.simulationEmail.create({
        data: {
          userId: user.id,
          campaignId: campaign.id,
          templateId: template.id,
          token: `sim-${user.id}-${i}-${Date.now()}`,
          sentAt,
          clicked: isClicked,
          clickedAt: isClicked ? new Date(sentAt.getTime() + Math.random() * 3600000) : null,
          opened: Math.random() < 0.7,
        },
      });

      sent++;
      if (isClicked) clicked++;
    }

    // Create user metrics
    await prisma.userMetrics.upsert({
      where: { userId: user.id },
      update: {
        totalSent: sent,
        totalClicked: clicked,
        lastActivity: now,
      },
      create: {
        userId: user.id,
        totalSent: sent,
        totalClicked: clicked,
        totalCompleted: 0,
        lastActivity: now,
      },
    });

    // Assign training (some completed)
    const isCompleted = Math.random() < 0.5;
    await prisma.userTraining.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: module.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        moduleId: module.id,
        assignedAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        completedAt: isCompleted ? new Date(now.getTime() - Math.random() * 20 * 24 * 60 * 60 * 1000) : null,
      },
    });
  }

  console.log(`✅ Created ${students.length} demo students with simulation history`);

  console.log("\n🎉 Demo data seeding complete!\n");
  console.log("📧 Manager Account:");
  console.log("   Email: phishwise0@gmail.com");
  console.log("   School: Springdale Community Group");
  console.log("   Invite Code: SPRINGDALE25");
  console.log("\n👤 Your Demo Student Account:");
  console.log("   Email: ptribble@outlook.com");
  console.log("   (Use this for testing)");
  console.log("\n✨ Ready to test!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
