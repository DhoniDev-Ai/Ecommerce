import React from 'react';
import { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
    title: 'Privacy Ritual | Ayuniv Sanctuary',
    description: 'Learn how we protect your digital energy and data within the Ayuniv Sanctuary.',
};

export default function PrivacyPolicy() {
    const lastUpdated = "January 27, 2026";

    return (
        <div className="bg-[#fdfbf7] min-h-screen font-serif text-[#2d3a3a] selection:bg-[#e8e6e2]">
            <Header />
            {/* Decorative Header Area */}
            <header className="max-w-4xl mx-auto pt-32 md:pt-28 pb-12 px-6 text-center">
                <span className="uppercase tracking-[0.2em] text-sm text-[#9aa09a] block mb-4">The Ethical Foundation</span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
                    Privacy <span className="italic">Ritual</span>
                </h1>
                <p className="mt-8 text-[#5a6a6a] max-w-xl mx-auto italic">
                    "Your trust is the most sacred ingredient in our alchemy."
                </p>
            </header>

            <main className="max-w-3xl mx-auto px-6 pb-24">
                <div className="border-t border-[#e8e6e2] pt-12 space-y-16">

                    {/* Section 1: Data Gathering */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">01</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Data Gathering</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                To facilitate your wellness journey, we collect essential digital signatures: your name, email address (via Supabase), and the physical sanctuary address where your rituals are delivered.
                            </p>
                            <p>
                                This data is gathered solely to fulfill your orders and provide seamless access to your personal sanctuary account.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Secure Transmissions */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">02</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Secure Alchemy</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                Financial exchanges are handled with the utmost integrity. We utilize encrypted payment gateways (Stripe/Razorpay) to ensure your sensitive data never touches our internal servers.
                            </p>
                            <p>
                                Your transactional energy is protected by industry-standard SSL encryption and modern security protocols.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Digital Footprints */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">03</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Your Digital Sovereignty</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                You retain full control over your digital footprint. At any moment, you may request to view, modify, or permanently erase your data from our archives.
                            </p>
                            <p>
                                Direct your requests to <span className="text-[#2d3a3a] border-b border-[#2d3a3a]/30">info@ayuniv.com</span>. We will honor your request within 72 hours.
                            </p>
                        </div>
                    </section>

                    {/* Footer of the page */}
                    <footer className="pt-20 border-t border-[#e8e6e2] text-center text-[#9aa09a] text-sm italic">
                        <p>Last updated: {lastUpdated}</p>
                        <p className="mt-2">Ayuniv Jaipur Studio • Holistic Wellness Archive</p>
                    </footer>
                </div>
            </main>
            <Footer />
        </div>
    );
}