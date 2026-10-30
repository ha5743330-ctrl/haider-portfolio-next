"use client";

import { useRef, useState } from "react";

const MAX_SIDE = 1200;
const MAX_BYTES = 400 * 1024;
const PREFIX = "data:image/jpeg;base64,".length;

// Resize in the browser: longest side 1200px, JPEG quality 0.8.
async function shrink(file: File) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff"; // JPEG has no transparency
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.8);
}

export default function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  async function pick(file?: File) {
    if (!file) return;
    setMsg("");
    try {
      const url = await shrink(file);
      const bytes = ((url.length - PREFIX) * 3) / 4;
      if (bytes > MAX_BYTES) setMsg(`Image is ${Math.round(bytes / 1024)} KB after resizing. The limit is 400 KB, please choose a smaller image.`);
      else onChange(url);
    } catch {
      setMsg("That file could not be read as an image.");
    }
    if (input.current) input.current.value = "";
  }

  return (
    <div className="img">
      {value && (
        // base64 data URL: next/image cannot optimise it
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" />
      )}
      <div className="acts">
        <button type="button" className="btn g s" onClick={() => input.current?.click()}>{value ? "Replace" : "Upload"}</button>
        {value && <button type="button" className="btn d s" onClick={() => onChange("")}>Remove</button>}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {msg && <small className="err" role="alert">{msg}</small>}
    </div>
  );
}
