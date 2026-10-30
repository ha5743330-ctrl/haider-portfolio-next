"use client";

import { useEffect, useRef } from "react";

// Cursor glow plus 3D tilt on project cards. Skipped for reduced motion.
export default function PointerFx() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const move = (e: PointerEvent) => {
      glow.current!.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      const card = (e.target as Element).closest<HTMLElement>(".proj");
      document.querySelectorAll<HTMLElement>(".proj .shot").forEach((s) => {
        if (s.parentElement !== card) s.style.transform = "";
      });
      const shot = card?.querySelector<HTMLElement>(".shot");
      if (!card || !shot) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      shot.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, []);

  return <div ref={glow} className="glow" aria-hidden="true" />;
}
