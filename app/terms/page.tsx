import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'Terms of Service | Ayuniv Sanctuary',
    description: 'The sacred agreement between Ayuniv and its community members.',
};

export default function TermsAndConditions() {
    const lastUpdated = "January 27, 2026";

    return (
        <div className="bg-[#fdfbf7] min-h-screen font-serif text-[#2d3a3a] selection:bg-[#e8e6e2]">
            {/* Decorative Header */}
            <Header />
            <header className="max-w-4xl mx-auto pt-32 pb-12 px-6 text-center">
                <span className="uppercase tracking-[0.2em] text-sm text-[#9aa09a] block mb-4">The Sacred Agreement</span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
                    Terms of <span className="italic">Service</span>
                </h1>
                <p className="mt-8 text-[#5a6a6a] max-w-xl mx-auto italic">
                    "By entering the sanctuary, you agree to walk this path with us."
                </p>
            </header>

            <main className="max-w-3xl mx-auto px-6 pb-24">
                <div className="border-t border-[#e8e6e2] pt-12 space-y-16">

                    {/* Section 1: The Digital Identity */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">01</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">The Digital Identity</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                To provide a bespoke wellness experience, Ayuniv preserves certain digital markers: your "Sanctuary Address", "Email", and "Phone Number".
                            </p>
                            <p>
                                By creating an account, you consent to the archiving of these details to facilitate seamless future rituals and secure delivery of our alchemical products.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Financial Exchanges */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">02</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Financial Integrity</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                All transactions are processed via secure, third-party encrypted gateways. While we record the "success of a transaction", your sensitive card details are never housed within the Ayuniv Sanctuary’s primary archives.
                            </p>
                            <p>
                                You agree to provide current, complete, and accurate purchase and account information for all rituals performed at our store.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: The Connection (Marketing) */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">03</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">The Connection</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                Communication is the thread that binds our community. By sharing your contact details, you agree to receive:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 decoration-[#e8e6e2]">
                                <li><strong>Ritual Updates:</strong> Information regarding order status and delivery.</li>
                                <li><strong>The Archive:</strong> Periodic insights from the Ayuniv Blog.</li>
                                <li><strong>Alchemical Releases:</strong> First access to new products and wellness guides.</li>
                            </ul>
                            <p className="text-sm italic">You may withdraw your consent to marketing communications at any time via the "Unsubscribe" link in our digital signals.</p>
                        </div>
                    </section>

                    {/* Section 4: Use of the Sanctuary */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">04</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Sacred Conduct</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                The content, imagery, and "Ayuniv" trademark are the intellectual property of our Jaipur Studio. You agree not to replicate, sell, or exploit any portion of the Sanctuary without express written permission.
                            </p>
                        </div>
                    </section>

                    {/* Final Footer */}
                    <footer className="pt-20 border-t border-[#e8e6e2] text-center text-[#9aa09a] text-sm italic">
                        <p>Last updated: {lastUpdated}</p>
                        <p>Ayuniv Jaipur Studio • Governing Law: Rajasthan, India</p>
                    </footer>
                </div>
            </main>
            <Footer />
        </div>
    );
}