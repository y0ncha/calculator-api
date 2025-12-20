/**
 * @module controllers/independent
 * @description Independent calculator request handling and orchestration
 * @requires ../utils/operations
 * @requires ../utils/history
 * @requires ../loggers
 * @requires ../repositories/postgres
 */

const operations = require("../utils/operations");
const { independentHistory: history } = require("../utils/history");
const { independentLogger: logger } = require("../loggers");
const postgres = require("../repositories/operation.postgres");
const mongo = require("../repositories/operation.mongo");

/**
 * @function independentCalculate
 * @description Performs calculation with provided arguments, persists to database
 */
exports.independentCalculate = async (req, res) => {
  try {
    const args = req.body.arguments;
    const op = req.body.operation;
    const opKey = op?.toLowerCase(); // normalize the operation key
    const opEntry = operations.map[opKey];

    if (!opEntry) {
      const error = `Error: unknown operation: ${op}`;
      logger.error(`Server encountered an error ! message: ${error}`);
      return res.status(409).json({ errorMessage: error });
    }
    if (args.length < opEntry.arity) {
      const error = `Error: Not enough arguments to perform the operation ${op}`;
      logger.error(`Server encountered an error ! message: ${error}`);
      return res.status(409).json({
        errorMessage: `Error: Not enough arguments to perform the operation ${op}`,
      });
    }
    if (args.length > opEntry.arity) {
      const error = `Error: Too many arguments to perform the operation ${op}`;
      logger.error(`Server encountered an error ! message: ${error}`);
      return res.status(409).json({ errorMessage: error });
    }

    const result = operations.perform(opKey, args);

    history.addAction(op, args, result);

    const payload = {
      flavor: "INDEPENDENT",
      operation: opKey,
      result,
      arguments: JSON.stringify(args),
    };

    // Persist to both databases (Mongo insert is a no-op when disabled)
    await postgres.insert(payload);
    await mongo.insert(payload);

    logger.info(`Performing operation ${op}. Result is ${result}`);
    logger.debug(`Performing operation: ${op}(${args.join(",")}) = ${result}`);
    res.status(200).json({ result });
  } catch (error) {
    logger.error(
      `Server encountered an error ! message: ${
        error?.message || String(error)
      }`
    );
    res.status(503).json({ errorMessage: error?.message || String(error) });
  }
};
