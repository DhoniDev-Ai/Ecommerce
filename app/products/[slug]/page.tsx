"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
    ChevronLeft, Plus, Minus, Leaf, Droplets,
    ShieldCheck, Sparkles, ArrowRight, ShoppingBag, Zap
} from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/hooks/useCart";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";
import { PriceDisplay } from "@/components/product/PriceDisplay";

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [product, setProduct] = useState<any | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const { addToCart, isAdding, isSuccess } = useCart();

    const handleAddToCart = () => {
        if (product) {
            addToCart(product.id, product.price, quantity);
        }
    };

    const isProcessing = product ? isAdding(product.id) : false;
    const showSuccess = product ? isSuccess(product.id) : false;

    // Fetch product from Supabase using your exact demo data structure
    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error || !data) {
                    setProduct(null);
                    return;
                }

                const productData: any = data;

                // Filling dynamic details with safe JSON parsing for your demo fields
                const mappedProduct = {
                    ...productData,
                    price: parseFloat(productData.price),
                    // Parse stringified JSONs from your demo data
                    nutrition_info: typeof productData.nutrition_facts === 'string'
                        ? JSON.parse(productData.nutrition_facts)
                        : productData.nutrition_facts,
                    ingredient_details: typeof productData.ingredient_details === 'string'
                        ? JSON.parse(productData.ingredient_details)
                        : productData.ingredient_details,
                    usage_guidance: productData.usage_instructions,
                };

                setProduct(mappedProduct);

                // Fetch related products (same category first)
                let { data: related } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', productData.category)
                    .neq('id', productData.id)
                    .limit(4);

                // Fallback: if no same-category products, get any other products
                if (!related || related.length === 0) {
                    const { data: anyProducts } = await supabase
                        .from('products')
                        .select('*')
                        .neq('id', productData.id)
                        .limit(4);
                    related = anyProducts;
                }

                if (related) setRelatedProducts(related);
            } catch (err) {
                console.error('Error fetching product:', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchProduct();
    }, [slug]);

    // Gallery auto-rotation logic
    useEffect(() => {
        if (isPaused || !product?.image_urls?.length) return;
        const interval = setInterval(() => {
            setSelectedImageIndex((prev) => (prev + 1) % product.image_urls.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [product?.image_urls?.length, isPaused]);

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 8000);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Header />
            <main className="grow">
                <ProductSkeleton />
            </main>
            <Footer />
        </div>
    );

    if (!product) return notFound();

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-32 pb-24 relative z-10">
                <div className="mx-auto max-w-7xl px-8 lg:px-12">

                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
                        <Link href="/products" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7A8A8A] hover:text-[#5A7A6A] transition-colors">
                            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Collection
                        </Link>
                    </motion.div>



                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                        {/* LEFT: Sticky Gallery with Organic Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                            className="lg:col-span-7 lg:sticky lg:top-32 h-fit flex justify-center items-center flex-col"
                        >
                            {/* Main Image Container - Focused & Minimal */}
                            <div className="relative w-full max-md:max-w-[80%] max-w-[75%] aspect-square rounded-[4rem] overflow-hidden bg-white/80 shadow-[0_40px_100px_rgba(0,0,0,0.02)] flex items-center justify-center p-12 lg:p-20 mb-10">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImageIndex}
                                        src={product.image_urls[selectedImageIndex] || product.image_urls[0]}
                                        // Stage 1: Enter from below, slightly smaller, deeply blurred
                                        initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(12px)" }}
                                        // Stage 2: Rise to center, sharpen, fill space
                                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                        // Stage 3: Continue flowing upward while dissolving
                                        exit={{ opacity: 0, y: -30, scale: 0.98, filter: "blur(6px)" }}
                                        // The "Velvet" Easing: Slow start, very smooth finish
                                        transition={{
                                            duration: 0.9, // Longer duration for luxury feel
                                            ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for "liquid" motion
                                        }}
                                        className="max-h-[65%] w-auto object-contain rounded drop-shadow-[0_50px_60px_rgba(0,0,0,0.08)]"
                                    />
                                </AnimatePresence>

                                {/* Float Badge - Subtle Glassmorphism */}
                                <div className="absolute top-10 left-10 h-20 w-20 rounded-full border border-[#5A7A6A]/10 flex items-center justify-center text-center text-[7px] uppercase tracking-[0.25em] text-[#5A7A6A] leading-tight backdrop-blur-xl bg-white/30 select-none">
                                    Cold <br /> Pressed
                                </div>
                            </div>

                            {/* Thumbnail Navigation - Tactile & Premium */}
                            <div className="flex gap-5 justify-center">
                                {product.image_urls.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={cn(
                                            "group relative w-16 h-16 rounded-2xl overflow-hidden bg-white transition-all duration-700 border",
                                            selectedImageIndex === index
                                                ? "border-[#5A7A6A] shadow-xl scale-110"
                                                : "border-transparent opacity-40 hover:opacity-100 hover:scale-105"
                                        )}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain p-2" />
                                        {selectedImageIndex === index && (
                                            <motion.div
                                                layoutId="thumb-glow"
                                                className="absolute inset-0 bg-[#5A7A6A]/5 pointer-events-none"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* RIGHT: Product Narrative & Action Suite */}
                        <div className="lg:col-span-5 pt-8 flex justify-start items-start">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="w-full max-w-xl"
                            >
                                <p className="text-[10px] uppercase tracking-[0.6em] text-[#7A8B7A] mb-8 font-bold">
                                    {product.category} — Ritual
                                </p>

                                {/* Signature Staggered Title */}
                                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#2D3A3A] leading-[0.82] tracking-tighter mb-12 flex flex-col">
                                    <span className="block">{product.name.split(' ')[0]}</span>
                                    <span className="italic font-serif font-light text-[#5A7A6A] ml-12 lg:ml-20 mt-3">
                                        {product.name.split(' ').slice(1).join(' ')}
                                    </span>
                                </h1>


                                <div className="flex items-center gap-6 mb-14">
                                    <PriceDisplay
                                        price={product.price}
                                        comparisonPrice={product.compare_at_price}
                                        priceClassName="text-4xl font-light tracking-tight"
                                        comparisonClassName="text-lg"
                                    />
                                    <div className="h-px grow bg-gradient-to-r from-[#E8E6E2] to-transparent" />
                                </div>


                                {/* Large-Text Managed Description */}
                                <div className="relative mb-14 group">
                                    <p className="text-xl text-[#6A7A7A] leading-relaxed font-light italic opacity-90 border-l-[1px] border-[#5A7A6A]/20 pl-8 transition-colors group-hover:border-[#5A7A6A]">
                                        "{product.description}"
                                    </p>
                                    <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-[#5A7A6A] scale-y-0 group-hover:scale-y-100 transition-transform duration-1000 ease-in-out origin-top" />
                                </div>

                                {/* Wellness Objectives */}
                                <div className="flex flex-wrap gap-3 mb-14">
                                    {product.wellness_goals.map((goal: string) => (
                                        <span key={goal} className="px-6 py-2.5 rounded-full bg-white border border-[#5A7A6A]/10 text-[9px] uppercase tracking-[0.3em] text-[#5A7A6A] font-bold shadow-sm hover:shadow-md transition-shadow cursor-default">
                                            {goal}
                                        </span>
                                    ))}
                                </div>

                                {/* ACTION SUITE: 3-Button Interaction */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-5">
                                        {/* Tactile Quantity Selector */}
                                        <div className="flex items-center border border-[#E8E6E2] rounded-full p-1.5 bg-[#F3F1ED]/40 backdrop-blur-sm">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-[#5A6A6A] hover:bg-white hover:text-[#2D3A3A] rounded-full transition-all active:scale-90"><Minus className="w-4 h-4" /></button>
                                            <span className="w-12 text-center font-heading text-xl text-[#2D3A3A]">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-[#5A6A6A] hover:bg-white hover:text-[#2D3A3A] rounded-full transition-all active:scale-90"><Plus className="w-4 h-4" /></button>
                                        </div>

                                        {/* Primary: Add to Bag */}
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isProcessing}
                                            className={cn(
                                                "flex-[2] py-5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:shadow-[0_20px_40px_rgba(45,58,58,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70",
                                                showSuccess
                                                    ? "bg-[#5A7A6A] text-white scale-105"
                                                    : "bg-[#2D3A3A] text-white"
                                            )}
                                        >
                                            <ShoppingBag className="w-4 h-4" /> Add to Bag
                                        </button>
                                    </div>

                                    {/* Quick Buy: Performance checkout */}
                                    <button className="w-full py-5 bg-[#5A7A6A] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#4A6A5A] hover:shadow-[0_20px_40px_rgba(90,122,106,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95">
                                        <Zap className="w-4 h-4 fill-white" /> Quick Buy — Direct Checkout
                                    </button>

                                    {/* AI Guide: Consultive approach */}
                                    <button className="w-full py-4 rounded-full border border-[#5A7A6A]/20 text-[#5A7A6A] bg-white hover:bg-[#5A7A6A]/5 transition-all flex items-center justify-center gap-3 group">
                                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-500" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Consult Ayuniv AI Guide</span>
                                    </button>
                                </div>

                                {/* Trust Infrastructure - Fine Print Style */}
                                <div className="mt-20 grid grid-cols-3 gap-10 border-t border-[#E8E6E2] pt-12 opacity-50 hover:opacity-100 transition-opacity duration-700">
                                    {[
                                        { icon: Leaf, text: "Himalayan Sourced" },
                                        { icon: Droplets, text: "Bio-Active Pure" },
                                        { icon: ShieldCheck, text: "Clinical Grade" }
                                    ].map((item, i) => (
                                        <div key={i} className="text-center group">
                                            <item.icon className="w-5 h-5 text-[#5A7A6A] mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
                                            <p className="text-[7px] uppercase tracking-[0.4em] text-[#7A8A8A] font-black leading-tight">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>





                    {/* Alchemy & Nutrition Sections - Perfectly filled from demo data */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-20 border-t border-[#E8E6E2]">
                        <div className="grid lg:grid-cols-2 gap-12 mt-5 lg:gap-20">
                            <div className="mt-20">
                                <h2 className="font-heading text-3xl text-[#2D3A3A] mb-10">The Alchemy</h2>
                                <div className="space-y-5">
                                    {product.ingredient_details?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-end border-b border-[#E8E6E2] pb-4 group">
                                            <span className="text-[#5A6A6A] font-light text-xl group-hover:text-[#5A7A6A] transition-colors">{item.name}</span>
                                            <span className="text-[10px] uppercase tracking-widest text-[#9AA09A] font-bold">{item.certification}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#F3F1ED] rounded-[2.5rem] p-6 mt-10 lg:p-12 shadow-inner">
                                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-10 italic">Nutrition Facts</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { label: 'Energy', val: product.nutrition_info?.calories, unit: 'kcal' },
                                        { label: 'Natural Sugar', val: product.nutrition_info?.sugar, unit: '' },
                                        { label: 'Fiber', val: product.nutrition_info?.fiber, unit: '' },
                                        { label: 'Serving', val: product.nutrition_info?.serving_size, unit: '' }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-6 bg-white rounded-3xl text-center shadow-sm">
                                            <p className="text-[10px] text-[#9AA09A] uppercase font-bold mb-2 tracking-widest">{stat.label}</p>
                                            <p className="text-3xl font-light text-[#2D3A3A]">{stat.val}<span className="text-xs ml-1 text-[#9AA09A]">{stat.unit}</span></p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 p-6 border border-[#2D3A3A]/5 rounded-3xl bg-white/40 backdrop-blur-sm">
                                    <p className="text-xs text-[#7A8A8A] leading-relaxed">
                                        <span className="font-bold text-[#2D3A3A] uppercase tracking-tighter mr-2 italic">How to Enjoy:</span>
                                        {product.usage_guidance}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* SECTION: Lifestyle Editorial Stack (Dynamic 16:9 from demo data) */}
                    <div className="mt-32 space-y-0 -mx-8 lg:-mx-12">
                        {product.lifestyle_images?.map((src: string, index: number) => (
                            <motion.div key={index} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }} className="w-full container mx-auto overflow-hidden group relative">
                                <img src={src} alt="" className="w-full h-full object-cover " />
                                <div className="absolute inset-0 bg-black/5" />
                                {/* <div className="absolute bottom-10 left-10 lg:left-20 text-white">
                                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold drop-shadow-md">Ritual Reflection 0{index + 1}</p>
                                </div> */}
                            </motion.div>
                        ))}
                    </div>

                    {/* Recommendations Section */}
                    <section className="mt-32 border-t border-[#E8E6E2] pt-32">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Curated For You</p>
                                <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A]">You May Also <span className="italic font-serif font-light text-[#5A7A6A]">Enjoy.</span></h2>
                            </div>
                            <Link href="/products" className="hidden sm:flex items-center gap-2 text-xs text-[#5A7A6A] hover:underline uppercase tracking-widest font-bold">View Collection <ArrowRight className="w-4 h-4" /></Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((rel) => (
                                <Link key={rel.id} href={`/products/${rel.slug}`} className="group">
                                    <div className="aspect-square rounded-[2rem] overflow-hidden bg-white mb-6 transition-all duration-500 group-hover:shadow-2xl flex items-center justify-center p-8">
                                        <img src={rel.image_urls[0]} alt="" className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                    <h3 className="font-heading text-xl text-[#2D3A3A] mb-1">{rel.name}</h3>
                                    <p className="text-sm text-[#7A8A8A] font-light italic">₹{parseFloat(rel.price).toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}