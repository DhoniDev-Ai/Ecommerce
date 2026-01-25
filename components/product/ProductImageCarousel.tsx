"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@/lib/framer";
import Image from "next/image";

const carouselImages = [
    {
        src: "/assets/demo1.jpg",
        alt: "Product Benefits - Blood Sugar Management",
        ratio: "16/9", // landscape
    },
    {
        src: "/assets/Demo2.jpg",
        alt: "Product Features and Benefits",
        ratio: "16/9", // portrait
    },
];

export function ProductImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, []);

    const currentImage = carouselImages[currentIndex];

    return (
        <section className="py-16 bg-[#FDFBF7]">
            <div className="mx-auto max-w-7xl px-8 lg:px-12">
                <div className="relative w-full overflow-hidden rounded-4xl bg-[#F3F1ED]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="relative w-full"
                            style={{ aspectRatio: currentImage.ratio }}
                        >
                            <Image
                                width={1000}
                                height={1000}
                                src={currentImage.src}
                                alt={currentImage.alt}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {carouselImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-white w-8"
                                    : "bg-white/40 hover:bg-white/60"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Optional: Image caption */}
                <p className="text-center mt-4 text-sm text-[#7A8A8A]">
                    {currentImage.alt}
                </p>
            </div>
        </section>
    );
}
