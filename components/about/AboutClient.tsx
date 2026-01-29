"use client";

import { motion } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Wind, ShieldCheck, Sun } from "lucide-react";
import Image from "next/image";

export function AboutClient() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-32 relative z-10">

                {/* 1. HERO: The Manifesto Headline */}
                <section className="px-8 lg:px-12 mb-32 pt-12">
                    <div className="mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-5xl"
                        >
                            <span className="inline-block px-4 py-1 rounded-full border border-[#5A7A6A]/20 text-[10px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold mb-8">
                                Est. 2025 • Jaipur
                            </span>
                            <h1 className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-[#2D3A3A] tracking-tighter">
                                We don't just extract juice. <br />
                                We bottle <span className="italic font-serif font-light text-[#5A7A6A]">intelligence.</span>
                            </h1>
                            <p className="mt-8 text-xl text-[#6A7A7A] font-light max-w-2xl leading-relaxed">
                                Ayuniv represents the union of Ayurveda and the Universe.
                                A ritual of returning to the source, stripping away the noise, and trusting the potent simplicity of nature.
                            </p>
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
                            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#F3F1ED] order-2 lg:order-1 shadow-xl"
                        >
                            <Image
                                src="/assets/about_1.png"
                                alt="Ayuniv Roots in Jaipur"
                                width={1200}
                                height={1500}
                                priority
                                className="w-full h-full object-cover grayscale-10 hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#2D3A3A]/30 to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-2 opacity-80">Our Origins</p>
                                <p className="font-heading text-3xl">The Pink City</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="font-heading text-4xl text-[#2D3A3A] mb-8 leading-none">
                                Founded in December 2025. <br />
                                <span className="italic font-serif text-[#5A7A6A] text-3xl">A quiet revolution begins.</span>
                            </h2>
                            <div className="space-y-6 text-lg text-[#6A7A7A] font-light leading-relaxed">
                                <p>
                                    Ayuniv began as a realization in the heart of Jaipur: <strong>Wellness has become too clear, yet too complicated.</strong> We saw shelves filled with synthetics and empty promises. We wanted to return to the basics.
                                </p>
                                <p>
                                    We wait for the sun to ripen the fruit. We wait for the seasons to shift. We are not in a hurry. Every bottle of our Sea Buckthorn or Himalayan sourced blends is a testament to patience—pressing the fruit without heat to keep its soul alive.
                                </p>
                                <p>
                                    This is not just a brand. It is an honest attempt to bring the raw, healing energy of the Himalayas to your doorstep.
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-6">
                                <div className="border-l border-[#5A7A6A]/20 pl-6">
                                    <h4 className="font-heading text-2xl text-[#2D3A3A]">100%</h4>
                                    <p className="text-xs uppercase tracking-widest text-[#7A8A8A] mt-1">Pure Pulp</p>
                                </div>
                                <div className="border-l border-[#5A7A6A]/20 pl-6">
                                    <h4 className="font-heading text-2xl text-[#2D3A3A]">0%</h4>
                                    <p className="text-xs uppercase tracking-widest text-[#7A8A8A] mt-1">Added Sugar</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 3. PILLARS: What makes us Ayuniv */}
                <section className="px-8 lg:px-12 py-24 bg-[#F3F5F3] rounded-[4rem] mx-4 lg:mx-8 mb-40 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.5] " /> {/* Texture Fallback */}

                    <div className="mx-auto max-w-7xl relative z-10">
                        <div className="text-center mb-24 max-w-2xl mx-auto">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#5A7A6A] font-bold mb-4 block">Our Codes</span>
                            <h2 className="font-heading text-4xl md:text-5xl text-[#2D3A3A]">The Sacred Guidelines</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                            {[
                                {
                                    icon: Leaf,
                                    title: "Radical Purity",
                                    text: "If it's not found in a garden or a forest, it doesn't belong in our bottle. No fillers, no gums, no hidden chemistry."
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Clinical Potency",
                                    text: "We don't just rely on tradition. We verify with science. Every batch is tested for bioactive density and purity."
                                },
                                {
                                    icon: Sun,
                                    title: "Solar Sourced",
                                    text: "We partner with growers who follow the sun, harvesting at peak ripeness to ensure maximum nutrient retention."
                                }
                            ].map((pillar, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-shadow duration-500 group"
                                >
                                    <div className="w-14 h-14 rounded-full bg-[#F3F1ED] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-[#5A7A6A]">
                                        <pillar.icon strokeWidth={1.5} className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-heading text-2xl text-[#2D3A3A] mb-4">{pillar.title}</h3>
                                    <p className="text-sm text-[#7A8A8A] font-light leading-relaxed">{pillar.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. THE PROCESS: The Alchemy */}
                <section className="px-8 lg:px-12 mb-40">
                    <div className="mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#2D3A3A] rounded-[3rem] overflow-hidden text-white grid lg:grid-cols-2"
                        >
                            <div className="relative aspect-square lg:aspect-auto">
                                <Image
                                    src="/assets/about_2.png"
                                    alt="Cold Press Process"
                                    width={1000}
                                    height={1000}
                                    className="w-full h-full object-cover opacity-90"
                                />
                            </div>
                            <div className="p-12 lg:p-24 flex flex-col justify-center">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-[#5A7A6A] font-bold mb-6">The Method</span>
                                <h2 className="font-heading text-4xl lg:text-5xl mb-8">
                                    Cold-pressed. <br />
                                    <span className="italic font-light opacity-70">Never rushed.</span>
                                </h2>
                                <p className="text-white/70 font-light text-lg leading-relaxed mb-10">
                                    Heat kills enzymes. Speed kills flavor. Our cold-press extraction applies 10 tons of pressure without heat, preserving the living essence of the fruit. It's the difference between "juice" and "nectar".
                                </p>
                                <div className="flex gap-4">
                                    <div className="px-5 py-2 rounded-full border border-white/10 text-xs uppercase tracking-wider text-white/60">No Pasteurization</div>
                                    <div className="px-5 py-2 rounded-full border border-white/10 text-xs uppercase tracking-wider text-white/60">No Concentrates</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 5. FINAL CTA: Join the Ritual */}
                <section className="px-8 lg:px-12 mb-32">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="font-heading text-4xl lg:text-6xl text-[#2D3A3A] mb-8 tracking-tighter">
                            Ready to embrace <span className="italic font-light text-[#5A7A6A]">true wellness?</span>
                        </h2>
                        <p className="text-[#6A7A7A] mb-12 max-w-lg mx-auto">
                            The journey to balance begins with a single sip. Explore our curated collection of Himalayan elixirs.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-3 px-12 py-6 bg-[#2D3A3A] text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#5A7A6A] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                        >
                            Explore the Collection
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
