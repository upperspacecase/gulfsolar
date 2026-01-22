"use client";

import { useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-NZ", {
  maximumFractionDigits: 1,
});

const roofMultipliers = {
  pitched: 1,
  flat: 0.92,
};

export default function Calculator({ settings }) {
  const [monthlyBill, setMonthlyBill] = useState("");
  const [roofType, setRoofType] = useState("pitched");
  const [homeDuringDay, setHomeDuringDay] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const parsedBill = Number(monthlyBill);
  const canEstimate = parsedBill > 0;

  const outputs = useMemo(() => {
    if (!canEstimate) {
      return null;
    }

    const annualBill = parsedBill * 12;
    const annualUsageKwh = annualBill / settings.ratePerKwh;
    const productionPerKw =
      settings.dailySunHours * 365 * settings.systemEfficiency;
    const roofMultiplier = roofMultipliers[roofType] ?? 0.95;
    const targetKwh = annualUsageKwh * settings.coverageTarget;
    const systemSizeKw = (targetKwh / productionPerKw) * roofMultiplier;
    const savingsBase =
      annualUsageKwh *
      settings.ratePerKwh *
      settings.coverageTarget *
      settings.savingsMultiplier;
    const occupancyBoost = homeDuringDay ? 1.05 : 0.95;
    const annualSavings = savingsBase * occupancyBoost;
    const systemCost = systemSizeKw * settings.systemCostPerKw;
    const paybackYears = systemCost / annualSavings;
    const monthlySavings = annualSavings / 12;
    const annualProductionKwh = systemSizeKw * productionPerKw;
    const litersNotBurned = annualProductionKwh / 10;

    const range = settings.rangeBuffer;

    const rangeValue = (value) => [
      value * (1 - range),
      value * (1 + range),
    ];

    return {
      systemSize: rangeValue(systemSizeKw),
      savings: rangeValue(annualSavings),
      payback: rangeValue(paybackYears),
      upfront: rangeValue(systemCost),
      monthlySavings: rangeValue(monthlySavings),
      litersNotBurned: rangeValue(litersNotBurned),
    };
  }, [canEstimate, homeDuringDay, parsedBill, roofType, settings]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (!canEstimate) {
      nextErrors.estimate = "Enter your bill to see your estimate.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    setStatus("Sending your breakdown...");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        inputs: {
          monthlyBill: parsedBill,
          roofType,
          homeDuringDay,
        },
        outputs,
      }),
    });

    if (!res.ok) {
      setStatus("Something went wrong. Please try again.");
      return;
    }

    setStatus("Done! Check your inbox for the full breakdown.");
    setEmail("");
  };

  return (
    <div className="card bg-white/95 text-slate-900 shadow-soft">
      <div className="card-body gap-6">
        <div>
          <h3 className="text-lg font-semibold">Solar estimate calculator</h3>
          <p className="text-sm text-slate-600">
            Takes ~60 seconds. We email your estimate and one follow-up.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="form-control">
            <span className="label-text text-sm font-medium">
              Monthly electricity bill
            </span>
            <div className="input input-bordered flex items-center gap-2">
              <span className="text-slate-400">$</span>
              <input
                type="number"
                min="0"
                className="w-full"
                value={monthlyBill}
                onChange={(event) => setMonthlyBill(event.target.value)}
                placeholder="220"
              />
            </div>
          </label>

          <label className="form-control">
            <span className="label-text text-sm font-medium">
              Roof type (optional)
            </span>
            <select
              className="select select-bordered"
              value={roofType}
              onChange={(event) => setRoofType(event.target.value)}
            >
              <option value="pitched">Pitched</option>
              <option value="flat">Flat</option>
            </select>
          </label>

          <label className="label cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={homeDuringDay}
              onChange={(event) => setHomeDuringDay(event.target.checked)}
            />
            <span className="label-text text-sm">
              Home during the day (optional)
            </span>
          </label>
        </div>

          <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
                Estimated results
            </p>
            <details className="dropdown dropdown-end">
              <summary className="cursor-pointer text-xs text-slate-500 underline">
                assumptions
              </summary>
              <ul className="menu dropdown-content z-[1] w-64 rounded-box bg-white p-3 text-xs shadow">
                {settings.assumptions.map((item) => (
                  <li key={item} className="leading-5 text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {outputs ? (
            <div className="mt-3 grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Upfront system cost</span>
                <span className="font-semibold">
                  {currencyFormatter.format(outputs.upfront[0])}–
                  {currencyFormatter.format(outputs.upfront[1])}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Monthly savings</span>
                <span className="font-semibold text-emerald-600">
                  +{currencyFormatter.format(outputs.monthlySavings[0])}–
                  {currencyFormatter.format(outputs.monthlySavings[1])}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimated payback</span>
                <span className="font-semibold">
                  {numberFormatter.format(outputs.payback[0])}–
                  {numberFormatter.format(outputs.payback[1])} yrs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Liters of oil not burned</span>
                <span className="font-semibold">
                  {numberFormatter.format(outputs.litersNotBurned[0])}–
                  {numberFormatter.format(outputs.litersNotBurned[1])}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Enter your bill to see the ranges.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <label className="form-control">
            <span className="label-text text-sm font-medium">
              Email me the full breakdown
            </span>
            <input
              type="email"
              className="input input-bordered"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
            />
            {errors.email ? (
              <span className="mt-1 text-xs text-error">{errors.email}</span>
            ) : null}
          </label>

          {errors.estimate ? (
            <p className="text-xs text-error">{errors.estimate}</p>
          ) : null}

          <button type="submit" className="btn btn-primary">
            Send my estimate breakdown
          </button>
          <p className="text-xs text-slate-500">
            No spam. We email your estimate and one follow-up.
          </p>
          {status ? (
            <p className="text-xs text-slate-600" aria-live="polite">
              {status}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
