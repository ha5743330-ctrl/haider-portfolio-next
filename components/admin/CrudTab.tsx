"use client";

import { useEffect, useState } from "react";
import { api, type Item } from "./api";
import EditDialog from "./EditDialog";
import { collections } from "./fields";

const text = (v: unknown) => (typeof v === "string" ? v : "");

export default function CrudTab({ k, notify }: { k: string; notify: (t: string) => void }) {
  const c = collections[k];
  const [items, setItems] = useState<Item[] | null>(null);
  const [editing, setEditing] = useState<Item | "new" | null>(null);

  const [tick, setTick] = useState(0);
  const load = () => setTick((t) => t + 1);
  useEffect(() => {
    api<Item[]>("GET", c.list).then((r) => r.ok && setItems(r.data));
  }, [c.list, tick]);

  async function remove(x: Item) {
    if (!confirm(`Delete "${text(x[c.titleKey])}"? This cannot be undone.`)) return;
    const r = await api("DELETE", `/api/${k}/${x._id}`);
    notify(r.ok ? "Deleted" : r.message);
    load();
  }

  // Swap with the neighbour, then renumber so orders always equal list positions.
  async function move(i: number, d: number) {
    const next = [...items!];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    await Promise.all(next.flatMap((x, idx) => (x.order === idx ? [] : [api("PUT", `/api/${k}/${x._id}`, { order: idx })])));
    load();
  }

  async function toggle(x: Item) {
    const r = await api("PUT", `/api/${k}/${x._id}`, { status: x.status === "published" ? "draft" : "published" });
    notify(r.ok ? "Saved" : r.message);
    load();
  }

  return (
    <>
      <div className="top"><h2>{c.label}</h2><button className="btn" onClick={() => setEditing("new")}>+ Add</button></div>
      {items === null ? <p className="empty">Loading…</p> : items.length === 0 ? (
        <div className="empty">Nothing here yet. Tap Add to create the first one.</div>
      ) : items.map((x, i) => (
        <div className="row" key={x._id}>
          <div className="grow">
            {text(x.image) && (
              // base64 data URL: next/image cannot optimise it
              // eslint-disable-next-line @next/next/no-img-element
              <img className="thumb" src={text(x.image)} alt="" />
            )}
            <div>
              <h3>{text(x[c.titleKey])}</h3>
              <p>
                {k === "projects" && <span className={`tag ${x.status === "published" ? "pub" : ""}`}>{x.status === "published" ? "Published" : "Draft"}</span>}
                {k === "internships" && <span className={`tag ${x.status === "Completed" ? "pub" : ""}`}>{text(x.status)}</span>}
                {c.subKeys.map((s) => text(x[s])).find(Boolean)}
              </p>
            </div>
          </div>
          <div className="acts wrap">
            <button className="btn g s" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button className="btn g s" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</button>
            {k === "projects" && <button className="btn g s" onClick={() => toggle(x)}>{x.status === "published" ? "Unpublish" : "Publish"}</button>}
            <button className="btn g s" onClick={() => setEditing(x)}>Edit</button>
            <button className="btn d s" onClick={() => remove(x)}>Delete</button>
          </div>
        </div>
      ))}
      {editing && (
        <EditDialog k={k} c={c} item={editing === "new" ? undefined : editing} onClose={() => setEditing(null)}
          onSaved={() => { notify("Saved"); load(); }} />
      )}
    </>
  );
}
