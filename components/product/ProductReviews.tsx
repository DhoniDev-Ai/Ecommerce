"use client";

import { useState } from "react";
import { Star, CheckCircle, Pencil } from "lucide-react";
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

export function ProductReviews({ productId, reviews, currentUserReview, isVerifiedBuyer }: ProductReviewsProps) {
    const [isWriting, setIsWriting] = useState(false);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <section className="py-24 border-t border-[#E8E6E2] bg-[#FDFBF7]">
            <div className="max-w-4xl mx-auto px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h2 className="font-heading text-3xl text-[#2D3A3A] mb-4">Customer Reviews</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className="w-4 h-4 fill-[#5A7A6A] text-[#5A7A6A]" />
                                ))}
                            </div>
                            <span className="text-sm text-[#7A8A8A] font-medium">{reviews.length} Verified Reviews</span>
                        </div>
                    </div>

                    {/* Write/Edit/Delete Button Logic */}
                    {!isWriting && isVerifiedBuyer && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsWriting(true)}
                                className="bg-[#2D3A3A] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5A7A6A] transition-colors flex items-center gap-2"
                            >
                                {currentUserReview ? (
                                    <><Pencil className="w-3 h-3" /> Edit Your Review</>
                                ) : (
                                    "Write a Review"
                                )}
                            </button>

                            {currentUserReview && (
                                <form action={async () => {
                                    if (confirm("Are you sure you want to delete your review?")) {
                                        const { deleteReview } = await import("@/actions/store/reviews");
                                        await deleteReview(productId);
                                    }
                                }}>
                                    <button
                                        type="submit"
                                        className="bg-red-50 text-red-600 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isWriting && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-16 overflow-hidden"
                        >
                            <ReviewForm
                                productId={productId}
                                existingReview={currentUserReview}
                                onCancel={() => setIsWriting(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Review List */}
                <div className="space-y-8">
                    {reviews.length === 0 ? (
                        <p className="text-center text-[#9AA09A] py-12 italic">No reviews yet. Be the first to share your experience!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-3xl border border-[#E8E6E2] shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#F3F1ED] flex items-center justify-center font-bold text-[#5A7A6A]">
                                            {review.author_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2D3A3A] text-sm">{review.author_name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-widest text-[#9AA09A]">{formatDate(review.created_at)}</span>
                                                {/* Always verified in this list as per logic, or check explicitly if needed */}
                                                <span className="flex items-center gap-1 text-[9px] font-bold text-[#5A7A6A] bg-[#E8F0E8] px-2 py-0.5 rounded-full">
                                                    <CheckCircle className="w-3 h-3" /> Verified Buyer
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < review.rating ? "fill-[#5A7A6A] text-[#5A7A6A]" : "text-[#E8E6E2]"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[#2D3A3A] leading-relaxed text-sm">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}