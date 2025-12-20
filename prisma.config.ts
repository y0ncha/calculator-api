import { defineConfig } from "prisma/config";

const postgres_uri =
  process.env.POSTGRES_URI ??
  "postgresql://postgres:postgres@postgres:5432/operations";

export default defineConfig({
  schema: "schema/schema.prisma",
  datasource: {
    url: postgres_uri,
  },
});
