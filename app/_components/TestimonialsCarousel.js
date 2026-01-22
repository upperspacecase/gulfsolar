"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export default function TestimonialsCarousel({ items }) {
  const [active, setActive] = useState(0);

  const current = useMemo(() => items[active], [items, active]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        What to expect from the best
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">
        We have a proven track record in delivering custom solar solutions
        across the Gulf.
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
        <div>
          <p className="text-sm text-slate-600">Installation type</p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {current.location}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              className="btn btn-sm btn-outline rounded-full"
              onClick={handlePrev}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className="btn btn-sm btn-primary rounded-full"
              onClick={handleNext}
            >
              →
            </button>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          {current.note} System size {current.size}. Typical result:{" "}
          <span className="font-semibold text-slate-900">{current.result}</span>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl">
        <div className="relative h-72 w-full overflow-hidden rounded-3xl">
          <Image
            src={current.image}
            alt={`${current.location} install`}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.location}
                type="button"
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-2.5 w-2.5 rounded-full ${
                  index === active ? "bg-primary" : "bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
