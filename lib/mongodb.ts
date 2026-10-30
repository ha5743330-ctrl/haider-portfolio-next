import mongoose from "mongoose";

// Kept on globalThis so hot reloads and warm serverless calls reuse one connection.
const cache = globalThis as typeof globalThis & {
  mongoosePromise?: Promise<typeof mongoose>;
};

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  cache.mongoosePromise ??= mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .catch((err) => {
      cache.mongoosePromise = undefined; // let the next request retry
      throw err;
    });

  return cache.mongoosePromise;
}
