/**
 * @module db/postgres/prisma.client
 * @description Single Prisma client instance for database access
 */

const { PrismaClient: Prisma } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { URL } = require("url");
const { config } = require("../../config");

const maskConnectionString = (uri) => {
  if (!uri) return "";
  try {
    const parsed = new URL(uri);
    if (parsed.password) {
      parsed.password = "***";
    }
    return parsed.toString();
  } catch (error) {
    return uri.replace(/(\/\/[^:]+):[^@]+@/, "$1:***@");
  }
};

const pool = new Pool({
  connectionString: config.postgres.connectionString,
});

console.log(
  `[startup] Connecting to Postgres at ${maskConnectionString(
    config.postgres.connectionString,
  )}`,
);

const prisma = new Prisma({
  adapter: new PrismaPg(pool),
});

module.exports = { prisma };
