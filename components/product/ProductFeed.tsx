"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getProductStats, ProductStats } from "@/actions/store/stats";

interface ProductFeedProps {
    initialProducts: Product[];
}

export function ProductFeed({ initialProducts }: ProductFeedProps) {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [productStats, setProductStats] = useState<ProductStats>({});
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedGoal, setSelectedGoal] = useState<string>("All Goals");

    const categories = ["All", "Pulp", "She Care", "Cleanse", "Immunity", "Heart Health", "Diabetic Care"];
    const wellnessGoals = ["All Goals", "Energy", "Immunity", "Detox", "Digestion", "Skin Health", "Women's Health", "Heart Health", "Blood Sugar"];

    // Handle URL query params for auto-filtering
    useEffect(() => {
        const goalParam = searchParams.get('goal');
        if (goalParam) {
            const matchingGoal = wellnessGoals.find(g => g.toLowerCase() === goalParam.toLowerCase());
            if (matchingGoal) {
                setSelectedGoal(matchingGoal);
            }
        }
    }, [searchParams]);

    // Fetch stats and sort
    useEffect(() => {
        getProductStats().then(stats => {
            setProductStats(stats);
            if (Object.keys(stats).length > 0) {
                setProducts(currentProducts => {
                    const sorted = [...currentProducts].sort((a, b) => {
                        const salesA = stats[a.id] || 0;
                        const salesB = stats[b.id] || 0;
                        return salesB - salesA;
                    });
                    // Simple check to avoid loop if order unchanged
                    if (sorted[0]?.id === currentProducts[0]?.id) return currentProducts;
                    return sorted;
                });
            }
        });
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesGoal = selectedGoal === "All Goals" || p.wellness_goals.includes(selectedGoal);
            return matchesCategory && matchesGoal;
        });
    }, [products, selectedCategory, selectedGoal]);

    // Calculate ranking based on stats
    const rankedProductIds = useMemo(() => {
        return Object.entries(productStats)
            .sort(([, a], [, b]) => b - a)
            .map(([id]) => id);
    }, [productStats]);

    const getTrendingRank = (id: string) => {
        const rank = rankedProductIds.indexOf(id);
        return rank === -1 ? undefined : rank + 1;
    };

    return (
        <div className="mx-auto max-w-[1440px] px-8 lg:px-16">
            {/* Header - Asymmetric Editorial Layout */}
            <div className="grid lg:grid-cols-12 gap-8 mb-24 items-end">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-8"
                >
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-6">
                        Seasonal Collection
                    </p>
                    <h1 className="font-heading text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#2D3A3A] tracking-tighter">
                        Ayurvedic Wellness,<br />
                        <span className="italic font-serif font-light text-[#5A7A6A]">Pure Bottled.</span>
                    </h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-4 flex lg:justify-end"
                >
                    <p className="text-sm text-[#6A7A7A] max-w-xs font-light leading-relaxed border-l border-[#E8E6E2] pl-6">
                        Discover our collection of cold‑pressed Ayurvedic juices made to support energy, immunity, digestion, heart health, and daily balance. Made with natural ingredients and no added sugar.
                    </p>
                </motion.div>
            </div>

            <span className="text-sm text-[#6A7A7A] max-w-xs font-light leading-relaxed border-l border-[#E8E6E2] pl-6 block mb-8">🌿 100% Ayurvedic • Cold‑Pressed • No Added Sugar</span>

            {/* Filter Bar */}
            <div className="z-30 mb-20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-6 border-y border-[#E8E6E2]/50 backdrop-blur-sm bg-[#FDFBF7]/40">

                    {/* Categories */}
                    <div className="flex items-center gap-10 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`group relative text-[10px] uppercase tracking-[0.25em] font-bold transition-all whitespace-nowrap pb-2`}
                            >
                                <span className={selectedCategory === cat ? "text-[#5A7A6A]" : "text-[#2D3A3A]/40 group-hover:text-[#2D3A3A]"}>
                                    {cat}
                                </span>
                                {selectedCategory === cat && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 hidden md:block w-full h-0.5 bg-[#5A7A6A]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Goal Selector */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#9AA09A] font-bold">
                            <SlidersHorizontal className="w-3 h-3" /> Ritual Goal:
                        </div>
                        <select
                            value={selectedGoal}
                            onChange={(e) => setSelectedGoal(e.target.value)}
                            className="bg-transparent text-[10px] uppercase tracking-widest font-bold text-[#5A7A6A] focus:outline-none cursor-pointer appearance-none pr-4 border-b border-[#5A7A6A]/20"
                        >
                            {wellnessGoals.map(goal => (
                                <option key={goal} value={goal}>{goal}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Staggered Grid View */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 lg:gap-x-20 gap-y-24 max-sm:gap-y-16 ">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            layout
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.05,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className={index % 3 === 1 ? "lg:translate-y-16" : ""}
                        >
                            <ProductCard
                                product={product}
                                trendingRank={getTrendingRank(product.id)}
                                salesCount={productStats[product.id] || 0}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="py-40 text-center border-t border-[#E8E6E2]">
                    <h3 className="font-heading text-2xl text-[#2D3A3A] mb-4">No rituals match your journey.</h3>
                    <button
                        onClick={() => { setSelectedCategory("All"); setSelectedGoal("All Goals") }}
                        className="text-[10px] uppercase tracking-widest text-[#5A7A6A] font-bold border-b border-[#5A7A6A] pb-1"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}
