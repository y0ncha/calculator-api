/**
 * @module db/repositories/postgres
 * @description PostgreSQL repository for operations table access
 * @requires ../clients/prisma
 */

const {prisma} = require("../clients/prisma");

/**
 * @function insertOperation
 * @description Inserts operation record into database. Uses Prisma transaction to compute next rawid (sequential integer starting at 1).
 * @param {Object} params - Operation parameters
 * @param {string} params.flavor - Operation flavor: "STACK" or "INDEPENDENT"
 * @param {string} params.operation - Operation name (e.g., "plus", "minus")
 * @param {number} params.result - Computed result
 * @param {string} params.arguments - JSON string of arguments (e.g., "[1,2,3]")
 * @returns {Promise<number>} The assigned rawid
 */
async function insertOperation({ flavor, operation, result, arguments: args }) {
    return prisma.$transaction(async (tx) => {
        // Get last rawid
        const last = await getLast(tx, "rawid");

        // Compute next rawid
        const nextId = last ? last + 1 : 1;

        // Insert with explicit rawid
        const record = await tx.operation.create({
            data: {
                rawid: nextId,
                flavor,
                operation,
                result,
                arguments: args,
            },
        });
        return record.rawid;
    });
}

/**
 * @function listOperations
 * @description Retrieves operations from database, optionally filtered by flavor
 * @param {string} [flavor] - Optional filter: "STACK" or "INDEPENDENT"
 * @returns {Promise<Array>} Array of operation records ordered by rawid
 */
async function listOperations(flavor) {
    return prisma.operation.findMany({
        where: flavor ? { flavor } : undefined,
        orderBy: { rawid: "asc" },
    });
}

/**
 * @function getLast
 * @description Helper to get last value of a field
 * @param {Object} tx - Prisma transaction object
 * @param {string} field - Field name to retrieve
 * @returns {Promise<number|null>} Last value or null if table is empty
 * @private
 */
async function getLast(tx, field) {
    const row = await tx.operation.findFirst({
        orderBy: { [field]: "desc" },
        select: { [field]: true },
    });

    return row ? row[field] : null;
}

/**
 * @function clearDatabase
 * @description Deletes all operation records from database
 * @returns {Promise<void>}
 */
async function clearDatabase() {
    await prisma.operation.deleteMany({});
}

module.exports = {insertOperation, listOperations, clearDatabase};
