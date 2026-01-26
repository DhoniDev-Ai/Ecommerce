import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
    title: 'Common Rituals (FAQ) | Ayuniv Sanctuary',
    description: 'Find answers to common questions about our wellness juices, shipping, and the Ayuniv philosophy.',
};

export default function FAQ() {
    const categories = [
        {
            title: "The Alchemy",
            questions: [
                {
                    q: "What makes Ayuniv juices unique?",
                    a: "Our juices are not mere beverages; they are cold-pressed alchemies crafted in our Jaipur studio. We use locally sourced, organic ingredients designed to bio-hack your immunity and energy levels without artificial preservatives."
                },
                {
                    q: "What is the shelf life of the rituals?",
                    a: "Because we prioritize freshness over chemistry, our cold-pressed elixirs typically have a sanctuary life of 3-5 days when kept refrigerated. Always check the 'Ritual Date' on the bottle."
                }
            ]
        },
        {
            title: "The Journey (Shipping)",
            questions: [
                {
                    q: "How long until the sanctuary reaches me?",
                    a: "Orders are prepared with intention within 1-2 business days. Transit typically takes 5-7 business days across India. Orders placed after the 'Sacred Hour' (8:00 PM IST) begin their journey the following morning."
                },
                {
                    q: "Is there a complimentary shipping ritual?",
                    a: "Yes. For orders that reach a total investment of ₹899 or more, the shipping ritual is complimentary. For orders below this threshold, a standard shipping fee is applied at checkout."
                }
            ]
        },
        {
            title: "Cancellations & Care",
            questions: [
                {
                    q: "Can I pause or cancel a ritual?",
                    a: "You may cancel your order before 8:00 PM IST on the day of purchase. Once our alchemists begin the preparation, we are unable to halt the process."
                },
                {
                    q: "What if my elixir arrives compromised?",
                    a: "While we package with care, should a bottle arrive damaged, please document it and email info@ayuniv.com within 24 hours. We will initiate a replacement ritual immediately."
                }
            ]
        }
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen font-serif text-[#2d3a3a] selection:bg-[#e8e6e2]">
            {/* Decorative Header */}
            <Header />
            <header className="max-w-4xl mx-auto pt-32 pb-12 px-6 text-center">
                <span className="uppercase tracking-[0.2em] text-sm text-[#9aa09a] block mb-4">The Archive of Knowledge</span>
                <h1 className="text-5xl md:text-6xl font-light leading-tight italic">Common Rituals</h1>
                <p className="mt-8 text-[#5a6a6a] max-w-xl mx-auto italic">
                    "Finding clarity is the first step toward wellness."
                </p>
            </header>

            <main className="max-w-3xl mx-auto px-6 pb-24">
                <div className=" border-[#e8e6e2] pt-12 space-y-20">

                    {categories.map((category, index) => (
                        <section key={index} className="space-y-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xs uppercase tracking-[0.3em] text-[#9aa09a] whitespace-nowrap">
                                    {category.title}
                                </h2>
                                <div className="h-px w-full bg-[#e8e6e2]"></div>
                            </div>

                            <div className="space-y-12">
                                {category.questions.map((item, qIndex) => (
                                    <div key={qIndex} className="group">
                                        <h3 className="text-xl md:text-2xl mb-4 font-medium leading-snug">
                                            {item.q}
                                        </h3>
                                        <p className="text-[#5a6a6a] leading-relaxed pl-6 border-l border-[#e8e6e2] group-hover:border-[#2d3a3a] transition-colors">
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* Contact Ritual Prompt */}
                    <div className="bg-[#f8f6f2] p-10 text-center rounded-sm border border-[#e8e6e2]">
                        <h3 className="text-xl mb-4 italic">Still seeking clarity?</h3>
                        <p className="text-[#5a6a6a] mb-6">If your question remains unanswered, reach out to our Jaipur studio.</p>
                        <a
                            href="mailto:info@ayuniv.com"
                            className="inline-block border-b border-[#2d3a3a] pb-1 text-sm uppercase tracking-widest hover:text-[#9aa09a] transition-colors"
                        >
                            Contact info@ayuniv.com
                        </a>
                    </div>

                    {/* Final Footer */}
                    <footer className="pt-20 border-t border-[#e8e6e2] text-center text-[#9aa09a] text-sm italic">
                        <p>Ayuniv Jaipur Studio • Rajasthan, India</p>
                    </footer>
                </div>
            </main >
        </div >
    );
}