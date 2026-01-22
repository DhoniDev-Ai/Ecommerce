"use client";
import { cn } from "@/utils/cn";

interface PriceDisplayProps {
    price: number;
    comparisonPrice?: number;
    className?: string;
    priceClassName?: string;
    comparisonClassName?: string;
}

export function PriceDisplay({ price, comparisonPrice, className, priceClassName, comparisonClassName }: PriceDisplayProps) {
    const isOnSale = comparisonPrice && comparisonPrice > price;

    return (
        <div className={cn("flex flex-col items-center gap-0.5", className)}>
            <div className="flex items-center gap-3">
                {isOnSale && (
                    <span className={cn(
                        "text-[#9AA09A] line-through decoration-[#5A7A6A]/30 text-xs font-light",
                        comparisonClassName
                    )}>
                        ₹{comparisonPrice.toLocaleString()}
                    </span>
                )}
                <span className={cn(
                    "text-xl tracking-tight",
                    isOnSale ? "font-serif italic text-[#5A7A6A]" : "font-heading text-[#2D3A3A]",
                    priceClassName
                )}>
                    ₹{price.toLocaleString()}
                </span>
            </div>

            {isOnSale && (
                <span className="text-[7px] uppercase tracking-[0.4em] text-[#5A7A6A] font-black">
                    Offer Ritual
                </span>
            )}
        </div>
    );
}