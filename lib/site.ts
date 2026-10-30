import { connection } from "next/server";
import { connectDB } from "./mongodb";
import { Certificate, Education, Internship, Journey, Profile, Project, Service } from "./models";
import { getProjects } from "./projects";

// Everything the public page shows, read fresh on every request (admin edits appear on refresh).
export async function getSite() {
  await connection();
  await connectDB();
  const profile = await Profile.findOne().lean();
  const by = { order: 1, _id: 1 } as const;
  const [projects, journey, services, internships, education, certificates, published] = await Promise.all([
    getProjects(profile),
    Journey.find().sort(by).lean(),
    Service.find().sort(by).lean(),
    Internship.find().sort(by).lean(),
    Education.find().sort(by).lean(),
    Certificate.find().sort(by).lean(),
    Project.countDocuments({ status: "published" }),
  ]);
  const counts = { internships: internships.length, certificates: certificates.length, projects: published };
  return { profile, projects, journey, services, internships, education, certificates, counts };
}
