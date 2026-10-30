import { connection } from "next/server";
import { createItem } from "@/lib/admin";
import { collections } from "@/lib/collections";
import { connectDB } from "@/lib/mongodb";

type Ctx = { params: Promise<{ collection: string }> };

// Public: GET /api/{projects,services,internships,certificates,education,journey}
export async function GET(_req: Request, { params }: Ctx) {
  await connection();
  const { collection } = await params;
  const entry = collections[collection];
  if (!entry) return Response.json({ error: "Not found" }, { status: 404 });

  await connectDB();
  const items = await entry.model.find(entry.publicFilter ?? {}).sort({ order: 1, _id: 1 }).lean();
  return Response.json(items);
}

// Admin: create
export async function POST(req: Request, { params }: Ctx) {
  return createItem((await params).collection, req);
}
