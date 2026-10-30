import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Site from "@/components/site/Site";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models";
import "./site.css";

const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

// Read per request so admin edits show on refresh (the page body is dynamic too).
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  await connectDB();
  const p = await Profile.findOne().select("heroTitle heroIntro").lean();
  const title = `Haider Ali – ${p?.heroTitle ?? "Full-stack developer"}`;
  const description = p?.heroIntro ?? "";
  return { metadataBase: new URL(BASE), title, description, openGraph: { title, description, type: "website" } };
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Site />
    </Suspense>
  );
}
