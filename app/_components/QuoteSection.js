"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ISLANDS } from "../../data/islands";

const steps = [
  {
    step: "01",
    title: "Free Consultation",
    desc: "We assess your property, energy usage, and goals -- remotely or on-site.",
  },
  {
    step: "02",
    title: "Custom Design",
    desc: "Our engineers design a system optimised for your roof, budget, and island conditions.",
  },
  {
    step: "03",
    title: "Professional Install",
    desc: "We handle all logistics -- permits, transport, and a clean 1-2 day installation.",
  },
  {
    step: "04",
    title: "Ongoing Support",
    desc: "Remote monitoring, maintenance packages, and a 10-year workmanship warranty.",
  },
];

export default function QuoteSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    island: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Thanks! We'll be in touch shortly.");
    setFormData({ name: "", email: "", phone: "", island: "", message: "" });
  };

  return (
    <section ref={ref} id="services" className="bg-cream/80 backdrop-blur-sm py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Quote Form */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left -- Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-muted mb-4">
              Get a Quote
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone leading-tight mb-6">
              Start your solar journey today.
            </h2>
            <p className="text-stone-muted text-lg leading-relaxed mb-10 max-w-md">
              Tell us a bit about your property and we&apos;ll get back to you
              with a free, no-obligation assessment tailored for island
              conditions.
            </p>

            <div className="space-y-4 border-t border-stone/10 pt-8">
              {["Free site assessment", "Custom system design", "Response within 24 hours"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                  <span className="text-stone-muted">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right -- Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <form
              onSubmit={handleSubmit}
              className="border border-stone/15 bg-white p-8 md:p-10 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 bg-cream border border-stone/15 text-base text-stone placeholder:text-stone/30 focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="021 123 4567"
                    className="w-full px-4 py-3.5 bg-cream border border-stone/15 text-base text-stone placeholder:text-stone/30 focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3.5 bg-cream border border-stone/15 text-base text-stone placeholder:text-stone/30 focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone mb-1.5">Which island?</label>
                <select
                  name="island"
                  value={formData.island}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-cream border border-stone/15 text-base text-stone focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select an island</option>
                  {ISLANDS.map((island) => (
                    <option key={island.slug} value={island.slug}>
                      {island.name}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone mb-1.5">Tell us about your project</label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What are your solar goals?"
                  className="w-full px-4 py-3.5 bg-cream border border-stone/15 text-base text-stone placeholder:text-stone/30 focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-terracotta hover:bg-terracotta-dark text-cream font-medium rounded-full transition-colors duration-200 text-lg"
              >
                Request a Free Quote
              </button>

              {status && (
                <p className="text-sm text-center text-stone font-medium" aria-live="polite">
                  {status}
                </p>
              )}
            </form>
          </motion.div>
        </div>

        {/* How We Work */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 md:mt-28"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-muted mb-4">
            How We Work
          </p>
          <h3 className="font-serif text-3xl md:text-4xl text-stone mb-12 max-w-lg leading-tight">
            From first call to first kilowatt
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone/15">
            {steps.map((item) => (
              <div key={item.step} className="p-8 bg-cream">
                <p className="font-serif text-3xl text-terracotta mb-4">{item.step}</p>
                <h4 className="font-serif text-lg text-stone mb-2">{item.title}</h4>
                <p className="text-sm text-stone-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
