"use client";
import { motion } from "framer-motion";

export function ProductSkeleton() {
    // A subtle shimmer animation for that "Antigravity" feel
    const pulse = {
        initial: { opacity: 0.6 },
        animate: { opacity: 1 },
        transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse" as const,
        },
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                {/* Breadcrumb Skeleton */}
                <motion.div {...pulse} className="w-32 h-3 bg-[#F3F1ED] rounded-full mb-12" />

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* LEFT: Gallery Skeleton */}
                    <div className="lg:col-span-7 space-y-10 flex flex-col items-center">
                        <motion.div
                            {...pulse}
                            className="w-full max-w-[75%] aspect-square bg-white rounded-[4rem] shadow-sm border border-[#E8E6E2]/40"
                        />
                        <div className="flex gap-5">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    {...pulse}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-16 h-16 rounded-2xl bg-white border border-[#E8E6E2]/40"
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Content Skeleton */}
                    <div className="lg:col-span-5 pt-8 space-y-10">
                        <div className="space-y-4">
                            <motion.div {...pulse} className="w-24 h-2 bg-[#7A8B7A]/20 rounded-full" />

                            {/* Staggered Title Skeleton */}
                            <div className="space-y-4">
                                <motion.div {...pulse} className="w-4/5 h-16 bg-[#2D3A3A]/5 rounded-3xl" />
                                <motion.div {...pulse} className="w-3/5 h-16 bg-[#5A7A6A]/10 rounded-3xl ml-12" />
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <motion.div {...pulse} className="w-32 h-10 bg-[#2D3A3A]/5 rounded-2xl" />
                            <div className="h-px grow bg-[#E8E6E2]" />
                        </div>

                        <div className="space-y-3">
                            <motion.div {...pulse} className="w-full h-4 bg-[#F3F1ED] rounded-full" />
                            <motion.div {...pulse} className="w-11/12 h-4 bg-[#F3F1ED] rounded-full" />
                            <motion.div {...pulse} className="w-4/5 h-4 bg-[#F3F1ED] rounded-full" />
                        </div>

                        {/* Button Skeletons */}
                        <div className="space-y-4 pt-6">
                            <div className="flex gap-4">
                                <motion.div {...pulse} className="w-32 h-14 bg-[#F3F1ED] rounded-full" />
                                <motion.div {...pulse} className="flex-1 h-14 bg-[#2D3A3A]/10 rounded-full" />
                            </div>
                            <motion.div {...pulse} className="w-full h-14 bg-[#5A7A6A]/20 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Skeleton */}
                <div className="mt-32 grid lg:grid-cols-2 gap-20 border-t border-[#E8E6E2] pt-20">
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div key={i} {...pulse} className="w-full h-12 bg-white rounded-2xl border border-[#E8E6E2]/40" />
                        ))}
                    </div>
                    <motion.div {...pulse} className="h-80 bg-[#F3F1ED] rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    );
}