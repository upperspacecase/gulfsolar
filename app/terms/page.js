import Link from "next/link";

export const metadata = {
    title: "Terms of Service | Gulf Solar",
    description: "Gulf Solar terms of service — the terms and conditions governing our solar installation services in the Hauraki Gulf.",
};

export default function TermsPage() {
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

                <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
                <p className="text-white/60 mb-12">Last updated: February 2026</p>

                <div className="space-y-10 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. About These Terms</h2>
                        <p>
                            These terms and conditions govern your use of the Gulf Solar
                            website and our provision of solar installation services. By using
                            our website or engaging our services, you agree to be bound by
                            these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Our Services</h2>
                        <p>
                            Gulf Solar provides solar panel installation, maintenance, and
                            consulting services across the Hauraki Gulf region. All services
                            are provided in accordance with New Zealand electrical safety
                            standards and the relevant building codes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Quotes & Estimates</h2>
                        <p>
                            Estimates provided through our online calculator are indicative
                            only and based on the information you provide. Formal quotes will
                            be provided following an on-site assessment. Quotes are valid for
                            30 days unless otherwise stated.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Consumer Guarantees</h2>
                        <p>
                            Our services come with guarantees that cannot be excluded under
                            the Consumer Guarantees Act 1993.
                            For major failures with the service, you are entitled to cancel
                            the service contract and receive a refund for the unused portion,
                            or to compensation for its reduced value. You are also entitled
                            to be compensated for any other reasonably foreseeable loss or
                            damage. If the failure does not amount to a major failure, you
                            are entitled to have problems with the service rectified in a
                            reasonable time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Warranty</h2>
                        <p className="mb-3">
                            Gulf Solar provides a 10-year workmanship warranty on all
                            installations. Manufacturer warranties on panels, inverters,
                            and batteries are provided separately and are subject to each
                            manufacturer&apos;s terms. Our workmanship warranty covers:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Quality of installation and mounting</li>
                            <li>Electrical connections and wiring</li>
                            <li>Weatherproofing and roof penetrations</li>
                            <li>System commissioning and configuration</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Payment Terms</h2>
                        <p>
                            Payment terms will be specified in your formal quote and
                            installation agreement. Typically, a deposit is required upon
                            acceptance of a quote, with the balance due upon completion
                            of installation. All prices are in New Zealand dollars and
                            include GST.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Island Logistics</h2>
                        <p>
                            Installations on remote islands may incur additional transport
                            costs for equipment and crew. These costs will be clearly
                            outlined in your quote. Weather and ferry/barge schedules may
                            affect installation timing, and we will communicate any delays
                            promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, Gulf Solar&apos;s liability
                            is limited to the cost of re-supplying the services. Nothing in
                            these terms limits your rights under the Consumer Guarantees
                            Act 1993 or any other applicable New Zealand legislation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Website Use</h2>
                        <p>
                            The content on this website is for general information purposes
                            only. While we endeavour to keep the information accurate and
                            up-to-date, we make no representations or warranties about the
                            completeness or accuracy of the information on this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law</h2>
                        <p>
                            These terms are governed by and construed in accordance with the
                            laws of New Zealand, and you agree to submit to the exclusive
                            jurisdiction of the courts of New Zealand.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Contact</h2>
                        <p>
                            For any questions about these terms, please contact us at{" "}
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
