"use client";

import { useState, useMemo } from "react";
import { Star, CheckCircle, Pencil, ChevronDown, Quote } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
    id: string;
    user_id: string;
    rating: number;
    comment: string;
    author_name: string;
    created_at: string;
    updated_at?: string;
}

interface ProductReviewsProps {
    productId: string;
    reviews: Review[];
    currentUserReview?: Review | null;
    isVerifiedBuyer: boolean;
}

const REVIEWS_PER_PAGE = 4;

// Color palette for reviewer avatars
const avatarColors = [
    "bg-[#E8F0E8] text-[#5A7A6A]",
    "bg-[#FFF3E0] text-[#8B6914]",
    "bg-[#EDE7F6] text-[#5E35B1]",
    "bg-[#E3F2FD] text-[#1565C0]",
    "bg-[#FCE4EC] text-[#AD1457]",
    "bg-[#F3E5F5] text-[#7B1FA2]",
];

export function ProductReviews({ productId, reviews, currentUserReview, isVerifiedBuyer }: ProductReviewsProps) {
    const [isWriting, setIsWriting] = useState(false);
    const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

    // --- STATS ---
    const stats = useMemo(() => {
        if (reviews.length === 0) return { avg: 0, distribution: [0, 0, 0, 0, 0] };
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / reviews.length;
        const distribution = [5, 4, 3, 2, 1].map(
            star => reviews.filter(r => r.rating === star).length
        );
        return { avg: Math.round(avg * 10) / 10, distribution };
    }, [reviews]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

    const visibleReviews = reviews.slice(0, visibleCount);
    const hasMore = visibleCount < reviews.length;

    return (
        <section className="py-20 border-t border-[#E8E6E2] bg-[#FDFBF7]">
            <div className="max-w-5xl mx-auto px-6 md:px-8">

                {/* ── HEADER ── */}
                <div className="text-center mb-14">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5A7A6A] bg-[#E8F0E8] px-4 py-1.5 rounded-full inline-block mb-5"
                    >
                        Customer Stories
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-3xl md:text-4xl text-[#2D3A3A] tracking-tight"
                    >
                        What People Are Saying
                    </motion.h2>
                </div>

                {/* ── RATING SUMMARY + WRITE BUTTON ── */}
                {reviews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-3xl border border-[#E8E6E2] shadow-sm p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center gap-8"
                    >
                        {/* Left: Big average */}
                        <div className="flex flex-col items-center gap-2 md:min-w-[140px]">
                            <span className="font-heading text-5xl text-[#2D3A3A]">{stats.avg}</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= Math.round(stats.avg) ? "fill-[#5A7A6A] text-[#5A7A6A]" : "text-[#E8E6E2]"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-[#9AA09A] font-medium">{reviews.length} reviews</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-20 bg-[#E8E6E2]" />

                        {/* Right: Distribution bars */}
                        <div className="flex-1 w-full space-y-2">
                            {[5, 4, 3, 2, 1].map((star, idx) => {
                                const count = stats.distribution[idx];
                                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-3 text-xs">
                                        <span className="w-3 font-bold text-[#2D3A3A]">{star}</span>
                                        <Star className="w-3 h-3 fill-[#5A7A6A] text-[#5A7A6A]" />
                                        <div className="flex-1 h-2 bg-[#F3F1ED] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${pct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: 0.2 + idx * 0.05 }}
                                                className="h-full bg-[#5A7A6A] rounded-full"
                                            />
                                        </div>
                                        <span className="w-6 text-right text-[#9AA09A] font-mono">{count}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Write Review button */}
                        {isVerifiedBuyer && !isWriting && (
                            <div className="flex flex-col gap-2 shrink-0">
                                <button
                                    onClick={() => setIsWriting(true)}
                                    className="bg-[#2D3A3A] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#5A7A6A] transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    {currentUserReview ? <><Pencil className="w-3 h-3" /> Edit Review</> : "Write Review"}
                                </button>
                                {currentUserReview && (
                                    <form action={async () => {
                                        if (confirm("Delete your review?")) {
                                            const { deleteReview } = await import("@/actions/store/reviews");
                                            await deleteReview(productId);
                                        }
                                    }}>
                                        <button type="submit" className="w-full text-red-500 text-[10px] font-bold uppercase tracking-widest hover:text-red-700 transition-colors py-1">
                                            Delete
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── REVIEW FORM ── */}
                <AnimatePresence>
                    {isWriting && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-10 overflow-hidden"
                        >
                            <ReviewForm
                                productId={productId}
                                existingReview={currentUserReview}
                                onCancel={() => setIsWriting(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── REVIEW CARDS ── */}
                {reviews.length === 0 ? (
                    <div className="text-center py-16">
                        <Quote className="w-8 h-8 text-[#E8E6E2] mx-auto mb-4" />
                        <p className="text-[#9AA09A] italic text-sm">No reviews yet. Be the first to share your experience!</p>
                        {isVerifiedBuyer && !isWriting && (
                            <button
                                onClick={() => setIsWriting(true)}
                                className="mt-4 bg-[#2D3A3A] text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#5A7A6A] transition-colors"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {visibleReviews.map((review, idx) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: idx < REVIEWS_PER_PAGE ? idx * 0.08 : 0 }}
                                        className="bg-white p-5 rounded-2xl border border-[#E8E6E2] hover:border-[#d4d0ca] hover:shadow-md transition-all duration-300 flex flex-col"
                                    >
                                        {/* Top row */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[idx % avatarColors.length]}`}>
                                                    {review.author_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#2D3A3A] text-sm leading-tight">{review.author_name}</h4>
                                                    <span className="text-[10px] text-[#9AA09A]">{formatDate(review.created_at)}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < review.rating ? "fill-[#5A7A6A] text-[#5A7A6A]" : "text-[#E8E6E2]"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="flex items-center gap-1 text-[8px] font-bold text-[#5A7A6A] bg-[#E8F0E8] px-1.5 py-0.5 rounded-full">
                                                    <CheckCircle className="w-2.5 h-2.5" /> Verified
                                                </span>
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-[#2D3A3A] text-sm leading-relaxed flex-1">{review.comment}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Show More */}
                        {hasMore && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center mt-8"
                            >
                                <button
                                    onClick={() => setVisibleCount(prev => prev + REVIEWS_PER_PAGE)}
                                    className="inline-flex items-center gap-2 text-[#5A7A6A] text-xs font-bold uppercase tracking-widest hover:text-[#2D3A3A] transition-colors group"
                                >
                                    Show More Reviews ({reviews.length - visibleCount} remaining)
                                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}