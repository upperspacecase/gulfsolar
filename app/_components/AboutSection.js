"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} id="about" className="bg-cream/80 backdrop-blur-sm py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left -- Image */}
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

                    {/* Right -- Text */}
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

                        <div className="mt-10 border-t border-stone/10 pt-8">
                            <div className="flex items-baseline gap-4">
                                <span className="font-serif text-5xl text-terracotta">8+</span>
                                <div>
                                    <p className="text-stone font-medium">Years serving the Gulf</p>
                                    <p className="text-sm text-stone-muted mt-1">
                                        Salt-spray rated systems built to outlast the coastal environment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
