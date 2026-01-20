"use client";

import { useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface ProductFiltersProps {
    categories: string[];
    wellnessGoals: string[];
    selectedCategory: string | null;
    selectedGoal: string | null;
    onCategoryChange: (category: string | null) => void;
    onGoalChange: (goal: string | null) => void;
    className?: string;
}

export function ProductFilters({
    categories,
    wellnessGoals,
    selectedCategory,
    selectedGoal,
    onCategoryChange,
    onGoalChange,
    className,
}: ProductFiltersProps) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const hasActiveFilters = selectedCategory || selectedGoal;

    const clearFilters = () => {
        onCategoryChange(null);
        onGoalChange(null);
    };

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                    Categories
                </h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() =>
                                onCategoryChange(selectedCategory === category ? null : category)
                            }
                            className={cn(
                                "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                                selectedCategory === category
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-zinc-50 text-foreground hover:bg-zinc-100"
                            )}
                        >
                            {category}
                            {selectedCategory === category && (
                                <X className="h-4 w-4" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Wellness Goals */}
            <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                    Wellness Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                    {wellnessGoals.map((goal) => (
                        <button
                            key={goal}
                            onClick={() =>
                                onGoalChange(selectedGoal === goal ? null : goal)
                            }
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                                selectedGoal === goal
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                        >
                            {goal}
                            {selectedGoal === goal && <X className="h-3 w-3" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={clearFilters}
                >
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Filters */}
            <aside className={cn("hidden lg:block", className)}>
                <div className="sticky top-28 rounded-2xl bg-white p-6 shadow-sm border border-zinc-100">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-6">
                        Filters
                    </h2>
                    <FilterContent />
                </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
                <Button
                    variant="outline"
                    className="w-full rounded-full gap-2"
                    onClick={() => setShowMobileFilters(true)}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {(selectedCategory ? 1 : 0) + (selectedGoal ? 1 : 0)}
                        </span>
                    )}
                </Button>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading text-xl font-bold text-foreground">
                                Filters
                            </h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="rounded-full p-2 hover:bg-zinc-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <FilterContent />
                        <div className="mt-6 pt-6 border-t">
                            <Button
                                className="w-full rounded-full"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                Show Results
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

interface SortDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { value: "popularity", label: "Most Popular" },
        { value: "newest", label: "Newest" },
        { value: "price_asc", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
    ];

    const selectedLabel = options.find((o) => o.value === value)?.label || "Sort";

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm border border-zinc-100 hover:border-zinc-200 transition-colors"
            >
                {selectedLabel}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl bg-white py-2 shadow-xl border border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full px-4 py-2.5 text-left text-sm transition-colors",
                                    value === option.value
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-foreground hover:bg-zinc-50"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
