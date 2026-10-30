"use client";

import { useState } from "react";
import { missions } from "./content";

export default function ContactForm() {
  const [state, setState] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget, f = new FormData(form);
    setBusy(true);
    setState(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: f.get("n"), email: f.get("e"), type: f.get("t"), text: f.get("m") }),
      });
      if (res.ok) {
        form.reset();
        setState({ ok: true, text: "Thanks! Your message is sent. I’ll reply by email." });
      } else {
        const { error } = await res.json().catch(() => ({ error: "" }));
        const text = res.status === 400 ? "Please check your details and try again." : error || "Something went wrong. Please try again.";
        setState({ ok: false, text });
      }
    } catch {
      setState({ ok: false, text: "Network error. Please try again." });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit}>
      <label>Your name<input name="n" required maxLength={100} autoComplete="name" /></label>
      <label>Email<input name="e" type="email" required maxLength={200} autoComplete="email" /></label>
      <label>
        Project type
        <select name="t" id="ptype">
          {missions.map((m) => (
            <option key={m[0]}>{m[0]}</option>
          ))}
        </select>
      </label>
      <label>Details<textarea name="m" required maxLength={5000} /></label>
      <button className="btn" type="submit" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
      <p role={state?.ok === false ? "alert" : "status"} style={{ fontSize: 14, color: state?.ok === false ? "#f87171" : undefined }}>
        {state?.text}
      </p>
    </form>
  );
}
