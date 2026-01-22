/**
 * @module repositories/operation.mongo
 * @description MongoDB repository for operations table access
 * @requires ../db/mongo/mongoose.client
 * @requires ../db/mongo/operation.model
 * @requires ../db/mongo/rawid.service
 */

const mongoClient = require("../db/mongo/mongoose.client");
const { Operation } = require("../db/mongo/operation.model");
const { nextId } = require("../db/mongo/rawid.service");

const PING_TTL_MS = 1000;
let lastOkAt = 0;

/**
 * @function assertLive
 * @description Verifies MongoDB connection is available, throws error if not
 */
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

/**
 * @function isLive
 * @description Checks if MongoDB is available, returns boolean
 */
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
 * @function insert
 * @description Inserts operation to operations collection with computed rawid
 */
async function insert({ flavor, operation, arguments: args, result }) {
  await assertLive();

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
 * @function list
 * @description Fetches operations from operations collection, optionally filtered by flavor
 */
async function list(flavor) {
  await assertLive();

  const filter = flavor ? { flavor } : {};
  return Operation.find(filter)
    .sort({ rawid: 1 })
    .select("-_id")
    .lean();
}

/**
 * @function clear
 * @description Deletes all operations from operations collection, returns count deleted
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
