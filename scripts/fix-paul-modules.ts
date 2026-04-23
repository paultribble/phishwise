import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🔧 Fixing Paul Tribble's modules - removing bad content modules...\n"
  );

  // Get Paul Tribble
  const paul = await prisma.user.findUnique({
    where: { email: "ptribble@outlook.com" },
  });

  if (!paul) {
    console.log("❌ Paul Tribble not found");
    return;
  }

  // Find all modules with bad content (markdown instead of JSON)
  const badModules = await prisma.trainingModule.findMany({
    where: {
      content: {
        startsWith: "#", // Markdown headers start with #
      },
    },
    select: { id: true, name: true },
  });

  console.log(`Found ${badModules.length} modules with invalid markdown content:\n`);
  badModules.forEach((m) => {
    console.log(`  ❌ ${m.name}`);
  });

  if (badModules.length === 0) {
    console.log("✅ No bad modules found!");
    return;
  }

  const badModuleIds = badModules.map((m) => m.id);

  // Delete Paul's assignments to these bad modules
  const deletedAssignments = await prisma.userTraining.deleteMany({
    where: {
      userId: paul.id,
      moduleId: {
        in: badModuleIds,
      },
    },
  });

  console.log(
    `\n✅ Removed ${deletedAssignments.count} bad module assignments from Paul\n`
  );

  // Delete the bad modules themselves (they can't be fixed, just remove them)
  const deletedModules = await prisma.trainingModule.deleteMany({
    where: {
      id: {
        in: badModuleIds,
      },
    },
  });

  console.log(
    `✅ Deleted ${deletedModules.count} malformed modules from database\n`
  );

  // Verify remaining modules
  const finalAssignments = await prisma.userTraining.findMany({
    where: { userId: paul.id },
    include: { module: true },
  });

  console.log(
    `✅ Paul now has ${finalAssignments.length} valid modules assigned:\n`
  );
  finalAssignments.forEach((a) => {
    const status = a.completedAt ? "✓ Completed" : "⏳ Pending";
    console.log(`  ${status}: ${a.module.name}`);
  });

  console.log("\n" + "=".repeat(70));
  console.log("✅ Cleanup complete! Paul's modules are now properly configured.");
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
