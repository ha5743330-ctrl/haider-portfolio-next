"use client";

import type { Errors, Item } from "./api";
import type { Field } from "./fields";
import ImageField from "./ImageField";

export type Values = Record<string, string | boolean>;

export const initial = (fields: Field[], item?: Item): Values =>
  Object.fromEntries(
    fields.map((f) => {
      const v = item?.[f.name];
      if (f.type === "tags") return [f.name, Array.isArray(v) ? v.join(", ") : ""];
      if (f.type === "select") return [f.name, String(v ?? f.options![0][0])];
      return [f.name, v == null ? "" : String(v)];
    }),
  );

// Values -> API body (tags split, numbers parsed, blank numbers left out).
export function toBody(fields: Field[], values: Values) {
  const body: Record<string, unknown> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === "tags") body[f.name] = String(v).split(",").map((t) => t.trim()).filter(Boolean);
    else if (f.type === "number") { if (String(v).trim() !== "") body[f.name] = Number(v); }
    else body[f.name] = v;
  }
  return body;
}

type Props = { fields: Field[]; values: Values; errors: Errors; set: (name: string, v: string) => void };

export function FormFields({ fields, values, errors, set }: Props) {
  return fields.map((f) => {
    const v = String(values[f.name]);
    const on = (e: { target: { value: string } }) => set(f.name, e.target.value);
    const common = { name: f.name, value: v, onChange: on, "aria-invalid": Boolean(errors[f.name]) || undefined };
    return (
      <label key={f.name}>
        {f.label}
        {f.type === "textarea" ? (
          <textarea {...common} />
        ) : f.type === "select" ? (
          <select {...common}>
            {f.options!.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        ) : f.type === "image" ? (
          <ImageField value={v} onChange={(x) => set(f.name, x)} />
        ) : (
          <input {...common} type={f.type === "number" ? "number" : "text"} />
        )}
        {errors[f.name] && <small className="err" role="alert">{errors[f.name]}</small>}
      </label>
    );
  });
}
