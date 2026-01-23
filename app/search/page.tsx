"use client";

import { Suspense } from "react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Search as SearchIcon, X, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase/client";

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all products from Supabase
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map DB data to Product type
                const mappedProducts: Product[] = (data ?? []).map((product: any) => ({
                    id: product.id,
                    slug: product.slug || '',
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image_urls: product.image_urls || [],
                    category: product.category,
                    stock: product.stock_quantity || 0,
                    ingredients: product.ingredients || [],
                    benefits: product.benefits || [],
                    wellness_goals: product.wellness_goals || [],
                    created_at: product.created_at,
                }));

                setProducts(mappedProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const results = useMemo(() => {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase().trim();

        return products.filter((product) => {
            return (
                product.name.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery) ||
                product.wellness_goals.some(goal => goal.toLowerCase().includes(lowerQuery)) ||
                product.description.toLowerCase().includes(lowerQuery)
            );
        });
    }, [query, products]);

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
                        {loading ? "Loading..." : results.length > 0 ? `Found ${results.length} Rituals` : query ? "No results found" : "Start typing to explore"}
                    </p>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] rounded-[2.5rem] bg-[#F3F1ED] mb-8" />
                                <div className="h-4 bg-[#F3F1ED] rounded mb-4 w-3/4" />
                                <div className="h-6 bg-[#F3F1ED] rounded w-full" />
                            </div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        <AnimatePresence mode="popLayout">
                            {results.map((product, index) => (
                                <motion.div
                                    layout
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.05,
                                    }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : query && !loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center"
                    >
                        <Sparkles className="w-16 h-16 mx-auto mb-8 text-[#5A7A6A]/20" />
                        <h3 className="font-heading text-3xl text-[#2D3A3A] mb-4">Nothing matches that search</h3>
                        <p className="text-sm text-[#7A8A8A] font-light mb-12">
                            Try searching for "energy", "immunity", or "detox"
                        </p>
                        <button
                            onClick={() => setQuery("")}
                            className="px-8 py-3 border border-[#5A7A6A]/20 text-[10px] uppercase tracking-widest text-[#5A7A6A] font-bold hover:bg-[#5A7A6A]/5 transition-all rounded-full"
                        >
                            Clear Search
                        </button>
                    </motion.div>
                ) : null}
            </div>
        </main>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Header />
            <Suspense fallback={
                <main className="grow pt-40 pb-24 relative z-10">
                    <div className="mx-auto max-w-7xl px-8 lg:px-12">
                        <div className="h-20 bg-[#F3F1ED] rounded animate-pulse mb-16 w-full max-w-3xl" />
                    </div>
                </main>
            }>
                <SearchContent />
            </Suspense>
            <Footer />
        </div>
    );
}