"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }),
      });
      if (res.ok) return router.push("/admin");
      const { error } = await res.json().catch(() => ({ error: "" }));
      setError(error || "Login failed");
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <form className="box" onSubmit={submit}>
      <h1>Admin login</h1>
      <p>Enter the admin password to manage your site.</p>
      <label>
        Password
        <input type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      <button className="btn" style={{ width: "100%" }} disabled={busy}>
        {busy ? "Checking…" : "Log in"}
      </button>
      <p className="err" role="alert">{error}</p>
    </form>
  );
}
