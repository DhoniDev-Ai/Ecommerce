"use client";

import { motion } from "@/lib/framer";
import { Leaf, Droplets, Sun, ShieldCheck } from "lucide-react";

const trustItems = [
    {
        icon: Leaf,
        title: "100% Natural",
        description: "Pure botanical ingredients sourced from certified organic farms.",
    },
    {
        icon: Droplets,
        title: "Cold-Pressed",
        description: "Maximum nutrient density preserved at precise, low temperatures.",
    },
    {
        icon: Sun,
        title: "No Added Sugar",
        description: "Only the natural, sun-ripened sweetness of real, whole fruits.",
    },
    {
        icon: ShieldCheck,
        title: "Clean Promise",
        description: "Transparent sourcing from Jaipur with zero hidden additives.",
    },
];

export function TrustSection() {
    return (
        <section className="relative py-20 lg:py-24 bg-[#FDFBF7] overflow-hidden">
            {/* Static background remains unchanged to prevent re-renders */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 mx-auto max-w-7xl px-8 lg:px-12">
                {/* Header: Simplified for instant feel */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-2xl mb-16 lg:mb-20"
                >
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">
                        Our Philosophy
                    </p>
                    <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] leading-[1.1] tracking-tighter">
                        What goes in <br />
                        <span className="italic font-serif font-light text-[#5A7A6A]">really matters.</span>
                    </h2>
                </motion.div>

                {/* Grid: Uses CSS Grid gap for better performance */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {trustItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            // Moving hover logic to CSS for hardware acceleration
                            className="group relative p-10 rounded-[2.5rem] bg-white border border-[#E8E6E2]/60 transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5A7A6A]/5 hover:border-[#5A7A6A]/20"
                        >
                            {/* Icon: Simple transitions */}
                            <div className="relative mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-[#F3F5F3] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#E8F0E8]">
                                    <item.icon
                                        className="w-5 h-5 text-[#5A7A6A] transition-transform duration-300 group-hover:scale-110"
                                        strokeWidth={1.2}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative">
                                <h3 className="font-heading text-xl text-[#2D3A3A] mb-3 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[#7A8A8A] leading-relaxed font-light">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}