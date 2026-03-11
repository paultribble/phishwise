import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomDateInPast(daysAgo: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime);
}

function generateUserName(index: number): string {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  return `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`;
}

const MODULE_CONTENT = {
  phishing: 'Phishing is a type of cyber attack where criminals send fraudulent emails pretending to be from legitimate organizations.',
  socialeng: 'Social engineering exploits human psychology through tactics like urgency, fear, and authority to manipulate behavior.',
  credential: 'Credential theft targets your username and password through fake login pages and account verification requests.',
  billing: 'Financial phishing exploits concerns about money through unexpected invoices, failed payments, and refund offers.',
  shipping: 'Package scams exploit online shopping. Never click email tracking links. Go directly to the carrier website instead.',
  security: 'Security alert phishing uses fear to panic you into clicking links. Always go directly to the website instead.',
  impersonate: 'Impersonation phishing pretends to be from your boss, family, or government. Verify through a different channel.',
  attachments: 'Malware spreads through attachments and document links. Never open unexpected files. Verify sender first.',
};

async function main() {
  console.log('🌱 Starting PhishWise seed...\n');

  console.log('🧹 Cleaning existing data...');
  await prisma.userMetrics.deleteMany();
  await prisma.userHistory.deleteMany();
  await prisma.userTraining.deleteMany();
  await prisma.simulationEmail.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.template.deleteMany();
  await prisma.trainingModule.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
  console.log('✓ Database cleaned\n');

  console.log('📚 Creating training modules...');
  const modules = await Promise.all([
    prisma.trainingModule.create({ data: { name: 'Phishing Basics', orderIndex: 1, description: 'Learn what phishing is', content: MODULE_CONTENT.phishing, isActive: true } }),
    prisma.trainingModule.create({ data: { name: 'Social Engineering', orderIndex: 2, description: 'Understand psychological manipulation', content: MODULE_CONTENT.socialeng, isActive: true } }),
    prisma.trainingModule.create({ data: { name: 'Credential Theft', orderIndex: 3, description: 'Identify password traps', content: MODULE_CONTENT.credential, isActive: true } }),
    prisma.trainingModule.create({ data: { name: 'Billing Scams', orderIndex: 4, description: 'Recognize financial phishing', content: MODULE_CONTENT.billing, isActive: true } }),
    prisma.trainingModule.create({ data: { name: 'Shipping Scams', orderIndex: 5, description: 'Identify delivery phishing', content: MODULE_CONTENT.shipping, isActive: true } }),
    prisma.trainingModule.create({ data: { name: 'Security Alerts', orderIndex: 6, description: 'Recognize fear-based phishing', content: MODULE_CONTENT.security, isActive: true } }),
    prisma.trainingModule.create({ data: { name: 'Impersonation', orderIndex: 7, description: 'Detect trusted source phishing', content: MODULE_CONTENT.impersonate, isActive: true } }),
    prisma.trainingModule.create({ data: { name: 'Attachments', orderIndex: 8, description: 'Safe email attachment handling', content: MODULE_CONTENT.attachments, isActive: true } }),
  ]);
  console.log(`✓ Created ${modules.length} modules\n`);

  console.log('✉️  Creating email templates...');
  const templates = await Promise.all([
    // Module 1
    prisma.template.create({ data: { moduleId: modules[0].id, name: 'Security Alert', subject: 'Security Notice: Unusual activity', fromAddress: 'security@alerts.com', body: '<h2>Alert</h2><p>Verify identity immediately.</p>', difficulty: 1, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[0].id, name: 'Login Detected', subject: 'New device login detected', fromAddress: 'noreply@security.net', body: '<h2>Login Detected</h2><p>From Shanghai, China</p>', difficulty: 2, isActive: true } }),
    // Module 2
    prisma.template.create({ data: { moduleId: modules[1].id, name: 'Prize Winner', subject: 'You won 5000 dollars', fromAddress: 'winners@prize.com', body: '<h1>YOU WON</h1><p>Claim your prize now</p>', difficulty: 1, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[1].id, name: 'Account Closing', subject: 'Account will be closed', fromAddress: 'account@notify.com', body: '<h2>FINAL WARNING</h2><p>Account deleted in 12 hours</p>', difficulty: 2, isActive: true } }),
    // Module 3
    prisma.template.create({ data: { moduleId: modules[2].id, name: 'PayPal Alert', subject: 'PayPal unusual activity', fromAddress: 'service@paypa1.com', body: '<h2>Security Alert</h2><p>Login from Moscow detected</p>', difficulty: 2, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[2].id, name: 'Microsoft Blocked', subject: 'Microsoft blocked sign-in', fromAddress: 'account@microsoft-sec.com', body: '<h2>Sign-in blocked</h2><p>From North Korea</p>', difficulty: 2, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[2].id, name: 'Password Reset', subject: 'Password reset request', fromAddress: 'noreply@reset.com', body: '<h2>Reset Password</h2><p>Click to reset now</p>', difficulty: 1, isActive: true } }),
    // Module 4
    prisma.template.create({ data: { moduleId: modules[3].id, name: 'Netflix Payment', subject: 'Netflix payment failed', fromAddress: 'billing@netflix.com', body: '<h2>Payment Issue</h2><p>Update payment method</p>', difficulty: 2, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[3].id, name: 'Invoice Due', subject: 'Invoice 899.99 due', fromAddress: 'invoices@billing.net', body: '<h2>Invoice</h2><p>Payment required immediately</p>', difficulty: 3, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[3].id, name: 'Refund Offer', subject: 'You have a 327 refund', fromAddress: 'refunds@service.com', body: '<h2>Refund Approved</h2><p>Claim your refund now</p>', difficulty: 2, isActive: true } }),
    // Module 5
    prisma.template.create({ data: { moduleId: modules[4].id, name: 'USPS Delivery', subject: 'USPS delivery failed', fromAddress: 'tracking@usps.com', body: '<h2>Delivery Failed</h2><p>Confirm address now</p>', difficulty: 1, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[4].id, name: 'Amazon Package', subject: 'Amazon needs address info', fromAddress: 'shipment@amazon.com', body: '<h2>Delivery Update</h2><p>Update address required</p>', difficulty: 2, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[4].id, name: 'FedEx Customs', subject: 'FedEx customs fee required', fromAddress: 'customs@fedex.com', body: '<h2>Customs Fee</h2><p>Pay 4.75 fee now</p>', difficulty: 2, isActive: true } }),
    // Module 6
    prisma.template.create({ data: { moduleId: modules[5].id, name: 'Account Locked', subject: 'Account temporarily locked', fromAddress: 'security@protect.com', body: '<h2>LOCKED</h2><p>Unlock immediately</p>', difficulty: 2, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[5].id, name: 'Virus Alert', subject: 'Virus detected', fromAddress: 'alerts@security.com', body: '<h2>VIRUS ALERT</h2><p>Run scan now</p>', difficulty: 1, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[5].id, name: 'Breach Alert', subject: 'Password leaked in breach', fromAddress: 'security@breach.com', body: '<h2>Breach</h2><p>Secure account now</p>', difficulty: 3, isActive: true } }),
    // Module 7
    prisma.template.create({ data: { moduleId: modules[6].id, name: 'CEO Request', subject: 'Wire transfer needed', fromAddress: 'ceo@company.com', body: '<p>Wire 47500 dollars urgently</p>', difficulty: 3, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[6].id, name: 'Family Emergency', subject: 'Need money urgently', fromAddress: 'emergency@gmail.com', body: '<p>Send 850 dollars for help</p>', difficulty: 2, isActive: true } }),
    // Module 8
    prisma.template.create({ data: { moduleId: modules[7].id, name: 'Google Drive', subject: 'Document shared with you', fromAddress: 'drive@google.com', body: '<h2>Shared</h2><p>Open document</p>', difficulty: 2, isActive: true } }),
    prisma.template.create({ data: { moduleId: modules[7].id, name: 'Invoice PDF', subject: 'Invoice attached', fromAddress: 'accounts@vendor.com', body: '<h2>Invoice</h2><p>Download PDF</p>', difficulty: 2, isActive: true } }),
  ]);
  console.log(`✓ Created ${templates.length} templates\n`);

  console.log('🏫 Creating demo school...');
  const demoSchool = await prisma.school.create({
    data: {
      name: 'PhishWise Demo School',
      inviteCode: 'DEMO2025',
      frequency: 'weekly',
      createdBy: 'phishwise0@gmail.com',
    }
  });
  console.log(`✓ School: ${demoSchool.name}\n`);

  console.log('👥 Creating demo users...');
  const managerUser = await prisma.user.create({
    data: { email: 'phishwise0@gmail.com', name: 'Manager', role: 'MANAGER', schoolId: demoSchool.id, emailVerified: new Date() }
  });

  const paulUser = await prisma.user.create({
    data: { email: 'ptribble@outlook.com', name: 'Paul Tribble', role: 'USER', schoolId: demoSchool.id, emailVerified: new Date() }
  });

  const additionalUsers = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          name: generateUserName(i),
          role: 'USER',
          schoolId: demoSchool.id,
          emailVerified: new Date(),
        }
      })
    )
  );

  const allUsers = [paulUser, ...additionalUsers];
  console.log(`✓ Manager: ${managerUser.email}`);
  console.log(`✓ Users: ${allUsers.length}\n`);

  console.log('📊 Generating simulations...');
  let totalSimulations = 0;
  let totalClicked = 0;

  for (const user of allUsers) {
    const numSimulations = Math.floor(Math.random() * 8) + 8;
    for (let i = 0; i < numSimulations; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const daysAgo = 60 - (i * (60 / numSimulations));
      const sentAt = randomDateInPast(daysAgo);
      const userIndex = allUsers.indexOf(user);
      const baseClickRate = 0.15 + (userIndex * 0.05);
      const wasClicked = Math.random() < baseClickRate;
      const wasOpened = wasClicked || Math.random() < 0.75;

      await prisma.simulationEmail.create({
        data: {
          userId: user.id,
          templateId: template.id,
          trackingToken: `${user.id}_${i}`,
          sentAt,
          opened: wasOpened,
          openedAt: wasOpened ? new Date(sentAt.getTime() + Math.random() * 3600000) : null,
          clicked: wasClicked,
          clickedAt: wasClicked ? new Date(sentAt.getTime() + Math.random() * 7200000) : null,
        }
      });

      totalSimulations++;
      if (wasClicked) totalClicked++;

      if (wasClicked && Math.random() < 0.8) {
        const completedAt = new Date(sentAt.getTime() + Math.random() * 1800000);
        await prisma.userTraining.create({
          data: {
            userId: user.id,
            moduleId: template.moduleId,
            assignedAt: new Date(sentAt.getTime() + Math.random() * 7200000),
            completedAt,
            score: Math.floor(Math.random() * 30) + 70,
          }
        });
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastSimulation: randomDateInPast(Math.random() * 7) }
    });

    const userSimulations = await prisma.simulationEmail.findMany({ where: { userId: user.id } });
    const userTrainings = await prisma.userTraining.findMany({ where: { userId: user.id, completedAt: { not: null } } });

    await prisma.userMetrics.create({
      data: {
        userId: user.id,
        totalSent: userSimulations.length,
        totalClicked: userSimulations.filter(s => s.clicked).length,
        totalCompleted: userTrainings.length,
        lastActivity: randomDateInPast(Math.random() * 3),
      }
    });
  }

  console.log(`✓ Simulations: ${totalSimulations} (${totalClicked} clicked)\n`);
  console.log('\n✅ SEED COMPLETE\n');
  console.log('Manager: phishwise0@gmail.com');
  console.log('User: ptribble@outlook.com');
  console.log('School Code: DEMO2025\n');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
