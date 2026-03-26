"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ISLANDS } from "../../data/islands";

export default function IslandCoverage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="coverage" className="bg-stone py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left -- Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta mb-4">
              Coverage Area
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream mb-6 leading-tight">
              Serving every island in the{" "}
              <span className="text-terracotta">Hauraki Gulf</span>
            </h2>
            <p className="text-cream/60 text-lg leading-relaxed mb-10">
              From Waiheke to Great Barrier, we handle the logistics that other
              solar companies won&apos;t. Ferry, barge, and even helicopter access
              for the most remote locations.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {ISLANDS.map((island, i) => (
                <motion.div
                  key={island.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  className="flex items-center gap-3 py-2"
                >
                  <span className="w-2 h-2 rounded-full bg-terracotta flex-shrink-0" />
                  <span className="text-cream/80 text-sm font-medium">{island.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#estimate"
                className="rounded-full bg-terracotta px-8 py-4 text-center font-medium text-cream transition-all hover:bg-terracotta-dark"
              >
                Get a Free Quote
              </a>
              <a
                href="tel:+64225225012"
                className="rounded-full border border-cream/20 px-8 py-4 text-center font-medium text-cream transition-colors hover:bg-cream/10"
              >
                Call +64 22 522 5012
              </a>
            </div>
          </motion.div>

          {/* Right -- Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="overflow-hidden"
          >
            <Image
              src="/Statics/DSC00176.JPG"
              alt="Hauraki Gulf solar installation"
              width={1200}
              height={800}
              className="w-full h-[450px] object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
