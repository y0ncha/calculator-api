const mongoClient = require("../db/mongo/mongoose.client");
const { Operation } = require("../db/mongo/operation.model");
const { nextId } = require("../db/mongo/rawid.service");

const PING_TTL_MS = 1000;
let lastOkAt = 0;

async function assertLive() {
  const now = Date.now();
  if (now - lastOkAt < PING_TTL_MS) return;

  try {
    await mongoClient.connect();
    await mongoClient.client.connection.db.admin().command({ ping: 1 });
  } catch (error) {
    const wrappedError = new Error("Mongo database is unavailable");
    wrappedError.cause = error;
    throw wrappedError;
  }

  lastOkAt = now;
}

async function isLive() {
  try {
    await mongoClient.connect();
    await mongoClient.client.connection.db.admin().command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Inserts a new operation record into Mongo when Mongo mode is enabled.
 */
async function insert({ flavor, operation, arguments: args, result }) {
  await assertLive(); // 👈 enforce invariant here

  const rawid = await nextId();
  const doc = await Operation.create({
    rawid,
    flavor,
    operation,
    arguments: args,
    result,
  });

  return doc.rawid;
}
/**
 * Returns all operation records (optionally filtered by flavor) when enabled.
 */
async function list(flavor) {
  await assertLive();

  const filter = flavor ? { flavor } : {};
  return Operation.find(filter).sort({ rawid: 1 }).lean();
}

/**
 * Best-effort clear:
 * - tries to connect (even if no previous ops happened)
 * - if Mongo is down, silently returns 0
 */
async function clear() {
  if (!(await isLive())) return 0;

  await mongoClient.connect();
  const { deletedCount = 0 } = await Operation.deleteMany({});
  return deletedCount;
}

module.exports = {
  assertLive,
  isLive,
  insert,
  list,
  clear,
};
