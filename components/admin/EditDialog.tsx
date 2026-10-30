"use client";

import { useEffect, useRef, useState } from "react";
import { api, type Errors, type Item } from "./api";
import type { Collection } from "./fields";
import { FormFields, initial, toBody, type Values } from "./FormFields";

type Props = { k: string; c: Collection; item?: Item; onSaved: () => void; onClose: () => void };

export default function EditDialog({ k, c, item, onSaved, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<Values>(() => initial(c.fields, item));
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => ref.current?.showModal(), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api(item ? "PUT" : "POST", `/api/${k}${item ? `/${item._id}` : ""}`, toBody(c.fields, values));
    setBusy(false);
    if (!r.ok) return setErrors(Object.keys(r.errors).length ? r.errors : { _: r.message });
    onSaved();
    ref.current?.close();
  }

  return (
    <dialog ref={ref} onClose={onClose}>
      <form onSubmit={submit}>
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>{item ? "Edit" : "Add"} {c.singular}</h3>
        <FormFields fields={c.fields} values={values} errors={errors} set={(n, v) => setValues((s) => ({ ...s, [n]: v }))} />
        {errors._ && <p className="err" role="alert">{errors._}</p>}
        <div className="acts">
          <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
          <button className="btn g" type="button" onClick={() => ref.current?.close()}>Cancel</button>
        </div>
      </form>
    </dialog>
  );
}
