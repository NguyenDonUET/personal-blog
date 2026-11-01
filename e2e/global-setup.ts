import { execSync } from "node:child_process";
import dotenv from "dotenv";
import path from "node:path";

export default async function globalSetup() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });

  if (!process.env.MONGODB_URI) {
    console.warn(
      "[e2e] MONGODB_URI is not set — admin CRUD tests will be skipped.",
    );
    return;
  }

  execSync("pnpm seed", {
    stdio: "inherit",
    env: process.env,
    cwd: process.cwd(),
  });
}
