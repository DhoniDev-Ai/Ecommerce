"use client";

import { cn } from "@/utils/cn";

interface PriceDisplayProps {
    price: number;
    comparisonPrice?: number;
    badgeText?: string;
    priceClassName?: string;
    comparisonClassName?: string;
    currency?: string;
}

/**
 * PriceDisplay Component
 * 
 * Handles consistent "sale price" display logic across ProductCard and Product Detail pages.
 * Shows strikethrough for comparison prices and optional sale badges.
 * 
 * @param price - Current selling price
 * @param comparisonPrice - Original/comparison price (if higher, shows as strikethrough)
 * @param badgeText - Optional text to show below price (e.g., "SAVE 20%")
 * @param priceClassName - Custom classes for the main price
 * @param comparisonClassName - Custom classes for the comparison price
 * @param currency - Currency symbol (default: "₹")
 */
export function PriceDisplay({
    price,
    comparisonPrice,
    badgeText,
    priceClassName,
    comparisonClassName,
    currency = "₹"
}: PriceDisplayProps) {
    // Only show sale UI if comparison price exists and is genuinely higher
    const isOnSale = comparisonPrice !== undefined && comparisonPrice > price;

    // Calculate discount percentage for the badge if needed
    const discountPercentage = isOnSale
        ? Math.round((1 - price / comparisonPrice!) * 100)
        : 0;

    // Auto-generate badge text if on sale but no custom badge provided
    const displayBadge = badgeText || (isOnSale ? `SAVE ${discountPercentage}%` : null);

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
                {/* Ghost Price - The "cut" original price */}
                {isOnSale && (
                    <span
                        className={cn(
                            "text-[#7A8A8A] line-through decoration-[#5A7A6A]/40 text-sm font-light opacity-60",
                            comparisonClassName
                        )}
                    >
                        {currency}{comparisonPrice!.toLocaleString()}
                    </span>
                )}

                {/* Main Price - Highlighted when on sale */}
                <span
                    className={cn(
                        "text-2xl font-serif italic tracking-tight",
                        isOnSale ? "text-[#5A7A6A]" : "text-[#2D3A3A]",
                        priceClassName
                    )}
                >
                    {currency}{price.toLocaleString()}
                </span>
            </div>

            {/* Sale Badge - Sage Green accent */}
            {isOnSale && displayBadge && (
                <span className="text-[7px] uppercase tracking-[0.4em] text-[#5A7A6A] font-bold mt-1">
                    {displayBadge}
                </span>
            )}
        </div>
    );
}
