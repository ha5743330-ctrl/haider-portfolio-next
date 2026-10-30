import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Plain strings default to "" so the admin can leave fields blank.
const str = { type: String, default: "", trim: true };
const order = { type: Number, default: 0 };
const opts = { versionKey: false } as const;

const make = <T>(name: string, schema: mongoose.Schema<T>) =>
  (models[name] as mongoose.Model<T>) ?? model<T>(name, schema);

export const Project = make(
  "Project",
  new Schema(
    {
      title: { ...str, required: true },
      category: str,
      description: str,
      tags: { type: [String], default: [] },
      link: str,
      image: { type: String, default: "" }, // base64 JPEG data URL
      status: { type: String, enum: ["draft", "published"], default: "draft" },
      order,
    },
    opts,
  ),
);

export const Service = make(
  "Service",
  new Schema({ title: { ...str, required: true }, description: str, order }, opts),
);

export const Internship = make(
  "Internship",
  new Schema(
    {
      company: { ...str, required: true },
      role: str,
      period: str,
      status: { type: String, enum: ["In progress", "Completed"], default: "In progress" },
      description: str,
      order,
    },
    opts,
  ),
);

export const Certificate = make(
  "Certificate",
  new Schema(
    { title: { ...str, required: true }, issuer: str, date: str, link: str, image: str, order },
    opts,
  ),
);

export const Education = make(
  "Education",
  new Schema({ title: { ...str, required: true }, school: str, period: str, description: str, order }, opts),
);

export const Journey = make(
  "Journey",
  new Schema({ label: { ...str, required: true }, heading: str, description: str, order }, opts),
);

export const Message = make(
  "Message",
  new Schema(
    {
      name: { ...str, required: true },
      email: { ...str, required: true },
      type: str,
      text: { ...str, required: true },
      read: { type: Boolean, default: false },
      replied: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
    opts,
  ),
);

export const Profile = make(
  "Profile",
  new Schema(
    {
      photo: str, // base64 JPEG data URL
      heroTitle: str,
      heroIntro: str,
      aboutText: str,
      contactIntro: str,
      footerText: str,
      headline: str,
      email: str,
      phone: str,
      github: str,
      linkedin: str,
      youtube: str,
      cvLink: str,
      open: { type: Boolean, default: true }, // "Taking new projects"
      githubUsername: { ...str, default: "ha5743330-ctrl" },
      projectsLimit: { type: Number, min: 2, max: 6, default: 4 },
      githubFill: { type: Boolean, default: true },
    },
    opts,
  ),
);
