const {prisma} = require("../clients/prisma");

async function insertOperation({ flavor, operation, result, arguments: args }) {
    return prisma.$transaction(async (tx) => {
        // 1. Get last rawid
        const last = await getLast(tx, "rawid");

        // 2. Compute next rawid
        const nextId = last ? last + 1 : 1;

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

    return row ? row[field] : null;
}

async function clearDatabase() {
    await prisma.operation.deleteMany({});
}

module.exports = {insertOperation, listOperations, clearDatabase};
