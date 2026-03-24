import Hero from "./_components/Hero";
import AboutSection from "./_components/AboutSection";
import ServicesGrid from "./_components/ServicesGrid";
import Calculator from "./_components/Calculator";
import TestimonialsSection from "./_components/TestimonialsSection";
import FaqAccordion from "./_components/FaqAccordion";
import ContactSection from "./_components/ContactSection";
import Footer from "./_components/Footer";
import ScrollVideoBackground from "./_components/ScrollVideoBackground";
import settings from "../data/calculator-settings.json";

export default function Home() {
  return (
    <ScrollVideoBackground>
    <main>
      <Hero />

      <AboutSection />

      <ServicesGrid />

      {/* Solar Estimator */}
      <section id="estimate" className="bg-cream/80 backdrop-blur-sm py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-muted mb-4">
                Solar Estimator
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone leading-tight mb-6">
                See what solar could save you
              </h2>
              <p className="text-lg text-stone-muted leading-relaxed mb-10">
                Enter your current power bill and we&apos;ll calculate your
                potential savings, system size, and payback period — tailored
                for island conditions.
              </p>
              <ul className="space-y-4">
                {[
                  "Takes less than 60 seconds",
                  "Based on real Gulf island data",
                  "No pressure, just information",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                    <span className="text-stone-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Calculator */}
            <div>
              <Calculator settings={settings} />
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <FaqAccordion />

      <ContactSection />

      <Footer />
    </main>
    </ScrollVideoBackground>
  );
}
