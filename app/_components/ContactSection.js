"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="contact" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-muted mb-4">
              Contact
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone mb-6 leading-tight">
              Let&apos;s talk solar.
            </h2>
            <p className="text-stone-muted text-lg leading-relaxed mb-10 max-w-md">
              Get in touch for a free, no-obligation consultation. We&apos;ll
              assess your property and design a custom solar solution.
            </p>

            {/* Contact details */}
            <div className="space-y-6 border-t border-stone/10 pt-8">
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-terracotta flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-xs text-stone-muted uppercase tracking-wide">Phone</p>
                  <a href="tel:+6421123456" className="text-stone font-medium hover:text-terracotta transition-colors">
                    0800 SOLAR (0800 765 27)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-terracotta flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <div>
                  <p className="text-xs text-stone-muted uppercase tracking-wide">Email</p>
                  <a href="mailto:info@gulfsolar.co.nz" className="text-stone font-medium hover:text-terracotta transition-colors">
                    info@gulfsolar.co.nz
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-terracotta flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <div>
                  <p className="text-xs text-stone-muted uppercase tracking-wide">Location</p>
                  <p className="text-stone font-medium">Hauraki Gulf, New Zealand</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — CTA panel (Ferus form placeholder) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="border border-stone/15 bg-cream p-8 md:p-12">
              <h3 className="font-serif text-2xl text-stone mb-3">
                Ready to go solar?
              </h3>
              <p className="text-stone-muted leading-relaxed mb-8">
                Reach out today for a free assessment. We&apos;ll design a
                system tailored to your property and island conditions.
              </p>

              {/* TODO: Replace with Ferus API form embed */}
              <div className="space-y-4">
                <a
                  href="tel:+6421123456"
                  className="flex items-center justify-center gap-3 w-full rounded-full bg-terracotta px-8 py-4 font-medium text-cream transition-all hover:bg-terracotta-dark text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 0800 SOLAR
                </a>
                <a
                  href="mailto:info@gulfsolar.co.nz"
                  className="flex items-center justify-center gap-3 w-full rounded-full border border-stone px-8 py-4 font-medium text-stone transition-all hover:bg-stone hover:text-cream text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Send an Email
                </a>
              </div>

              <p className="text-xs text-stone-muted text-center mt-6">
                Free consultation · No obligation · Island specialists
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
