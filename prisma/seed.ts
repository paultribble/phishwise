import { PrismaClient, Role } from "@prisma/client";
import * as bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Demo password (same for all demo accounts)
  const demoPassword = "PhishWise2025!";
  const hashedPassword = await bcryptjs.hash(demoPassword, 12);

  // Create training modules
  console.log("📚 Creating training modules...");
  const modules = [
    {
      name: "Recognizing Phishing Emails",
      description: "Learn to identify common phishing tactics and suspicious email characteristics.",
      content: `# Recognizing Phishing Emails

Phishing emails are designed to trick you into revealing sensitive information. Here are key warning signs:

## Red Flags
1. **Urgent requests** - Legitimate companies rarely demand immediate action
2. **Suspicious links** - Hover over links to see the actual URL
3. **Generic greetings** - "Dear Customer" instead of your name
4. **Poor spelling/grammar** - Professional companies proofread carefully
5. **Requests for passwords** - Banks never ask for passwords via email
6. **Mismatched sender addresses** - Check the full email address

## What to do
- Never click links or download attachments from unknown senders
- Verify requests by contacting the company directly
- Report phishing emails to your IT department
- Use multi-factor authentication when available`,
      orderIndex: 1,
      isActive: true,
    },
    {
      name: "Protecting Your Passwords",
      description: "Best practices for creating and managing strong passwords.",
      content: `# Protecting Your Passwords

Strong passwords are your first line of defense against cyber attacks.

## Password Guidelines
1. **Length** - Use at least 12 characters
2. **Complexity** - Mix uppercase, lowercase, numbers, and symbols
3. **Uniqueness** - Never reuse passwords across accounts
4. **No personal info** - Avoid birthdays, names, or common words

## Password Managers
- Store passwords securely in a password manager
- Never share passwords via email or chat
- Change passwords immediately if compromised
- Enable multi-factor authentication

## Common Mistakes
- Writing passwords on sticky notes
- Using the same password everywhere
- Sharing passwords with colleagues
- Writing passwords in unencrypted files`,
      orderIndex: 2,
      isActive: true,
    },
    {
      name: "Social Engineering Tactics",
      description: "Understand how attackers manipulate people to bypass security.",
      content: `# Social Engineering Tactics

Social engineering exploits human psychology rather than technical vulnerabilities.

## Common Tactics
1. **Pretexting** - Creating a fabricated scenario to extract information
2. **Baiting** - Offering something enticing (USB drives with malware)
3. **Quid pro quo** - Trading information for services
4. **Tailgating** - Following authorized personnel into restricted areas
5. **Phishing** - Sending fraudulent emails to collect sensitive data

## Defense Strategies
- Verify identities before sharing information
- Never leave sensitive documents visible
- Lock your computer when away
- Be skeptical of unsolicited requests
- Report suspicious behavior
- Follow your organization's security policies

## Real-World Examples
Learn from actual phishing attempts that have compromised organizations.`,
      orderIndex: 3,
      isActive: true,
    },
  ];

  const createdModules = await Promise.all(
    modules.map(async (module) => {
      const existing = await prisma.trainingModule.findFirst({
        where: { name: module.name },
      });
      if (existing) {
        return prisma.trainingModule.update({
          where: { id: existing.id },
          data: module,
        });
      }
      return prisma.trainingModule.create({
        data: module,
      });
    })
  );

  console.log(`✅ Created ${createdModules.length} training modules`);

  // Create email templates for each module
  console.log("📧 Creating email templates...");
  const templates = [
    {
      moduleId: createdModules[0].id,
      name: "Bank Account Verification",
      subject: "URGENT: Verify Your Account Immediately",
      body: `Dear Valued Customer,

We have detected unusual activity on your account. Please verify your information immediately by clicking the link below:

VERIFY ACCOUNT: http://verify-account.com/login?token=abc123

If you do not verify within 24 hours, your account will be suspended.

Best regards,
Security Team`,
      difficulty: 1,
    },
    {
      moduleId: createdModules[0].id,
      name: "Package Delivery Notification",
      subject: "Your package requires action - Confirm delivery",
      body: `Hello,

Your delivery cannot be completed. Please click here to reschedule:

http://tracking.confirm-delivery.net/package/track?id=xyz789

Tracking ID: PKG-2025-001234

Thank you,
Delivery Service`,
      difficulty: 2,
    },
    {
      moduleId: createdModules[1].id,
      name: "Password Reset Request",
      subject: "Reset your password",
      body: `Hi there,

Someone requested a password reset for your account. If this was you, click the link below:

http://reset-password.service.com/confirm?token=def456

If this wasn't you, ignore this email.

Regards,
Account Security`,
      difficulty: 1,
    },
    {
      moduleId: createdModules[1].id,
      name: "Software Update Required",
      subject: "CRITICAL: Update Required for Security",
      body: `Your system requires an immediate security update.

Download the update here: http://secure-update.com/installer.exe

This is required to maintain protection.

- Security Team`,
      difficulty: 3,
    },
    {
      moduleId: createdModules[2].id,
      name: "CEO Impersonation",
      subject: "Need Your Help - Wire Transfer Urgent",
      body: `Hi,

I need a quick favor - can you process an urgent wire transfer for me?

Wire $50,000 to: Account 123456789

I'm in a meeting and need this done ASAP. Reply with confirmation once sent.

Thanks,
[CEO Name]`,
      difficulty: 4,
    },
    {
      moduleId: createdModules[2].id,
      name: "IT Support Impersonation",
      subject: "IT: System Maintenance - Please Provide Credentials",
      body: `Hi,

We're performing system maintenance and need to verify access. Please provide your username and password for verification:

Username: ___________
Password: ___________

This will only take a moment.

Thanks,
IT Support`,
      difficulty: 3,
    },
  ];

  const createdTemplates = await Promise.all(
    templates.map(async (template) => {
      // Create template (no upsert needed for demo data)
      return prisma.template.create({
        data: template,
      });
    })
  );

  console.log(`✅ Created ${createdTemplates.length} email templates`);

  // Create demo school
  console.log("🏫 Creating demo school...");
  const school = await prisma.school.upsert({
    where: { inviteCode: "DEMO2025" },
    update: {
      name: "PhishWise Demo School",
      frequency: "weekly",
    },
    create: {
      name: "PhishWise Demo School",
      inviteCode: "DEMO2025",
      createdBy: "system",
      frequency: "weekly",
    },
  });

  console.log(`✅ Created demo school: ${school.name}`);

  // Create demo users
  console.log("👥 Creating demo users...");
  const managerUser = await prisma.user.upsert({
    where: { email: "phishwise0@gmail.com" },
    update: {
      name: "PhishWise Manager",
      password: hashedPassword,
      role: "MANAGER" as Role,
      schoolId: school.id,
    },
    create: {
      name: "PhishWise Manager",
      email: "phishwise0@gmail.com",
      password: hashedPassword,
      role: "MANAGER" as Role,
      schoolId: school.id,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "ptribble@outlook.com" },
    update: {
      name: "Paul Tribble",
      password: hashedPassword,
      role: "USER" as Role,
      schoolId: school.id,
    },
    create: {
      name: "Paul Tribble",
      email: "ptribble@outlook.com",
      password: hashedPassword,
      role: "USER" as Role,
      schoolId: school.id,
    },
  });

  console.log(`✅ Created demo users`);

  // Create sample simulations for the user
  console.log("📊 Creating sample simulation data...");
  let simulationCount = 0;

  // Create 80-150 simulations for the regular user
  for (let i = 0; i < 100; i++) {
    const randomTemplate =
      createdTemplates[Math.floor(Math.random() * createdTemplates.length)];
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - Math.floor(Math.random() * 90));

    const clicked = Math.random() < 0.4; // 40% click rate
    const opened = Math.random() < 0.7; // 70% open rate

    await prisma.simulationEmail.create({
      data: {
        userId: regularUser.id,
        templateId: randomTemplate.id,
        sentAt: sentDate,
        opened: opened,
        openedAt: opened ? sentDate : null,
        clicked: clicked,
        clickedAt: clicked ? new Date(sentDate.getTime() + 3600000) : null,
        status: clicked ? "clicked" : opened ? "opened" : "sent",
      },
    });

    simulationCount++;
  }

  console.log(`✅ Created ${simulationCount} sample simulations`);

  // Initialize user metrics
  console.log("📈 Initializing user metrics...");
  const stats = await prisma.simulationEmail.aggregate({
    where: { userId: regularUser.id },
    _count: true,
  });

  const clickedCount = await prisma.simulationEmail.count({
    where: { userId: regularUser.id, clicked: true },
  });

  await prisma.userMetrics.upsert({
    where: { userId: regularUser.id },
    update: {
      totalSent: stats._count,
      totalClicked: clickedCount,
      lastActivity: new Date(),
    },
    create: {
      userId: regularUser.id,
      totalSent: stats._count,
      totalClicked: clickedCount,
      totalCompleted: 0,
      lastActivity: new Date(),
    },
  });

  console.log(`✅ Initialized user metrics`);

  // Print demo credentials
  console.log("\n" + "=".repeat(60));
  console.log("🎉 SEED COMPLETE - Demo Credentials");
  console.log("=".repeat(60));
  console.log(`\n📧 Manager Account:`);
  console.log(`   Email: ${managerUser.email}`);
  console.log(`   Password: ${demoPassword}`);
  console.log(`   Role: MANAGER\n`);
  console.log(`📧 User Account:`);
  console.log(`   Email: ${regularUser.email}`);
  console.log(`   Password: ${demoPassword}`);
  console.log(`   Role: USER\n`);
  console.log(`🏫 School Invite Code: ${school.inviteCode}\n`);
  console.log("=".repeat(60) + "\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
