/**
 * @module repositories/operation.postgres
 * @description PostgreSQL repository for operations table access
 * @requires ../db/postgres/prisma.client
 */

const { prisma } = require("../db/postgres/prisma.client");

const PING_TTL_MS = 1000;
let lastOkAt = 0;

/**
 * @function assertLive
 * @description Verifies Postgres connection is available, throws error if not
 */
async function assertLive() {
  const now = Date.now();
  if (now - lastOkAt < PING_TTL_MS) return;

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    const wrappedError = new Error("Postgres database is unavailable");
    wrappedError.cause = error;
    throw wrappedError;
  }

  lastOkAt = now;
}

/**
 * @function isLive
 * @description Checks if Postgres is available, returns boolean
 */
async function isLive() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * @function insert
 * @description Inserts operation to operations table with computed rawid. Uses Prisma transaction to compute next rawid (getLast + 1) and insert atomically.
 */
async function insert({ flavor, operation, result, arguments: args }) {
  await assertLive();

  return prisma.$transaction(async (tx) => {
    const last = await getLast(tx, "rawid");
    const nextId = last ? last + 1 : 1;

    const record = await tx.operation.create({
      data: { rawid: nextId, flavor, operation, result, arguments: args },
    });

    return record.rawid;
  });
}

/**
 * @function list
 * @description Fetches operations from operations table, optionally filtered by flavor
 */
async function list(flavor) {
  await assertLive();

  return prisma.operation.findMany({
    where: flavor ? { flavor } : undefined,
    orderBy: { rawid: "asc" },
  });
}

/**
 * @function getLast
 * @description Retrieves last value of specified field from operations table
 * @private
 */
async function getLast(tx, field) {
  const row = await tx.operation.findFirst({
    orderBy: { [field]: "desc" },
    select: { [field]: true },
  });

  return row ? row[field] : null;
}

/**
 * @function clear
 * @description Deletes all operations from operations table, returns count deleted
 */
async function clear() {
  if (!(await isLive())) return 0; // silent skip if down

  const res = await prisma.operation.deleteMany({});
  return res.count;
}

module.exports = {
  assertLive,
  isLive,
  insert,
  list,
  clear,
};
