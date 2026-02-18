"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

const testimonials = [
  {
    quote: "Gulf Solar transformed our property. The system handles everything salt air can throw at it, and our power bills dropped 80%. Best investment we've made on the island.",
    name: "Sarah & Mark Thompson",
    location: "Waiheke Island",
    image: "/Statics/DSC00194.JPG",
  },
  {
    quote: "Being off-grid on Great Barrier seemed daunting until Gulf Solar designed our system. Two years in and we haven't had a single day without power. The battery setup is bulletproof.",
    name: "James Whitfield",
    location: "Great Barrier Island",
    image: "/testimonial-man.png",
  },
  {
    quote: "The logistics of getting solar to our island property could have been a nightmare, but Gulf Solar handled everything — barges, permits, installation. We just watched it happen.",
    name: "Aroha & Dave Chen",
    location: "Rakino Island",
    image: "/Statics/DSC00198.JPG",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = useCallback(
    (newDirection) => {
      setDirection(newDirection);
      setCurrent((prev) => {
        const next = prev + newDirection;
        if (next < 0) return testimonials.length - 1;
        if (next >= testimonials.length) return 0;
        return next;
      });
    },
    []
  );

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6000);
    return () => clearInterval(timer);
  }, [navigate]);

  const t = testimonials[current];

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section ref={ref} id="testimonials" className="bg-stone py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50 mb-4">
            Customer Stories
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream max-w-lg leading-tight">
            What our customers say
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              {/* Image */}
              <div className="overflow-hidden aspect-[4/3]">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quote */}
              <div>
                <p className="font-serif italic text-xl md:text-2xl text-cream/90 leading-relaxed mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-cream/15 pt-6">
                  <p className="font-medium text-cream text-sm">{t.name}</p>
                  <p className="text-cream/50 text-sm">{t.location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-terracotta w-6" : "bg-cream/30"
                    }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:text-cream hover:border-cream/40 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => navigate(1)}
                className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:text-cream hover:border-cream/40 transition-colors"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
