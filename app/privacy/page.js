import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | Gulf Solar",
    description: "Gulf Solar privacy policy — how we collect, use, and protect your personal information under the NZ Privacy Act 2020.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-charcoal-dark text-white">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-orange hover:text-orange-light transition-colors mb-12"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-white/60 mb-12">Last updated: February 2026</p>

                <div className="space-y-10 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p>
                            Gulf Solar (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy
                            in accordance with the Privacy Act 2020 (New Zealand). This policy
                            explains how we collect, use, disclose, and protect your personal
                            information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                        <p className="mb-3">We may collect the following personal information:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Name and contact details (email, phone number, address)</li>
                            <li>Property details relevant to solar installation quotes</li>
                            <li>Information you provide through our contact forms</li>
                            <li>Website usage data (cookies, analytics)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="mb-3">We use your personal information to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide solar installation quotes and assessments</li>
                            <li>Communicate with you about our services</li>
                            <li>Process and manage installation projects</li>
                            <li>Improve our website and services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Disclosure of Information</h2>
                        <p>
                            We do not sell your personal information. We may share information
                            with trusted third parties who assist us in delivering our services
                            (e.g., electrical sub-contractors, equipment suppliers) only as
                            necessary to complete your installation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                        <p>
                            We take reasonable steps to protect your personal information from
                            unauthorised access, modification, or disclosure. However, no method
                            of electronic transmission or storage is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                        <p>
                            Under the Privacy Act 2020, you have the right to access and request
                            correction of your personal information. To make a request, contact
                            us at{" "}
                            <a href="mailto:hello@gulfsolar.co.nz" className="text-orange hover:text-orange-light">
                                hello@gulfsolar.co.nz
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
                        <p>
                            Our website uses cookies to improve your browsing experience and
                            analyse site traffic. You can control cookies through your browser
                            settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. Any changes
                            will be posted on this page with an updated revision date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our data
                            practices, please contact us at{" "}
                            <a href="mailto:hello@gulfsolar.co.nz" className="text-orange hover:text-orange-light">
                                hello@gulfsolar.co.nz
                            </a>{" "}
                            or call +64 21 123 456.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
