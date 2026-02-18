"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const islands = [
  "Waiheke Island",
  "Great Barrier Island",
  "Rakino Island",
  "Rotoroa Island",
  "Ponui Island",
  "Kawau Island",
  "Tiritiri Matangi",
  "Motuihe Island",
];

export default function IslandCoverage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="coverage" className="bg-charcoal py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-orange font-semibold uppercase tracking-widest text-sm mb-4">
              Coverage Area
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Serving Every Island<br />
              in the <span className="text-orange">Hauraki Gulf</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              From Waiheke to Great Barrier, we handle the logistics that other
              solar companies won&apos;t. Ferry, barge, and even helicopter access
              for the most remote locations.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {islands.map((island, i) => (
                <motion.div
                  key={island}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  className="flex items-center gap-3 py-2"
                >
                  <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{island}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#estimate"
                className="rounded-lg bg-orange px-7 py-3.5 text-center font-semibold text-white transition-all hover:bg-orange-dark shadow-sm hover:shadow-md"
              >
                Get a Free Quote
              </a>
              <a
                href="tel:+6421123456"
                className="rounded-lg border border-white/20 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10"
              >
                Call 0800 SOLAR
              </a>
            </div>
          </motion.div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="overflow-hidden rounded-2xl"
          >
            <Image
              src="/Statics/DSC00193.JPG"
              alt="Hauraki Gulf aerial view"
              width={6000}
              height={3376}
              className="w-full h-[450px] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
