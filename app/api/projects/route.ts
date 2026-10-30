import { connection } from "next/server";
import { createItem } from "@/lib/admin";
import { fetchGithubProjects } from "@/lib/github";
import { connectDB } from "@/lib/mongodb";
import { Profile, Project } from "@/lib/models";

// Public: published DB projects by order, then GitHub repos up to profile.projectsLimit.
export async function GET() {
  await connection();
  await connectDB();
  const [db, profile] = await Promise.all([
    Project.find({ status: "published" }).sort({ order: 1, _id: 1 }).lean(),
    Profile.findOne().select("githubUsername githubFill projectsLimit").lean(),
  ]);
  const items: object[] = db.map((p) => ({ ...p, source: "db" }));

  const limit = profile?.projectsLimit ?? 4;
  if ((profile?.githubFill ?? true) && items.length < limit) {
    const have = new Set(db.map((p) => p.link));
    const repos = (await fetchGithubProjects(profile?.githubUsername ?? "ha5743330-ctrl"))
      .filter((r) => !have.has(r.link))
      .slice(0, limit - items.length);
    items.push(...repos.map((r) => ({ ...r, source: "github" })));
  }
  return Response.json(items);
}

// Admin: create (this static route shadows the generic [collection] one)
export async function POST(req: Request) {
  return createItem("projects", req);
}
