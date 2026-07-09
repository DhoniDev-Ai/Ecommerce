"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import Image from "next/image";

// --- CONTENT CONFIGURATION ---
const SLIDES = [
    {
        id: 1,
        slug: "ayuniv-sea-buckthorn-Juice-300ml",
        title: "Sea Buckthorn",
        bgImage: "/banners/Sea_bhukthron.png", 
        accentColor: "#E67E22",
    },
    {
        id: 2,
        slug: "she-care-juice",
        title: "She Care",
        bgImage: "/banners/She_Care.png", 
        accentColor: "#5A7A6A",
    },
    {
        id: 3,
        slug: "cholesterol-care-juice",
        title: "Heart Guard",
        bgImage: "/banners/Cholestrol.png", 
        accentColor: "#8B5A2B",
    }
];

export function Hero() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    useEffect(() => {
        if (!isInView) return;
        const timer = setInterval(() => { next(); }, 6000);
        return () => clearInterval(timer);
    }, [isInView, current]);

    const next = () => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % SLIDES.length);
    };
    
    const prev = () => {
        setDirection(-1);
        setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    };

    const slide = SLIDES[current];

    // --- SLIDE ANIMATIONS ---
    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? "100%" : "-100%",
                opacity: 1
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? "100%" : "-100%",
                opacity: 1
            };
        }
    };

    return (
        <section ref={ref} className="w-full bg-[#FDFBF7] pt-20 pb-4 md:pt-24 md:pb-8 px-4 sm:px-6 lg:px-8">
            {/* STRICT 16:9 Aspect Ratio Container */}
            <div className="relative mx-auto max-w-[1400px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl aspect-video bg-[#FDFBF7] group">
                
                {/* 1. CLICKABLE IMAGE LAYER */}
                <Link href={`/products/${slide.slug}`} className="block absolute inset-0 z-10 cursor-pointer">
                    <span className="sr-only">View {slide.title}</span>
                </Link>

                <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl z-0">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={slide.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-none bg-[#FDFBF7]"
                        >
                            <Image
                                src={slide.bgImage}
                                alt={slide.title}
                                fill
                                priority
                                className="object-cover object-center"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 2. NAVIGATION CONTROLS */}
                
                {/* Desktop Arrows (Centered vertically) */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
                    className="absolute hidden md:flex left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm items-center justify-center text-[#2D3A3A] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
                    className="absolute hidden md:flex right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm items-center justify-center text-[#2D3A3A] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Mobile Arrows (Bottom Right Corner) */}
                <div className="absolute md:hidden bottom-2 right-2 z-30 flex gap-2">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[#2D3A3A] hover:bg-white cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[#2D3A3A] hover:bg-white cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Dot Navigation (Bottom Center) */}
                <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 md:-translate-x-1/2 z-30 flex items-center gap-1.5 md:gap-2 mr-auto md:mr-0 pl-2 md:pl-0">
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { 
                                e.preventDefault(); e.stopPropagation(); 
                                setDirection(idx > current ? 1 : -1);
                                setCurrent(idx); 
                            }}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm",
                                current === idx ? "w-4 md:w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}