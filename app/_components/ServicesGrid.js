"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const services = [
  {
    number: "01",
    title: "Residential Solar",
    description: "Custom solar installations for island homes, designed to withstand salt air, high winds, and maximize energy production in challenging coastal environments.",
    features: ["Grid-tied & off-grid systems", "Battery storage solutions", "Roof & ground mount options"],
    image: "/Statics/DSC00171.JPG",
  },
  {
    number: "02",
    title: "Commercial Systems",
    description: "Scalable solar solutions for island businesses, from small cafes to larger operations. Reduce overheads and demonstrate environmental commitment.",
    features: ["Commercial-scale installations", "Power monitoring systems", "Maintenance packages"],
    image: "/Statics/DSC00195.JPG",
  },
  {
    number: "03",
    title: "Remote Island Specialists",
    description: "We come to you — no matter which Hauraki Gulf island you call home. Our team has the experience and equipment to handle installations anywhere.",
    features: ["Boat & barge transport", "All island locations covered", "Remote monitoring support"],
    highlighted: true,
    image: "/Statics/DSC00202.JPG",
  },
];

export default function ServicesGrid() {
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section 
      ref={ref}
      id="services" 
      className="py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl">
            Solar solutions built for the unique challenges of island living
          </h2>
        </motion.div>

        {/* Services grid */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service) => (
            <motion.div
              key={service.number}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative p-8 rounded-2xl transition-shadow duration-300 cursor-pointer ${
                service.highlighted 
                  ? "bg-black/42 backdrop-blur-md text-white shadow-lg border border-white/25" 
                  : "bg-white/14 backdrop-blur-md text-white shadow-lg border border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="relative mb-6 overflow-hidden rounded-xl border border-white/20">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={6000}
                  height={3376}
                  className="h-36 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>

              {/* Number */}
              <motion.div 
                className={`text-6xl font-bold mb-6 ${
                  service.highlighted ? "text-gold" : "text-white/35"
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {service.number}
              </motion.div>

              {/* Content */}
              <h3 className={`text-2xl font-bold mb-4 ${
                service.highlighted ? "text-white" : "text-white"
              }`}>
                {service.title}
              </h3>
              
              <p className={`mb-6 ${
                service.highlighted ? "text-white/80" : "text-white/80"
              }`}>
                {service.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <motion.li 
                    key={i}
                    className={`flex items-center gap-2 text-sm ${
                      service.highlighted ? "text-white/70" : "text-white/75"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      service.highlighted ? "bg-gold" : "bg-gold/80"
                    }`} />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              {/* Highlighted badge */}
              {service.highlighted && (
                <motion.div 
                  className="absolute top-4 right-4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <span className="px-3 py-1 bg-gold text-navy text-xs font-semibold rounded-full">
                    Our Specialty
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
