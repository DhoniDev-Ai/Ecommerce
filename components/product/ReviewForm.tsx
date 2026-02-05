"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { submitReview } from "@/actions/store/reviews";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#2D3A3A] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#5A7A6A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
        </button>
    );
}

interface ReviewFormProps {
    productId: string;
    existingReview?: { rating: number, comment: string } | null;
    onCancel: () => void;
}

export function ReviewForm({ productId, existingReview, onCancel }: ReviewFormProps) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(existingReview?.rating || 0);
    const [message, setMessage] = useState("");

    const clientAction = async (formData: FormData) => {
        const result = await submitReview({ message: "" }, formData);
        if (result.success) {
            onCancel(); // Close form on success (page revalidates automatically)
        } else {
            setMessage(result.message);
        }
    };

    return (
        <form action={clientAction} className="space-y-6 bg-white p-8 rounded-3xl border border-[#E8E6E2]">
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="rating" value={selectedRating} />

            <div className="space-y-4 text-center">
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#7A8B7A]">Rate your experience</label>
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setSelectedRating(star)}
                        >
                            <Star
                                className={`w-8 h-8 transition-colors ${star <= (hoveredRating || selectedRating)
                                        ? "fill-[#5A7A6A] text-[#5A7A6A]"
                                        : "text-[#E8E6E2]"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                    name="comment"
                    rows={4}
                    defaultValue={existingReview?.comment || ""}
                    placeholder="What did you like about this product?"
                    className="w-full p-4 bg-[#F9F8F6] border border-[#E8E6E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A7A6A]/20 resize-none text-sm text-[#2D3A3A] placeholder:text-[#9AA09A]"
                    required
                />
            </div>

            {message && (
                <p className="text-red-500 text-xs text-center">{message}</p>
            )}

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs border border-[#E8E6E2] text-[#7A8A8A] hover:bg-[#F3F1ED] transition-colors"
                >
                    Cancel
                </button>
                <div className="flex-1">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
