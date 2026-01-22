/**
 * @module config
 * @description Configuration loader for database connections (Postgres and MongoDB)
 */

const tryLoadDotenv = () => {
  try {
    // Optional dependency; ignore missing module/file errors
    require("dotenv").config();
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      console.warn("[config] dotenv load skipped:", error.message);
    }
  }
};

tryLoadDotenv();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const appPort = toNumber(process.env.PORT, 8496);
const postgresHost = process.env.POSTGRES_HOST || "postgres";
const postgresPort = toNumber(process.env.POSTGRES_PORT, 5432);
const postgresUser = process.env.POSTGRES_USER || "postgres";
const postgresPassword = process.env.POSTGRES_PASSWORD || "docker";
const postgresDb = process.env.POSTGRES_DB || "operations";
const postgresConnectionString =
  process.env.POSTGRES_URI ||
  `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDb}`;

const mongoHost = process.env.MONGO_HOST || "mongo";
const mongoPort = toNumber(process.env.MONGO_PORT, 27017);
const mongoDbName = process.env.MONGO_DB || "calculator";
const mongoUri =
  process.env.MONGO_URI || `mongodb://${mongoHost}:${mongoPort}/${mongoDbName}`;

const config = {
  server: {
    port: appPort,
  },
  postgres: {
    host: postgresHost,
    port: postgresPort,
    user: postgresUser,
    password: postgresPassword,
    database: postgresDb,
    connectionString: postgresConnectionString,
  },
  mongo: {
    host: mongoHost,
    port: mongoPort,
    dbName: mongoDbName,
    uri: mongoUri,
  },
};

module.exports = { config };
