"use client";

import Link from "next/link";
import { Product } from "@/types";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { PriceDisplay } from "./PriceDisplay";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart, isAdding, isSuccess } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, product.price);
    };

    const getProductImage = () => {
        const nameToImage: Record<string, string> = {
            "Green Goddess Cleanse": "/assets/sea_buckthorn_pulp_300ml.png",
            "Sunrise Citrus Roots": "/assets/sea_buckthorn_pulp_300ml_1.png",
            "Beet It Up": "/assets/sea_buckthorn_pulp_500ml.png",
            "Tropical Immunity Boost": "/assets/shecare_closup_duo.png",
            "Sea Buckthorn Elixir": "/assets/sea_buckthorn_pulp_500ml.png",
            "Calm Lavender Blend": "/assets/duo_shecare.png",
            "Protein Power Green": "/assets/duo_shecare_2.png",
        };
        return nameToImage[product.name] || product.image_urls?.[0] || "/assets/sea_buckthorn_pulp_300ml.png";
    };

    const productImage = getProductImage();
    const isProcessing = isAdding(product.id);
    const showSuccess = isSuccess(product.id);

    return (
        <article
            className="group relative flex flex-col transition-all duration-700 ease-out"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Visual Container */}
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-[#F3F1ED]">
                <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <div className="absolute inset-0 flex items-center justify-center p-10">
                        <img
                            src={productImage}
                            alt={product.name}
                            className={cn(
                                "h-full w-full object-contain transition-transform duration-1000 ease-out",
                                isHovered ? "scale-110" : "scale-100"
                            )}
                        />
                    </div>
                </Link>

                <button
                    onClick={handleAddToCart}
                    disabled={isProcessing}
                    className={cn(
                        "absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full shadow-xl cursor-pointer transition-all duration-500 z-10",
                        isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                        showSuccess
                            ? "bg-[#5A7A6A] text-white scale-110"
                            : "bg-white text-[#2D3A3A] hover:bg-[#5A7A6A] hover:text-white",
                        isProcessing && "opacity-50"
                    )}
                >
                    <Plus className={cn("h-5 w-5 transition-transform", showSuccess && "rotate-90")} />
                </button>

                <div className="absolute top-6 left-6">
                    <span className="rounded-full bg-white/80 backdrop-blur-md px-4 py-1 text-[8px] font-bold tracking-[0.2em] text-[#5A7A6A] uppercase">
                        {product.wellness_goals?.[0]}
                    </span>
                </div>
            </div>

            {/* Refined Text Info */}
            <div className="mt-3 flex flex-col items-center text-center px-2">
                <h3 className="font-heading text-lg text-[#2D3A3A] leading-tight transition-colors group-hover:text-[#5A7A6A]">
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                </h3>

                {/* Clean Pricing Ritual */}
                <div className="mt-1 ">
                    <PriceDisplay
                        price={product.price}
                        comparisonPrice={product.compare_at_price}
                    />
                </div>

                {/* <p className="text-[10px] uppercase tracking-[0.2em] font-light text-[#7A8A8A] mt-2 opacity-60">
                    Cold Pressed
                </p> */}
            </div>
        </article>
    );
}