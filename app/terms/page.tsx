import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Sanctuary | Ayuniv",
    description: "The guiding principles and agreements for your journey with Ayuniv.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#5A7A6A]/20">
            <Header />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto">
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A7A6A] mb-6">Agreement</p>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#2D3A3A] mb-8">
                        Terms of <span className="font-serif italic text-[#5A7A6A]">Sanctuary.</span>
                    </h1>
                    <p className="text-[#7A8A8A] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                        By entering our digital space and partaking in our rituals, you agree to these guiding principles. They exist to ensure harmony between our offerings and your wellbeing.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-16">

                    <Section title="1. Nature of Artifacts">
                        <p>
                            Ayuniv products are born from nature and crafted with intent. Due to this organic origin, slight variations in color, texture, or scent may occur. These are not flaws but signatures of authenticity.
                        </p>
                    </Section>

                    <Section title="2. Holistic Advice">
                        <p>
                            The wisdom shared on our platform is educational and rooted in holistic traditions. It is not a substitute for professional medical advice. If you have specific medical conditions, always consult your physician before beginning a new ritual.
                        </p>
                    </Section>

                    <Section title="3. Intellectual Property">
                        <p>
                            The imagery, words, and designs within Ayuniv are the soul of our brand. They are protected by copyright. You may admire them, but you may not copy, reproduce, or use them for commercial purposes without our blessing (written consent).
                        </p>
                    </Section>

                    <Section title="4. Returns & Harmony">
                        <p>
                            We strive for your absolute contentment. If a product arrives damaged or does not resonate with you due to a defect, please consult our Return Policy (FAQ) within 7 days. Personal care items, once opened, generally cannot be returned for hygiene reasons.
                        </p>
                    </Section>

                    <Section title="5. Governing Law">
                        <p>
                            These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan—the heart of our operations.
                        </p>
                    </Section>

                    <div className="pt-12 border-t border-[#E8E6E2]">
                        <p className="text-xs text-[#9AA09A] leading-relaxed">
                            Questions about these terms?<br />
                            Reach out at <a href="mailto:care@ayuniv.in" className="text-[#5A7A6A] hover:underline">care@ayuniv.in</a>
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
            <div className="text-[#5A7A6A] text-sm md:text-base leading-loose font-light text-justify">
                {children}
            </div>
        </section>
    );
}