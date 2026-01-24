"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

// --- CONTENT CONFIGURATION ---
const SLIDES = [
    {
        id: 1,
        slug: "sea-buckthorn-pulp",
        category: "Immunity Archive",
        title: "Sea Buckthorn",
        subtitle: "The Golden Berry",
        description: "Wild-harvested Himalayan berries. A concentrated burst of Omega-7.",
        bgImage: "/assets/Tm/12.png",
        color: "text-[#2D3A3A]",
        accentColor: "#E67E22",
        borderColor: "rgba(230, 126, 34, 0.3)"
    },
    {
        id: 2,
        slug: "she-care-juice",
        category: "Vitality Collection",
        title: "She Care",
        subtitle: "Inner Harmony",
        description: "A gentle, potent Ayurvedic blend for hormonal balance crafted with Shatavari.",
        bgImage: "/assets/Tm/24.png",
        color: "text-[#2D3A3A]",
        accentColor: "#5A7A6A",
        borderColor: "rgba(90, 122, 106, 0.3)"
    },
    {
        id: 3,
        slug: "cholesterol-care",
        category: "Heart Series",
        title: "Heart Guard",
        subtitle: "Ancient Roots",
        description: "A precise blend of garlic, ginger, and honey for cardiovascular strength.",
        bgImage: "/assets/Tm/26.png",
        color: "text-[#3E2723]",
        accentColor: "#8B5A2B",
        borderColor: "rgba(139, 90, 43, 0.3)"
    }
];

export function Hero() {
    const [current, setCurrent] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    useEffect(() => {
        if (!isInView) return;
        const timer = setInterval(() => { next(); }, 7000);
        return () => clearInterval(timer);
    }, [isInView, current]);

    const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
    const prev = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

    const slide = SLIDES[current];

    // --- ANIMATIONS ---
    const bgVariants = {
        initial: { scale: 1, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 1.2 } },
        exit: { opacity: 0, transition: { duration: 0.8 } }
    };

    const textReveal = {
        initial: { y: "100%" },
        animate: { y: "0%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 } },
        exit: { y: "-100%", transition: { duration: 0.4 } }
    };

    return (
        <section ref={ref} className="relative h-screen w-full overflow-hidden bg-[#FDFBF7]">

            {/* 1. BACKGROUND LAYER */}
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={slide.id}
                    variants={bgVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute  inset-0 z-0"
                >
                    <img
                        src={slide.bgImage}
                        alt={slide.title}
                        // Mobile: Center | Desktop: Center
                        className="w-full  h-full object-[45%_center] object-cover md:object-center"
                    />

                    {/* --- IMPROVISED ATMOSPHERIC LAYER --- */}

                    {/* 1. Mobile-Specific Depth Stack */}
                    <div className="md:hidden absolute inset-0 z-10 pointer-events-none">
                        {/* A. The Color Anchor: Matches your brand #FDFBF7 perfectly */}
                        <div className="absolute inset-x-0 bottom-0 h-[70vh] bg-linear-to-t from-[#FDFBF7]/80 via-[#FDFBF7]/40 to-transparent" />

                        {/* B. The Optical Blur: Softens background contrast so text pops */}

                    </div>

                    {/* 2. Desktop-Only Side Anchor */}
                    {/* <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/40 via-transparent to-transparent pointer-events-none z-10" /> */}
                </motion.div>
            </AnimatePresence>

            {/* 2. MAIN CONTENT LAYER */}
            <div className="relative z-10 w-full h-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12">


                <div className="lg:col-span-5 flex flex-col justify-start max-sm:justify-start  sm:pb-0 sm:pt-24 md:pt-40 pb-24  h-full pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div key={slide.id} className="space-y-4 md:space-y-6 relative z-20 pointer-events-auto">

                            {/* Category Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                                exit={{ opacity: 0, y: -10 }}
                                className="inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/40 backdrop-blur-xl border w-fit shadow-sm"
                                style={{ borderColor: slide.borderColor }}
                            >

                                <span className={cn("text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-bold", slide.color)}>
                                    {slide.category}
                                </span>
                            </motion.div>

                            {/* Headline */}
                            <div className="overflow-hidden">
                                <motion.h1
                                    variants={textReveal}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className={cn("font-heading text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem] leading-[0.9] tracking-tighter", slide.color)}
                                >
                                    {slide.title}
                                </motion.h1>
                            </div>

                            <div className="overflow-hidden">
                                <motion.span
                                    variants={textReveal}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="italic font-serif font-light opacity-80 block text-3xl md:text-5xl lg:text-[4rem] leading-none"
                                >
                                    {slide.subtitle}
                                </motion.span>
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                                exit={{ opacity: 0 }}
                                className="pt-2 cursor-pointer md:pt-4"
                            >
                                <Link
                                    href={`/products/${slide.slug}`}
                                    className="group relative inline-flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 text-white rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl active:scale-95"
                                    style={{ backgroundColor: slide.accentColor }}
                                >
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold relative z-10">Start Ritual</span>
                                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.button>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* CENTER SPACER (Bottle Area) */}
                <div className="hidden lg:block lg:col-span-7" />

            </div>

            {/* 3. NAVIGATION & DESC (Desktop Only Position) */}
            <div className="absolute bottom-10 right-6 md:right-12 z-30 flex flex-col items-end gap-6">

                {/* Description */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hidden md:block max-w-xs text-left bg-white/30 backdrop-blur-md p-4 rounded-xl border border-white/20"
                    >
                        <p className={cn("text-xs leading-relaxed font-medium text-white")}>
                            {slide.description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Nav Arrows */}
                <div className="flex gap-3">
                    <button
                        onClick={prev}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#2D3A3A]" />
                    </button>
                    <button
                        onClick={next}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full text-white flex items-center justify-center hover:scale-105 transition-all shadow-md"
                        style={{ backgroundColor: slide.accentColor }}
                    >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>

            {/* 4. PROGRESS BAR */}
            <div className="absolute bottom-0 left-0 h-1 md:h-1.5 bg-black/5 w-full z-30">
                <motion.div
                    key={current}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="h-full"
                    style={{ backgroundColor: slide.accentColor }}
                />
            </div>
        </section>
    );
}