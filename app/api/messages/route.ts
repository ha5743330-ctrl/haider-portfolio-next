import { connection } from "next/server";
import { parseBody } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models";
import { messageInputSchema } from "@/lib/schemas";

// ponytail: in-memory per-instance limiter; use a shared store if abuse shows up.
const hits = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

// Admin: inbox, newest first
export async function GET() {
  await connection();
  await connectDB();
  return Response.json(await Message.find().sort({ createdAt: -1 }).lean());
}

// Public: contact form
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) return Response.json({ error: "Too many messages, try later" }, { status: 429 });

  const body = await parseBody(req, messageInputSchema);
  if (!body.data) return body.response;

  await connectDB();
  await Message.create(body.data);
  return Response.json({ ok: true }, { status: 201 });
}
