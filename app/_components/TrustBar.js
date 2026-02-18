"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const certifications = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
        label: "SEANZ Member",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        label: "Enphase Certified",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
        ),
        label: "SolarEdge Partner",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z" />
            </svg>
        ),
        label: "LG Energy",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.25 3.108A.75.75 0 015 17.654V6.346a.75.75 0 011.17-.624l5.25 3.108a.75.75 0 010 1.24z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.42 15.17l-5.25 3.108A.75.75 0 0111 17.654V6.346a.75.75 0 011.17-.624l5.25 3.108a.75.75 0 010 1.24z" />
            </svg>
        ),
        label: "Fronius Partner",
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18a.94.94 0 00-.662.274.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76M11.25 20.25l.916-.305a1.786 1.786 0 00.85-.87l.144-.317a1.786 1.786 0 011.618-1.035h2.309M16.5 20.25h.922a.75.75 0 00.75-.75v-.176a1.125 1.125 0 011.125-1.125h1.453" />
            </svg>
        ),
        label: "Tesla Powerwall",
    },
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
                <svg key={i} className="w-4 h-4 text-amber" fill="currentColor" viewBox="0 0 20 20">
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
        <section ref={ref} className="bg-offwhite py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Partner Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/40 mb-8">
                        Trusted Partners & Certifications
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-16 md:mb-20">
                        {certifications.map((cert) => (
                            <div
                                key={cert.label}
                                className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white shadow-card hover:shadow-card-hover transition-shadow"
                            >
                                <span className="text-orange">{cert.icon}</span>
                                <span className="text-xs font-semibold text-charcoal/70 text-center whitespace-nowrap">
                                    {cert.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Google Reviews Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid md:grid-cols-4 gap-6 items-start"
                >
                    {/* Summary */}
                    <div className="text-center md:text-left flex flex-col items-center md:items-start">
                        <p className="text-3xl font-extrabold text-charcoal mb-1">Excellent</p>
                        <StarRating count={5} />
                        <p className="text-sm text-charcoal/50 mt-2">
                            Based on <span className="font-semibold text-charcoal/70">50+ reviews</span>
                        </p>
                        <p className="text-sm font-bold text-charcoal/40 mt-1 tracking-wide">★ Google</p>
                    </div>

                    {/* Review Cards */}
                    {reviews.map((review) => (
                        <div
                            key={review.name}
                            className="bg-white rounded-xl p-6 shadow-card"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-bold">{review.initials}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-charcoal">{review.name}</p>
                                </div>
                            </div>
                            <StarRating count={review.rating} />
                            <p className="text-sm text-charcoal/65 leading-relaxed mt-3">{review.text}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
