import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// Training modules with full content
const modules = [
  {
    id: "module-1-phishing-basics",
    name: "Module 1: Phishing Basics",
    description: "Learn what phishing is and how to spot it",
    content: JSON.stringify({
      overview: "Phishing is a social engineering attack used to steal user data.",
      tactics: [
        {
          name: "Deception",
          description: "Pretending to be a trusted entity",
        },
        {
          name: "Urgency",
          description: "Creating pressure to act quickly",
        },
      ],
      redFlags: [
        "Unexpected requests for passwords",
        "Suspicious sender addresses",
        "Poor grammar and spelling",
      ],
      quiz: {
        question: "What is phishing?",
        options: [
          "A legitimate fishing activity",
          "An email scam pretending to be from trusted sources",
          "A type of password",
          "A computer virus",
        ],
        correctIndex: 1,
      },
    }),
  },
  {
    id: "module-2-malicious-links",
    name: "Module 2: Malicious Links",
    description: "Identify and avoid dangerous links in emails",
    content: JSON.stringify({
      overview: "Phishing emails often contain malicious links.",
      tactics: [
        {
          name: "URL Masking",
          description: "Hiding the real URL behind link text",
        },
      ],
      redFlags: [
        "Links that don't match the text displayed",
        "Shortened URLs from unknown services",
        "HTTPS but suspicious domain",
      ],
      quiz: {
        question: "How can you safely check a link?",
        options: [
          "Click it and see what happens",
          "Hover over it to see the real URL",
          "Trust the link text",
          "Ask friends on social media",
        ],
        correctIndex: 1,
      },
    }),
  },
  {
    id: "module-3-account-password-traps",
    name: "Module 3: Account & Password Traps",
    description: "Learn to identify credential theft attempts",
    content: JSON.stringify({
      overview: "Phishing emails often target login credentials.",
      tactics: [
        {
          name: "Urgency",
          description: "Account locked, verify immediately",
        },
        {
          name: "Fear",
          description: "Claims of suspicious activity",
        },
      ],
      redFlags: [
        "Requests to click and log in",
        "Vague mentions of account issues",
        "Threatening language about suspension",
      ],
      quiz: {
        question: "What should you do if you receive a login request email?",
        options: [
          "Click the link and log in",
          "Go directly to the official website in a new tab",
          "Reply asking for more details",
          "Forward to friends",
        ],
        correctIndex: 1,
      },
    }),
  },
  {
    id: "module-4-social-engineering",
    name: "Module 4: Social Engineering",
    description: "Understand psychological manipulation tactics",
    content: JSON.stringify({
      overview: "Social engineering exploits human psychology.",
      tactics: [
        {
          name: "Authority",
          description: "Impersonating trusted figures",
        },
        {
          name: "Trust",
          description: "Building fake relationships",
        },
      ],
      redFlags: [
        "Requests from 'authority figures'",
        "Emotional manipulation",
        "Pressure to bypass normal procedures",
      ],
      quiz: {
        question: "What is social engineering?",
        options: [
          "Using social media",
          "Exploiting human psychology for access",
          "Engineering social events",
          "Building bridges",
        ],
        correctIndex: 1,
      },
    }),
  },
  {
    id: "module-5-best-practices",
    name: "Module 5: Security Best Practices",
    description: "Implement protective measures against phishing",
    content: JSON.stringify({
      overview: "Protect yourself with good security habits.",
      tactics: [
        {
          name: "Multi-Factor Authentication",
          description: "Add an extra layer of security",
        },
        {
          name: "Verification",
          description: "Always verify before sharing info",
        },
      ],
      redFlags: [],
      quiz: {
        question: "Which is the strongest security practice?",
        options: [
          "Using the same password everywhere",
          "Multi-factor authentication",
          "Never changing your password",
          "Sharing credentials with IT",
        ],
        correctIndex: 1,
      },
    }),
  },
];

// Template data with 3 per module
const templates = [
  // Module 1 templates
  {
    id: "tpl-1-1",
    moduleId: "module-1-phishing-basics",
    name: "Generic Security Alert",
    subject: "Security Alert: Unusual Activity Detected",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>Hello {{USER_NAME}},</p>
      <p>We've detected unusual activity on your account.</p>
      <p><a href="{{PHISHING_LINK}}" style="background:#1d4ed8;color:white;padding:10px 20px;text-decoration:none;">Verify Your Account</a></p>
      <p>Thank you,<br/>Security Team</p>
    </div>`,
    difficulty: 1,
    fromAddress: "security@company-alert.com",
  },
  {
    id: "tpl-1-2",
    moduleId: "module-1-phishing-basics",
    name: "Account Verification",
    subject: "Please Verify Your Email Address",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>Hello {{USER_NAME}},</p>
      <p>We need to verify your email. Click below to confirm:</p>
      <p><a href="{{PHISHING_LINK}}" style="background:#1d4ed8;color:white;padding:10px 20px;text-decoration:none;">Verify Email</a></p>
    </div>`,
    difficulty: 1,
    fromAddress: "support@account-verify.net",
  },
  {
    id: "tpl-1-3",
    moduleId: "module-1-phishing-basics",
    name: "Limited Time Offer",
    subject: "Your Account Will Be Closed In 24 Hours",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>Dear {{USER_NAME}},</p>
      <p>Your account will be closed due to inactivity!</p>
      <p><a href="{{PHISHING_LINK}}" style="background:#dc2626;color:white;padding:10px 20px;text-decoration:none;">Reactivate Now</a></p>
    </div>`,
    difficulty: 2,
    fromAddress: "account@danger-alert.com",
  },

  // Module 2 templates
  {
    id: "tpl-2-1",
    moduleId: "module-2-malicious-links",
    name: "Banking Update",
    subject: "Update Your Banking Information",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>Hello {{USER_NAME}},</p>
      <p>Please update your banking details: <a href="{{PHISHING_LINK}}" style="color:#1d4ed8;">click here</a></p>
    </div>`,
    difficulty: 1,
    fromAddress: "banking@secure-update.com",
  },
  {
    id: "tpl-2-2",
    moduleId: "module-2-malicious-links",
    name: "Document Review",
    subject: "Important Document Requires Your Review",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>Please review this document: <a href="{{PHISHING_LINK}}">open document</a></p>
    </div>`,
    difficulty: 2,
    fromAddress: "docs@company-portal.org",
  },
  {
    id: "tpl-2-3",
    moduleId: "module-2-malicious-links",
    name: "System Maintenance",
    subject: "System Maintenance - Click To Confirm Access",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>During maintenance, click to confirm your access: <a href="{{PHISHING_LINK}}" style="color:red;">Confirm Access</a></p>
    </div>`,
    difficulty: 3,
    fromAddress: "admin@maintenance-alert.net",
  },

  // Module 3 templates
  {
    id: "tpl-3-1",
    moduleId: "module-3-account-password-traps",
    name: "Password Reset",
    subject: "Confirm Your Password Reset",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>Hello {{USER_NAME}},</p>
      <p>Click below to reset your password immediately:</p>
      <p><a href="{{PHISHING_LINK}}" style="background:#dc2626;color:white;padding:10px 20px;text-decoration:none;">Reset Password Now</a></p>
    </div>`,
    difficulty: 2,
    fromAddress: "no-reply@account-security.com",
  },
  {
    id: "tpl-3-2",
    moduleId: "module-3-account-password-traps",
    name: "Account Locked",
    subject: "Your Account Has Been Locked",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>Your account has been locked. <a href="{{PHISHING_LINK}}">Unlock now</a> to regain access.</p>
    </div>`,
    difficulty: 1,
    fromAddress: "security@account-lock.io",
  },
  {
    id: "tpl-3-3",
    moduleId: "module-3-account-password-traps",
    name: "MFA Verification",
    subject: "Verify Your Multi-Factor Authentication",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>We need to verify your MFA. <a href="{{PHISHING_LINK}}" style="background:#1d4ed8;color:white;padding:10px 20px;text-decoration:none;">Complete Verification</a></p>
    </div>`,
    difficulty: 3,
    fromAddress: "mfa@verify-secure.com",
  },

  // Module 4 templates
  {
    id: "tpl-4-1",
    moduleId: "module-4-social-engineering",
    name: "CEO Urgent Request",
    subject: "Urgent: Information Request from CEO",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>The CEO needs information urgently. <a href="{{PHISHING_LINK}}">Click to proceed</a></p>
    </div>`,
    difficulty: 2,
    fromAddress: "ceo@company.com",
  },
  {
    id: "tpl-4-2",
    moduleId: "module-4-social-engineering",
    name: "HR Benefits Update",
    subject: "Update Your HR Benefits Information",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>Hello {{USER_NAME}},</p>
      <p>Please update your benefits: <a href="{{PHISHING_LINK}}" style="background:#1d4ed8;color:white;padding:10px 20px;text-decoration:none;">Update Benefits</a></p>
    </div>`,
    difficulty: 1,
    fromAddress: "hr@company-benefits.com",
  },
  {
    id: "tpl-4-3",
    moduleId: "module-4-social-engineering",
    name: "Trusted Vendor Request",
    subject: "Please Confirm Your Account Details",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>Our trusted vendor needs verification. <a href="{{PHISHING_LINK}}">Confirm Details</a></p>
    </div>`,
    difficulty: 3,
    fromAddress: "vendor@trusted-partner.com",
  },

  // Module 5 templates
  {
    id: "tpl-5-1",
    moduleId: "module-5-best-practices",
    name: "Software Update",
    subject: "Critical Security Update Required",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>A critical update is available. <a href="{{PHISHING_LINK}}" style="background:#dc2626;color:white;padding:10px 20px;text-decoration:none;">Install Update</a></p>
    </div>`,
    difficulty: 1,
    fromAddress: "updates@software-alert.net",
  },
  {
    id: "tpl-5-2",
    moduleId: "module-5-best-practices",
    name: "License Renewal",
    subject: "Your License Is Expiring Soon",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>Renew your license: <a href="{{PHISHING_LINK}}">Renew Now</a></p>
    </div>`,
    difficulty: 2,
    fromAddress: "licensing@renewal-service.com",
  },
  {
    id: "tpl-5-3",
    moduleId: "module-5-best-practices",
    name: "Policy Acknowledgment",
    subject: "Acknowledge New Security Policy",
    body: `<div style="font-family: sans-serif; max-width: 600px;">
      <p>{{USER_NAME}},</p>
      <p>Please acknowledge the new policy: <a href="{{PHISHING_LINK}}">Acknowledge</a></p>
    </div>`,
    difficulty: 3,
    fromAddress: "compliance@policy-update.io",
  },
];

async function main() {
  console.log("🌱 Seeding comprehensive demo data...\n");

  // Create training modules
  console.log("📚 Creating training modules...");
  for (const module of modules) {
    await prisma.trainingModule.upsert({
      where: { id: module.id },
      update: { content: module.content },
      create: module,
    });
  }
  console.log(`✓ Created ${modules.length} training modules\n`);

  // Create templates
  console.log("📧 Creating email templates...");
  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {},
      create: {
        id: template.id,
        moduleId: template.moduleId,
        name: template.name,
        subject: template.subject,
        body: template.body,
        fromAddress: template.fromAddress,
        difficulty: template.difficulty,
      },
    });
  }
  console.log(`✓ Created ${templates.length} email templates\n`);

  // Create demo school
  console.log("🏫 Creating demo school...");
  const demoSchool = await prisma.school.upsert({
    where: { inviteCode: "DEMO2025" },
    update: {},
    create: {
      name: "PhishWise Demo School",
      inviteCode: "DEMO2025",
      createdBy: "demo",
      frequency: "weekly",
    },
  });
  console.log(`✓ Created school: ${demoSchool.name}\n`);

  // Create demo manager
  console.log("👨‍💼 Creating demo manager...");
  const demoManager = await prisma.user.upsert({
    where: { email: "phishwise0@gmail.com" },
    update: { role: "MANAGER", schoolId: demoSchool.id },
    create: {
      email: "phishwise0@gmail.com",
      name: "Demo Manager",
      role: "MANAGER",
      schoolId: demoSchool.id,
    },
  });
  console.log(`✓ Created manager: ${demoManager.email}\n`);

  // Create demo users
  console.log("👥 Creating 10 demo users...");
  const demoUsers = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.upsert({
      where: { email: `demouser${i}@example.com` },
      update: { schoolId: demoSchool.id },
      create: {
        email: `demouser${i}@example.com`,
        name: `Demo User ${i}`,
        role: "USER",
        schoolId: demoSchool.id,
      },
    });
    demoUsers.push(user);
  }
  console.log(`✓ Created 10 demo users\n`);

  // Create campaign
  console.log("📢 Creating demo campaign...");
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
  console.log(`✓ Created campaign: ${demoCampaign.name}\n`);

  // Create realistic simulation history (87 simulations over 60 days)
  console.log("📊 Creating 87 simulations with realistic patterns...");
  let simulationCount = 0;

  for (const user of demoUsers) {
    // Generate 8-9 simulations per user over the last 60 days
    const simulationsPerUser = Math.floor(Math.random() * 2) + 8;
    let userClickRate = Math.random() * 0.6 + 0.2; // Click rate between 20-80%

    for (let i = 0; i < simulationsPerUser; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const sentAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      // Select random template
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      const token = `demo_${user.id}_${i}_${crypto.randomBytes(4).toString("hex")}`;

      const clicked = Math.random() < userClickRate;
      const opened = clicked || Math.random() < 0.3; // Higher chance of opened

      const sim = await prisma.simulationEmail.create({
        data: {
          userId: user.id,
          campaignId: demoCampaign.id,
          templateId: randomTemplate.id,
          token,
          sentAt,
          opened,
          openedAt: opened ? new Date(sentAt.getTime() + Math.random() * 3600000) : null,
          clicked,
          clickedAt: clicked ? new Date(sentAt.getTime() + Math.random() * 3600000) : null,
          status: clicked ? "completed" : "sent",
        },
      });

      // Create history records
      if (clicked) {
        await prisma.userHistory.create({
          data: {
            userId: user.id,
            actionType: "simulation_clicked",
            detail: `Clicked simulation (template: ${randomTemplate.name})`,
            timestamp: sim.clickedAt!,
          },
        });
      }

      if (opened && !clicked) {
        await prisma.userHistory.create({
          data: {
            userId: user.id,
            actionType: "simulation_opened",
            detail: `Opened email (template: ${randomTemplate.name})`,
            timestamp: sim.openedAt!,
          },
        });
      }

      simulationCount++;
    }

    // Create UserMetrics
    const clicks = await prisma.simulationEmail.count({
      where: { userId: user.id, clicked: true },
    });
    const sent = await prisma.simulationEmail.count({
      where: { userId: user.id },
    });

    await prisma.userMetrics.upsert({
      where: { userId: user.id },
      update: { totalSent: sent, totalClicked: clicks },
      create: {
        userId: user.id,
        totalSent: sent,
        totalClicked: clicks,
      },
    });
  }
  console.log(`✓ Created ${simulationCount} simulations\n`);

  // Create UserHistory entries for activity feed
  console.log("📝 Creating activity history...");
  const activityTypes = ["simulation_sent", "training_assigned", "training_completed"];
  for (const user of demoUsers) {
    for (let i = 0; i < 5; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      await prisma.userHistory.create({
        data: {
          userId: user.id,
          actionType: activityTypes[Math.floor(Math.random() * activityTypes.length)],
          detail: `Activity event ${i + 1}`,
          timestamp,
        },
      });
    }
  }
  console.log(`✓ Created activity history\n`);

  console.log("✨ Demo seeding complete!\n");
  console.log("📊 Summary:");
  console.log(`   - School: ${demoSchool.name} (${demoSchool.inviteCode})`);
  console.log(`   - Manager: ${demoManager.email}`);
  console.log(`   - Users: ${demoUsers.length}`);
  console.log(`   - Simulations: ${simulationCount}`);
  console.log(`   - Templates: ${templates.length}`);
  console.log(`   - Modules: ${modules.length}\n`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
