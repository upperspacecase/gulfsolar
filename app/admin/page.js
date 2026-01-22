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
  const [form, setForm] = useState(defaultSettings);
  const [status, setStatus] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNumber = (field, value) => {
    const parsed = Number(value);
    updateField(field, Number.isNaN(parsed) ? 0 : parsed);
  };

  const updateAssumptions = (value) => {
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    updateField("assumptions", lines);
  };

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
    setForm(data.settings);
    setStatus("Settings loaded.");
  };

  const saveSettings = async () => {
    setStatus("Saving...");
    const res = await fetch("/api/calculator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setStatus("Save failed. Check password.");
      return;
    }

    setStatus("Saved.");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!password.trim()) {
      setStatus("Enter a password.");
      return;
    }
    setStatus("Checking password...");
    const res = await fetch("/api/calculator", {
      headers: {
        Authorization: `Bearer ${password}`,
      },
    });
    if (!res.ok) {
      setStatus("Incorrect password.");
      return;
    }
    const data = await res.json();
    setForm(data.settings);
    setIsAuthed(true);
    setStatus("");
  };

  return (
    <div className="min-h-screen bg-[url('/hcrop1450x1208@stretch@crop2@2x.png')] bg-cover bg-center px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-5xl rounded-[32px] bg-white/95 p-8 text-slate-900 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Gulf Solar Admin</h1>
            <p className="mt-2 text-sm text-slate-500">
              Update calculator inputs (password required).
            </p>
          </div>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-slate-700">
            Settings
          </span>
        </div>

        {!isAuthed ? (
          <form
            onSubmit={handleLogin}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <label className="form-control w-full sm:max-w-xs">
              <span className="label-text text-sm font-medium">
                Enter password
              </span>
              <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin password"
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </form>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="btn btn-outline" onClick={fetchSettings}>
                Reload
              </button>
              <button className="btn btn-primary" onClick={saveSettings}>
                Save changes
              </button>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <label className="form-control">
                <span className="label-text text-sm font-medium">Currency</span>
                <input
                  type="text"
                  className="input input-bordered"
                  value={form.currency}
                  onChange={(event) => updateField("currency", event.target.value)}
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">Region label</span>
                <input
                  type="text"
                  className="input input-bordered"
                  value={form.regionLabel}
                  onChange={(event) =>
                    updateField("regionLabel", event.target.value)
                  }
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  Rate per kWh
                </span>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered"
                  value={form.ratePerKwh}
                  onChange={(event) => updateNumber("ratePerKwh", event.target.value)}
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  Daily sun hours
                </span>
                <input
                  type="number"
                  step="0.1"
                  className="input input-bordered"
                  value={form.dailySunHours}
                  onChange={(event) =>
                    updateNumber("dailySunHours", event.target.value)
                  }
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  System efficiency
                </span>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered"
                  value={form.systemEfficiency}
                  onChange={(event) =>
                    updateNumber("systemEfficiency", event.target.value)
                  }
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  Coverage target
                </span>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered"
                  value={form.coverageTarget}
                  onChange={(event) =>
                    updateNumber("coverageTarget", event.target.value)
                  }
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  Cost per kW
                </span>
                <input
                  type="number"
                  step="10"
                  className="input input-bordered"
                  value={form.systemCostPerKw}
                  onChange={(event) =>
                    updateNumber("systemCostPerKw", event.target.value)
                  }
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  Savings multiplier
                </span>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered"
                  value={form.savingsMultiplier}
                  onChange={(event) =>
                    updateNumber("savingsMultiplier", event.target.value)
                  }
                />
              </label>
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  Range buffer
                </span>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered"
                  value={form.rangeBuffer}
                  onChange={(event) =>
                    updateNumber("rangeBuffer", event.target.value)
                  }
                />
              </label>
            </div>
            <div className="mt-6">
              <label className="form-control">
                <span className="label-text text-sm font-medium">
                  Assumptions (one per line)
                </span>
                <textarea
                  className="textarea textarea-bordered mt-2 min-h-[160px] text-sm"
                  value={form.assumptions.join("\n")}
                  onChange={(event) => updateAssumptions(event.target.value)}
                />
              </label>
            </div>
          </>
        )}

        {status ? (
          <p className="mt-4 text-sm text-slate-600">{status}</p>
        ) : null}
      </div>
    </div>
  );
}
