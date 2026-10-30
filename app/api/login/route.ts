import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { parseBody } from "@/lib/admin";
import { COOKIE, MAX_AGE, signSession } from "@/lib/session";

// ponytail: in-memory per-instance limiter; use a shared store if abuse shows up.
const fails = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;
const recent = (ip: string) => (fails.get(ip) ?? []).filter((t) => Date.now() - t < WINDOW_MS);

// Hash both sides so timingSafeEqual always gets equal-length buffers.
const sha = (s: string) => createHash("sha256").update(s).digest();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (recent(ip).length >= LIMIT) {
    return Response.json({ error: "Too many attempts, try again in 15 minutes" }, { status: 429 });
  }

  const body = await parseBody(req, z.object({ password: z.string().min(1).max(200) }));
  if (!body.data) return body.response;

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !timingSafeEqual(sha(body.data.password), sha(expected))) {
    fails.set(ip, [...recent(ip), Date.now()]);
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }

  fails.delete(ip);
  (await cookies()).set(COOKIE, await signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return Response.json({ ok: true });
}
