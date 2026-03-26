import Hero from "./_components/Hero";
import AboutSection from "./_components/AboutSection";
import QuoteSection from "./_components/QuoteSection";
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
        <QuoteSection />
        <Calculator settings={settings} />
        <TestimonialsSection />
        <FaqAccordion />
        <ContactSection />
        <Footer />
      </main>
    </ScrollVideoBackground>
  );
}
