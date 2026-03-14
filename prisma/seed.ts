import { PrismaClient, Role } from "@prisma/client";
import * as bcryptjs from "bcryptjs";
import { ALL_MODULES } from "@/lib/modules";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

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

  // Get all templates for random selection
  const allTemplates = await prisma.template.findMany();

  // Create 100 simulations with random templates
  for (let i = 0; i < 100; i++) {
    const randomTemplate = allTemplates[Math.floor(Math.random() * allTemplates.length)];
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
  console.log(`📚 Modules created: ${createdModules.length}`);
  console.log(`📧 Templates created: ${templateCount}`);
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
