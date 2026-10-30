"use client";

import { useEffect, useState } from "react";
import { api, type Item } from "./api";

const s = (v: unknown) => (typeof v === "string" ? v : "");
const when = (v: unknown) => new Date(s(v)).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

type Props = { initialOpen: string | null; notify: (t: string) => void; onChange: () => void };

export default function Messages({ initialOpen, notify, onChange }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [open, setOpen] = useState<string | null>(initialOpen);

  const [tick, setTick] = useState(0);
  const load = () => setTick((t) => t + 1);

  async function patch(m: Item, body: Record<string, boolean>) {
    const r = await api("PUT", `/api/messages/${m._id}`, body);
    load();
    onChange();
    return r;
  }

  // Refetch on open/changes; opening a message marks it read.
  useEffect(() => {
    api<Item[]>("GET", "/api/messages").then((r) => {
      if (!r.ok) return;
      setItems(r.data);
      const m = r.data.find((x) => x._id === open);
      if (m && !m.read) patch(m, { read: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- patch only touches state and onChange
  }, [open, tick]);

  async function remove(m: Item) {
    if (!confirm(`Delete the message from ${s(m.name)}?`)) return;
    const r = await api("DELETE", `/api/messages/${m._id}`);
    notify(r.ok ? "Deleted" : r.message);
    setOpen(null);
    load();
    onChange();
  }

  if (items === null) return <p className="empty">Loading…</p>;
  const m = items.find((x) => x._id === open);

  if (m) {
    return (
      <>
        <div className="top"><h2>{s(m.name)}</h2><button className="btn g s" onClick={() => setOpen(null)}>Back</button></div>
        <p className="meta">{s(m.email)} · {s(m.type)} · {when(m.createdAt)}</p>
        <div className="msgbody">{s(m.text)}</div>
        <div className="acts wrap">
          <a className="btn" href={`mailto:${s(m.email)}?subject=${encodeURIComponent(`Re: ${s(m.type) || "your message"}`)}`}
            onClick={() => patch(m, { replied: true, read: true })}>Reply by email</a>
          <button className="btn g" onClick={() => patch(m, { replied: true, read: true }).then(() => notify("Marked as replied"))}>Mark as replied</button>
          <button className="btn d" onClick={() => remove(m)}>Delete</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="top"><h2>Messages</h2></div>
      {items.length === 0 ? <div className="empty">No messages yet. Contact form messages will appear here.</div> : items.map((x) => (
        <div className={`row ${x.read ? "" : "unread"}`} key={x._id}>
          <div>
            <h3>{s(x.name)}</h3>
            <p><span className={`tag ${x.replied ? "rep" : x.read ? "" : "new"}`}>{x.replied ? "Replied" : x.read ? "Read" : "New"}</span>{s(x.type)} · {when(x.createdAt)}</p>
          </div>
          <button className="btn g s" onClick={() => setOpen(x._id)}>Open</button>
        </div>
      ))}
    </>
  );
}
