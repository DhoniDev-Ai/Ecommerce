"use client";

import Link from "next/link";
import { Product } from "@/types";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { PriceDisplay } from "./PriceDisplay";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
    trendingRank?: number; // 1 = Top Bestseller, 2 = 2nd, etc.
    salesCount?: number;
}

export function ProductCard({ product, trendingRank, salesCount }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart, isAdding, isSuccess } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    // Use image from Supabase (fallback to safe default if empty)
    const productImage = product.image_urls?.[0] || "/assets/sea_buckthorn_pulp_300ml.png";
    const isProcessing = isAdding(product.id);
    const showSuccess = isSuccess(product.id);

    return (
        <article
            className="group relative flex flex-col transition-all duration-700 ease-out"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Visual Container */}
            <div className={cn(
                "relative aspect-square overflow-hidden rounded-[2.5rem] bg-[#F3F1ED] transition-all duration-500",
                trendingRank === 1 && "ring-1 ring-[#5A7A6A] ring-offset-4 ring-offset-[#FDFBF7]"
            )}>
                <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <div className="absolute inset-0 flex items-center justify-center p-10 max-sm:p-3">
                        <Image
                            width={1000}
                            height={1000}
                            src={productImage}
                            alt={product.name}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={cn(
                                "h-full w-full object-contain transition-all duration-1000 ease-out rounded-xl max-sm:rounded-4xl ",
                                isHovered ? "scale-110 rounded-4xl" : "scale-100 "
                            )}
                        />
                    </div>
                </Link>
                <button
                    onClick={handleAddToCart}
                    disabled={isProcessing}
                    className={cn(
                        "absolute bottom-6 right-6 flex h-6 w-6 md:h-12 md:w-12 items-center justify-center rounded-full shadow-xl cursor-pointer transition-all duration-500 z-10",

                        // 1. BASE STATE (Mobile & Tablet): Always Visible & In Position
                        "opacity-100 border-[0.5px] border-[#5A7A6A] translate-y-0",

                        // 2. DESKTOP STATE (Large Screens): Hidden by default
                        "lg:opacity-0 lg:translate-y-4",

                        // 3. HOVER STATE (Desktop Only): Slide up when the card (group) is hovered
                        "lg:group-hover:opacity-100 lg:group-hover:translate-y-0",

                        // 4. ACTIVE STATES: Force visibility if added successfully or processing
                        (showSuccess || isProcessing) && "opacity-100 translate-y-0 lg:opacity-100 lg:translate-y-0",

                        // 5. COLORS
                        showSuccess
                            ? "bg-[#5A7A6A] text-white scale-110"
                            : "bg-white text-[#2D3A3A] hover:bg-[#5A7A6A] hover:text-white",

                        isProcessing && "opacity-50"
                    )}
                >
                    <Plus className={cn("h-3 w-3 md:h-6 md:w-6 transition-transform", showSuccess && "rotate-90")} />
                </button>

                <div className="absolute bottom-4 left-4 max-sm:hidden flex flex-col gap-2">
                    {product.wellness_goals?.[0] && (
                        <span className="rounded-full bg-white/80 backdrop-blur-md px-4 py-1 text-[8px] font-bold tracking-[0.2em] text-[#5A7A6A] uppercase w-fit">
                            {product.wellness_goals[0]}
                        </span>
                    )}

                </div>
                <div className="absolute top-4 right-4 max-sm:right-4 max-sm:top-2 flex flex-col gap-2 z-10">
                    {(product.is_on_sale && product.sale_badge_text) && (
                        <span
                            className="
        font-heading text-[12px] leading-none tracking-[0.08em] uppercase
        
        px-3 py-2 max-sm:p-1  max-sm:text-[8px]  bg-red-50 text-red-600 rounded-full  font-bold border border-red-100
        shadow-[0_2px_4px_rgba(45,58,58,0.1)]
        
        inline-block w-fit
      "
                        >
                            {product.sale_badge_text}
                        </span>
                    )}
                    {/* Only show Most Loved for Rank 1. Hide "Trending" for 2, 3 etc. */}
                    {!product.is_on_sale && trendingRank === 1 && (
                        <span
                            className="font-heading text-[10px] leading-none tracking-[0.08em] uppercase px-3 py-2 max-sm:p-1 max-sm:text-[8px] rounded-full font-bold border shadow-sm inline-flex items-center gap-1 bg-[#2D3A3A] text-[#F3F1ED] border-[#2D3A3A]"
                        >
                            Start Here • Most Loved
                        </span>
                    )}
                </div>
            </div>

            {/* Refined Text Info */}
            <div className="mt-3 max-sm:mt-2 flex flex-col items-center text-center px-2">
                <h3 className="font-heading max-sm:text-sm    sm:text-lg  text-[#2D3A3A] leading-tight transition-colors group-hover:text-[#5A7A6A]">
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                {/* Safe render check: Ensure salesCount is truthy AND > 5 to avoid rendering '0' */}
                {(salesCount || 0) > 5 && (
                    <p className="text-[9px] uppercase tracking-widest text-[#5A7A6A] font-bold mt-1 opacity-80">
                        {salesCount}+ Bought this month
                    </p>
                )}

                {/* Clean Pricing Ritual */}
                <div className="mt-1 ">
                    <PriceDisplay
                        price={product.price}
                        comparisonPrice={product.comparison_price}
                        salePrice={product.sale_price}
                        isOnSale={product.is_on_sale}
                    />
                </div>

                {/* <p className="text-[10px] uppercase tracking-[0.2em] font-light text-[#7A8A8A] mt-2 opacity-60">
                    Cold Pressed
                </p> */}
            </div>
        </article>
    );
}