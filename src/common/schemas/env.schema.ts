import * as dotenv from "dotenv";
import { z } from "zod";

const envSchema = z.object({
  nodeEnv: z.string(),
  databaseDatasource: z.literal("prisma"),
  pgdbURL: z.string().nonempty(),
});

dotenv.config();
export const env = envSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  databaseDatasource: process.env.DATABASE_DATASOURCE,
  pgdbURL: process.env.PGDB_URL,
});
