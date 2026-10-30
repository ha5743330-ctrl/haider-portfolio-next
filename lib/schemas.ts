import { z } from "zod";

// One schema per model. Create uses it as-is; update uses .partial() (see lib/admin.ts).
// No .default() here: with .partial() a default would overwrite stored values on update.
// Missing fields on create fall back to the Mongoose defaults.

const text = (max = 2000) => z.string().trim().max(max);
const required = (max = 200) => z.string().trim().min(1).max(max);

const link = text(500).refine(
  (v) => v === "" || v.startsWith("/") || /^https?:\/\/\S+$/.test(v),
  "Must be an http(s) URL or a /path",
);

const MAX_IMAGE_BYTES = 400 * 1024;
const PREFIX = "data:image/jpeg;base64,";
const image = z.string().refine(
  (v) => v === "" || (v.startsWith(PREFIX) && ((v.length - PREFIX.length) * 3) / 4 <= MAX_IMAGE_BYTES),
  "Must be a base64 JPEG data URL under 400 KB",
);

const order = z.number().int().min(0).optional();

export const projectSchema = z.object({
  title: required(),
  category: text(100).optional(),
  description: text().optional(),
  tags: z.array(required(50)).max(20).optional(),
  link: link.optional(),
  image: image.optional(),
  status: z.enum(["draft", "published"]).optional(),
  order,
});

export const serviceSchema = z.object({
  title: required(),
  description: text().optional(),
  order,
});

export const internshipSchema = z.object({
  company: required(),
  role: text(100).optional(),
  period: text(100).optional(),
  status: z.enum(["In progress", "Completed"]).optional(),
  description: text().optional(),
  order,
});

export const certificateSchema = z.object({
  title: required(),
  issuer: text(200).optional(),
  date: text(50).optional(),
  link: link.optional(),
  image: image.optional(),
  order,
});

export const educationSchema = z.object({
  title: required(),
  school: text(200).optional(),
  period: text(100).optional(),
  description: text().optional(),
  order,
});

export const journeySchema = z.object({
  label: required(),
  heading: text(200).optional(),
  description: text().optional(),
  order,
});

// Visitors send only name/email/type/text; read/replied are admin-only (PUT).
export const messageInputSchema = z.object({
  name: required(100),
  email: z.email().max(200),
  type: text(100).optional(),
  text: required(5000),
});
export const messageSchema = messageInputSchema.extend({
  read: z.boolean().optional(),
  replied: z.boolean().optional(),
});

export const profileSchema = z.object({
  photo: image.optional(),
  heroTitle: text().optional(),
  heroIntro: text().optional(),
  aboutText: text().optional(),
  contactIntro: text().optional(),
  footerText: text().optional(),
  headline: text(200).optional(),
  email: text(200).optional(),
  phone: text(50).optional(),
  github: link.optional(),
  linkedin: link.optional(),
  youtube: link.optional(),
  cvLink: link.optional(),
  open: z.boolean().optional(),
  githubUsername: text(100).optional(),
  projectsLimit: z.number().int().min(2).max(6).optional(),
  githubFill: z.boolean().optional(),
});
