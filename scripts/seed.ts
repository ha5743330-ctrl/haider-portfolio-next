// Run with: npm run seed (Node strips the types; env comes from .env.local).
// Idempotent: clears the content collections, then inserts. Messages are never touched.
import { readFileSync } from "node:fs";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb.ts";
import { Certificate, Education, Internship, Journey, Profile, Project, Service } from "../lib/models.ts";

// legacy/haiderali.jpg is 1024x1024 and ~41 KB: already inside the 1200 px / 400 KB limits.
const photo = "data:image/jpeg;base64," + readFileSync("legacy/haiderali.jpg").toString("base64");

const ordered = <T extends object>(items: T[]) => items.map((item, order) => ({ ...item, order }));

const profile = {
  photo,
  heroTitle: "Every website has two sides. I build both.",
  heroIntro:
    "I’m Haider, a full-stack developer in Islamabad. I make the part people see, and the part that keeps it running.",
  aboutText:
    "I started in Bara Kahu and now build for businesses. I care about sites that load fast, look sharp and are easy to update. I studied AI, so I know where it helps and where it doesn’t.",
  contactIntro: "Tell me what you’re building and where you need help.",
  footerText: "© 2026 Haider Ali",
  headline: "Full-stack developer, Islamabad",
  email: "ha5743330@gmail.com",
  phone: "+92 347 0861897",
  github: "https://github.com/ha5743330-ctrl",
  linkedin: "https://www.linkedin.com/in/haider-ali-545970360",
  youtube: "https://youtube.com/@techwithhaider2",
  cvLink: "/files/Haider_Ali_CV.pdf",
  open: true,
  githubUsername: "ha5743330-ctrl",
  projectsLimit: 4,
  githubFill: true,
};

const projects = ordered([
  { title: "LMS platform", category: "Web app", description: "Courses, user roles and progress tracking.", tags: ["React", "Node.js", "MongoDB"], status: "published" },
  { title: "Noor-ul-Quran", category: "Web app", description: "Turns Quran verses into shareable videos.", tags: ["JavaScript"], link: "https://github.com/ha5743330-ctrl/Noor-ul-Quran", status: "published" },
  { title: "Neighborhood carpool", category: "Concept", description: "Ride sharing between Bara Kahu and Islamabad.", tags: ["MERN", "Maps"], status: "draft" },
]);

const services = ordered([
  { title: "Business websites", description: "Fast sites with an admin panel so you can edit content yourself." },
  { title: "Web apps and dashboards", description: "Custom tools with login and user roles." },
  { title: "AI integration", description: "Chatbots, search and automation." },
]);

// Roles are blank on purpose: Haider fills them in admin.
const internships = ordered([
  { company: "FlyRank AI", period: "8 weeks", description: "Remote, unpaid.", status: "In progress" },
  { company: "Alkhidmat Foundation", period: "8 weeks", description: "Remote, volunteer.", status: "In progress" },
  { company: "Arch Technologies", period: "2 months", description: "Remote, unpaid.", status: "In progress" },
  { company: "Developers Hub Corporation", period: "8 weeks", description: "Remote, unpaid.", status: "Completed" },
]);

const certificates = ordered([
  {
    title: "Microsoft Azure AI Fundamentals (AI-900)",
    issuer: "Microsoft",
    date: "July 2, 2026",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/Haiderali-0774/489B0F237EFEF991?sharingId=2269BFFE1865A52D",
  },
  { title: "Internship completion", issuer: "Developers Hub Corporation", link: "/files/DHC_Certificate.pdf" },
]);

// Years are blank on purpose.
const education = ordered([
  { title: "BS Computer Science (AI)", school: "BIMS, affiliated with PMAS Arid Agriculture University" },
  { title: "Intermediate, Computer Science", school: "Islamabad Career College, Bharakahu" },
]);

const journey = ordered([
  { label: "Bara Kahu", heading: "Computer Science at intermediate level", description: "Where I first learned to code, near Islamabad." },
  { label: "BS Computer Science (AI)", heading: "BIMS, PMAS Arid Agriculture University", description: "Programming, databases and machine learning." },
  { label: "Four internships", heading: "Web development and AI", description: "Developers Hub, FlyRank AI, Arch Technologies and Alkhidmat Foundation." },
  { label: "July 2026", heading: "Microsoft Azure AI Fundamentals", description: "AI-900 certified." },
  { label: "Now", heading: "Building products and taking clients", description: "An LMS, a Quran video app and this portfolio." },
]);

await connectDB();

const targets = [
  [Project, projects],
  [Service, services],
  [Internship, internships],
  [Certificate, certificates],
  [Education, education],
  [Journey, journey],
  [Profile, [profile]],
] as const;

for (const [model, docs] of targets) {
  await model.deleteMany({});
  await model.insertMany(docs);
  console.log(`${model.modelName}: ${docs.length}`);
}

await mongoose.disconnect();
