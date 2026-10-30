type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  html_url: string;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

// Public repos mapped to the Project shape. Never throws: any failure gives [].
export async function fetchGithubProjects(username: string) {
  if (!username) return [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const repos: Repo[] = await res.json();
    return repos
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
      .map((r) => ({
        title: r.name,
        description: r.description ?? "",
        tags: [...(r.language ? [r.language] : []), ...(r.topics ?? [])],
        link: r.html_url,
        category: "GitHub",
      }));
  } catch {
    return [];
  }
}
