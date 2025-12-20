/**
 * @module controllers/general
 * @description General endpoint handlers (health, history, database, log level)
 * @requires ../utils/history
 * @requires ../loggers
 * @requires ../db/repositories/postgres
 */

const { stackHistory, independentHistory } = require("../utils/history");
const { stackLogger, independentLogger, requestLogger } = require("../loggers");
const postgres = require("../repositories/operation.postgres");
const mongo = require("../repositories/operation.mongo");

/**
 * @function health
 * @description Health check endpoint
 */
exports.health = (req, res) => {
  res.status(200).send("OK");
};

exports.fetchHistory = async (req, res) => {
  const { flavor, persistenceMethod } = req.query;

  try {
    // flavor validation (case-sensitive)
    if (flavor && flavor !== "STACK" && flavor !== "INDEPENDENT") {
      return res
        .status(409)
        .json({ errorMessage: `Error: unknown flavor: ${flavor}` });
    }

    // ─────────────────────────────
    // 1) NO persistenceMethod → internal history
    // ─────────────────────────────
    if (!persistenceMethod) {
      let result = [];

      if (flavor === "STACK") {
        result = stackHistory.fetch();
      } else if (flavor === "INDEPENDENT") {
        result = independentHistory.fetch();
      } else {
        result = [...stackHistory.fetch(), ...independentHistory.fetch()];
      }

      return res.status(200).json({ result });
    }

    // ─────────────────────────────
    // 2) persistenceMethod present → DB history
    // ─────────────────────────────
    if (persistenceMethod !== "POSTGRES" && persistenceMethod !== "MONGO") {
      return res.status(409).json({
        errorMessage:
          "Error: persistenceMethod must be exactly one of POSTGRES or MONGO",
      });
    }

    const result =
      persistenceMethod === "POSTGRES"
        ? await postgres.list(flavor)
        : await mongo.list(flavor);

    return res.status(200).json({ result });
  } catch (error) {
    return res
      .status(503)
      .json({ errorMessage: error?.message || String(error) });
  }
};

/**
 * @function clearHistory
 * @description Clears in-memory history for both flavors
 */
exports.clearHistory = (req, res) => {
  stackHistory.clear();
  independentHistory.clear();
  res
    .status(200)
    .json({ result: stackHistory.length + independentHistory.length });
};

/**
 * @function getLogLevel
 * @description Returns current log level of specified logger
 */
exports.getLogLevel = (req, res) => {
  const name = req.query["logger-name"];

  if (name === "stack-logger") {
    res.status(200).json({ result: stackLogger.level.levelStr });
  } else if (name === "independent-logger") {
    res.status(200).json({ result: independentLogger.level.levelStr });
  } else if (name === "request-logger") {
    res.status(200).json({ result: requestLogger.level.levelStr });
  } else {
    res.status(409).json({ errorMessage: `Logger '${name}' not found` });
  }
};

/**
 * @function setLogLevel
 * @description Updates log level of specified logger
 */
exports.setLogLevel = (req, res) => {
  const name = req.query["logger-name"];
  let level = req.query["logger-level"];

  // Validate log level
  if (!["DEBUG", "INFO", "ERROR"].includes(level)) {
    return res
      .status(409)
      .json({ errorMessage: `Invalid log level: ${level}` });
  }

  level = level.toLowerCase();

  if (name === "stack-logger") {
    stackLogger.level = level;
    level = stackLogger.level.levelStr;
  } else if (name === "independent-logger") {
    independentLogger.level = level;
    level = independentLogger.level.levelStr;
  } else if (name === "request-logger") {
    requestLogger.level = level;
    level = requestLogger.level.levelStr;
  } else {
    return res.status(409).json({ errorMessage: `Logger '${name}' not found` });
  }
  res.status(200).json({ result: level });
};

/**
 * @function clearDB
 * @description Clears all operations from Postgres database
 */
exports.clearDB = async (req, res) => {
  try {
    const postgresDeleted = await postgres.clear();
    const mongoDeleted = await mongo.clear();

    res.status(200).json({
      result: {
        postgres: postgresDeleted,
        mongo: mongoDeleted,
        total: postgresDeleted + mongoDeleted,
      },
    });
  } catch (error) {
    res.status(409).json({
      errorMessage: error && error.message ? error.message : String(error),
    });
  }
};
