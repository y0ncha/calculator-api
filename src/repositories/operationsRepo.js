const { prisma } = require("../db/prismaClient");

async function insertOperation({ flavor, operation, result, arguments: args }) {
    return prisma.$transaction(async (tx) => {
        // 1. Get last rawid
        const last = await getLast(tx, "rawid");
        const lastId = last ? last : 0;

        // 2. Compute next rawid
        const nextId = lastId + 1;

        // 3. Insert with explicit rawid
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


async function listOperations(flavor) {
    return prisma.operation.findMany({
        where: flavor ? { flavor } : undefined,
        orderBy: { rawid: "asc" },
    });
}

async function getLast(tx, field) {
    const row = await tx.operation.findFirst({
        orderBy: { [field]: "desc" },
        select: { [field]: true },
    });

    return row[field];
}

module.exports = {insertOperation, listOperations};

