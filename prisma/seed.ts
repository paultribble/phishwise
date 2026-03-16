import { PrismaClient, Role } from "@prisma/client";
import * as bcryptjs from "bcryptjs";
import { ALL_MODULES } from "@/lib/modules";

const prisma = new PrismaClient();

async function main() {
  // Safety check: never seed in production
  if (process.env.ENVIRONMENT === "production") {
    console.log("🚫 Skipping seed in production environment");
    return;
  }

  // Additional safety: if DB already has many users, skip in production-like environments
  const userCount = await prisma.user.count();
  if (userCount > 100 && process.env.NODE_ENV === "production") {
    console.log(
      "🚫 Database already contains " +
        userCount +
        " users. Skipping seed (safety check)."
    );
    return;
  }

  console.log("🌱 Starting database seed...");

  // Clean up existing data to avoid conflicts
  console.log("🧹 Cleaning up existing seed data...");
  try {
    await prisma.simulationEmail.deleteMany({});
    await prisma.userHistory.deleteMany({});
    await prisma.userMetrics.deleteMany({});
    await prisma.userTraining.deleteMany({});
    await prisma.campaign.deleteMany({});
    console.log("✅ Cleaned up simulation and tracking data");
  } catch (error) {
    console.log("ℹ️  No existing data to clean (first run)");
  }

  // Demo password (same for all demo accounts)
  const demoPassword = "PhishWise2025!";
  const hashedPassword = await bcryptjs.hash(demoPassword, 12);

  // Create training modules from module configs
  console.log("📚 Creating training modules...");
  const createdModules = await Promise.all(
    ALL_MODULES.map(async (module) => {
      const existing = await prisma.trainingModule.findFirst({
        where: { name: module.name },
      });
      if (existing) {
        return prisma.trainingModule.update({
          where: { id: existing.id },
          data: {
            description: module.description,
            content: module.content,
            orderIndex: module.orderIndex,
            isActive: module.isActive !== false,
          },
        });
      }
      return prisma.trainingModule.create({
        data: {
          name: module.name,
          description: module.description,
          content: module.content,
          orderIndex: module.orderIndex,
          isActive: module.isActive !== false,
        },
      });
    })
  );

  console.log(`✅ Created/updated ${createdModules.length} training modules`);

  // Create email templates for each module
  console.log("📧 Creating email templates...");
  let templateCount = 0;

  for (const module of ALL_MODULES) {
    const createdModule = createdModules.find((m) => m.name === module.name);
    if (!createdModule) continue;

    for (const template of module.templates) {
      const existingTemplate = await prisma.template.findFirst({
        where: { name: template.name, moduleId: createdModule.id },
      });
      if (existingTemplate) {
        await prisma.template.update({
          where: { id: existingTemplate.id },
          data: {
            subject: template.subject,
            body: template.body,
            fromAddress: template.fromAddress || "security@verify-account.com",
            difficulty: template.difficulty,
            isActive: template.isActive !== false,
          },
        });
      } else {
        await prisma.template.create({
          data: {
            moduleId: createdModule.id,
            name: template.name,
            subject: template.subject,
            body: template.body,
            fromAddress: template.fromAddress || "security@verify-account.com",
            difficulty: template.difficulty,
            isActive: template.isActive !== false,
          },
        });
      }
      templateCount++;
    }
  }

  console.log(`✅ Created ${templateCount} email templates`);

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

  // Demo users with varying statistics
  const demoUsers = [
    { email: "ptribble@outlook.com", name: "Paul Tribble", clickRate: 0.4, simCount: 100 },
    { email: "alice.johnson@example.com", name: "Alice Johnson", clickRate: 0.15, simCount: 85 },
    { email: "bob.smith@example.com", name: "Bob Smith", clickRate: 0.55, simCount: 95 },
    { email: "carol.white@example.com", name: "Carol White", clickRate: 0.08, simCount: 120 },
    { email: "david.brown@example.com", name: "David Brown", clickRate: 0.45, simCount: 75 },
    { email: "emma.davis@example.com", name: "Emma Davis", clickRate: 0.25, simCount: 110 },
    { email: "frank.miller@example.com", name: "Frank Miller", clickRate: 0.62, simCount: 80 },
    { email: "grace.wilson@example.com", name: "Grace Wilson", clickRate: 0.12, simCount: 130 },
    { email: "henry.taylor@example.com", name: "Henry Taylor", clickRate: 0.48, simCount: 90 },
    { email: "isabella.anderson@example.com", name: "Isabella Anderson", clickRate: 0.35, simCount: 105 },
    { email: "james.thomas@example.com", name: "James Thomas", clickRate: 0.70, simCount: 70 },
  ];

  const createdUsers = [];
  for (const demoUser of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        name: demoUser.name,
        password: hashedPassword,
        role: "USER" as Role,
        schoolId: school.id,
      },
      create: {
        name: demoUser.name,
        email: demoUser.email,
        password: hashedPassword,
        role: "USER" as Role,
        schoolId: school.id,
      },
    });
    createdUsers.push({ ...user, clickRate: demoUser.clickRate, simCount: demoUser.simCount });
  }

  console.log(`✅ Created 1 manager + ${createdUsers.length} demo users`);

  // Create sample simulations for all users
  console.log("📊 Creating sample simulation data for all users...");
  let simulationCount = 0;

  // Get all templates for random selection
  const allTemplates = await prisma.template.findMany();

  // Create simulations for each user with their unique statistics
  for (const user of createdUsers) {
    // Create varied number of simulations per user
    for (let i = 0; i < user.simCount; i++) {
      const randomTemplate = allTemplates[Math.floor(Math.random() * allTemplates.length)];
      const sentDate = new Date();
      sentDate.setDate(sentDate.getDate() - Math.floor(Math.random() * 90));

      const clicked = Math.random() < user.clickRate;
      const opened = Math.random() < (0.6 + user.clickRate * 0.2); // Higher open rate for high-click users

      await prisma.simulationEmail.create({
        data: {
          userId: user.id,
          templateId: randomTemplate.id,
          sentAt: sentDate,
          opened: opened,
          openedAt: opened ? sentDate : null,
          clicked: clicked,
          clickedAt: clicked ? new Date(sentDate.getTime() + 3600000) : null,
          status: clicked ? "clicked" : opened ? "opened" : "sent",
          trackingToken: `token_${user.id}_${i}`,
        },
      });

      simulationCount++;
    }
  }

  console.log(`✅ Created ${simulationCount} sample simulations across all users`);

  // Initialize user metrics for all demo users
  console.log("📈 Initializing user metrics...");
  for (const user of createdUsers) {
    const stats = await prisma.simulationEmail.aggregate({
      where: { userId: user.id },
      _count: true,
    });

    const clickedCount = await prisma.simulationEmail.count({
      where: { userId: user.id, clicked: true },
    });

    // Randomly assign some users to have completed training
    const trainingCompleted = Math.random() < 0.5 ? Math.floor(Math.random() * 5) : 0;

    await prisma.userMetrics.upsert({
      where: { userId: user.id },
      update: {
        totalSent: stats._count,
        totalClicked: clickedCount,
        totalCompleted: trainingCompleted,
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random activity in last 30 days
      },
      create: {
        userId: user.id,
        totalSent: stats._count,
        totalClicked: clickedCount,
        totalCompleted: trainingCompleted,
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Initialized metrics for ${createdUsers.length} users`);

  // Print demo credentials
  console.log("\n" + "=".repeat(70));
  console.log("🎉 SEED COMPLETE - Demo Credentials");
  console.log("=".repeat(70));
  console.log(`\n📧 Manager Account:`);
  console.log(`   Email: ${managerUser.email}`);
  console.log(`   Password: ${demoPassword}`);
  console.log(`   Role: MANAGER\n`);
  console.log(`👥 Demo Users (${createdUsers.length} users):`);
  for (const user of createdUsers) {
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Simulations: ${user.simCount}, Click Rate: ${(user.clickRate * 100).toFixed(0)}%\n`);
  }
  console.log(`🏫 School Invite Code: ${school.inviteCode}\n`);
  console.log(`📚 Modules created: ${createdModules.length}`);
  console.log(`📧 Templates created: ${templateCount}`);
  console.log(`📊 Total simulations: ${simulationCount}`);
  console.log("=".repeat(70) + "\n");
}

main()
  .then(() => {
    console.log("✅ Seed completed successfully");
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
