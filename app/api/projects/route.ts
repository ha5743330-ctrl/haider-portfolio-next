import { cookies } from "next/headers";
import { connection } from "next/server";
import { createItem } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { Profile, Project } from "@/lib/models";
import { getProjects } from "@/lib/projects";
import { COOKIE, verifySession } from "@/lib/session";

// Public: published DB projects by order, then GitHub repos up to profile.projectsLimit.
// Admin: ?all=1 lists every DB project, drafts included (proxy.ts also guards this).
export async function GET(req: Request) {
  await connection();
  if (new URL(req.url).searchParams.has("all")) {
    if (!(await verifySession((await cookies()).get(COOKIE)?.value))) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    return Response.json(await Project.find().sort({ order: 1, _id: 1 }).lean());
  }
  await connectDB();
  const profile = await Profile.findOne().select("githubUsername githubFill projectsLimit").lean();
  return Response.json(await getProjects(profile));
}

// Admin: create (this static route shadows the generic [collection] one)
export async function POST(req: Request) {
  return createItem("projects", req);
}
