"use client";

import { useState } from "react";
import { missions } from "./content";

export default function Mission() {
  const [i, setI] = useState(0);
  const [title, text, tags] = missions[i];

  // "Choose this" preselects the matching option in the contact form (select#ptype).
  const choose = () => {
    (document.getElementById("ptype") as HTMLSelectElement).value = title;
  };

  return (
    <>
      <div className="tabs" role="tablist">
        {missions.map((m, k) => (
          <button key={m[0]} role="tab" aria-selected={k === i} onClick={() => setI(k)}>
            {m[0]}
          </button>
        ))}
      </div>
      <div className="panel" role="tabpanel" aria-live="polite">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="tags">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <a className="btn" href="#contact" onClick={choose}>
          Choose this
        </a>
      </div>
    </>
  );
}
