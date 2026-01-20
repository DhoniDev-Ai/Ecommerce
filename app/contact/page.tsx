"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Send, MapPin, Mail, Phone, Instagram } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Grain Texture Overlay for consistent 2026 premium feel */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-32 lg:pt-40 pb-24 relative z-10">
                <div className="mx-auto max-w-7xl px-8 lg:px-12">

                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-3xl mb-24"
                    >
                        <span className="inline-block px-4 py-1 rounded-full border border-[#5A7A6A]/20 text-[10px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold mb-8">
                            Get in Touch
                        </span>
                        <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] leading-[1] text-[#2D3A3A] tracking-tighter">
                            Let’s begin a <br />
                            <span className="italic font-serif font-light text-[#5A7A6A]">conversation.</span>
                        </h1>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                        {/* LEFT: Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="lg:col-span-5 space-y-16"
                        >
                            {/* Jaipur HQ */}
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold mb-6 flex items-center gap-3">
                                    <MapPin className="w-3 h-3" /> The Studio
                                </h3>
                                <p className="text-xl text-[#2D3A3A] font-light leading-relaxed">
                                    C-Scheme, Jaipur <br />
                                    Rajasthan, India 302001
                                </p>
                            </div>

                            {/* Digital Channels */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold mb-4 flex items-center gap-3">
                                        <Mail className="w-3 h-3" /> Inquiries
                                    </h3>
                                    <a href="mailto:hello@ayuniv.com" className="text-xl text-[#2D3A3A] hover:text-[#5A7A6A] transition-colors font-light">
                                        hello@ayuniv.com
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold mb-4 flex items-center gap-3">
                                        <Instagram className="w-3 h-3" /> Community
                                    </h3>
                                    <a href="#" className="text-xl text-[#2D3A3A] hover:text-[#5A7A6A] transition-colors font-light">
                                        @ayuniv_wellness
                                    </a>
                                </div>
                            </div>

                            {/* Operating Hours */}
                            <div className="pt-12 border-t border-[#E8E6E2]">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AA09A] leading-relaxed">
                                    Our Jaipur studio is open for consultations <br />
                                    Monday — Friday, 10am to 6pm.
                                </p>
                            </div>
                        </motion.div>

                        {/* RIGHT: Minimalist Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="lg:col-span-7 bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl shadow-black/[0.02] border border-[#E8E6E2]/50"
                        >
                            <form className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[#7A8B7A] font-bold ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            className="w-full bg-[#FDFBF7] border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-[#5A7A6A]/30 transition-all placeholder:text-[#9AA09A]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[#7A8B7A] font-bold ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            className="w-full bg-[#FDFBF7] border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-[#5A7A6A]/30 transition-all placeholder:text-[#9AA09A]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#7A8B7A] font-bold ml-1">Your Ritual Inquiry</label>
                                    <textarea
                                        rows={5}
                                        placeholder="How can we help you on your wellness journey?"
                                        className="w-full bg-[#FDFBF7] border-none rounded-[2rem] px-6 py-4 text-sm focus:ring-1 focus:ring-[#5A7A6A]/30 transition-all placeholder:text-[#9AA09A] resize-none"
                                    />
                                </div>

                                <button className="group relative w-full py-5 bg-[#2D3A3A] text-white rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl">
                                    <span className="relative z-10 flex items-center justify-center gap-3 font-medium text-xs tracking-widest uppercase">
                                        Send Message <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-[#5A7A6A] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}