"use client";

import { useEffect, useRef } from "react";

// Shows the real number; counts up from 0 once when scrolled into view.
export default function CountUp({ n }: { n: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const f = (t: number) => {
          const k = Math.min(1, (t - t0) / 900);
          el.textContent = String(Math.round(n * k));
          if (k < 1) requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n]);

  return <b ref={ref}>{n}</b>;
}
