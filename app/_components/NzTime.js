"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: "Pacific/Auckland",
  hour: "2-digit",
  minute: "2-digit",
});

export default function NzTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = setInterval(update, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-xs text-white/70">{time} NZT</span>;
}
