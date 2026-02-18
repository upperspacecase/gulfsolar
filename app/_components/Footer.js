export default function Footer() {
  return (
    <footer className="bg-stone py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-cream text-xl mb-3">Gulf Solar</p>
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
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream/50 text-sm hover:text-cream transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-cream font-medium text-sm mb-4">Contact</p>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:+6421123456" className="text-cream/50 text-sm hover:text-cream transition-colors">
                  0800 SOLAR
                </a>
              </li>
              <li>
                <a href="mailto:info@gulfsolar.co.nz" className="text-cream/50 text-sm hover:text-cream transition-colors">
                  info@gulfsolar.co.nz
                </a>
              </li>
              <li>
                <span className="text-cream/50 text-sm">Hauraki Gulf, NZ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            © {new Date().getFullYear()} Gulf Solar. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-cream/30 text-xs hover:text-cream/60 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-cream/30 text-xs hover:text-cream/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
