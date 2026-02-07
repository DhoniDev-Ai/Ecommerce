"use client";
import { cn } from "@/utils/cn";

interface PriceDisplayProps {
    price: number;
    salePrice?: number;
    comparisonPrice?: number;
    isOnSale?: boolean;
    className?: string;
    priceClassName?: string;
    comparisonClassName?: string;
}

export function PriceDisplay({ price, salePrice, comparisonPrice, isOnSale: explicitIsOnSale, className, priceClassName, comparisonClassName }: PriceDisplayProps) {
    // Logic: 
    // 1. If explicitly on sale and salePrice exists -> Main: salePrice, Strikethrough: comparisonPrice (or price fallback)
    // 2. If comparisonPrice > price -> Main: price, Strikethrough: comparisonPrice
    // 3. Otherwise -> Main: price, No Strikethrough

    const hasSaleOverride = explicitIsOnSale && !!salePrice;
    const effectivePrice = hasSaleOverride ? salePrice : price;
    const effectiveCompare = hasSaleOverride ? (comparisonPrice || price) : comparisonPrice;

    // Auto-detect sale state if comparison price is higher than selling price
    const isDiscounted = explicitIsOnSale || (!!effectiveCompare && effectiveCompare > effectivePrice);


    return (
        <div className={cn("flex flex-col items-center gap-0.5", className)}>
            <div className="flex items-center gap-3">
                {isDiscounted && effectiveCompare && (
                    <span className={cn(
                        "text-[#5A6A6A] line-through decoration-[#5A7A6A]/30 text-xs font-light",
                        comparisonClassName
                    )}>
                        ₹{effectiveCompare.toLocaleString()}
                    </span>
                )}
                <span className={cn(
                    "text-xl max-sm:text-base  tracking-tight",
                    isDiscounted ? "font-serif italic text-[#5A7A6A]" : "font-heading italic text-[#2D3A3A]",
                    priceClassName
                )}>
                    ₹{effectivePrice.toLocaleString()}
                </span>
            </div>

            {isDiscounted && (
                <span className="text-[7px] uppercase tracking-[0.4em] text-[#5A7A6A] font-black">
                    Offer Ritual
                </span>
            )}
        </div>
    );
}