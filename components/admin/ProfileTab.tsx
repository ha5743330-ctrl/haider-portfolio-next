"use client";

import { useEffect, useState } from "react";
import { api, type Errors, type Item } from "./api";
import { settingsFields, textFields, type Field } from "./fields";
import { FormFields, initial, toBody, type Values } from "./FormFields";
import ImageField from "./ImageField";

type Props = { kind: "text" | "settings"; notify: (t: string) => void };

export default function ProfileTab({ kind, notify }: Props) {
  const [profile, setProfile] = useState<Item | null>(null);
  useEffect(() => {
    api<Item>("GET", "/api/profile").then((r) => r.ok && setProfile(r.data));
  }, []);
  if (!profile) return <p className="empty">Loading…</p>;
  return kind === "text" ? (
    <>
      <div className="top"><h2>Site text</h2></div>
      <ProfileForm profile={profile} fields={textFields} label="Save text" notify={notify} />
    </>
  ) : (
    <Settings profile={profile} notify={notify} />
  );
}

function Settings({ profile, notify }: { profile: Item; notify: (t: string) => void }) {
  const [p, setP] = useState(profile);

  // Switches and the photo save as soon as they change.
  async function save(patch: Record<string, unknown>) {
    const r = await api<Item>("PUT", "/api/profile", patch);
    if (r.ok) setP(r.data);
    notify(r.ok ? "Saved" : r.message);
  }

  const Switch = ({ name, title, hint }: { name: string; title: string; hint: string }) => (
    <div className="sw">
      <div><b>{title}</b><p>{hint}</p></div>
      <button className={`btn ${p[name] ? "" : "g"}`} aria-pressed={Boolean(p[name])} onClick={() => save({ [name]: !p[name] })}>
        {p[name] ? "On" : "Off"}
      </button>
    </div>
  );

  return (
    <>
      <div className="top"><h2>Settings</h2></div>
      {Switch({ name: "open", title: "Taking new projects", hint: "Shows the green badge on your site." })}
      {Switch({ name: "githubFill", title: "Fill projects from GitHub", hint: "Adds your latest public repos after your published projects." })}
      <div className="sw col">
        <div><b>Profile photo</b><p>Shown in the About section with a scroll effect.</p></div>
        <ImageField value={String(p.photo ?? "")} onChange={(photo) => save({ photo })} />
      </div>
      <ProfileForm profile={p} fields={settingsFields} label="Save settings" notify={notify} />
    </>
  );
}

function ProfileForm({ profile, fields, label, notify }: { profile: Item; fields: Field[]; label: string; notify: (t: string) => void }) {
  const [values, setValues] = useState<Values>(() => initial(fields, profile));
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api("PUT", "/api/profile", toBody(fields, values));
    setBusy(false);
    setErrors(r.ok ? {} : Object.keys(r.errors).length ? r.errors : { _: r.message });
    if (r.ok) notify("Saved");
  }

  return (
    <form onSubmit={submit}>
      <FormFields fields={fields} values={values} errors={errors} set={(n, v) => setValues((s) => ({ ...s, [n]: v }))} />
      {errors._ && <p className="err" role="alert">{errors._}</p>}
      <button className="btn" disabled={busy}>{busy ? "Saving…" : label}</button>
    </form>
  );
}
