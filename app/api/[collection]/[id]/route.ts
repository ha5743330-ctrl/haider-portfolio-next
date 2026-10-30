import { deleteItem, updateItem } from "@/lib/admin";

type Ctx = { params: Promise<{ collection: string; id: string }> };

// Admin: update / delete one item (also used for messages)
export async function PUT(req: Request, { params }: Ctx) {
  const { collection, id } = await params;
  return updateItem(collection, id, req);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { collection, id } = await params;
  return deleteItem(collection, id);
}
