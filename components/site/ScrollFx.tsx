"use client";

import { useEffect } from "react";
import { stageColors } from "./content";

const cl = (v: number) => Math.max(0, Math.min(1, v));
const $ = (id: string) => document.getElementById(id)!;
const all = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];

// Every scroll-driven effect from the design, driven by one rAF-throttled handler.
export default function ScrollFx() {
  useEffect(() => {
    const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const story = $("story"), split = $("split"), hs = $("hs"), track = $("track");
    const about = $("about"), tl = $("tl"), me = $("me"), bar = document.querySelector<HTMLElement>("#prog i")!;
    const stages = all(".stage"), dots = all("#sdots span"), words = all("#rv span"), tdots = all("#tl div");
    let cur = -1, ticking = false;

    const prog = (el: HTMLElement) => cl(-el.getBoundingClientRect().top / (el.offsetHeight - innerHeight));
    const reach = () => Math.max(0, track.scrollWidth - innerWidth);
    const size = () => { if (!RM) hs.style.height = innerHeight + reach() + "px"; };

    function update() {
      ticking = false;
      const d = document.documentElement, p = cl(scrollY / (d.scrollHeight - innerHeight));
      bar.style.width = p * 100 + "%";
      $("pct").textContent = Math.round(p * 100) + "%";
      if (RM) return;

      const s = Math.min(3, Math.floor(prog(story) * 4));
      if (s !== cur) {
        cur = s;
        stages.forEach((e, i) => e.classList.toggle("on", i === s));
        dots.forEach((e, i) => e.classList.toggle("on", i === s));
        story.style.background = stageColors[s];
      }
      split.style.setProperty("--p", prog(split).toFixed(3));
      track.style.transform = `translateX(${-prog(hs) * reach()}px)`;

      const ar = about.getBoundingClientRect();
      const nw = Math.round(cl((innerHeight * 0.85 - ar.top) / (innerHeight * 0.9)) * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < nw));

      const tr = tl.getBoundingClientRect(), tp = cl((innerHeight * 0.7 - tr.top) / tr.height);
      tl.style.setProperty("--t", String(tp));
      tdots.forEach((e, i) => e.classList.toggle("on", tp >= i / tdots.length + 0.03));

      me.style.setProperty("--q", cl((innerHeight - me.getBoundingClientRect().top) / (innerHeight * 0.75)).toFixed(3));
    }

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const onResize = () => { size(); update(); };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    size();
    update();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
