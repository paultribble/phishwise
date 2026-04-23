import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verifying Paul Tribble's module assignments...\n");

  // Get Paul Tribble
  const paul = await prisma.user.findUnique({
    where: { email: "ptribble@outlook.com" },
  });

  if (!paul) {
    console.log("❌ Paul Tribble not found");
    return;
  }

  console.log(`✓ Found: ${paul.name} (${paul.email})\n`);

  // Get all available modules
  const validModules = await prisma.trainingModule.findMany({
    select: { id: true, name: true, isActive: true },
  });

  console.log(`📚 Available modules in database (${validModules.length}):`);
  validModules.forEach((m) => {
    console.log(`  - ${m.name} [${m.id.substring(0, 8)}...]`);
  });

  const validModuleIds = new Set(validModules.map((m) => m.id));

  // Get Paul's current assignments
  const paulAssignments = await prisma.userTraining.findMany({
    where: { userId: paul.id },
    include: { module: true },
  });

  console.log(
    `\n📋 Paul's current module assignments (${paulAssignments.length}):`
  );
  let orphanedCount = 0;

  for (const assignment of paulAssignments) {
    if (!assignment.module) {
      console.log(
        `  ❌ MISSING: [${assignment.moduleId.substring(0, 8)}...] (orphaned)`
      );
      orphanedCount++;
    } else {
      const status = assignment.completedAt ? "✓ Completed" : "⏳ Pending";
      console.log(`  ${status}: ${assignment.module.name}`);
    }
  }

  if (orphanedCount > 0) {
    console.log(`\n⚠️  Found ${orphanedCount} orphaned module assignments!`);
    console.log("🗑️  Removing orphaned assignments...\n");

    // Delete orphaned assignments
    const deleted = await prisma.userTraining.deleteMany({
      where: {
        userId: paul.id,
        moduleId: {
          notIn: Array.from(validModuleIds),
        },
      },
    });

    console.log(`✅ Deleted ${deleted.count} orphaned assignments`);
  }

  // Check for missing assignments (modules not assigned to Paul)
  const assignedModuleIds = new Set(paulAssignments.map((a) => a.moduleId));
  const unassignedModules = validModules.filter(
    (m) => !assignedModuleIds.has(m.id)
  );

  if (unassignedModules.length > 0) {
    console.log(`\n📌 Assigning ${unassignedModules.length} missing modules...`);

    for (const module of unassignedModules) {
      await prisma.userTraining.create({
        data: {
          userId: paul.id,
          moduleId: module.id,
          assignedAt: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ),
          completedAt: null,
          score: null,
        },
      });
    }

    console.log(`✅ Assigned ${unassignedModules.length} modules to Paul\n`);
  }

  // Final verification
  const finalAssignments = await prisma.userTraining.findMany({
    where: { userId: paul.id },
    include: { module: true },
  });

  console.log(
    `\n✅ FINAL CHECK: Paul now has ${finalAssignments.length} valid module assignments:\n`
  );
  finalAssignments.forEach((a) => {
    const status = a.completedAt
      ? `✓ Completed (${a.completedAt.toLocaleDateString()})`
      : "⏳ Pending";
    console.log(`  ${status}: ${a.module.name}`);
  });

  // Verify all modules have valid content
  console.log(
    `\n🔎 Verifying module content integrity for Paul's modules...`
  );
  let contentErrors = 0;

  for (const assignment of finalAssignments) {
    try {
      const content = JSON.parse(assignment.module.content);
      if (
        !content.overview ||
        !content.tactics ||
        !content.redFlags ||
        !content.quiz
      ) {
        console.log(
          `  ❌ ${assignment.module.name}: Missing required content fields`
        );
        contentErrors++;
      }
    } catch (e) {
      console.log(
        `  ❌ ${assignment.module.name}: Invalid JSON content - ${e instanceof Error ? e.message : String(e)}`
      );
      contentErrors++;
    }
  }

  if (contentErrors === 0) {
    console.log(`  ✅ All module content is valid!\n`);
  } else {
    console.log(`  ⚠️  Found ${contentErrors} content errors\n`);
  }

  console.log("=" + "=".repeat(68));
  console.log("✅ Verification complete!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
