// Regression tests for: Prisma Client v5 to v7 upgrade
import assert from "node:assert/strict";
import test from "node:test";

test("Prisma client exposes the Project query delegate", async () => {
  process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
  const { prisma } = await import("./prisma");
  assert.equal(typeof prisma.project.findMany, "function");
  await prisma.$disconnect();
});
