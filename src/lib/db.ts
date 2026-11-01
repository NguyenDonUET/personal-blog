import mongoose from "mongoose";

const globalForMongoose = globalThis as typeof globalThis & {
  mongoosePromise?: Promise<typeof mongoose>;
};

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose.connect(uri);
  }

  return globalForMongoose.mongoosePromise;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}
