"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  SUN_INTENSITY_DEFAULT,
  SUN_INTENSITY_EVENT,
  SUN_INTENSITY_MAX,
  SUN_INTENSITY_MIN,
  SUN_INTENSITY_STORAGE_KEY,
  sanitizeSunIntensity,
} from "./sunControls";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Estimator", href: "#estimate" },
  { label: "Coverage", href: "#coverage" },
  { label: "Contact", href: "#contact" },
];

const heroMedia = {
  main: "/Statics/DSC00174.JPG",
  secondary: "/Statics/DSC00207.JPG",
};

export default function Hero() {
  const containerRef = useRef(null);
  const [sunIntensity, setSunIntensity] = useState(() => {
    if (typeof window === "undefined") return SUN_INTENSITY_DEFAULT;
    const saved = window.localStorage.getItem(SUN_INTENSITY_STORAGE_KEY);
    return sanitizeSunIntensity(saved ?? SUN_INTENSITY_DEFAULT);
  });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, -90]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SUN_INTENSITY_STORAGE_KEY, String(sunIntensity));
    window.dispatchEvent(
      new CustomEvent(SUN_INTENSITY_EVENT, { detail: { value: sunIntensity } }),
    );
  }, [sunIntensity]);

  const handleSunIntensityChange = (event) => {
    const nextValue = sanitizeSunIntensity(event.target.value);
    setSunIntensity(nextValue);

    if (typeof window === "undefined") return;
    window.localStorage.setItem(SUN_INTENSITY_STORAGE_KEY, String(nextValue));
    window.dispatchEvent(
      new CustomEvent(SUN_INTENSITY_EVENT, { detail: { value: nextValue } }),
    );
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full pb-20 pt-32 md:pt-36">
      <div className="fixed left-1/2 top-4 z-40 w-[calc(100%-1.5rem)] max-w-7xl -translate-x-1/2">
        <div className="section-shell flex items-center justify-between rounded-2xl px-4 py-3 md:px-6 md:py-4">
          <a href="#" className="flex items-center">
            <Image
              src="/Add a heading.png"
              alt="Gulf Solar"
              width={220}
              height={46}
              className="h-7 w-auto md:h-8"
              priority
            />
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-white/85 transition-colors hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 rounded-lg border border-white/20 bg-black/25 px-3 py-2 lg:flex">
            <label
              htmlFor="sun-brightness"
              className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80"
            >
              Sun
            </label>
            <input
              id="sun-brightness"
              type="range"
              min={SUN_INTENSITY_MIN}
              max={SUN_INTENSITY_MAX}
              step="0.01"
              value={sunIntensity}
              onChange={handleSunIntensityChange}
              className="h-1 w-28 cursor-pointer accent-gold"
              aria-label="Sun brightness"
            />
            <span className="w-10 text-right text-xs font-semibold text-white/85">
              {Math.round(sunIntensity * 100)}%
            </span>
          </div>

          <a
            href="#estimate"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
          >
            Free Assessment
          </a>
        </div>
      </div>

      <motion.div
        className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Enterprise Solar For Coastal Conditions
          </p>
          <h1 className="section-heading text-4xl font-bold leading-[1.05] md:text-6xl xl:text-7xl">
            Energy Infrastructure
            <br />
            <span className="text-gold">Engineered for Island Life.</span>
          </h1>
          <p className="section-copy mt-7 max-w-2xl text-lg md:text-xl">
            We design and install high-performance solar systems for homes, lodges,
            farms, and island businesses across the Hauraki Gulf.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#estimate"
              className="rounded-lg bg-gold px-8 py-4 text-center font-semibold text-navy shadow-lg transition-colors hover:bg-gold-light"
            >
              Start Your Project
            </a>
            <a
              href="#services"
              className="section-shell rounded-lg px-8 py-4 text-center font-semibold text-white transition-colors hover:text-gold"
            >
              Explore Solutions
            </a>
          </div>
        </div>

        <div className="section-shell rounded-3xl p-6 md:p-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/20">
            <Image
              src={heroMedia.main}
              alt="Close-up of premium solar panel surface"
              width={6000}
              height={3376}
              className="h-52 w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Field Quality • Real Install
            </p>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">Why Gulf Solar</p>
          <h2 className="section-heading mt-4 text-2xl font-bold md:text-3xl">
            Strategic, resilient systems
          </h2>
          <p className="section-copy mt-4 text-base">
            Built for salt spray, high winds, transport constraints, and long-term reliability.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["12+", "Islands Served"],
              ["8", "Years Gulf Experience"],
              ["24h", "Initial Response"],
              ["75%", "Typical Bill Reduction"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/20 bg-white/8 p-4">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="mt-1 text-sm text-white/75">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-gold/40 bg-gold/12 p-4">
            <p className="text-sm text-white/90">
              &ldquo;One project lead. One logistics plan. One performance target.&rdquo;
            </p>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-xl border border-white/20">
            <Image
              src={heroMedia.secondary}
              alt="Installer positioning rail system on a roof"
              width={6000}
              height={3376}
              className="h-28 w-full object-cover object-[center_42%]"
            />
            <div className="absolute inset-0 bg-navy/25" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
