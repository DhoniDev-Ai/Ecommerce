"use client";

import { motion } from "@/lib/framer";
import { MessageCircle, Sparkles, Send } from "lucide-react";

export function AIAssistantTeaser() {
    return (
        <section className="relative py-24 lg:py-32 bg-[#FDFBF7] overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 mx-auto max-w-5xl px-8 lg:px-12">
                {/* Main Container - The "Digital Sanctuary" */}
                <div className="relative rounded-[4rem] bg-[#F3F5F3] p-10 lg:p-20 overflow-hidden shadow-2xl shadow-[#5A7A6A]/5">

                    {/* Floating Organic Glows */}
                    <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] bg-[#E8F0E8]/80" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full blur-[100px] bg-[#FFEDE0]/40" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Persuasive Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-[#5A7A6A]/10 mb-8">
                                <Sparkles className="w-3 h-3 text-[#5A7A6A]" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A7A6A] font-bold">Smart Wellness</span>
                            </div>

                            <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] leading-[1.1] tracking-tighter mb-6">
                                Not sure where <br />
                                <span className="italic font-serif font-light text-[#5A7A6A]">to start?</span>
                            </h2>

                            <p className="text-lg text-[#6A7A7A] leading-relaxed mb-10 font-light">
                                Our bespoke guide learns your goals to curate the perfect Ayuniv ritual.
                                Think of it as a knowledgeable friend who truly understands the science of nature.
                            </p>

                            <button className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#2D3A3A] text-white text-sm font-medium rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl">
                                <span className="relative z-10 flex items-center gap-3">
                                    Chat with Wellness Guide <MessageCircle className="w-4 h-4" />
                                </span>
                                <div className="absolute inset-0 bg-[#5A7A6A] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                        </motion.div>

                        {/* Right: The Interactive "Conversation" Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-xl">
                                {/* Chat UI Mockup */}
                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <div className="bg-[#2D3A3A] text-white text-xs py-3 px-5 rounded-2xl rounded-tr-none max-w-[80%] font-light">
                                            I want to boost my energy naturally without caffeine.
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 }}
                                        className="flex justify-start items-start gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#E8F0E8] flex items-center justify-center shrink-0 mt-1">
                                            <Sparkles className="w-4 h-4 text-[#5A7A6A]" />
                                        </div>
                                        <div className="bg-white text-[#2D3A3A] text-xs py-3 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm border border-[#F3F1ED] font-light leading-relaxed">
                                            I'd recommend our <span className="font-bold">Sunrise Citrus</span> blend. It uses turmeric and ginger for a sustained, natural lift.
                                        </div>
                                    </motion.div>

                                    {/* Input Field Mockup */}
                                    <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                                        <span className="text-[10px] text-[#9AA09A] uppercase tracking-widest">Type your goal...</span>
                                        <div className="w-8 h-8 rounded-full bg-[#5A7A6A] flex items-center justify-center text-white">
                                            <Send className="w-3 h-3 translate-x-[1px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Brand Metadata */}
                            <p className="absolute -bottom-10 right-4 text-[9px] uppercase tracking-[0.2em] text-[#9AA09A]">
                                Personalised Ayuniv Guidance — 2026
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}