import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), `.env`) });

const env = process.env.NODE_ENV ?? "development";

export const config = {
  port: Number(process.env.PORT) ?? 3000,
  nodeEnv: env,
};