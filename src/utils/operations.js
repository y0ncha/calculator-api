/**
 * @module utils/operations
 * @description Arithmetic operations for calculator
 */

/**
 * @typedef {Object} OperationEntry
 * @property {number} arity - Number of required arguments
 * @property {Function} fn - Operation implementation
 */

/**
 * @constant {Object.<string, OperationEntry>} map
 * @description Supported operations: plus, minus, times, divide, pow, abs, fact
 */
const map = {
    plus: {
        arity: 2,
        fn: (x, y) => x + y
    },
    minus: {
        arity: 2,
        fn: (x, y) => x - y
    },
    times: {
        arity: 2,
        fn: (x, y) => x * y
    },
    divide: {
        arity: 2,
        fn: (x, y) => {
            if (y === 0) throw `Error while performing operation Divide: division by 0`;
            return Math.trunc(x / y);
        }
    },
    pow: {
        arity: 2,
        fn: (x, y) => x ** y
    },
    abs: {
        arity: 1,
        fn: x => Math.abs(x)
    },
    fact: {
        arity: 1,
        fn: x => {
            if (x < 0) throw `Error while performing operation Factorial: not supported for the negative number`;
            return factorial(x);
        }
    }
};

/**
 * @function perform
 * @description Performs arithmetic operation on provided arguments
 */
function perform(op, args) {
    const entry = map[op];

    if (!entry) {
        throw `Error: unknown operation: ${op}`;
    }

    try {
        return entry.fn(...args);
    }
    catch (error) {
        throw error;
    }
}

/**
 * @function factorial
 * @description Computes factorial of non-negative integer
 * @private
 */
function factorial(n) {
    return n === 0 ? 1 : n * factorial(n - 1);
}

module.exports = { map, perform };