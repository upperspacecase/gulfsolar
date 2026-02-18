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

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} id="about" className="bg-white py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left — Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="overflow-hidden">
                            <Image
                                src="/about-solar-install.png"
                                alt="Gulf Solar team installing panels on an island rooftop"
                                width={1024}
                                height={1024}
                                className="w-full h-[500px] object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Right — Text + Island List */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-muted mb-4">
                            About Gulf Solar
                        </p>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone mb-6 leading-tight">
                            We choose solar to keep the island clean.
                        </h2>
                        <div className="space-y-5 text-stone-muted text-lg leading-relaxed max-w-lg">
                            <p>
                                Gulf Solar was founded with a simple belief: every island home
                                deserves access to reliable, high-performance solar energy.
                            </p>
                            <p>
                                We&apos;re a team who understand the unique challenges of
                                coastal installations. From salt spray corrosion to barge
                                logistics, we&apos;ve been there and we love a challenge.
                            </p>
                        </div>

                        {/* Island list */}
                        <div className="mt-10 border-t border-stone/10 pt-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-muted mb-5">
                                Islands We Serve
                            </p>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                                {islands.map((island) => (
                                    <div key={island} className="flex items-center gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                                        <span className="text-sm text-stone/70">{island}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
