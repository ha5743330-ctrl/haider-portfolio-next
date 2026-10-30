import { connection } from "next/server";
import { updateProfile } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models";

export async function GET() {
  await connection();
  await connectDB();
  const profile = await Profile.findOne().lean();
  return profile ? Response.json(profile) : Response.json({ error: "Not found" }, { status: 404 });
}

// Admin
export async function PUT(req: Request) {
  return updateProfile(req);
}
