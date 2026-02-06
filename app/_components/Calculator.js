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
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-navy">Solar Estimate Calculator</h3>
          <p className="text-sm text-gray-600 mt-1">
            Get your personalized estimate in 60 seconds
          </p>
        </div>

        {/* Form inputs */}
        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-navy mb-2">
              Monthly electricity bill
            </span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                min="0"
                className="w-full pl-8 pr-4 py-3 bg-offwhite border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                value={monthlyBill}
                onChange={(event) => setMonthlyBill(event.target.value)}
                placeholder="220"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-navy mb-2">
              Roof type
            </span>
            <select
              className="w-full px-4 py-3 bg-offwhite border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all appearance-none cursor-pointer"
              value={roofType}
              onChange={(event) => setRoofType(event.target.value)}
            >
              <option value="pitched">Pitched roof</option>
              <option value="flat">Flat roof</option>
            </select>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
              checked={homeDuringDay}
              onChange={(event) => setHomeDuringDay(event.target.checked)}
            />
            <span className="text-sm text-gray-600">
              Home during the day (uses more power when sun is shining)
            </span>
          </label>
        </div>

        {/* Results panel */}
        <div className="bg-navy rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold">Estimated Results</p>
            <details className="relative">
              <summary className="cursor-pointer text-xs text-white/60 hover:text-white underline list-none">
                Assumptions
              </summary>
              <ul className="absolute right-0 top-full mt-2 w-64 bg-white text-navy rounded-lg shadow-lg p-4 text-xs space-y-2 z-10">
                {settings.assumptions.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {outputs ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/70">System cost</span>
                <span className="font-semibold">
                  {currencyFormatter.format(outputs.upfront[0])}–
                  {currencyFormatter.format(outputs.upfront[1])}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Monthly savings</span>
                <span className="font-semibold text-gold">
                  +{currencyFormatter.format(outputs.monthlySavings[0])}–
                  {currencyFormatter.format(outputs.monthlySavings[1])}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Payback period</span>
                <span className="font-semibold">
                  {numberFormatter.format(outputs.payback[0])}–
                  {numberFormatter.format(outputs.payback[1])} years
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">CO₂ reduction</span>
                <span className="font-semibold">
                  {numberFormatter.format(outputs.litersNotBurned[0])}–
                  {numberFormatter.format(outputs.litersNotBurned[1])} L/year
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/60">
              Enter your monthly bill above to see your personalized estimate
            </p>
          )}
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-navy mb-2">
              Email for full breakdown
            </span>
            <input
              type="email"
              className="w-full px-4 py-3 bg-offwhite border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
            />
            {errors.email && (
              <span className="mt-1 text-xs text-red-500">{errors.email}</span>
            )}
          </label>

          {errors.estimate && (
            <p className="text-xs text-red-500">{errors.estimate}</p>
          )}

          <button 
            type="submit" 
            className="w-full py-4 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-lg transition-colors duration-200"
          >
            Get My Free Estimate
          </button>

          <p className="text-xs text-gray-500 text-center">
            No spam. We send your estimate and one follow-up email.
          </p>

          {status && (
            <p className="text-sm text-center text-navy font-medium" aria-live="polite">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
