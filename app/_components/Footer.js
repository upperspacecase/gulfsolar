"use client";

import { ISLANDS } from "../../data/islands";

export default function Footer() {
  return (
    <footer className="bg-stone/80 backdrop-blur-sm py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-cream text-2xl mb-3">Gulf Solar</p>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              Premium solar energy solutions for homes and businesses across the Hauraki Gulf.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-cream font-medium text-sm mb-4">Explore</p>
            <ul className="space-y-2.5">
              {[
                { label: "Services", href: "#services" },
                { label: "About", href: "#about" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Estimate", href: "#estimate" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-cream/50 text-sm hover:text-cream transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-cream font-medium text-sm mb-4">Contact</p>
            <ul className="space-y-2.5">
              <li><a href="tel:+64225225012" className="text-cream/50 text-sm hover:text-cream transition-colors">+64 22 522 5012</a></li>
              <li><a href="mailto:info@gulfsolar.co.nz" className="text-cream/50 text-sm hover:text-cream transition-colors">info@gulfsolar.co.nz</a></li>
              <li><span className="text-cream/50 text-sm">Hauraki Gulf, NZ</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            &copy; {new Date().getFullYear()} Gulf Solar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-cream/30 text-xs hover:text-cream/60 transition-colors cursor-pointer">Back to top</button>
            <a href="/privacy" className="text-cream/30 text-xs hover:text-cream/60 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-cream/30 text-xs hover:text-cream/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
