require("dotenv").config();

const {PrismaClient: Prisma} = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new Prisma({
    adapter: new PrismaPg(pool),
});

module.exports = { prisma };