"use client";

import { useState } from "react";

const defaultSettings = {
  currency: "NZD",
  regionLabel: "Waiheke Island & Hauraki Gulf",
  ratePerKwh: 0.34,
  dailySunHours: 4.2,
  systemEfficiency: 0.82,
  coverageTarget: 0.85,
  systemCostPerKw: 2400,
  savingsMultiplier: 0.92,
  rangeBuffer: 0.15,
  assumptions: [
    "Based on typical Waiheke solar yield and local rates",
    "Assumes north-facing roof or equivalent output",
    "Ranges shown for clarity, not guaranteed savings",
  ],
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [jsonText, setJsonText] = useState(
    JSON.stringify(defaultSettings, null, 2)
  );
  const [status, setStatus] = useState("");

  const fetchSettings = async () => {
    setStatus("Loading settings...");
    const res = await fetch("/api/calculator", {
      headers: {
        Authorization: `Bearer ${password}`,
      },
    });

    if (!res.ok) {
      setStatus("Unauthorized or settings not found.");
      return;
    }

    const data = await res.json();
    setJsonText(JSON.stringify(data.settings, null, 2));
    setStatus("Settings loaded.");
  };

  const saveSettings = async () => {
    setStatus("Saving...");
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      setStatus("Invalid JSON. Fix formatting before saving.");
      return;
    }

    const res = await fetch("/api/calculator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(parsed),
    });

    if (!res.ok) {
      setStatus("Save failed. Check password.");
      return;
    }

    setStatus("Saved.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white/95 p-8 text-slate-900 shadow-soft">
        <h1 className="text-3xl font-semibold">Gulf Solar Admin</h1>
        <p className="mt-2 text-sm text-slate-500">
          Edit calculator settings (password required).
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="form-control w-full sm:max-w-xs">
            <span className="label-text text-sm font-medium">Admin Password</span>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
            />
          </label>
          <div className="flex gap-3">
            <button className="btn btn-outline" onClick={fetchSettings}>
              Load
            </button>
            <button className="btn btn-primary" onClick={saveSettings}>
              Save
            </button>
          </div>
        </div>

        <div className="mt-6">
          <label className="form-control">
            <span className="label-text text-sm font-medium">Settings JSON</span>
            <textarea
              className="textarea textarea-bordered mt-2 min-h-[320px] font-mono text-xs"
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
            />
          </label>
        </div>

        {status ? (
          <p className="mt-4 text-sm text-slate-600">{status}</p>
        ) : null}
      </div>
    </div>
  );
}
