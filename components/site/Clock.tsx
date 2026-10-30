"use client";

import { useEffect, useState } from "react";

const time = () =>
  new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit" });

export default function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => setT(time());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return <span>{t ? `Islamabad ${t}` : "Islamabad"}</span>;
}
