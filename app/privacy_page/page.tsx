import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Ritual | Ayuniv",
    description: "Our sacred vow to protect your personal sanctuary and data.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#5A7A6A]/20">
            <Header />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto">
                {/* HERO SECTION */}
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A7A6A] mb-6">Transparency</p>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#2D3A3A] mb-8">
                        The Privacy <span className="font-serif italic text-[#5A7A6A]">Ritual.</span>
                    </h1>
                    <p className="text-[#7A8A8A] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                        Your trust is the foundation of our sanctuary. We hold your personal information with the same reverence as the ingredients in our blends—safeguarded, respected, and used only to enhance your well-being.
                    </p>
                </div>

                {/* CONTENT */}
                <div className="max-w-3xl mx-auto space-y-16">

                    <Section title="1. The Collection">
                        <p>
                            To process your rituals (orders), we collect essential artifacts: your name, contact scrolls (email/phone), and physical sanctuary coordinates (address). We may also gather digital footprints (cookies) to ensure your path through our sanctuary is smooth and personalized.
                        </p>
                    </Section>

                    <Section title="2. The Alchemy of Use">
                        <p>
                            Your data flows through our systems for three sacred purposes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-[#5A7A6A]">
                            <li>Fulfilment: Ensuring your chosen remedies reach your doorstep.</li>
                            <li>Communication: Sending you updates, wisdom, and ritual confirmations.</li>
                            <li>Improvement: Refining our digital sanctuary based on how you interact with it.</li>
                        </ul>
                    </Section>

                    <Section title="3. The Circle of Trust">
                        <p>
                            We do not sell your essence. We share it only with Trusted Guardians—logistics partners who deliver your order and payment processors who secure your transaction. These entities are bound by vows (contracts) to strict confidentiality.
                        </p>
                    </Section>

                    <Section title="4. Sacred Security">
                        <p>
                            We employ modern enchantments (SSL encryption and secure servers) to protect your information. While no digital realm is impenetrable, we vigilantly guard the gates to your data.
                        </p>
                    </Section>

                    <Section title="5. Your Sovereignty">
                        <p>
                            You hold dominion over your data. You may request to see what we hold, correct it, or ask for its erasure from our records, subject to legal requirements. Contact our guardians at <a href="mailto:info@ayuniv.com" className="text-[#5A7A6A] underline decoration-dotted underline-offset-4">info@ayuniv.com</a>.
                        </p>
                    </Section>

                    <div className="pt-12 border-t border-[#E8E6E2]">
                        <p className="text-xs text-[#9AA09A]">
                            Last Updated: January 2026<br />
                            Ayuniv Wellness Pvt. Ltd.
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h2 className="font-heading text-2xl text-[#2D3A3A]">{title}</h2>
            <div className="text-[#5A7A6A] text-sm md:text-base leading-loose font-light">
                {children}
            </div>
        </section>
    );
}