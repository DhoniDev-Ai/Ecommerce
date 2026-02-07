import React from 'react';
import { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
    title: 'Shipping Ritual | Ayuniv Sanctuary',
    description: 'Understand the timeline and care involved in bringing the Ayuniv Sanctuary to your door across India.',
};

export default function ShippingPolicy() {
    return (
        <div className="bg-[#fdfbf7] min-h-screen font-serif text-[#2d3a3a] selection:bg-[#e8e6e2]">
            {/* Decorative Header */}
            <Header />
            <header className="max-w-4xl mx-auto pt-32 pb-12 px-6 text-center">
                <span className="uppercase tracking-[0.2em] text-sm text-[#9aa09a] block mb-4">The Journey to You</span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight">
                    Shipping <span className="italic">Ritual</span>
                </h1>
                <p className="mt-8 text-[#5a6a6a] max-w-xl mx-auto italic">
                    "Patience is the final ingredient in every Ayuniv ritual."
                </p>
            </header>

            <main className="max-w-3xl mx-auto px-6 pb-24">
                <div className="border-t border-[#e8e6e2] pt-12 space-y-16">

                    {/* Section 1: Fulfillment Alchemy */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">01</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Processing the Essence</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                Every order is handled with individual intention. We require **1-2 business days** to prepare and package your selection before it leaves our Jaipur studio.
                            </p>
                            <div className="p-4 bg-[#f8f6f2] border-l-2 border-[#2d3a3a] text-sm">
                                <p><strong>The Sacred Hour:</strong> Orders placed after 12:00 PM IST will begin their processing ritual the following business morning.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Shipping Tiers */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">02</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Ritual Investment</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                We currently offer our sanctuary items for delivery exclusively within **India**.
                            </p>
                            <ul className="space-y-3 list-none">
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 bg-[#9aa09a] rounded-full"></span>
                                    <span>Orders above <strong>₹899</strong>: Complimentary Shipping</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-[#9aa09a]">
                                    <span className="h-1 w-1 bg-[#9aa09a] rounded-full"></span>
                                    <span>Orders below ₹899: A standard shipping fee is applied at checkout.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3: Transit Timelines */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">03</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Transit Timelines</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                Once your package is in the care of our logistics partners, it typically reaches your sanctuary within **5-7 business days**.
                            </p>
                            <p className="text-sm italic">
                                Deliveries to metro cities may arrive sooner, while remote areas may require the full 7-day window.
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Damage Ritual */}
                    <section className="group">
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[#9aa09a] font-sans text-xs uppercase tracking-widest">04</span>
                            <h2 className="text-2xl font-medium uppercase tracking-wide">Compromised Deliveries</h2>
                        </div>
                        <div className="pl-10 space-y-4 text-[#5a6a6a] leading-relaxed">
                            <p>
                                Should your items arrive in a compromised state, please document the condition immediately and email <span className="text-[#2d3a3a] border-b border-[#2d3a3a]/30 font-medium">info@ayuniv.com</span> within 24 hours. We will initiate a replacement ritual without delay.
                            </p>
                        </div>
                    </section>



                </div>
            </main>
            <Footer />
        </div>
    );
}