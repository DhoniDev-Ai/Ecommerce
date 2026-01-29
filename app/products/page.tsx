"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { SlidersHorizontal, X } from "lucide-react";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedGoal, setSelectedGoal] = useState<string>("All Goals");

    const categories = ["All", "Pulp", "She Care", "Cleanse", "Immunity", "Heart Health", "Diabetic Care"];
    const wellnessGoals = ["All Goals", "Energy", "Immunity", "Detox", "Digestion", "Skin Health", "Women's Health", "Heart Health", "Blood Sugar"];

    // Handle URL query params for auto-filtering
    useEffect(() => {
        const goalParam = searchParams.get('goal');
        if (goalParam) {
            // Find the matching goal case-insensitively
            const matchingGoal = wellnessGoals.find(g => g.toLowerCase() === goalParam.toLowerCase());
            if (matchingGoal) {
                setSelectedGoal(matchingGoal);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                // ... rest of fetch

                const mappedProducts: Product[] = (data ?? []).map((product: any) => ({
                    id: product.id,
                    slug: product.slug || '',
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image_urls: product.image_urls || [],
                    category: product.category,
                    stock_quantity: product.stock_quantity || 0,
                    ingredients: product.ingredients || [],
                    benefits: product.benefits || [],
                    wellness_goals: product.wellness_goals || [],
                    created_at: product.created_at,
                    is_on_sale: product.is_on_sale || false,
                    sale_price: product.sale_price,
                    sale_badge_text: product.sale_badge_text,
                    comparison_price: product.comparison_price,
                }));

                setProducts(mappedProducts);
            } catch (err: any) {
                if (err.name === 'AbortError' || err.message?.includes('AbortError')) return;
                //console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesGoal = selectedGoal === "All Goals" || p.wellness_goals.includes(selectedGoal);
            return matchesCategory && matchesGoal;
        });
    }, [products, selectedCategory, selectedGoal]);

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-40 pb-32 relative z-10">
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
                    <span className="text-sm  text-[#6A7A7A] max-w-xs font-light leading-relaxed border-l border-[#E8E6E2] pl-6">🌿 100% Ayurvedic • Cold‑Pressed • No Added Sugar</span>
                    {/* Filter Bar - Minimalist Sticky Ribbon */}
                    <div className=" z-30 mb-20">
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
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3  gap-x-20 gap-y-24">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={i % 3 === 1 ? "lg:translate-y-16 animate-pulse" : "animate-pulse"}>
                                    <div className="aspect-4/5 rounded-[2.5rem] bg-[#F3F1ED] mb-8" />
                                    <div className="h-4 bg-[#F3F1ED] rounded mb-4 w-3/4" />
                                    <div className="h-6 bg-[#F3F1ED] rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
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
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredProducts.length === 0 && (
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
            </main>

            <Footer />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
            <ProductsContent />
        </Suspense>
    );
}