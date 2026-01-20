"use client";

import { Suspense } from "react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Search as SearchIcon, X, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { mockProducts } from "@/app/products/page"

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    const results = useMemo(() => {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase().trim();

        return mockProducts.filter((product) => {
            return (
                product.name.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery) ||
                product.wellness_goals.some(goal => goal.toLowerCase().includes(lowerQuery)) ||
                product.description.toLowerCase().includes(lowerQuery)
            );
        });
    }, [query]);

    return (
        <main className="grow pt-40 pb-24 relative z-10">
            <div className="mx-auto max-w-7xl px-8 lg:px-12">

                {/* Dynamic Search Header */}
                <div className="max-w-3xl mb-16">
                    <div className="relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for a blend or a feeling..."
                            autoFocus
                            className="w-full bg-transparent border-b-2 border-[#2D3A3A]/10 py-6 text-4xl lg:text-6xl font-heading text-[#2D3A3A] placeholder:text-[#2D3A3A]/10 focus:outline-none focus:border-[#5A7A6A] transition-colors"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-[#7A8B7A] hover:text-[#2D3A3A] transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        )}
                    </div>
                    <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold">
                        {results.length > 0 ? `Found ${results.length} Rituals` : "Start typing to explore"}
                    </p>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    <AnimatePresence mode="popLayout">
                        {results.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty/Suggestion State */}
                {query.length > 0 && results.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center border-t border-[#E8E6E2]"
                    >
                        <h3 className="font-heading text-2xl text-[#2D3A3A] mb-4">No blends found for "{query}"</h3>
                        <p className="text-sm text-[#7A8A8A] font-light mb-12 italic">Try searching for a goal like "Immunity" or "Energy".</p>

                        <div className="flex flex-wrap justify-center gap-4">
                            {["She Care", "Pulp", "Energy", "Detox"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setQuery(tag)}
                                    className="px-6 py-2 rounded-full border border-[#5A7A6A]/20 text-[10px] uppercase tracking-widest text-[#5A7A6A] font-bold hover:bg-[#5A7A6A]/5 transition-all"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            {/* Grain Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <Suspense fallback={
                <main className="grow pt-40 pb-24 relative z-10">
                    <div className="mx-auto max-w-7xl px-8 lg:px-12">
                        <div className="max-w-3xl mb-16">
                            <div className="w-full h-16 bg-[#F3F1ED] animate-pulse rounded-2xl" />
                        </div>
                    </div>
                </main>
            }>
                <SearchContent />
            </Suspense>

            <Footer />
        </div>
    );
}