import SunMoonCycle from "./_components/SunMoonCycle";
import Hero from "./_components/Hero";
import StatsSection from "./_components/StatsSection";
import ServicesGrid from "./_components/ServicesGrid";
import Calculator from "./_components/Calculator";
import TestimonialsSection from "./_components/TestimonialsSection";
import IslandCoverage from "./_components/IslandCoverage";
import ContactSection from "./_components/ContactSection";
import Footer from "./_components/Footer";
import settings from "../data/calculator-settings.json";

export default function Home() {
  return (
    <main className="min-h-screen relative isolate">
      {/* Fixed background with sun/moon cycle */}
      <SunMoonCycle />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Stats Section - transparent background to show sky */}
        <StatsSection />

        {/* Services Section */}
        <ServicesGrid />

        {/* Solar Estimator Section */}
        <section id="estimate" className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="text-white bg-black/28 backdrop-blur-md rounded-2xl border border-white/20 p-8">
                <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">
                  Solar Estimator
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Get Your Personalized Solar Estimate
                </h2>
                <p className="text-lg text-white/80 mb-8">
                  Enter your current power bill and a few details about your home. 
                  We&apos;ll calculate your potential savings, system size, and payback period 
                  — all tailored for island conditions.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy text-sm font-bold">✓</span>
                    <span className="text-white/80">Takes less than 60 seconds</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy text-sm font-bold">✓</span>
                    <span className="text-white/80">Based on real Gulf island data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy text-sm font-bold">✓</span>
                    <span className="text-white/80">No pressure, just information</span>
                  </li>
                </ul>
              </div>

              {/* Right - Calculator */}
              <div className="lg:pl-8">
                <Calculator settings={settings} />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Island Coverage Section */}
        <IslandCoverage />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
