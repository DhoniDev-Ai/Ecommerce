"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useRef, useState } from "react";

const testimonials = [
    {
        id: 1,
        name: "Aarav P.",
        rating: 5,
        text: "I was skeptical about natural supplements, but the Sea Buckthorn juice has truly improved my energy levels. I feel lighter and more active throughout the day."
    },
    {
        id: 2,
        name: "Meera S.",
        rating: 5,
        text: "The Diabetic Wellness powder is a game-changer. It's gentle on the stomach and I've noticed a real difference in my daily balance. Highly recommended!"
    },
    {
        id: 3,
        name: "Rohan D.",
        rating: 5,
        text: "Ayuniv's products feel so premium and pure. You can tell they care about sourcing. The packaging is beautiful too—it feels like a ritual every time I open it."
    },
    {
        id: 4,
        name: "Priya K.",
        rating: 5,
        text: "Finally, a brand that combines modern science with traditional wisdom without feeling outdated. The Turmeric blend is now a staple in my morning routine."
    },
    {
        id: 5,
        name: "Vikram J.",
        rating: 5,
        text: "Fast delivery and excellent customer support. But mostly, the quality speaks for itself. My immunity feels stronger than it has in years."
    }
];


interface Testimonial {
    id: string | number;
    name: string;
    rating: number;
    text: string;
}

interface TestimonialsProps {
    initialTestimonials?: Testimonial[];
}

export function Testimonials({ initialTestimonials = [] }: TestimonialsProps) {
    const data = initialTestimonials.length > 0 ? initialTestimonials : testimonials;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isClickPaused, setIsClickPaused] = useState(false);

    const isPaused = isHovered || isClickPaused;

    const handleClick = () => {
        setIsClickPaused(true);
        setTimeout(() => setIsClickPaused(false), 6000);
    };

    return (
        <section className="pt-24 pb-32 bg-[#FDFBF7] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#5A7A6A]/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-8 lg:px-12 mb-20 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold block mb-4"
                >
                    Community Stories
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] tracking-tighter"
                >
                    Loved by <span className="italic font-serif font-light text-[#5A7A6A]">Thousands.</span>
                </motion.h2>
            </div>

            {/* Marquee Effect Container */}
            <div
                className="relative w-full overflow-hidden mask-linear-fade cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                <div className={`flex gap-6 animate-infinite-scroll w-max pl-6 ${isPaused ? 'animation-paused' : ''}`}>
                    {/* Double the list for seamless loop */}
                    {[...data, ...data].map((testimonial, i) => (
                        <div
                            key={i}
                            className="w-[300px] md:w-[400px] p-8 rounded-4xl bg-white border border-[#E8E6E2] shadow-sm flex flex-col justify-between shrink-0 transition-transform duration-300"
                        >
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, starI) => (
                                        <Star key={starI} className="w-3.5 h-3.5 fill-[#5A7A6A] text-[#5A7A6A]" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-[#E8E6E2] mb-4 opacity-50" />
                                <p className="text-[#2D3A3A] text-sm md:text-base leading-relaxed font-light">
                                    "{testimonial.text}"
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#F3F1ED] flex items-center justify-center text-[10px] font-bold text-[#5A7A6A]">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <span className="text-xs uppercase tracking-widest font-bold text-[#9AA09A]">
                                    {testimonial.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fade masks for edges */}
                <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
            </div>

        </section>
    );
}

// Add these to your globals.css if not present:
// .animate-infinite-scroll { animation: scroll 40s linear infinite; }
// @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
