"use client";


import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";
import { SlidersHorizontal, X, ArrowDown } from "lucide-react";


// Mock data for demonstration
export const mockProducts: Product[] = [
    {
        id: "1",
        slug: "green-goddess-cleanse",
        name: "Green Goddess Cleanse",
        description: "A powerful detox blend of kale, spinach, apple, and lemon.",
        price: 12.0,
        image_urls: [],
        category: "Cleanse",
        stock: 100,
        ingredients: ["Kale", "Spinach", "Apple", "Lemon", "Ginger"],
        benefits: ["Supports detox", "Boosts energy"],
        wellness_goals: ["Detox", "Energy"],
        is_featured: true,
        popularity_score: 95,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        slug: "sunrise-citrus-roots",
        name: "Sunrise Citrus Roots",
        description: "Energizing carrot, orange, and ginger blend.",
        price: 11.0,
        compare_at_price: 13.0,
        image_urls: [],
        category: "Juice",
        stock: 100,
        ingredients: ["Carrot", "Orange", "Ginger", "Turmeric"],
        benefits: ["Supports immunity", "Anti-inflammatory"],
        wellness_goals: ["Immunity", "Energy"],
        is_featured: true,
        popularity_score: 88,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        slug: "beet-it-up",
        name: "Beet It Up",
        description: "Earthy beets mixed with sweet apple and cucumber.",
        price: 11.0,
        image_urls: [],
        category: "Juice",
        stock: 100,
        ingredients: ["Beetroot", "Apple", "Cucumber", "Lemon"],
        benefits: ["Supports stamina", "Heart health"],
        wellness_goals: ["Stamina", "Heart Health"],
        is_featured: false,
        popularity_score: 82,
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        slug: "tropical-immunity-boost",
        name: "Tropical Immunity Boost",
        description: "Mango, pineapple, and coconut water with turmeric.",
        price: 13.0,
        image_urls: [],
        category: "Smoothie",
        stock: 50,
        ingredients: ["Mango", "Pineapple", "Coconut Water", "Turmeric"],
        benefits: ["Immune support", "Hydration"],
        wellness_goals: ["Immunity", "Hydration"],
        is_featured: true,
        popularity_score: 91,
        created_at: new Date().toISOString(),
    },
    {
        id: "5",
        slug: "calm-lavender-blend",
        name: "Calm Lavender Blend",
        description: "Soothing lavender, chamomile, and apple blend.",
        price: 10.0,
        image_urls: [],
        category: "Wellness",
        stock: 75,
        ingredients: ["Apple", "Lavender", "Chamomile", "Honey"],
        benefits: ["Relaxation", "Better sleep"],
        wellness_goals: ["Relaxation", "Sleep"],
        is_featured: false,
        popularity_score: 78,
        created_at: new Date().toISOString(),
    },
    {
        id: "6",
        slug: "sea-buckthorn-elixir",
        name: "Sea Buckthorn Elixir",
        description: "Himalayan sea buckthorn with amla and honey.",
        price: 14.0,
        image_urls: [],
        category: "Wellness",
        stock: 60,
        ingredients: ["Sea Buckthorn", "Amla", "Raw Honey", "Ginger"],
        benefits: ["Rich in antioxidants", "Supports immunity"],
        wellness_goals: ["Immunity", "Vitality"],
        is_featured: true,
        popularity_score: 92,
        created_at: new Date().toISOString(),
    },
];

const categories = ["All", "Juice", "Cleanse", "Smoothie", "Wellness"];
const wellnessGoals = [
    "All Goals",
    "Detox",
    "Energy",
    "Immunity",
    "Digestion",
    "Relaxation",
];


// (Keep your mockProducts, categories, and wellnessGoals from the previous step)

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedGoal, setSelectedGoal] = useState("All Goals");

    const filteredProducts = useMemo(() => {
        return mockProducts.filter((p) => {
            const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
            const goalMatch = selectedGoal === "All Goals" || p.wellness_goals.includes(selectedGoal);
            return categoryMatch && goalMatch;
        });
    }, [selectedCategory, selectedGoal]);

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
                                Curated Collection
                            </p>
                            <h1 className="font-heading text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#2D3A3A] tracking-tighter">
                                Pure life, <br />
                                <span className="italic font-serif font-light text-[#5A7A6A]">expertly bottled.</span>
                            </h1>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-4 flex lg:justify-end"
                        >
                            <p className="text-sm text-[#6A7A7A] max-w-xs font-light leading-relaxed border-l border-[#E8E6E2] pl-6">
                                From our Jaipur studio to your morning ritual. Explore our 2025 blends crafted for specific wellness intentions.
                            </p>
                        </motion.div>
                    </div>

                    {/* Filter Bar - Floating Glass Aesthetic */}
                    <div className="top-28 z-30 mb-20">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-6 border-y border-[#E8E6E2]/50 backdrop-blur-sm bg-[#FDFBF7]/40">

                            {/* Categories - Minimalist Tabs */}
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
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5A7A6A]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Refined Goal Filter */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#9AA09A] font-bold">
                                    <SlidersHorizontal className="w-3 h-3" /> Filter By Goal:
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

                    {/* Product Grid - Staggered Laptop View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-20 gap-y-24">
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
                                    // Stagger effect for laptop view (middle column offset)
                                    className={index % 3 === 1 ? "lg:translate-y-16" : ""}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="py-40 text-center border-t border-[#E8E6E2]">
                            <h3 className="font-heading text-2xl text-[#2D3A3A] mb-4">Finding your balance...</h3>
                            <button
                                onClick={() => { setSelectedCategory("All"); setSelectedGoal("All Goals") }}
                                className="text-[10px] uppercase tracking-widest text-[#5A7A6A] font-bold border-b border-[#5A7A6A] pb-1"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
