/**
 * @module utils/history
 * @description In-memory history tracking for calculator operations
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} flavor - Operation flavor (STACK or INDEPENDENT)
 * @property {string} operation - Operation name
 * @property {number[]} arguments - Operation arguments
 * @property {number} result - Operation result
 */

/**
 * @class History
 * @description In-memory history tracker for operations
 */
class History {
    constructor(flavor) {
        this.entries = [];
        this.flavor = flavor;
    }

    /**
     * @function addAction
     * @description Adds operation to history
     */
    addAction(op, args, res) {
        this.entries.push({ flavor: this.flavor, operation: op, arguments: args, result: res });
    }

    /**
     * @function fetch
     * @description Returns copy of history entries
     */
    fetch() {
        return [...this.entries];
    }

    /**
     * @function clear
     * @description Clears all history entries
     */
    clear() {
        this.entries.length = 0;
    }

    /**
     * @function length
     * @description Returns history length
     */
    length() {
        return this.entries.length;
    }
}

const stackHistory = new History('STACK');
const independentHistory = new History('INDEPENDENT');

module.exports = {
    stackHistory,
    independentHistory
};