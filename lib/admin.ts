import { isValidObjectId } from "mongoose";
import type { ZodType } from "zod";
import { collections } from "./collections";
import { connectDB } from "./mongodb";
import { Profile } from "./models";
import { profileSchema } from "./schemas";

// Every admin write goes through here. Step 4 protects non-GET /api/* in middleware,
// so these stay auth-free. (If middleware is ever skipped, add the session check here.)

const fail = (error: string, status: number, extra?: object) =>
  Response.json({ error, ...extra }, { status });

export async function parseBody<T>(req: Request, schema: ZodType<T>) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return { response: fail("Invalid JSON", 400) };
  }
  const result = schema.safeParse(json);
  if (!result.success) return { response: fail("Invalid data", 400, { issues: result.error.issues }) };
  return { data: result.data };
}

function find(name: string, id?: string) {
  const entry = collections[name];
  if (!entry) return { response: fail("Not found", 404) };
  if (id !== undefined && !isValidObjectId(id)) return { response: fail("Invalid id", 400) };
  return { entry };
}

export async function createItem(name: string, req: Request) {
  const found = find(name);
  if (!found.entry) return found.response;
  const { model, schema } = found.entry;

  const body = await parseBody(req, schema);
  if (!body.data) return body.response;

  await connectDB();
  const data: Record<string, unknown> = { ...body.data };
  if (data.order === undefined && model.schema.path("order")) {
    const last = await model.findOne().sort({ order: -1 }).select("order").lean();
    data.order = (last?.order ?? -1) + 1;
  }
  return Response.json(await model.create(data), { status: 201 });
}

export async function updateItem(name: string, id: string, req: Request) {
  const found = find(name, id);
  if (!found.entry) return found.response;
  const { model, schema } = found.entry;

  const body = await parseBody(req, schema.partial());
  if (!body.data) return body.response;

  await connectDB();
  const doc = await model.findByIdAndUpdate(id, { $set: body.data }, { returnDocument: "after", runValidators: true });
  return doc ? Response.json(doc) : fail("Not found", 404);
}

export async function deleteItem(name: string, id: string) {
  const found = find(name, id);
  if (!found.entry) return found.response;

  await connectDB();
  const doc = await found.entry.model.findByIdAndDelete(id);
  return doc ? Response.json({ ok: true }) : fail("Not found", 404);
}

export async function updateProfile(req: Request) {
  const body = await parseBody(req, profileSchema.partial());
  if (!body.data) return body.response;

  await connectDB();
  const doc = await Profile.findOneAndUpdate({}, { $set: body.data }, { upsert: true, returnDocument: "after", runValidators: true });
  return Response.json(doc);
}
