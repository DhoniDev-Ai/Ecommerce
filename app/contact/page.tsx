import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Sanctuary | Ayuniv",
    description: "Get in touch with us for inquiries, collaborations, or guidance.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Header />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto">
                {/* HEADER */}
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A7A6A] mb-6">Connection</p>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#2D3A3A] mb-8">
                        Reach the <span className="font-serif italic text-[#5A7A6A]">Sanctuary.</span>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start max-w-6xl mx-auto">

                    {/* INFO COLUMN */}
                    <div className="space-y-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#E8E6E2]">
                            <h2 className="font-heading text-2xl text-[#2D3A3A] mb-8">Direct Channels</h2>

                            <div className="space-y-8">
                                <a href="mailto:info@ayuniv.com" className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-[#F3F1ED] flex items-center justify-center shrink-0 group-hover:bg-[#5A7A6A] group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold text-[#9AA09A] mb-1">Electronic Mail</p>
                                        <p className="text-lg text-[#2D3A3A] group-hover:text-[#5A7A6A] transition-colors">info@ayuniv.com</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#F3F1ED] flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold text-[#9AA09A] mb-1">Base</p>
                                        <p className="text-lg text-[#2D3A3A] leading-relaxed">
                                            Ayuniv Wellness Pvt. Ltd.<br />
                                            Jaipur, Rajasthan, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="aspect-square rounded-[2.5rem] bg-[#5A7A6A] overflow-hidden relative">
                            {/* Decorative or Map Image Placeholder */}
                            <div className="absolute inset-0 bg-[#2D3A3A]/20 mix-blend-multiply" />
                            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest uppercase font-bold">
                                [Sanctuary Map Visual]
                            </div>
                        </div>
                    </div>

                    {/* FORM COLUMN (Visual) */}
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#E8E6E2] shadow-xl shadow-[#5A7A6A]/5">
                        <h2 className="font-heading text-2xl text-[#2D3A3A] mb-2">Send a Message</h2>
                        <p className="text-[#7A8A8A] mb-8 text-sm">We typically respond within 24 hours.</p>

                        <form className="space-y-6" action="mailto:info@ayuniv.com" method="GET">
                            {/* Note: This is a mailto form for simplicity given current static requirements */}

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#9AA09A] ml-2">Your Name</label>
                                <input type="text" placeholder="John Doe" className="w-full bg-[#F9F8F6] border border-[#E8E6E2] rounded-2xl p-4 outline-none focus:border-[#5A7A6A] transition-colors" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#9AA09A] ml-2">Email Address</label>
                                <input type="email" placeholder="john@example.com" className="w-full bg-[#F9F8F6] border border-[#E8E6E2] rounded-2xl p-4 outline-none focus:border-[#5A7A6A] transition-colors" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#9AA09A] ml-2">Message</label>
                                <textarea rows={5} placeholder="How can we help you?" className="w-full bg-[#F9F8F6] border border-[#E8E6E2] rounded-2xl p-4 outline-none focus:border-[#5A7A6A] transition-colors resize-none" />
                            </div>

                            <button className="w-full bg-[#2D3A3A] text-white py-4 rounded-full uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#5A7A6A] transition-colors">
                                Transmit
                            </button>
                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}