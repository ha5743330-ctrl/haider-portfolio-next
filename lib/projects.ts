import { fetchGithubProjects } from "./github";
import { Project } from "./models";

type ProfileLike = { githubUsername?: string; githubFill?: boolean; projectsLimit?: number } | null;

// Published DB projects by order, then GitHub repos up to projectsLimit (deduped by link).
export async function getProjects(profile: ProfileLike) {
  const db = await Project.find({ status: "published" }).sort({ order: 1, _id: 1 }).lean();
  const items = db.map((p) => ({ ...p, source: "db" as const }));

  const limit = profile?.projectsLimit ?? 4;
  if ((profile?.githubFill ?? true) && items.length < limit) {
    const have = new Set(db.map((p) => p.link));
    const repos = (await fetchGithubProjects(profile?.githubUsername ?? "ha5743330-ctrl"))
      .filter((r) => !have.has(r.link))
      .slice(0, limit - items.length);
    return [...items, ...repos.map((r) => ({ ...r, image: "", source: "github" as const }))];
  }
  return items;
}
