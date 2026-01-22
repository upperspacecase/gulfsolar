"use client";

import { useEffect, useMemo, useState } from "react";

const hasPrefix = (value) => value.startsWith("$") || value.startsWith("+");

const parseValue = (value) => {
  const normalized = value.replace(/[^0-9.]/g, "");
  return Number.parseFloat(normalized || "0");
};

const suffixFor = (value) => {
  const trimmed = value.replace(/^[+$]/, "");
  if (trimmed.includes("M")) {
    return "M";
  }
  if (trimmed.includes("K")) {
    return "K";
  }
  if (trimmed.includes("%")) {
    return "%";
  }
  return "";
};

const prefixFor = (value) => {
  if (value.startsWith("$")) return "$";
  if (value.startsWith("+")) return "+";
  return "";
};

const formatValue = (value, original) => {
  const prefix = prefixFor(original);
  const suffix = suffixFor(original);
  const decimals = suffix === "M" ? 1 : 0;
  const formatted = value.toFixed(decimals);
  return `${prefix}${formatted}${suffix}`;
};

export default function StatCounter({ value }) {
  const target = useMemo(() => parseValue(value), [value]);
  const prefix = useMemo(() => prefixFor(value), [value]);
  const suffix = useMemo(() => suffixFor(value), [value]);
  const decimals = suffix === "M" ? 1 : 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 900;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = target * progress;
      setDisplay(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [target]);

  const formatted = `${prefix}${display.toFixed(decimals)}${suffix}`;

  return formatted;
}
