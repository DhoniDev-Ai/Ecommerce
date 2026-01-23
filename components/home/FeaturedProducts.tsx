"use client";

import Link from "next/link";
import { motion } from "@/lib/framer";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

interface FeaturedProductsProps {
    products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
    return (
        <section className="relative py-24 lg:py-32 bg-[#FDFBF7] overflow-hidden">
            {/* Subtle Grain Texture for 2026 Premium feel */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">

                {/* Section Header - Editorial Alignment */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">
                            Curated Selection
                        </p>
                        <h2 className="font-heading text-4xl lg:text-6xl text-[#2D3A3A] tracking-tighter leading-[0.9]">
                            Featured <br />
                            <span className="italic font-serif font-light text-[#5A7A6A]">Blends.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-3 text-xs uppercase tracking-widest text-[#5A7A6A] font-semibold border-b border-[#5A7A6A]/10 pb-1 hover:border-[#5A7A6A] transition-all"
                        >
                            Explore the collection
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>

                {/* Responsive Products Grid - Asymmetric staggered effect on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
                    {products.slice(0, 3).map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 1,
                                delay: index * 0.15,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className={index === 1 ? "lg:translate-y-12" : ""} // Staggered middle card for editorial feel
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                {/* Mobile-only CTA for better flow */}
                <div className="mt-16 flex justify-center md:hidden">
                    <Link
                        href="/products"
                        className="px-8 py-4 bg-[#2D3A3A] text-white text-xs uppercase tracking-widest rounded-full font-medium"
                    >
                        View All Blends
                    </Link>
                </div>
            </div>
        </section>
    );
}