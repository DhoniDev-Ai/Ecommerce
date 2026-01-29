import { Header } from "@/components/layout/Header";
import {Footer} from "@/components/layout/Footer";
import { Metadata } from "next";
import { Plus, Minus } from "lucide-react";

export const metadata: Metadata = {
    title: "Frequently Asked Questions | Ayuniv",
    description: "Answers to your queries about our rituals, shipping, and products.",
};

const FAQS = [
    {
        question: "How do I choose the right ritual for me?",
        answer: "Listen to your body and intuition. If you seek calm, look for ingredients like Lavender or Chamomile. If you seek vitality, look for Citrus or Ginseng. Each product page details its unique benefits. You are also welcome to write to us for personal guidance."
    },
    {
        question: "Are your ingredients truly natural?",
        answer: "Yes. We source our botanicals from ethical growers who respect the earth. We compromise on nothing. No harsh parabens, no sulfates, no artificial synthetic fragrances—only the pure essence of nature."
    },
    {
        question: "How long does shipping take?",
        answer: "Once you summon a ritual (place an order), we prepare it with care within 24 hours. Delivery typically takes 3-7 days depending on your coordinates within India."
    },
    {
        question: "Do you offer Cash on Delivery?",
        answer: "Yes, we honor Cash on Delivery for most locations to make your experience seamless."
    },
    {
        question: "What is your return policy?",
        answer: "If a product reaches you in a damaged state, we will replace it immediately. For hygiene reasons, opened personal care products cannot be returned. Please notify us within 48 hours of delivery if there is an issue."
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Header />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto">
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A7A6A] mb-6">Guidance</p>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#2D3A3A] mb-8">
                        Common <span className="font-serif italic text-[#5A7A6A]">Queries.</span>
                    </h1>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div key={idx} className="group bg-white rounded-3xl border border-[#E8E6E2] overflow-hidden transition-all hover:border-[#5A7A6A]/50 hover:shadow-lg">
                            <details className="w-full [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer list-none outline-none">
                                    <h3 className="font-heading text-lg md:text-xl text-[#2D3A3A] group-open:text-[#5A7A6A] transition-colors">
                                        {faq.question}
                                    </h3>
                                    <div className="w-8 h-8 rounded-full border border-[#E8E6E2] flex items-center justify-center text-[#2D3A3A] group-open:bg-[#5A7A6A] group-open:text-white group-open:border-[#5A7A6A] transition-all">
                                        <Plus className="w-4 h-4 group-open:hidden" />
                                        <Minus className="w-4 h-4 hidden group-open:block" />
                                    </div>
                                </summary>
                                <div className="px-6 md:px-8 pb-8 pt-0">
                                    <p className="text-[#7A8A8A] leading-relaxed border-t border-[#F3F1ED] pt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}