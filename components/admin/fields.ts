export type Field = {
  name: string;
  label: string;
  type?: "textarea" | "select" | "image" | "tags" | "number" | "switch";
  options?: [value: string, label: string][];
};

export type Collection = {
  label: string;
  singular: string;
  list: string; // GET path
  titleKey: string;
  subKeys: string[]; // first non-empty one is shown under the title
  fields: Field[];
};

const f = (name: string, label: string, type?: Field["type"]): Field => ({ name, label, type });

export const collections: Record<string, Collection> = {
  projects: {
    label: "Projects", singular: "project", list: "/api/projects?all=1", titleKey: "title", subKeys: ["category", "description"],
    fields: [f("title", "Title"), f("category", "Category"), f("description", "Description", "textarea"), f("tags", "Tags (comma separated)", "tags"),
      f("link", "Live or GitHub link"), f("image", "Project image", "image"),
      { name: "status", label: "Status", type: "select", options: [["draft", "Draft"], ["published", "Published"]] }],
  },
  services: {
    label: "Services", singular: "service", list: "/api/services", titleKey: "title", subKeys: ["description"],
    fields: [f("title", "Title"), f("description", "Description", "textarea")],
  },
  internships: {
    label: "Internships", singular: "internship", list: "/api/internships", titleKey: "company", subKeys: ["role", "period"],
    fields: [f("company", "Company"), f("role", "Your role"), f("period", "Duration (e.g. 8 weeks, remote)"),
      { name: "status", label: "Status", type: "select", options: [["In progress", "In progress"], ["Completed", "Completed"]] },
      f("description", "What you did", "textarea")],
  },
  certificates: {
    label: "Certificates", singular: "certificate", list: "/api/certificates", titleKey: "title", subKeys: ["issuer", "date"],
    fields: [f("title", "Certificate name"), f("issuer", "Issued by"), f("date", "Date"), f("link", "Verify link"), f("image", "Certificate image", "image")],
  },
  education: {
    label: "Education", singular: "education entry", list: "/api/education", titleKey: "title", subKeys: ["school", "period"],
    fields: [f("title", "Degree or program"), f("school", "Institution"), f("period", "Years"), f("description", "Details", "textarea")],
  },
  journey: {
    label: "Journey", singular: "journey point", list: "/api/journey", titleKey: "label", subKeys: ["heading", "description"],
    fields: [f("label", "Label (place or year)"), f("heading", "Heading"), f("description", "Story", "textarea")],
  },
};

export const textFields: Field[] = [
  f("heroTitle", "Hero headline"), f("heroIntro", "Hero text", "textarea"), f("aboutText", "About text", "textarea"),
  f("contactIntro", "Contact text", "textarea"), f("footerText", "Footer text"),
];

export const settingsFields: Field[] = [
  f("headline", "Headline"), f("email", "Email"), f("phone", "Phone"), f("github", "GitHub link"), f("linkedin", "LinkedIn link"),
  f("youtube", "YouTube link"), f("cvLink", "CV link (PDF)"), f("githubUsername", "GitHub username (for the projects fill)"),
  { name: "projectsLimit", label: "Projects shown on the site (2 to 6)", type: "number" },
];
