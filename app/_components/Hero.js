"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Estimate", href: "#estimate" },
  { label: "Contact", href: "#contact" },
];

export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-stone/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <a href="#" className="flex items-center flex-shrink-0">
            <Image
              src="/Add a heading.png"
              alt="Gulf Solar"
              width={220}
              height={46}
              className="h-9 w-auto"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-stone-muted transition-colors hover:text-stone"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="tel:+6421123456"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-stone hover:text-terracotta transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0800 SOLAR
            </a>
            <a
              href="#contact"
              className="hidden sm:inline-block rounded-full border border-stone px-6 py-2.5 text-sm font-medium text-stone transition-all hover:bg-stone hover:text-cream"
            >
              Get in Touch
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col items-center justify-center gap-1.5 lg:hidden p-2"
              aria-label="Toggle mobile menu"
            >
              <span className={`block h-0.5 w-6 bg-stone transition-all duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-stone transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-stone transition-all duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-stone/10 bg-cream overflow-hidden"
            >
              <nav className="flex flex-col px-6 py-6 gap-4">
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-stone/80 hover:text-terracotta transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-full border border-stone px-6 py-3 text-center font-medium text-stone hover:bg-stone hover:text-cream transition-colors"
                >
                  Get in Touch
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-20">
        <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
          <Image
            src="/hero-aerial-gulf.png"
            alt="Aerial view of Waiheke Island and the Hauraki Gulf"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone/70 via-stone/30 to-transparent" />

          <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/70 mb-5">
                  Hauraki Gulf Solar Specialists
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.15] mb-6">
                  Solar energy for island life.
                </h1>
                <p className="text-cream/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
                  Premium solar installations for homes and businesses across
                  Waiheke Island, Great Barrier, and the Hauraki Gulf.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contact"
                    className="rounded-full bg-terracotta px-8 py-4 text-center font-medium text-cream transition-all hover:bg-terracotta-dark text-lg"
                  >
                    Get in Touch
                  </a>
                  <a
                    href="tel:+6421123456"
                    className="rounded-full border border-cream/40 px-8 py-4 text-center font-medium text-cream transition-colors hover:bg-cream/10"
                  >
                    Call 0800 SOLAR
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
