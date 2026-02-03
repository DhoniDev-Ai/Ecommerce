"use client";

import { motion } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Send, MapPin, Mail, Phone, Instagram, ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [message, setMessage] = useState("");

    const handleWhatsAppRedirect = () => {
        const encodedMessage = encodeURIComponent(message || "Hi Ayuniv, I would like to know more about...");
        window.open(`https://wa.me/917737350325?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Grain Texture Overlay for consistent 2026 premium feel */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-32 lg:pt-40 pb-24 relative z-10">
                <div className="mx-auto max-w-7xl px-8 lg:px-12">

                    {/* Header Section */}
                    <div className="grid lg:grid-cols-2 gap-16 mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="inline-block px-4 py-1 rounded-full border border-[#5A7A6A]/20 text-[10px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold mb-8">
                                Connect With Us
                            </span>
                            <h1 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[#2D3A3A] tracking-tighter mb-8">
                                We are here to <br />
                                <span className="italic font-serif font-light text-[#5A7A6A]">listen.</span>
                            </h1>
                            <p className="text-[#5A6A6A] font-light text-lg max-w-md leading-relaxed">
                                Whether you have a question about our rituals, need guidance on a blend, or just want to say hello — reach out directly.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                        {/* LEFT: Quick Direct Links Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="lg:col-span-5 space-y-4"
                        >
                            {/* Phone Card */}
                            {/* <a href="tel:+917737350325" className="block group bg-white rounded-4xl p-8 border border-[#E8E6E2] hover:border-[#5A7A6A]/30 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#F3F1ED] flex items-center justify-center group-hover:bg-[#5A7A6A] transition-colors">
                                        <Phone className="w-4 h-4 text-[#2D3A3A] group-hover:text-white transition-colors" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#9AA09A] -rotate-45 group-hover:rotate-0 transition-transform" />
                                </div>
                                <h3 className="text-sm font-bold text-[#2D3A3A] uppercase tracking-widest mb-1">Call Us</h3>
                                <p className="text-xl text-[#5A6A6A] font-light">+91 77373 50325</p>
                            </a> */}

                            {/* Email Card */}
                            <a href="mailto:info@ayuniv.com" className="block group bg-white rounded-4xl p-8 border border-[#E8E6E2] hover:border-[#5A7A6A]/30 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#F3F1ED] flex items-center justify-center group-hover:bg-[#5A7A6A] transition-colors">
                                        <Mail className="w-4 h-4 text-[#2D3A3A] group-hover:text-white transition-colors" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#9AA09A] -rotate-45 group-hover:rotate-0 transition-transform" />
                                </div>
                                <h3 className="text-sm font-bold text-[#2D3A3A] uppercase tracking-widest mb-1">Email Us</h3>
                                <p className="text-xl text-[#5A6A6A] font-light">info@ayuniv.com</p>
                            </a>

                            {/* Instagram Card - Moved Here */}
                            <a href="https://www.instagram.com/ayuniv_official/" target="_blank" className="block group bg-white rounded-4xl p-8 border border-[#E8E6E2] hover:border-[#5A7A6A]/30 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#F3F1ED] flex items-center justify-center group-hover:bg-[#5A7A6A] transition-colors">
                                        <Instagram className="w-4 h-4 text-[#2D3A3A] group-hover:text-white transition-colors" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#9AA09A] -rotate-45 group-hover:rotate-0 transition-transform" />
                                </div>
                                <h3 className="text-sm font-bold text-[#2D3A3A] uppercase tracking-widest mb-1">Follow Us</h3>
                                <p className="text-xl text-[#5A6A6A] font-light">@ayuniv_official</p>
                            </a>

                            {/* Address Card */}
                            {/* <div className="bg-[#FDFBF7] rounded-4xl p-8 border border-[#E8E6E2]">
                                <div className="flex items-center gap-3 mb-4 opacity-50">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">The Studio</span>
                                </div>
                                <p className="text-[#2D3A3A] font-light leading-relaxed">
                                    C-Scheme, Jaipur <br />
                                    Rajasthan, India 302001
                                </p>
                            </div> */}
                        </motion.div>

                        {/* RIGHT: Interactive Message Box (WhatsApp Only) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="lg:col-span-7 bg-[#2D3A3A] rounded-[3rem] px-8 py-6 text-white shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A7A6A] rounded-full blur-[100px] opacity-20 pointer-events-none" />

                            <h3 className="text-2xl font-serif italic font-light mb-8 relative z-10">Quick Chat</h3>

                            <div className="space-y-6 relative z-10">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here... (e.g., I want to know about the detox plan)"
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-lg font-light text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-colors resize-none mb-4"
                                />

                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                    <p className="text-white/30 text-[10px] uppercase tracking-widest order-2 sm:order-1">
                                        Typically replies within 1 hour
                                    </p>

                                    <button
                                        onClick={handleWhatsAppRedirect}
                                        className="w-full sm:w-auto order-1 sm:order-2 py-4 px-8 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center gap-3 transition-transform active:scale-95 group shadow-lg shadow-[#25D366]/20"
                                    >
                                        <MessageCircle className="w-5 h-5 fill-current" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Send on WhatsApp</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}