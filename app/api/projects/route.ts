import { connection } from "next/server";
import { createItem } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models";
import { getProjects } from "@/lib/projects";

// Public: published DB projects by order, then GitHub repos up to profile.projectsLimit.
export async function GET() {
  await connection();
  await connectDB();
  const profile = await Profile.findOne().select("githubUsername githubFill projectsLimit").lean();
  return Response.json(await getProjects(profile));
}

// Admin: create (this static route shadows the generic [collection] one)
export async function POST(req: Request) {
  return createItem("projects", req);
}
