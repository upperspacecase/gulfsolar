"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const faqs = [
    {
        question: "How much does a solar system cost for an island home?",
        answer:
            "A typical residential system for a Gulf island home ranges from $12,000–$25,000 before any subsidies. Island installations may include additional logistics costs for transport. Use our free estimator tool for a personalised ballpark figure.",
    },
    {
        question: "Will solar panels work in cloudy or rainy weather?",
        answer:
            "Yes! Modern solar panels generate electricity even on overcast days. In the Hauraki Gulf region, the annual solar irradiance is excellent. Most of our customers see 70–80% bill reductions year-round, including through winter.",
    },
    {
        question: "How do you handle installation logistics for remote islands?",
        answer:
            "We coordinate barge and ferry transport for all equipment, bring a self-sufficient crew, and manage all council permits and electrical inspections. We've been doing this for over 8 years — logistics is our specialty.",
    },
    {
        question: "Do I need battery storage, or can I stay grid-tied?",
        answer:
            "It depends on your situation. Grid-tied homes on Waiheke can export excess power. Off-grid properties on Great Barrier will need battery storage. We design for both scenarios and recommend the best option during your free assessment.",
    },
    {
        question: "What warranties do you offer?",
        answer:
            "We provide a 10-year workmanship warranty on all installations. Panels carry a 25-year manufacturer warranty, and inverters are covered for 10–15 years. We also offer ongoing maintenance packages with remote monitoring.",
    },
    {
        question: "How long does installation take?",
        answer:
            "A standard residential installation takes 1–2 days on-site. For remote islands, we plan 2–3 day trips for transport and setup. We'll provide a clear timeline during your consultation.",
    },
];

export default function FaqAccordion() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section ref={ref} id="faq" className="bg-white py-24 md:py-32">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-orange font-semibold uppercase tracking-widest text-sm mb-4">
                        Common Questions
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">
                        Frequently Asked Questions
                    </h2>
                </motion.div>

                {/* Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.08 * index }}
                            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-charcoal pr-4">
                                    {faq.question}
                                </span>
                                <motion.span
                                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0 w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center text-orange text-xl font-medium"
                                >
                                    +
                                </motion.span>
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6">
                                            <div className="h-px bg-gray-100 mb-4" />
                                            <p className="text-charcoal/65 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
