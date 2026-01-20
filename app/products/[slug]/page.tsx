"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, Leaf, Droplets, ShieldCheck, Sparkles, ArrowRight, ShoppingBag, Zap } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/utils/cn";

// Mock product data
const mockProducts: Product[] = [
    {
        id: "1",
        slug: "green-goddess-cleanse",
        name: "Green Goddess Cleanse",
        description: "A powerful detox blend of kale, spinach, apple, and lemon. Restore your natural balance and feel renewed.",
        price: 12.0,
        image_urls: [],
        category: "Cleanse",
        stock: 100,
        ingredients: ["Organic Kale", "Baby Spinach", "Green Apple", "Fresh Lemon", "Ginger Root"],
        benefits: ["Supports natural detoxification", "Boosts daily energy levels", "Rich in vitamins A, C, and K"],
        wellness_goals: ["Detox", "Energy"],
        nutrition_info: { calories: 85, sugar: "12g", fiber: "4g", vitamins: ["Vitamin A", "Vitamin C", "Vitamin K"], serving_size: "16 fl oz" },
        usage_guidance: "Best enjoyed cold, first thing in the morning on an empty stomach. Shake well before drinking.",
        safety_disclaimer: "This product is not intended to diagnose, treat, cure, or prevent any disease.",
        is_featured: true,
        popularity_score: 95,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        slug: "sunrise-citrus-roots",
        name: "Sunrise Citrus Roots",
        description: "Energizing carrot, orange, and ginger blend. The perfect morning companion to start your day with natural vitality.",
        price: 11.0,
        compare_at_price: 13.0,
        image_urls: [],
        category: "Juice",
        stock: 100,
        ingredients: ["Organic Carrot", "Fresh Orange", "Ginger Root", "Turmeric"],
        benefits: ["Supports immunity", "Natural vitamin C boost", "Anti-inflammatory properties"],
        wellness_goals: ["Immunity", "Energy"],
        nutrition_info: { calories: 95, sugar: "18g", fiber: "2g", vitamins: ["Vitamin A", "Vitamin C"], serving_size: "16 fl oz" },
        usage_guidance: "Enjoy cold or at room temperature. Perfect as a morning energizer.",
        safety_disclaimer: "This product is not intended to diagnose, treat, cure, or prevent any disease.",
        is_featured: true,
        popularity_score: 88,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        slug: "beet-it-up",
        name: "Beet It Up",
        description: "Earthy beets mixed with sweet apple and refreshing cucumber for a balanced cleanse that supports natural stamina.",
        price: 11.0,
        image_urls: [],
        category: "Juice",
        stock: 100,
        ingredients: ["Organic Beetroot", "Green Apple", "Cucumber", "Fresh Lemon"],
        benefits: ["Supports stamina", "Heart health", "Natural nitrates"],
        wellness_goals: ["Stamina", "Heart Health"],
        nutrition_info: { calories: 90, sugar: "16g", fiber: "3g", vitamins: ["Vitamin C", "Iron"], serving_size: "16 fl oz" },
        usage_guidance: "Best consumed 1-2 hours before physical activity for optimal stamina support.",
        safety_disclaimer: "This product is not intended to diagnose, treat, cure, or prevent any disease.",
        is_featured: false,
        popularity_score: 82,
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        slug: "tropical-immunity-boost",
        name: "Tropical Immunity Boost",
        description: "Mango, pineapple, and coconut water with a hint of turmeric for tropical wellness that supports your defenses.",
        price: 13.0,
        image_urls: [],
        category: "Smoothie",
        stock: 50,
        ingredients: ["Fresh Mango", "Pineapple", "Coconut Water", "Turmeric", "Black Pepper"],
        benefits: ["Immune support", "Hydration", "Vitamin C rich"],
        wellness_goals: ["Immunity", "Hydration"],
        nutrition_info: { calories: 120, sugar: "22g", fiber: "2g", vitamins: ["Vitamin C", "Vitamin B6"], serving_size: "16 fl oz" },
        usage_guidance: "Shake well and enjoy cold. Perfect for post-workout recovery.",
        safety_disclaimer: "This product is not intended to diagnose, treat, cure, or prevent any disease.",
        is_featured: true,
        popularity_score: 91,
        created_at: new Date().toISOString(),
    },
    {
        id: "5",
        slug: "calm-lavender-blend",
        name: "Calm Lavender Blend",
        description: "Soothing lavender, chamomile, and apple blend designed to help you unwind and relax after a long day.",
        price: 10.0,
        image_urls: [],
        category: "Wellness",
        stock: 75,
        ingredients: ["Organic Apple", "Lavender Extract", "Chamomile", "Raw Honey"],
        benefits: ["Relaxation", "Stress relief", "Better sleep"],
        wellness_goals: ["Relaxation", "Sleep"],
        nutrition_info: { calories: 70, sugar: "14g", fiber: "1g", vitamins: ["Vitamin C"], serving_size: "16 fl oz" },
        usage_guidance: "Best enjoyed warm or cold in the evening, 1-2 hours before bed.",
        safety_disclaimer: "This product is not intended to diagnose, treat, cure, or prevent any disease.",
        is_featured: false,
        popularity_score: 78,
        created_at: new Date().toISOString(),
    },
    {
        id: "6",
        slug: "sea-buckthorn-elixir",
        name: "Sea Buckthorn Elixir",
        description: "Himalayan sea buckthorn with amla and honey. Ancient wisdom meets modern wellness in this antioxidant-rich elixir.",
        price: 14.0,
        image_urls: [],
        category: "Wellness",
        stock: 60,
        ingredients: ["Sea Buckthorn Berry", "Amla", "Raw Himalayan Honey", "Ginger Root"],
        benefits: ["Rich in antioxidants", "Supports immunity", "Omega fatty acids"],
        wellness_goals: ["Immunity", "Vitality"],
        nutrition_info: { calories: 80, sugar: "10g", fiber: "2g", vitamins: ["Vitamin C", "Vitamin E"], serving_size: "16 fl oz" },
        usage_guidance: "Take one tablespoon daily or mix with warm water. Can be added to smoothies.",
        safety_disclaimer: "This product is not intended to diagnose, treat, cure, or prevent any disease.",
        is_featured: true,
        popularity_score: 92,
        created_at: new Date().toISOString(),
    },
];

// Gallery images for each product (4 views)
const getProductGallery = (productName: string) => {
    // Using available assets as different "views"
    const galleries: Record<string, string[]> = {
        "Green Goddess Cleanse": [
            "/assets/sea_buckthorn_pulp_300ml.png",
            "/assets/sea_buckthorn_pulp_300ml_1.png",
            "/assets/duo_shecare.png",
            "/assets/shecare_closup_duo.png",
        ],
        "Sunrise Citrus Roots": [
            "/assets/sea_buckthorn_pulp_300ml_1.png",
            "/assets/sea_buckthorn_pulp_300ml.png",
            "/assets/sea_buckthorn_pulp_500ml.png",
            "/assets/duo_shecare_2.png",
        ],
        "Beet It Up": [
            "/assets/sea_buckthorn_pulp_500ml.png",
            "/assets/sea_buckthorn_pulp_300ml.png",
            "/assets/duo_shecare.png",
            "/assets/shecare_closup_duo.png",
        ],
        "Tropical Immunity Boost": [
            "/assets/shecare_closup_duo.png",
            "/assets/duo_shecare.png",
            "/assets/sea_buckthorn_pulp_300ml.png",
            "/assets/duo_shecare_2.png",
        ],
        "Sea Buckthorn Elixir": [
            "/assets/sea_buckthorn_pulp_500ml.png",
            "/assets/sea_buckthorn_pulp_300ml_1.png",
            "/assets/duo_shecare_2.png",
            "/assets/shecare_closup_duo.png",
        ],
        "Calm Lavender Blend": [
            "/assets/duo_shecare.png",
            "/assets/duo_shecare_2.png",
            "/assets/sea_buckthorn_pulp_300ml.png",
            "/assets/sea_buckthorn_pulp_500ml.png",
        ],
    };
    return galleries[productName] || [
        "/assets/sea_buckthorn_pulp_300ml.png",
        "/assets/sea_buckthorn_pulp_300ml_1.png",
        "/assets/sea_buckthorn_pulp_500ml.png",
        "/assets/duo_shecare.png",
    ];
};

// Get main product image
const getProductImage = (productName: string) => {
    return getProductGallery(productName)[0];
};

// Get product-specific demo images with aspect ratios
const getProductDemoImages = (productName: string) => {
    const demoImages: Record<string, Array<{ src: string; aspectRatio: string }>> = {
        "Green Goddess Cleanse": [
            { src: "/assets/demo1.jpg", aspectRatio: "16/9" },
            { src: "/assets/Demo2.jpg", aspectRatio: "4/5" },
        ],
        "Sunrise Citrus Roots": [
            { src: "/assets/demo1.jpg", aspectRatio: "16/9" },
            { src: "/assets/Demo2.jpg", aspectRatio: "4/5" },
        ],
        "Beet It Up": [
            { src: "/assets/demo1.jpg", aspectRatio: "16/9" },
            { src: "/assets/Demo2.jpg", aspectRatio: "4/5" },
        ],
        "Tropical Immunity Boost": [
            { src: "/assets/demo1.jpg", aspectRatio: "16/9" },
            { src: "/assets/Demo2.jpg", aspectRatio: "4/5" },
        ],
        "Sea Buckthorn Elixir": [
            { src: "/assets/demo1.jpg", aspectRatio: "16/9" },
            { src: "/assets/Demo2.jpg", aspectRatio: "4/5" },
        ],
        "Calm Lavender Blend": [
            { src: "/assets/demo1.jpg", aspectRatio: "16/9" },
            { src: "/assets/Demo2.jpg", aspectRatio: "4/5" },
        ],
    };
    return demoImages[productName] || [
        { src: "/assets/demo1.jpg", aspectRatio: "16/9" },
        { src: "/assets/Demo2.jpg", aspectRatio: "4/5" },
    ];
};

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const product = mockProducts.find((p) => p.slug === slug);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    if (!product) {
        notFound();
    }

    const gallery = getProductGallery(product.name);
    const currentImage = gallery[selectedImageIndex];

    // Auto-rotate gallery images every 4 seconds (pause for 8 seconds if user clicks)
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [gallery.length, isPaused]);

    // Handle thumbnail click - pause for 8 seconds
    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsPaused(true);

        setTimeout(() => {
            setIsPaused(false);
        }, 8000);
    };

    // Get related products (exclude current, take 4)
    const relatedProducts = mockProducts
        .filter((p) => p.slug !== slug)
        .slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\"/%3E%3C/svg%3E')" }} />

            <Header />

            <main className="grow pt-32 pb-24 relative z-10">
                <div className="mx-auto max-w-7xl px-8 lg:px-12">

                    {/* Breadcrumb / Back Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7A8A8A] hover:text-[#5A7A6A] transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Collection
                        </Link>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

                        {/* Left: Product Gallery with Thumbnails */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-7 flex justify-center items-center flex-col"
                        >
                            {/* Main Image */}
                            <div className="relative max-w-[80%] aspect-square rounded-[3rem] overflow-hidden bg-[#F3F1ED] flex items-center justify-center p-10 lg:p-16 shadow-2xl shadow-black/5 mb-4">
                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    className="max-h-full w-auto object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.12)] transition-all duration-500"
                                />
                                {/* Floating "Cold Pressed" Badge */}
                                <div className="absolute top-8 left-8 h-16 w-16 rounded-full border border-[#5A7A6A]/10 flex items-center justify-center text-center text-[7px] uppercase tracking-[0.15em] text-[#5A7A6A] leading-tight backdrop-blur-sm bg-white/50">
                                    Cold <br /> Pressed
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="flex gap-3 justify-center">
                                {gallery.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={cn(
                                            "w-20 h-20 rounded-2xl overflow-hidden bg-[#F3F1ED] p-2 transition-all duration-300",
                                            selectedImageIndex === index
                                                ? "ring-2 ring-[#5A7A6A] ring-offset-2"
                                                : "opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Product Info & Purchase */}
                        <div className="lg:col-span-5 flex justify-center items-center pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] mb-6 font-semibold">
                                    {product.category} — Pure Ritual
                                </p>

                                <h1 className="font-heading text-4xl md:text-5xl text-[#2D3A3A] leading-[1.1] tracking-tight mb-6">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-3xl text-[#2D3A3A] font-light">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <div className="h-px grow bg-[#E8E6E2]" />
                                </div>

                                <p className="text-lg text-[#6A7A7A] leading-relaxed mb-6 font-light">
                                    {product.description}
                                </p>

                                {/* Wellness Tags */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {product.wellness_goals.map((goal) => (
                                        <span
                                            key={goal}
                                            className="px-4 py-1.5 rounded-full bg-white border border-[#5A7A6A]/10 text-[10px] uppercase tracking-widest text-[#5A7A6A]"
                                        >
                                            {goal}
                                        </span>
                                    ))}
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-sm text-[#5A6A6A]">Quantity</span>
                                    <div className="flex items-center border border-[#E8E6E2] rounded-full">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-[#5A6A6A] hover:text-[#2D3A3A] transition-colors cursor-pointer"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-medium text-[#2D3A3A]">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-[#5A6A6A] hover:text-[#2D3A3A] transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-[#9AA09A]">
                                        ${(product.price * quantity).toFixed(2)}
                                    </span>
                                </div>

                                {/* Purchase Buttons */}
                                <div className="flex gap-3 mb-4">
                                    {/* Add to Cart */}
                                    <button className="group relative cursor-pointer flex-1 py-4 bg-white border-2 border-[#2D3A3A] text-[#2D3A3A] rounded-full overflow-hidden transition-all duration-500 hover:shadow-lg">
                                        <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-sm">
                                            <ShoppingBag className="w-4 h-4" /> Add to Cart
                                        </span>
                                    </button>

                                    {/* Buy Now */}
                                    <button className="group relative cursor-pointer flex-1 py-4 bg-[#2D3A3A] text-white rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#2D3A3A]/20">
                                        <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-sm">
                                            <Zap className="w-4 h-4" /> Buy Now
                                        </span>
                                        <div className="absolute inset-0 bg-[#5A7A6A] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    </button>
                                </div>

                                {/* Ask AI Button */}
                                <button className="group w-full cursor-pointer py-4 rounded-full border border-[#5A7A6A]/20 text-[#5A7A6A] hover:bg-[#5A7A6A]/5 transition-all duration-300 flex items-center justify-center gap-3">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-medium">Ask AI About This Product</span>
                                </button>

                                {/* Quick Trust Icons */}
                                <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#E8E6E2] pt-8">
                                    <div className="text-center">
                                        <Leaf className="w-5 h-5 text-[#5A7A6A] mx-auto mb-2 opacity-60" />
                                        <span className="text-[9px] uppercase tracking-widest text-[#7A8A8A]">Organic</span>
                                    </div>
                                    <div className="text-center">
                                        <Droplets className="w-5 h-5 text-[#5A7A6A] mx-auto mb-2 opacity-60" />
                                        <span className="text-[9px] uppercase tracking-widest text-[#7A8A8A]">Pure</span>
                                    </div>
                                    <div className="text-center">
                                        <ShieldCheck className="w-5 h-5 text-[#5A7A6A] mx-auto mb-2 opacity-60" />
                                        <span className="text-[9px] uppercase tracking-widest text-[#7A8A8A]">Tested</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>


                    {/* Deep Details: Ingredients & Nutrition */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-20 border-t border-[#E8E6E2] "
                    >
                        <div className="grid lg:grid-cols-2 gap-12 mt-5  lg:gap-20">
                            <div className="mt-20">
                                <h2 className="font-heading text-3xl text-[#2D3A3A] mb-10">The Alchemy</h2>
                                <div className="space-y-5">
                                    {product.ingredients.map((item, i) => (
                                        <div key={i} className="flex justify-between items-end border-b border-[#E8E6E2] pb-4">
                                            <span className="text-[#5A6A6A] font-light">{item}</span>
                                            <span className="text-[10px] uppercase tracking-widest text-[#9AA09A]">Certified Organic</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#F3F1ED] rounded-[2.5rem] p-6 mt-10 lg:p-8">
                                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6">Nutrition Facts</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-xl text-center">
                                        <p className="text-xs text-[#9AA09A] mb-1">Calories</p>
                                        <p className="text-xl font-light text-[#2D3A3A]">{product.nutrition_info?.calories}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl text-center">
                                        <p className="text-xs text-[#9AA09A] mb-1">Sugar</p>
                                        <p className="text-xl font-light text-[#2D3A3A]">{product.nutrition_info?.sugar}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl text-center">
                                        <p className="text-xs text-[#9AA09A] mb-1">Fiber</p>
                                        <p className="text-xl font-light text-[#2D3A3A]">{product.nutrition_info?.fiber}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl text-center">
                                        <p className="text-xs text-[#9AA09A] mb-1">Serving</p>
                                        <p className="text-sm font-light text-[#2D3A3A]">{product.nutrition_info?.serving_size}</p>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 border border-[#2D3A3A]/5 rounded-xl">
                                    <p className="text-xs text-[#7A8A8A] leading-relaxed">
                                        <span className="font-semibold text-[#2D3A3A] uppercase tracking-wider mr-2">How to Enjoy:</span>
                                        {product.usage_guidance}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>



                    {/* Product Demo Images - Dynamic Vertical Stack */}
                    <div className="mt-16">
                        <div className="lg:mx-auto w-full">
                            <div className="flex flex-col gap-0">
                                {getProductDemoImages(product.name).map((demoImg, index) => (
                                    <div
                                        key={index}
                                        className="w-full"
                                        style={{ aspectRatio: demoImg.aspectRatio }}
                                    >
                                        <img
                                            src={demoImg.src}
                                            alt={`${product.name} - Demo Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products You May Like */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 border-t border-[#E8E6E2] pt-20"
                    >
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-[#7A8B7A] mb-3">Curated For You</p>
                                <h2 className="font-heading text-3xl text-[#2D3A3A]">You May Also Like</h2>
                            </div>
                            <Link
                                href="/products"
                                className="hidden sm:flex items-center gap-2 text-sm text-[#5A7A6A] hover:underline"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relProduct) => (
                                <Link
                                    key={relProduct.id}
                                    href={`/products/${relProduct.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-[#F3F1ED] mb-4 transition-all duration-300 border border-[#E8E6E2] group-hover:shadow-lg">
                                        <img
                                            src={getProductImage(relProduct.name)}
                                            alt={relProduct.name}
                                            className="w-full h-full object-contain scale-90 rounded transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-heading pl-4 text-sm text-[#2D3A3A] group-hover:text-[#5A7A6A] transition-colors mb-1">
                                        {relProduct.name}
                                    </h3>
                                    <p className="text-sm pl-4 text-[#7A8A8A] font-light">
                                        ${relProduct.price.toFixed(2)}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        {/* View All Button - Mobile */}
                        <div className="mt-10 text-center sm:hidden">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#5A7A6A]/20 text-sm text-[#5A7A6A] hover:bg-[#5A7A6A]/5 transition-colors"
                            >
                                View All Products <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Safety Disclaimer */}
                    {product.safety_disclaimer && (
                        <div className="mt-16 p-6 rounded-2xl bg-[#F8F6F2] border border-[#E8E6E2]">
                            <p className="text-xs text-[#9AA09A] leading-relaxed text-center">
                                {product.safety_disclaimer}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}