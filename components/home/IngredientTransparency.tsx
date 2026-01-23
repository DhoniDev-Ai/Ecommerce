"use client";

import { motion, useScroll, useTransform } from "@/lib/framer";
import { useRef } from "react";

const ingredients = [
    { name: "Sea Buckthorn", emoji: "🍊", origin: "Himalayan Valleys", speed: 0.1 },
    { name: "Amla", emoji: "🫒", origin: "Indian Orchards", speed: 0.2 },
    { name: "Turmeric", emoji: "💛", origin: "Kerala Farms", speed: 0.15 },
    { name: "Ginger", emoji: "🫚", origin: "Organic Growers", speed: 0.25 },
];

export function IngredientTransparency() {
    const containerRef = useRef(null);

    // We use Framer Motion's useScroll for high-performance parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section
            ref={containerRef}
            className="relative py-16 lg:py-20 bg-[#FDFBF7] overflow-hidden"
            data-scroll-section
        >
            {/* Digital Grain Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 mx-auto max-w-7xl px-8 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">

                    {/* Left: Editorial Narrative */}
                    <div data-scroll data-scroll-speed="1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-6">
                                The Ayuniv Standard
                            </p>
                            <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] leading-[1.1] tracking-tighter mb-8">
                                We believe in <br />
                                <span className="italic font-serif font-light text-[#5A7A6A]">unfiltered transparency.</span>
                            </h2>
                            <p className="text-lg text-[#6A7A7A] leading-relaxed mb-10 font-light max-w-md">
                                Every element in our 2025 collection is sourced with intention.
                                No hidden additives, no artificial preservatives. Just pure nature,
                                preserved at its peak.
                            </p>

                            {/* Philosophy Checklist */}
                            <div className="space-y-5">
                                {[
                                    "100% full-disclosure labeling",
                                    "Direct-from-farm organic sourcing",
                                    "Rigorous third-party purity testing",
                                    "Zero synthetic additives or colors",
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#5A7A6A]/40" />
                                        <p className="text-sm text-[#5A6A6A] font-light tracking-wide">{item}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Tactile Ingredient Gallery */}
                    <div className="relative">
                        {/* Organic Background Glow */}
                        <div
                            className="absolute inset-0 rounded-full blur-[100px] opacity-30 pointer-events-none"
                            style={{
                                background: "radial-gradient(circle, #E8F0E8 0%, transparent 70%)",
                            }}
                        />

                        {/* Parallax Card Grid */}
                        <div className="relative grid grid-cols-2 gap-6 lg:gap-8">
                            {ingredients.map((ingredient, index) => (
                                <motion.div
                                    key={ingredient.name}
                                    style={{
                                        y: useTransform(scrollYProgress, [0, 1], [0, -200 * ingredient.speed])
                                    }}
                                    className="group relative bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-[#E8E6E2]/50 shadow-2xl shadow-black/[0.02] transition-colors duration-500 hover:border-[#5A7A6A]/20"
                                >
                                    <div className="relative z-10">
                                        <span className="text-4xl mb-6 block transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
                                            {ingredient.emoji}
                                        </span>
                                        <h4 className="font-heading text-lg text-[#2D3A3A] mb-1 tracking-tight">
                                            {ingredient.name}
                                        </h4>
                                        <p className="text-[10px] uppercase tracking-widest text-[#9AA09A] font-medium">
                                            {ingredient.origin}
                                        </p>
                                    </div>

                                    {/* Subtle decorative "Organic" tag visible on hover */}
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#5A7A6A]" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}