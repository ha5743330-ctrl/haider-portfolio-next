// Kept in code, not in admin (BUILD_PLAN Section 8).
export const stages = [
  ["Idea", "We talk about your business, your customers and what the site must do."],
  ["Design", "I sketch the layout and colors, so you see it before any code is written."],
  ["Code", "I build the pages and the server behind them, then test on phones and laptops."],
  ["Live", "Your site goes online, and you get an admin panel to update it yourself."],
] as const;

export const stageColors = ["#101114", "#2a2140", "#0f2a2e", "#2b2410"] as const;

export const missions = [
  ["Business website", "Fast, mobile-friendly sites with an admin panel so you can edit content yourself.", ["HTML and CSS", "React", "Admin panel"]],
  ["Web app", "Dashboards, learning platforms and booking tools with login and user roles.", ["React", "Node.js", "MongoDB"]],
  ["AI feature", "Chatbots, search and automation added to your product.", ["Python", "Azure AI", "APIs"]],
  ["Something else", "Tell me your idea and I’ll tell you honestly how I’d build it.", ["Planning", "Prototype"]],
] as const;

export const tech = ["React", "Node.js", "Express", "MongoDB", "Python", "Next.js", "Azure AI", "Git", "Tailwind"];

// Fallback colors for project cards that have no image.
export const cardColors = ["#5b3fd1", "#0f7b6c", "#c2410c", "#1f2937"];

// "Every website has two sides. I build both." -> 3 hero lines.
export function heroLines(title: string) {
  const sentences = title.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length >= 3) return [sentences[0], sentences[1], sentences.slice(2).join(" ")];
  const words = (sentences.length === 2 ? sentences[0] : title).split(" ");
  const cut = sentences.length === 2 ? Math.floor(words.length / 2) : Math.ceil(words.length / 3);
  const head = words.slice(0, cut).join(" ");
  if (sentences.length === 2) return [head, words.slice(cut).join(" "), sentences[1]];
  const rest = words.slice(cut);
  const mid = Math.ceil(rest.length / 2);
  return [head, rest.slice(0, mid).join(" "), rest.slice(mid).join(" ")];
}
