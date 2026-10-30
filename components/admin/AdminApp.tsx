"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, type Item } from "./api";
import CrudTab from "./CrudTab";
import Dashboard from "./Dashboard";
import { collections } from "./fields";
import Messages from "./Messages";
import ProfileTab from "./ProfileTab";

const TABS: [string, string][] = [
  ["dash", "Dashboard"], ...Object.entries(collections).map(([k, c]): [string, string] => [k, c.label]),
  ["text", "Site text"], ["messages", "Messages"], ["settings", "Settings"],
];

export default function AdminApp() {
  const [tab, setTab] = useState("dash");
  const [openMsg, setOpenMsg] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [tick, setTick] = useState(0);
  const refreshUnread = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    api<Item[]>("GET", "/api/messages").then((r) => r.ok && setUnread(r.data.filter((m) => !m.read).length));
  }, [tick, tab]); // also refresh on tab switch, so new messages show up

  const notify = (t: string) => {
    setToast(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2200);
  };

  async function logout() {
    await api("POST", "/api/logout");
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload drops admin state
    window.location.href = "/admin/login";
  }

  return (
    <>
      <nav>
        <span className="brand">Portfolio admin</span>
        {TABS.map(([k, label]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => { setTab(k); setOpenMsg(null); }}>
            {label}{k === "messages" && unread > 0 && <span className="n" aria-label={`${unread} unread`}>{unread}</span>}
          </button>
        ))}
        <button className="out" onClick={logout}>Log out</button>
      </nav>
      <main>
        {tab === "dash" ? <Dashboard onOpen={(id) => { setOpenMsg(id); setTab("messages"); }} />
          : collections[tab] ? <CrudTab key={tab} k={tab} notify={notify} />
          : tab === "messages" ? <Messages initialOpen={openMsg} notify={notify} onChange={refreshUnread} />
          : <ProfileTab key={tab} kind={tab as "text" | "settings"} notify={notify} />}
        <button className="btn g logout-m" onClick={logout}>Log out</button>
      </main>
      <div id="toast" className={toast ? "on" : ""} role="status">{toast}</div>
    </>
  );
}
