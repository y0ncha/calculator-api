/**
 * @module utils/stack
 * @description Stack data structure for integer operations
 */

/**
 * @class Stack
 * @description Stack implementation for calculator operations
 */
class Stack {
    /**
     * @constructor
     */
    constructor() {
        this._items = [];
    }

    /**
     * @function push
     * @description Pushes integers onto the stack
     */
    push(args) {
        if (!Array.isArray(args)) {
            throw "Invalid or missing 'arguments' array";
        }
        if (args.some(arg => !Number.isInteger(arg))) {
            throw "All arguments must be integers";
        }
        this._items.push(...args);
    }

    /**
     * @function pop
     * @description Removes and returns items from top of stack in reverse order
     */
    pop(count) {
        const size = this._items.length;
        if (!Number.isInteger(count) || count < 0 || count > size) {
            throw `Error: cannot remove ${count} from the stack. It has only ${size} arguments`;
        }
        return this._items.splice(-count).reverse();
    }

    /**
     * @function size
     * @description Returns current stack length
     */
    size() {
        return this._items.length;
    }

    /**
     * @function stringify
     * @description Returns stack contents as string (top first)
     */
    stringify() {
        return `${this._items.slice().reverse().join(', ')}`;
    }

    /**
     * @function clear
     * @description Clears all items from stack
     */
    clear() {
        this._items.length = 0;
    }
}

module.exports = new Stack();
