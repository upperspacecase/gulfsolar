"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const testimonials = [
  {
    quote: "Gulf Solar made the whole process so easy. They understood the challenges of installing on Waiheke — the ferry logistics, the coastal weather — and delivered a system that's been fantastic. Our power bills dropped by 75%.",
    author: "Sarah & Mike Thompson",
    location: "Waiheke Island",
    role: "Homeowners",
    initials: "ST",
    image: "/Statics/DSC00176.JPG",
  },
  {
    quote: "Living on Great Barrier, we didn't have many options. Gulf Solar came over on the ferry with all their gear and installed everything in two days. Professional, efficient, and they know island life.",
    author: "James Morrison",
    location: "Great Barrier Island",
    role: "Off-grid homeowner",
    initials: "JM",
    image: "/Statics/DSC00182.JPG",
  },
  {
    quote: "We run a small vineyard on Waiheke and needed reliable power for our operations. Gulf Solar designed a commercial system that handles our pumps, cooling, and office. Couldn't be happier with the results.",
    author: "The Henderson Family",
    location: "Waiheke Island",
    role: "Vineyard owners",
    initials: "HH",
    image: "/Statics/DSC00193.JPG",
  },
  {
    quote: "I was skeptical about solar on Rakino given the weather exposure, but Gulf Solar's installation has held up perfectly through two winters. The team knows what they're doing with coastal installations.",
    author: "Emma Chen",
    location: "Rakino Island",
    role: "Holiday home owner",
    initials: "EC",
    image: "/Statics/DSC00190.JPG",
  },
  {
    quote: "As a builder on the islands, I've seen a lot of contractors come and go. Gulf Solar stands out for their professionalism and their genuine understanding of island logistics. Highly recommend.",
    author: "David Wilson",
    location: "Rotoroa Island",
    role: "Builder & homeowner",
    initials: "DW",
    image: "/Statics/DSC00184.JPG",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section 
      ref={ref}
      className="py-20 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">
            Customer Stories
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            What Island Homeowners Say
          </h2>
        </motion.div>

        {/* Testimonial carousel */}
        <div className="max-w-4xl mx-auto bg-black/24 backdrop-blur-sm rounded-3xl border border-white/15 p-8 md:p-12">
          {/* Quote */}
          <div className="relative min-h-[200px]">
            {/* Quote mark */}
            <div className="absolute -top-4 -left-2 md:-left-8 text-8xl text-gold/20 font-serif">
              &ldquo;
            </div>
            
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed text-center mb-12"
              >
                {currentTestimonial.quote}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mb-10 overflow-hidden rounded-2xl border border-white/15">
            <Image
              src={currentTestimonial.image}
              alt={currentTestimonial.author}
              width={6000}
              height={3376}
              className="h-48 w-full object-cover"
            />
          </div>

          {/* Author info */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`author-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              {/* Avatar */}
              <motion.div 
                className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mb-4 ring-4 ring-gold/20"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-navy font-bold text-lg">
                  {currentTestimonial.initials}
                </span>
              </motion.div>
              
              {/* Name & location */}
              <h4 className="text-lg font-semibold text-white mb-1">
                {currentTestimonial.author}
              </h4>
              <p className="text-white/60 text-sm">
                {currentTestimonial.role} • {currentTestimonial.location}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-gold"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                animate={{ width: index === activeIndex ? 32 : 12 }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
