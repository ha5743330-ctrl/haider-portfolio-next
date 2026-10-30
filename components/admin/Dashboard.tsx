"use client";

import { useEffect, useState } from "react";
import { api, type Item } from "./api";

const s = (v: unknown) => (typeof v === "string" ? v : "");

export default function Dashboard({ onOpen }: { onOpen: (id: string) => void }) {
  const [d, setD] = useState<{ projects: Item[]; services: Item[]; messages: Item[] } | null>(null);

  useEffect(() => {
    Promise.all([api<Item[]>("GET", "/api/projects?all=1"), api<Item[]>("GET", "/api/services"), api<Item[]>("GET", "/api/messages")]).then(
      ([p, sv, m]) => setD({ projects: p.data ?? [], services: sv.data ?? [], messages: m.data ?? [] }),
    );
  }, []);
  if (!d) return <p className="empty">Loading…</p>;

  const stats = [
    [d.projects.length, "Projects"],
    [d.projects.filter((p) => p.status === "published").length, "Published"],
    [d.services.length, "Services"],
    [d.messages.filter((m) => !m.read).length, "New messages"],
  ];

  return (
    <>
      <div className="top"><h2>Welcome back, Haider</h2></div>
      <div className="cards">
        {stats.map(([n, label]) => <div className="stat" key={label}><b>{n}</b><span>{label}</span></div>)}
      </div>
      <h3 style={{ fontSize: 18, marginBottom: 12 }}>Latest messages</h3>
      {d.messages.length === 0 ? <div className="empty">No messages yet.</div> : d.messages.slice(0, 3).map((m) => (
        <div className={`row ${m.read ? "" : "unread"}`} key={m._id}>
          <div><h3>{s(m.name)}</h3><p>{s(m.text).slice(0, 70)}…</p></div>
          <button className="btn g s" onClick={() => onOpen(m._id)}>Open</button>
        </div>
      ))}
    </>
  );
}
