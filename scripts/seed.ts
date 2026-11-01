import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { PostModel } from "../src/models/post";
import type { Post } from "../src/types/post";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required to seed the database.");
  }

  const dataPath = path.join(process.cwd(), "src/data/posts.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const posts = JSON.parse(raw) as Post[];

  await mongoose.connect(uri);

  for (const post of posts) {
    await PostModel.findOneAndUpdate(
      { slug: post.slug },
      {
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.content,
        publishedAt: new Date(post.publishedAt),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  console.log(`Seeded ${posts.length} posts.`);

  if (process.argv.includes("--hash-password")) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      throw new Error("Set ADMIN_PASSWORD when using --hash-password.");
    }
    const hash = await bcrypt.hash(password, 12);
    console.log("\nADMIN_PASSWORD_HASH=");
    console.log(hash);
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
