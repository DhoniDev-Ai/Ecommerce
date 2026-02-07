"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
    ChevronLeft, Plus, Minus, Leaf, Droplets,
    ShieldCheck, Sparkles, ArrowRight, ShoppingBag, Zap,
    ChevronDown, Star, Loader2
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useCart } from "@/hooks/useCart";
import { useAI } from "@/context/AIContext";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ShareButton } from "@/components/ui/ShareButton";

interface ProductDetailClientProps {
    product: any;
    relatedProducts: any[];
    reviews: any[];
    isVerifiedBuyer: boolean;
    currentUserReview: any;
}

export function ProductDetailClient({ product, relatedProducts, reviews, isVerifiedBuyer, currentUserReview }: ProductDetailClientProps) {
    const router = useRouter();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);

    const { addToCart, isAdding, isSuccess } = useCart();
    const { openWithContext } = useAI();

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
        }
    };

    const handleQuickBuy = () => {
        if (product) {
            addToCart(product, quantity);
            router.push('/checkout');
        }
    };

    const isProcessing = product ? isAdding(product.id) : false;
    const showSuccess = product ? isSuccess(product.id) : false;

    const [showStickyCTA, setShowStickyCTA] = useState(false);

    // Social Proof: Random "viewing now" count
    const [viewingCount, setViewingCount] = useState(0);

    useEffect(() => {
        // Hydration safe random number between 12 and 48
        setViewingCount(Math.floor(Math.random() * (48 - 12 + 1)) + 12);
    }, []);

    // Gallery auto-rotation logic
    useEffect(() => {
        if (isPaused || !product?.image_urls?.length) return;
        const interval = setInterval(() => {
            setSelectedImageIndex((prev) => (prev + 1) % product.image_urls.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [product?.image_urls?.length, isPaused]);

    // Handle scroll for sticky CTA
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 600; // Show after scrolling past roughly the hero section
            setShowStickyCTA(scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000);
    };

    // Preload images for instant gallery switching
    useEffect(() => {
        if (!product?.image_urls) return;

        product.image_urls.forEach((src: string) => {
            const img = new window.Image();
            img.src = src;
        });
    }, [product?.image_urls]);

    // Calculate dynamic pricing
    const currentPrice = product.sale_price || product.price;

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-32 relative z-10">
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
                            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                            className="lg:col-span-7 lg:sticky lg:top-32 h-fit flex justify-center items-center flex-col"
                        >

                            {/* Main Image Container */}
                            <div className="relative w-full max-md:max-w-[95%] max-w-[75%] aspect-square rounded-[4rem] overflow-hidden bg-white/80 shadow-[0_40px_100px_rgba(0,0,0,0.02)] flex items-center justify-center p-3 lg:p-8 mb-10">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImageIndex}
                                        src={product.image_urls?.[selectedImageIndex] || product.image_urls?.[0]}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.22, 1, 0.36, 1]
                                        }}
                                        className="max-h-[90%] w-auto object-contain rounded-4xl drop-shadow-[0_50px_60px_rgba(0,0,0,0.08)] will-change-transform"
                                        loading="eager" // Force immediate load
                                        decoding="sync"
                                    />
                                </AnimatePresence>

                                {/* Badge */}
                                {product.is_on_sale && product.sale_badge_text && (
                                    <div className="absolute top-10 right-10 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] uppercase tracking-widest font-bold border border-red-100">
                                        {product.sale_badge_text}
                                    </div>
                                )}

                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 justify-center flex-wrap px-4">
                                {product.image_urls?.slice(0, isGalleryExpanded ? undefined : 3).map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={cn(
                                            "group relative w-16 h-16 rounded-2xl overflow-hidden bg-white transition-all duration-700 border shrink-0",
                                            selectedImageIndex === index
                                                ? "border-[#5A7A6A] shadow-xl scale-110"
                                                : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                        )}
                                    >
                                        <Image
                                            width={100}
                                            height={100} src={img} alt="" className="w-full h-full object-contain rounded-2xl p-1" />
                                        {selectedImageIndex === index && (
                                            <motion.div
                                                layoutId="thumb-glow"
                                                className="absolute inset-0 bg-[#5A7A6A]/5 pointer-events-none"
                                            />
                                        )}
                                    </button>
                                ))}

                                {/* +N More Indicator */}
                                {!isGalleryExpanded && product.image_urls?.length > 3 && (
                                    <button
                                        onClick={() => setIsGalleryExpanded(true)}
                                        className="w-16 cursor-pointer h-16 rounded-2xl bg-[#F3F1ED] border border-transparent hover:border-[#5A7A6A]/30 flex items-center justify-center text-[#5A7A6A] font-bold text-xs hover:bg-[#E8E6E2] transition-colors shrink-0"
                                    >
                                        +{product.image_urls.length - 3}
                                    </button>
                                )}

                                {/* Show Less (Optional, nicely integrated) */}
                                {isGalleryExpanded && product.image_urls?.length > 3 && (
                                    <button
                                        onClick={() => setIsGalleryExpanded(false)}
                                        className="w-16 h-16 rounded-2xl bg-[#F3F1ED] border border-transparent cursor-pointer hover:border-[#5A7A6A]/30 flex items-center justify-center text-[#5A7A6A] font-bold text-[10px] uppercase hover:bg-[#E8E6E2] transition-colors shrink-0"
                                    >
                                        Less
                                    </button>
                                )}
                            </div>
                        </motion.div>



                        {/* RIGHT: Product Narrative */}
                        <div className="lg:col-span-5 pt-8 flex justify-center items-start">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="w-full max-w-xl"
                            >
                                {/* SMART URGENCY (Moved Inside Column) */}
                                {viewingCount > 0 && (
                                    <div className="flex items-center gap-3 mb-6 bg-red-50/50 w-fit px-3 py-1.5 rounded-full border border-red-100/50">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                        <p className="text-[10px] font-medium text-[#7A8A8A] tracking-wider uppercase">
                                            <span className="font-bold text-[#2D3A3A]">{viewingCount} people</span> are viewing this ritual
                                        </p>
                                    </div>
                                )}

                                <p className="text-[10px] uppercase tracking-[0.6em] text-[#7A8B7A] mb-8 font-bold">
                                    {product.category} — Ritual
                                </p>

                                {/* Smart Title Logic - Hybrid Approach */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h1 className="font-heading text-5xl md:text-7xl lg:text-7xl text-[#2D3A3A] leading-[0.82] tracking-tighter mb-4 flex flex-col">
                                            {product.name.includes("Sea Buckthorn") ? (
                                                <>
                                                    <span className="block italic font-serif max-md:pb-2">Ayuniv</span>
                                                    <span className="italic font-serif font-light text-[#5A7A6A] ml-12 lg:ml-20 -mt-2 flex flex-col gap-0 leading-[0.9]">
                                                        <span>Sea Buckthorn <span className="hidden md:inline">Pulp</span></span>
                                                        <span className="md:hidden">Pulp</span>
                                                        <div className="flex items-center gap-3 pt-4">
                                                            <span className="text-3xl align-top font-sans tracking-wide border border-[#5A7A6A] rounded-full px-4 py-1 text-[20px] font-bold">
                                                                {product.slug.includes("500ml") ? "500ml" : "300ml"}
                                                            </span>
                                                            <span className="opacity-60 text-4xl lg:text-5xl font-light">(Juice)</span>
                                                        </div>
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="block italic font-serif">{product.name.split(' ')[0]}</span>
                                                    {product.name.split(' ').length > 1 && (
                                                        <span className="italic font-serif font-light text-[#5A7A6A] ml-12 lg:ml-20 mt-3">
                                                            {product.name.split(' ').slice(1).join(' ')}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </h1>

                                        {/* RATING SUMMARY */}
                                        {reviews && reviews.length > 0 && (
                                            <button
                                                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="flex items-center gap-2 mb-6 group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-0.5 text-[#5A7A6A]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn("w-3.5 h-3.5 fill-current", i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? "text-[#FFD700]" : "text-[#E8E6E2]")}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A8A8A] group-hover:text-[#2D3A3A] transition-colors">
                                                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} ({reviews.length} reviews)
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="pt-2">
                                        <ShareButton title={product.name} className="bg-white cursor-pointer border border-[#E8E6E2]" />
                                    </div>
                                </div>


                                <div className="flex items-center gap-6 mb-14">
                                    <PriceDisplay
                                        price={product.price}
                                        comparisonPrice={product.comparison_price}
                                        salePrice={product.sale_price}
                                        isOnSale={product.is_on_sale}
                                        priceClassName="text-4xl font-light tracking-tight"
                                        comparisonClassName="text-lg"
                                    />
                                    <div className="h-px grow bg-linear-to-r from-[#E8E6E2] to-transparent" />
                                </div>


                                <div className="relative mb-14 group">
                                    <div className="relative">
                                        <p className={cn(
                                            "text-xl text-[#6A7A7A] leading-relaxed font-light italic opacity-90 border-l border-[#5A7A6A]/20 pl-8 transition-colors group-hover:border-[#5A7A6A]",
                                            !isDescExpanded && "line-clamp-4"
                                        )}>
                                            "{product.description}"
                                        </p>
                                        {product.description.length > 200 && (
                                            <button
                                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                                className="text-[#5A7A6A] text-xs font-bold uppercase tracking-widest mt-4 pl-8 hover:underline cursor-pointer"
                                            >
                                                {isDescExpanded ? "Read Less" : "Read More"}
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute -left-px top-0 bottom-0 w-[2px] bg-[#5A7A6A] scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-out origin-top" />
                                </div>

                                {/* Variant Selector (Specific for Sea Buckthorn) */}
                                {product.name.includes("Sea Buckthorn") && (
                                    <div className="mb-10 p-5 rounded-4xl bg-[#F8F6F3] border border-[#E8E6E2]">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] uppercase tracking-widest text-[#5A7A6A] font-bold">Select Size Ritual:</span>
                                            <span className="text-[9px] text-[#5A6A6A] font-serif italic">Pure Himalayan Pulp</span>
                                        </div>
                                        <div className="flex bg-white p-1.5 rounded-full border border-[#E8E6E2] relative shadow-inner">
                                            {[
                                                { size: "300ml", slug: "ayuniv-sea-buckthorn-Juice-300ml" },
                                                { size: "500ml", slug: "ayuniv-sea-buckthorn-Juice-500ml" }
                                            ].map((variant) => {
                                                const isActive = product.slug === variant.slug;

                                                return (
                                                    <Link
                                                        key={variant.size}
                                                        href={`/products/${variant.slug}`}
                                                        className={cn(
                                                            "flex-1 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest text-center relative z-10",
                                                            isActive
                                                                ? "text-white shadow-md"
                                                                : "text-[#7A8A8A] hover:text-[#5A7A6A]"
                                                        )}
                                                    >
                                                        {variant.size}
                                                    </Link>
                                                )
                                            })}
                                            {/* Sliding Pill Background with simplified logic */}
                                            <motion.div
                                                layout
                                                className="absolute top-1.5 bottom-1.5 rounded-full bg-[#2D3A3A]"
                                                initial={false}
                                                animate={{
                                                    left: product.slug.includes("500ml") ? "50%" : "4px",
                                                    width: "calc(50% - 4px)"
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Wellness Objectives */}
                                <div className="flex flex-wrap gap-3 mb-14">
                                    {product.wellness_goals?.map((goal: string) => (
                                        <span key={goal} className="px-6 py-2.5 rounded-full bg-white border border-[#5A7A6A]/10 text-[9px] uppercase tracking-[0.3em] text-[#5A7A6A] font-bold shadow-sm hover:shadow-md transition-shadow cursor-default">
                                            {goal}
                                        </span>
                                    ))}
                                </div>

                                {/* BUNDLE SELECTOR */}
                                <div className="mb-10">
                                    <span className="text-[10px] uppercase tracking-widest text-[#5A6A6A] font-bold block mb-4">Quantity Bundles:</span>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { qty: 2, label: "Double", sub: "Save 5%", highlight: true },
                                            { qty: 3, label: "Triple", sub: "Most Loved" },
                                            { qty: 8, label: "Family", sub: "Best Value" }
                                        ].map((b) => (
                                            <button
                                                key={b.qty}
                                                onClick={() => setQuantity(b.qty)}
                                                className={cn(
                                                    "relative cursor-pointer flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300",
                                                    quantity === b.qty
                                                        ? "border-[#5A7A6A] bg-[#5A7A6A]/5 shadow-md scale-105 z-10"
                                                        : "border-[#E8E6E2] bg-white hover:border-[#5A7A6A]/50 hover:shadow-sm"
                                                )}
                                            >
                                                <span className={cn("font-heading text-xl mb-1", quantity === b.qty ? "text-[#2D3A3A]" : "text-[#7A8A8A]")}>{b.qty}</span>
                                                <span className="text-[8px] uppercase tracking-widest font-bold text-[#5A6A6A]">{b.label}</span>
                                                {b.highlight && quantity === b.qty && (
                                                    <span className="absolute -top-2 bg-[#5A7A6A] text-white text-[8px] px-2 py-0.5 rounded-full font-bold shadow-sm">POPULAR</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ACTION SUITE */}
                                <div className="space-y-5">
                                    {product?.stock_quantity > 0 ? (
                                        <>
                                            <div className="flex items-center gap-5">
                                                <div className="flex items-center border border-[#E8E6E2] rounded-full p-1.5 bg-[#F3F1ED]/40 backdrop-blur-sm">
                                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-[#5A6A6A] hover:bg-white hover:text-[#2D3A3A] rounded-full transition-all active:scale-90"><Minus className="w-4 h-4" /></button>
                                                    <span className="w-12 text-center font-heading text-xl text-[#2D3A3A]">{quantity}</span>
                                                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-[#5A6A6A] hover:bg-white hover:text-[#2D3A3A] rounded-full transition-all active:scale-90"><Plus className="w-4 h-4" /></button>
                                                </div>

                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={isProcessing}
                                                    className={cn(
                                                        "flex-2 py-5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:shadow-[0_20px_40px_rgba(45,58,58,0.15)] hover:-translate-y-0.5 transition-all flex items-center cursor-pointer justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-wait",
                                                        showSuccess
                                                            ? "bg-[#5A7A6A] text-white scale-105"
                                                            : "bg-[#2D3A3A] text-white"
                                                    )}
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : showSuccess ? (
                                                        <ShoppingBag className="w-4 h-4" />
                                                    ) : (
                                                        <ShoppingBag className="w-4 h-4" />
                                                    )}
                                                    {isProcessing ? "Adding..." : showSuccess ? "Added" : "Add to Bag"}
                                                </button>
                                            </div>

                                            <button
                                                onClick={handleQuickBuy}
                                                className="w-full py-5 bg-[#5A7A6A] text-white rounded-full text-[10px] cursor-pointer uppercase tracking-widest font-bold hover:bg-[#4A6A5A] hover:shadow-[0_20px_40px_rgba(90,122,106,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95">
                                                <Zap className="w-4 h-4 fill-white" /> Quick Buy — Direct Checkout
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full py-5 bg-gray-100 text-gray-400 rounded-full text-center text-xs uppercase tracking-widest font-bold cursor-not-allowed">
                                            Out of Stock
                                        </div>
                                    )}


                                    <button
                                        onClick={() => openWithContext(`Tell me about ${product.name}, its ingredients and how it helps.`)}
                                        className="w-full py-4 rounded-full border border-[#5A7A6A]/20 text-[#5A7A6A] cursor-pointer bg-white hover:bg-[#5A7A6A]/5 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-500" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Consult Aya</span>
                                    </button>
                                </div>

                                {/* Trust Infrastructure */}
                                <div className="mt-20 grid grid-cols-3 gap-10 border-t border-[#E8E6E2] pt-12 lg:opacity-50 hover:opacity-100 transition-opacity duration-700">
                                    {[
                                        { icon: Leaf, text: "Naturally Sourced" },
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


                    {/* Alchemy & Nutrition Sections */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-20 border-t border-[#E8E6E2]">
                        <div className="grid lg:grid-cols-2 gap-12 mt-5 lg:gap-20">
                            <div className="mt-20">
                                <h2 className="font-heading text-3xl text-[#2D3A3A] mb-10">The Ritual</h2>
                                <div className="space-y-5">
                                    {product.ingredient_details?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-end border-b border-[#E8E6E2] pb-4 group">
                                            <span className="text-[#5A6A6A] font-light md:text-xl  text-lg group-hover:text-[#5A7A6A] transition-colors">{item.name}</span>
                                            <span className="md:text-[10px] text-[8px] uppercase tracking-widest text-[#5A6A6A] font-bold">{item.certification}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#F3F1ED] rounded-[2.5rem] p-6 mt-10 lg:p-12 shadow-inner">
                                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-10 italic">Nutrition Facts</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { label: 'Energy', val: product.nutrition_facts?.calories, unit: 'kcal' },
                                        { label: 'Natural Sugar', val: product.nutrition_facts?.sugar, unit: '' },
                                        { label: 'Fiber', val: product.nutrition_facts?.fiber, unit: '' },
                                        { label: 'Serving', val: product.nutrition_facts?.serving_size, unit: '' }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-6 bg-white rounded-3xl text-center shadow-sm">
                                            <p className="md:text-[10px] text-[8px] text-[#5A6A6A] uppercase font-bold mb-2 tracking-widest">{stat.label}</p>
                                            <p className="md:text-3xl text-xl font-light text-[#2D3A3A]">{stat.val}<span className="text-xs ml-1 text-[#5A6A6A]">{stat.unit}</span></p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 p-6 border border-[#2D3A3A]/5 rounded-3xl bg-white/40 backdrop-blur-sm">
                                    <p className="text-xs text-[#7A8A8A] leading-relaxed">
                                        <span className="font-bold text-[#2D3A3A] uppercase tracking-tighter mr-2 italic">How to Enjoy:</span>
                                        {product.usage_instructions}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>



                    {/* Lifestyle Editorial Stack */}
                    <div className="mt-10 space-y-0 -mx-6 lg:-mx-10">
                        {product.lifestyle_images?.map((src: string, index: number) => (
                            <motion.div key={index} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }} className="w-full container mx-auto overflow-hidden group relative">
                                <Image
                                    width={2000}
                                    height={1200}
                                    src={src}
                                    alt=""
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Recommendations Section */}
                    <section className="mt-20 border-y border-[#E8E6E2] py-32">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Curated For You</p>
                                <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A]">You May Also <span className="italic font-serif font-light text-[#5A7A6A]">Enjoy.</span></h2>
                            </div>
                            <Link href="/products" className="hidden sm:flex items-center gap-2 text-xs text-[#5A7A6A] hover:underline uppercase tracking-widest font-bold">View Collection <ArrowRight className="w-4 h-4" /></Link>
                        </div>
                        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                            {relatedProducts.map((rel) => (
                                <div key={rel.id} className="w-[220px] md:w-[320px] flex-none snap-center">
                                    <ProductCard product={rel} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section */}
                    {
                        product.faq && product.faq.length > 0 && (
                            <div className="my-24  max-w-3xl mx-auto">
                                <h2 className="font-heading text-3xl text-[#2D3A3A] mb-12 text-center">Frequently Asked <span className="italic font-serif text-[#5A7A6A]">Questions.</span></h2>
                                <div className="space-y-4">
                                    {product.faq.map((item: any, i: number) => (
                                        <FAQItem key={i} question={item.question} answer={item.answer} />
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* 6. Product Reviews System */}
                <div id="reviews" className="mt-0">
                    <ProductReviews
                        productId={product.id}
                        reviews={reviews}
                        currentUserReview={currentUserReview}
                        isVerifiedBuyer={isVerifiedBuyer}
                    />
                </div>

                <Footer />
            </main>

            {/* MOBILE STICKY CTA */}
            <AnimatePresence>
                {showStickyCTA && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E6E2] p-4 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)] safe-area-pb"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#F3F1ED] rounded-xl p-1 shrink-0">
                                <Image
                                    width={100}
                                    height={100}
                                    src={product.image_urls?.[0]}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-heading text-sm text-[#2D3A3A] truncate">{product.name}</h3>
                                <p className="text-xs font-bold text-[#5A7A6A]">₹{currentPrice.toLocaleString()}</p>
                            </div>

                            {/* DYNAMIC ACTION BUTTON */}
                            {showSuccess ? (
                                <div className="flex items-center bg-[#2D3A3A] rounded-full p-1 shadow-lg">
                                    <button
                                        onClick={() => addToCart(product, -1)}
                                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 text-center text-xs font-bold text-white">
                                        {/* Since showSuccess is true, we assume at least 1, but ideally get real qty from cart context if possible, 
                                            or just reuse local quantity state if synced? 
                                            Better to just use + / - to add/remove 1 unit blindly or open cart?
                                            Let's blindly add/remove for now which triggers cart open */}
                                        <ShoppingBag className="w-3 h-3 inline" />
                                    </span>
                                    <button
                                        onClick={() => addToCart(product, 1)}
                                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isProcessing || product.stock_quantity <= 0}
                                    className={cn(
                                        "px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all active:scale-95",
                                        product.stock_quantity > 0
                                            ? "bg-[#2D3A3A] text-white shadow-lg shadow-[#2D3A3A]/20"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <ShoppingBag className="w-3 h-3" />
                                    )}
                                    {product.stock_quantity > 0 ? "Add to Bag" : "No Stock"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#E8E6E2]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 cursor-pointer flex justify-between items-center text-left hover:text-[#5A7A6A] transition-colors"
            >
                <span className="font-heading text-lg text-[#2D3A3A]">{question}</span>
                <ChevronDown className={cn("w-5 h-5 text-[#7A8A8A] transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-sm text-[#6A7A7A] leading-relaxed font-light max-w-2xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
