const { prisma } = require("../db/prismaClient");

async function insertOperation({ flavor, operation, result, arguments: args }) {
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

async function listOperations(flavor) {
    return prisma.operation.findMany({
        where: flavor ? { flavor } : undefined,
        orderBy: { rawid: "asc" },
    });
}

module.exports = {insertOperation, listOperations};