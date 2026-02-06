"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import StatCounter from "./StatCounter";

const stats = [
  {
    value: "$2.4M",
    label: "Total Savings Tracked",
    description: "Estimated savings for Gulf homeowners",
  },
  {
    value: "12",
    label: "Remote Islands Served",
    description: "Across the Hauraki Gulf",
  },
  {
    value: "8",
    label: "Years in the Gulf",
    description: "Serving island communities",
  },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section 
      ref={ref}
      id="stats" 
      className="py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="mb-14 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl font-bold">
              Measurable outcomes, not vague promises.
            </h2>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="section-shell text-center p-8 rounded-2xl shadow-lg transition-colors duration-300"
            >
              {/* Number */}
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                {isInView ? (
                  <StatCounter value={stat.value} />
                ) : (
                  <span>0</span>
                )}
              </div>
              
              {/* Label */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {stat.label}
              </h3>
              
              {/* Description */}
              <p className="section-copy">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
