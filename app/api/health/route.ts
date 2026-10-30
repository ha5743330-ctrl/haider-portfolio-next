import { connection } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connection(); // run per request, never prerender at build time

  try {
    const { connection: db } = await connectDB();
    await db.db!.admin().ping();
    return Response.json({ status: "ok" });
  } catch (err) {
    console.error("Health check failed:", err);
    return Response.json({ status: "error" }, { status: 503 });
  }
}
