import { prisma } from "../db/prisma_client.js";

/**
 * Inserts a calculator operation into Postgres.
 * Returns the generated rawid.
 */
export async function insertOperation({flavor, operation, result, arguments: args,}) {
    const record = await prisma.operation.create({
        data: {
            flavor,
            operation,
            result,
            arguments: args,
        },
    });
    return record.rawid;
}

/**
 * Returns all operations from Postgres.
 * Optional filter by flavor ("STACK" | "INDEPENDENT").
 */
export async function listOperations(flavor) {
    return prisma.operation.findMany({
        where: flavor ? { flavor } : undefined,
        orderBy: { rawid: "asc" },
    });
}