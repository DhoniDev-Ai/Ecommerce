"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FDFBF7] pt-24 pb-16 sm:pt-28 lg:pt-0 lg:pb-0">
            {/* Static Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Background Accents */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[60vw] sm:w-[50vw] h-[60vw] sm:h-[50vw] rounded-full blur-[80px] sm:blur-[120px] bg-[#E8F0E8]/60" />
                <div className="absolute bottom-0 left-[-10%] w-[50vw] sm:w-[40vw] h-[50vw] sm:h-[40vw] rounded-full blur-[60px] sm:blur-[100px] bg-[#FFEDE0]/30" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full">
                <div className="grid lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">
                        <div className="animate-fade-in">
                            {/* Tagline */}
                            <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                                <div className="h-px w-6 bg-[#5A7A6A]/40" />
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#7A8B7A] font-bold">
                                    The Future of Rituals
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[5rem] leading-[1.05] text-[#2D3A3A] tracking-tight mb-6">
                                Pure life, <br className="hidden sm:block" />
                                <span className="italic font-serif font-light text-[#5A7A6A]">concentrated.</span>
                            </h1>

                            {/* Description */}
                            <p className="text-base sm:text-lg lg:text-xl text-[#5A6A6A]/80 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 sm:mb-10 font-light">
                                High-potency wellness elixirs designed to sync your body with nature.
                                Cold-pressed, ethically sourced, and mindfully bottled in Jaipur.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                                <Link
                                    href="/products"
                                    className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#2D3A3A] text-white text-sm font-medium rounded-full overflow-hidden transition-all duration-500 hover:shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Explore Collection <ArrowRight className="w-4 h-4" />
                                    </span>
                                    <div className="absolute inset-0 bg-[#5A7A6A] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </Link>

                                <button className="flex items-center gap-3 text-sm font-medium text-[#2D3A3A] hover:text-[#5A7A6A] transition-colors group">
                                    <div className="w-10 h-10 rounded-full border border-[#2D3A3A]/10 flex items-center justify-center group-hover:bg-[#5A7A6A]/5 transition-colors">
                                        <Play className="w-3 h-3 fill-current" />
                                    </div>
                                    Our Story
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Right Content - Image */}
                    <div className="lg:col-span-6 order-1 lg:order-2">
                        <div className="relative w-full flex justify-center items-center mx-auto lg:mr-0 animate-fade-in">
                            {/* Image Frame */}
                            <div className="relative w-full h-[70vh] max-w-[400px] sm:max-w-[450px] lg:max-w-[520px] aspect-[3/4] rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border-4 sm:border-6 lg:border-8 border-white/60">
                                <img
                                    src="/assets/heromi.png"
                                    alt="Ayuniv Wellness Products"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Badge - Desktop Only */}
                            <div className="absolute bottom-8 left-0 sm:-left-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-[#E8E6E2] hidden md:block">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A8B7A] font-semibold mb-0.5">Origin</p>
                                <p className="text-sm font-heading text-[#2D3A3A]">Jaipur, Rajasthan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Bottom Indicator */}
            <div className="absolute bottom-4 sm:bottom-8 lg:bottom-12 left-0 w-full z-20 pointer-events-none hidden sm:block">
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex -space-x-1.5 sm:-space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#FDFBF7] bg-[#E8F0E8]" />
                            ))}
                        </div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#7A8B7A]">
                            Trusted by 2,000+
                        </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 sm:w-12 h-px bg-[#7A8B7A]/20" />
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#7A8B7A]">Est. 2026</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
