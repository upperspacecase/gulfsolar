"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import GulfMapBackground from "./GulfMapBackground";

const islands = [
  "Waiheke Island",
  "Great Barrier Island",
  "Rakino Island", 
  "Rotoroa Island",
  "Ponui Island",
  "Kawau Island",
  "Tiritiri Matangi",
  "The Noises",
  "Motuihe Island",
  "Rangitoto",
  "Motutapu",
  "Other Gulf Islands",
];

const features = [
  {
    icon: "🚤",
    title: "Boat & Barge Transport",
    description: "We handle all logistics to get our team and equipment to your island",
  },
  {
    icon: "⚡",
    title: "Remote Monitoring",
    description: "Track your system performance from anywhere with our online dashboard",
  },
  {
    icon: "🛠️",
    title: "Island-Savvy Installers",
    description: "Our team understands the unique challenges of coastal installations",
  },
];

export default function IslandCoverage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section 
      ref={ref}
      id="coverage"
      className="relative overflow-hidden py-20 md:py-32"
    >
      <div className="absolute inset-0">
        <GulfMapBackground />
        <div className="absolute inset-0 bg-navy/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {[
            "/Statics/DSC00149.JPG",
            "/Statics/DSC00198.JPG",
            "/Statics/DSC00203.JPG",
          ].map((src) => (
            <div key={src} className="section-shell rounded-2xl p-3">
              <div className="overflow-hidden rounded-xl border border-white/20">
                <Image
                  src={src}
                  alt="Gulf Solar installation detail"
                  width={6000}
                  height={3376}
                  className="h-40 w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">
            We Come To You
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto">
            Solar Installation Across the Hauraki Gulf / Tīkapa Moana
          </h2>
          <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">
            No matter which island you call home, we&apos;ll bring our expertise to you. 
            We&apos;ve installed solar systems on islands big and small throughout the Gulf.
          </p>
        </motion.div>

        {/* Islands grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {islands.map((island) => (
            <motion.div
              key={island}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="bg-white/14 backdrop-blur-md rounded-lg p-4 text-center shadow-sm hover:shadow-soft transition-shadow duration-200 border border-white/20 cursor-pointer"
            >
              <p className="font-medium text-white">{island}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/12 backdrop-blur-md rounded-2xl p-8 shadow-soft border border-white/20"
            >
              <motion.div 
                className="text-4xl mb-4"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/75 mb-6">
            Don&apos;t see your island listed? We probably still service it — get in touch!
          </p>
          <motion.a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-black/45 border border-white/20 text-white font-semibold rounded-lg hover:bg-black/60 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Check Your Island
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
