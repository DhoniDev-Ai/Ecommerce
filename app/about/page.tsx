"use client";

import { motion } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Leaf, Heart, Wind } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-32 relative z-10">

                {/* 1. HERO: The Manifesto Headline */}
                <section className="px-8 lg:px-12 mb-32">
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-4xl"
                        >
                            <span className="inline-block px-4 py-1 rounded-full border border-[#5A7A6A]/20 text-[10px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold mb-8">
                                Our Philosophy
                            </span>
                            <h1 className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-[#2D3A3A] tracking-tighter">
                                We bottle the intelligence <br />
                                <span className="italic font-serif font-light text-[#5A7A6A]">of nature itself.</span>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* 2. STORY: The Jaipur Roots */}
                <section className="px-8 lg:px-12 mb-30">
                    <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square rounded-[3rem] overflow-hidden bg-[#F3F1ED] order-2 lg:order-1"
                        >
                            <Image
                                src="/assets/about_1.png"
                                alt="Jaipur Wellness Roots"
                                width={10000}
                                height={10000}
                                className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#2D3A3A]/20 to-transparent" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="font-heading text-3xl text-[#2D3A3A] mb-8">Born in the Pink City, <br />Refined for the World.</h2>
                            <p className="text-lg text-[#6A7A7A] font-light leading-relaxed mb-6">
                                Ayuniv began in 2025 as a simple realization in the heart of Jaipur: wellness has become too complicated. We wanted to return to the basics—to the raw, potent intelligence of plants.
                            </p>
                            <p className="text-[#6A7A7A] font-light leading-relaxed">
                                Our journey is one of silence and patience. We wait for the sun to ripen the fruit and for the seasons to shift, ensuring every drop we press is a testament to the purity of Rajasthan’s heritage and modern nutritional science.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 3. PILLARS: What makes us Ayuniv */}
                <section className="px-8 lg:px-12 py-16 bg-[#F3F5F3]/50 rounded-[4rem] mx-4 lg:mx-8 mb-40">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center mb-24">
                            <h2 className="font-heading text-4xl text-[#2D3A3A]">Our Sacred Three</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-16">
                            {[
                                {
                                    icon: Leaf,
                                    title: "Radical Purity",
                                    text: "No compromises. No synthetics. If it isn't found in a garden, it isn't in our bottle."
                                },
                                {
                                    icon: Wind,
                                    title: "Mindful Sourcing",
                                    text: "We partner with local organic growers who respect the soil as much as the harvest."
                                },
                                {
                                    icon: Heart,
                                    title: "Gentle Power",
                                    text: "Wellness shouldn't be a shock to the system. We craft for sustained, natural vitality."
                                }
                            ].map((pillar, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-[#5A7A6A] group-hover:text-white transition-all duration-500">
                                        <pillar.icon strokeWidth={1.2} className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-heading text-xl text-[#2D3A3A] mb-4">{pillar.title}</h3>
                                    <p className="text-sm text-[#7A8A8A] font-light leading-relaxed">{pillar.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. THE PROCESS: The Alchemy */}
                <section className="px-8 lg:px-12 mb-40">
                    <div className="mx-auto max-w-5xl text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] mb-12">
                                Cold-pressed. <span className="italic font-light">Never rushed.</span>
                            </h2>
                            <div className="aspect-video rounded-[3rem] overflow-hidden bg-[#F3F1ED] mb-12 shadow-2xl">
                                <Image
                                    src="/assets/about_2.png"
                                    alt="Our Cold-Press Process"
                                    width={1000}
                                    height={1000}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xl text-[#6A7A7A] font-light max-w-3xl mx-auto italic leading-relaxed">
                                "Our technology is simple: 10 tons of pressure, zero heat, and a relentless commitment to keeping every enzyme alive."
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 5. FINAL CTA: Join the Ritual */}
                <section className="px-8 lg:px-12 mb-32">
                    <div className="mx-auto max-w-7xl rounded-[4rem] bg-[#2D3A3A] p-16 lg:p-32 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        <div className="relative z-10">
                            <h2 className="font-heading text-4xl lg:text-6xl text-white mb-8 tracking-tighter">
                                Start your <span className="italic font-light opacity-80">Ayuniv ritual.</span>
                            </h2>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#2D3A3A] rounded-full text-sm font-medium hover:bg-[#FDFBF7] transition-all duration-500 group"
                            >
                                Browse the 2025 Collection
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}