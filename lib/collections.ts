import type { Model } from "mongoose";
import type { ZodObject } from "zod";
import { Certificate, Education, Internship, Journey, Message, Project, Service } from "./models";
import {
  certificateSchema,
  educationSchema,
  internshipSchema,
  journeySchema,
  messageSchema,
  projectSchema,
  serviceSchema,
} from "./schemas";

type Entry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- one registry for different models
  model: Model<any>;
  schema: ZodObject;
  publicFilter?: Record<string, unknown>; // what anonymous GET may see
};

export const collections: Record<string, Entry> = {
  projects: { model: Project, schema: projectSchema, publicFilter: { status: "published" } },
  services: { model: Service, schema: serviceSchema },
  internships: { model: Internship, schema: internshipSchema },
  certificates: { model: Certificate, schema: certificateSchema },
  education: { model: Education, schema: educationSchema },
  journey: { model: Journey, schema: journeySchema },
  // Only PUT/DELETE by id go through the generic routes; list/POST live in app/api/messages.
  messages: { model: Message, schema: messageSchema },
};
