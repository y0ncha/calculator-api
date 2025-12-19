/**
 * @module controllers/stack
 * @description Stack-based calculator logic
 * @requires ../utils/stack
 * @requires ../utils/operations
 * @requires ../utils/history
 * @requires ../loggers
 */

const stack = require('../utils/stack');
const operations = require('../utils/operations');
const { stackHistory: history} = require('../utils/history');
const { stackLogger: logger } = require('../loggers');
const {insertOperation} = require("../db/repositories/postgres");

/**
 * @function getStackSize
 * @description Returns current stack length
 */
exports.getStackSize = (req, res) => {
    const size = stack.size();

    logger.info(`Stack size is ${size}`);

    res.status(200).json({ result: size });
    logger.debug( `Stack content (first == top): [${stack.stringify()}]`)
};

/**
 * @function pushArgs
 * @description Pushes numbers onto the stack
 */
exports.pushArgs = (req, res) => {
    try {
        const args = req.body.arguments;
        let len = args.length;
        let size = stack.size();

        logger.info(`Adding total of ${len} argument(s) to the stack | Stack size: ${size + len}`);
        stack.push(args);

        res.status(200).json({ result: stack.size() });
        logger.debug(`Adding arguments: ${args.join(',')} | Stack size before ${size} | stack size after ${stack.size()}`);
    }
    catch (error) {
        logger.error(`Server encountered an error ! message: ${error}`);
        res.status(409).json({ errorMessage: error });
    }
};

/**
 * @function stackCalculate
 * @description Performs operation using numbers from stack
 */
exports.stackCalculate = async (req, res) => {
    const op = req.query.operation;
    const opKey = op?.toLowerCase();
    const opEntry = operations.map[opKey];

    if (!opEntry) {
        const error = `Error: unknown operation: ${op}`;
        logger.error(`Server encountered an error ! message: ${error}`);
        return res.status(409).json({errorMessage: error});
    }
    if (opEntry.arity > stack.size()) {
        const error = `Error: cannot implement operation ${op}. It requires ${opEntry.arity} arguments and the stack has only ${stack.size()} arguments`;
        logger.error(`Server encountered an error ! message: ${error}`);
        return res.status(409).json({errorMessage: error});
    }

    try {
        const args = stack.pop(opEntry.arity);
        const result = operations.perform(opKey, args);

        logger.info(`Performing operation ${op}. Result is ${result} | stack size: ${stack.size()}`)
        history.addAction(op, args, result);

        // Insert the operation into the database
        await insertOperation({
            flavor: "STACK",
            operation: opKey,
            result,
            arguments: JSON.stringify(args),
        });

        res.status(200).json({result});
        logger.debug(`Performing operation: ${op}(${args.join(',')}) = ${result}`)
    } catch (error) {
        logger.error(`Server encountered an error ! message: ${error}`);
        res.status(409).json({errorMessage: error});
    }
};

/**
 * @function popArgs
 * @description Removes numbers from the stack
 */
exports.popArgs = (req, res) => {
    try {
        const count = Number(req.query.count);
        stack.pop(count);
        logger.info(`Removing total ${count} argument(s) from the stack | Stack size: ${stack.size()}`)
        res.status(200).json({ result: stack.size() });
    }
    catch (error) {
        logger.error(`Server encountered an error ! message: ${error}`);
        res.status(409).json({ errorMessage: error });
    }
};