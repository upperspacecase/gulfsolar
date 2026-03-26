"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const certifications = [
    "SEANZ Member",
    "Enphase Certified",
    "SolarEdge Partner",
    "LG Energy",
    "Fronius Partner",
    "Tesla Powerwall",
];

const reviews = [
    {
        name: "Sarah Thompson",
        text: "Gulf Solar transformed our property. The system handles everything salt air can throw at it, and our power bills dropped 80%.",
        rating: 5,
        initials: "ST",
    },
    {
        name: "James Whitfield",
        text: "Being off-grid on Great Barrier seemed daunting until Gulf Solar designed our system. Two years in and not a single day without power.",
        rating: 5,
        initials: "JW",
    },
    {
        name: "Robert Karena",
        text: "Professional from start to finish. The team clearly understands island conditions. Our vineyard's energy costs dropped dramatically.",
        rating: 5,
        initials: "RK",
    },
];

function StarRating({ count = 5 }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function TrustBar() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <section ref={ref} className="bg-cream/80 backdrop-blur-sm py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Partner Badges -- horizontal text row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-12 md:mb-16"
                >
                    {certifications.map((cert, i) => (
                        <span key={cert} className="flex items-center gap-6">
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-muted/50">
                                {cert}
                            </span>
                            {i < certifications.length - 1 && (
                                <span className="hidden md:inline text-stone/15">|</span>
                            )}
                        </span>
                    ))}
                </motion.div>

                {/* Google Reviews */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid md:grid-cols-4 gap-6 items-start"
                >
                    {/* Summary */}
                    <div className="flex flex-col items-start">
                        <p className="font-serif text-3xl text-stone mb-1">Excellent</p>
                        <StarRating count={5} />
                        <p className="text-sm text-stone-muted mt-2">
                            Based on <span className="font-semibold text-stone/70">50+ reviews</span>
                        </p>
                        <p className="text-sm font-bold text-stone-muted/40 mt-1 tracking-wide">Google</p>
                    </div>

                    {/* Review Cards */}
                    {reviews.map((review) => (
                        <div
                            key={review.name}
                            className="bg-white border border-stone/10 p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center flex-shrink-0">
                                    <span className="text-cream text-xs font-bold">{review.initials}</span>
                                </div>
                                <p className="text-sm font-semibold text-stone">{review.name}</p>
                            </div>
                            <StarRating count={review.rating} />
                            <p className="text-sm text-stone-muted leading-relaxed mt-3">{review.text}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
