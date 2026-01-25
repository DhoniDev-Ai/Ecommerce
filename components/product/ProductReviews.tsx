"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Star, User, Loader2, Send, Pencil, Trash2, X, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface Review {
    id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    is_verified: boolean; // New logic for trust
    author_name?: string;
}

export function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isVerifiedRitualist, setIsVerifiedRitualist] = useState(false);

    // Form State
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const fetchRitualData = async () => {
        // Only show full loading on first mount if needed, or subtle indicator
        // setLoading(true); // Removed blocking loading as requested

        try {
            // 1. Get Curent Identity
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // 2. Fetch Reviews (Simple Select, no Joins)
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (reviewsError) throw reviewsError;

            // 3. Application-Side Join for User Details
            let enrichedReviews = [];

            if (reviewsData && reviewsData.length > 0) {
                // Get all unique user IDs from reviews
                const userIds = Array.from(new Set(reviewsData.map((r: any) => r.user_id)));

                // Fetch details for these users (if any)
                const { data: usersData } = await supabase
                    .from('users')
                    .select('id, full_name, email')
                    .in('id', userIds);

                // Map user_id to user details
                const userMap: Record<string, any> = {};
                if (usersData) {
                    usersData.forEach((u: any) => { userMap[u.id] = u; });
                }

                // Transform Reviews
                enrichedReviews = reviewsData.map((r: any) => {
                    const author = userMap[r.user_id];
                    return {
                        ...r,
                        author_name: author?.full_name || author?.email?.split('@')[0].toUpperCase() || "Anonymous Ritualist",
                        is_verified: true
                    };
                });
            }

            setReviews(enrichedReviews);

            // 4. Check "Verified Ritualist" status for current user separately
            if (user) {
                // Fetch valid purchase
                const { data: orders } = await supabase
                    .from('orders')
                    .select('id') // Simplified to avoid 400 Bad Request
                    .eq('user_id', user.id)
                    .eq('payment_status', 'paid');

                // Check if any order contains this product
                if (orders && orders.length > 0) {
                    const orderIds = (orders as any[]).map(o => o.id);
                    const { data: items } = await supabase
                        .from('order_items')
                        .select('product_id')
                        .in('order_id', orderIds)
                        .eq('product_id', productId)
                        .limit(1);

                    setIsVerifiedRitualist(!!items?.length);
                } else {
                    setIsVerifiedRitualist(false);
                }
            }

        } catch (err) {
            console.error("Failed to load ritual data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRitualData(); }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);

        const payload = {
            user_id: user.id,
            product_id: productId,
            rating,
            comment,
        };

        try {
            const { error } = editingId
                ? await (supabase.from('reviews') as any).update(payload).eq('id', editingId)
                : await (supabase.from('reviews') as any).insert(payload);

            if (error) throw error;

            // Optimistic Update or Refresh
            await fetchRitualData();
            resetForm();
            setIsFormOpen(false); // Close form after submit
        } catch (err: any) {
            console.error("Ritual Sync Failed", err);
            alert(`Failed to save ritual: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async (reviewId: string) => {
        try {
            const { error } = await (supabase.from('reviews') as any).delete().eq('id', reviewId);
            if (error) throw error;

            setReviews(prev => prev.filter(r => r.id !== reviewId)); // Immediate removal from UI
            setDeleteConfirmationId(null);
            if (editingId === reviewId) resetForm();
            // Also refresh to be sure
            await fetchRitualData();
        } catch (err: any) {
            console.error("Delete failed", err);
            alert(`Failed to delete ritual: ${err.message}`);
            // Re-fetch to restore state if delete failed
            await fetchRitualData();
        }
    };

    const startEdit = (review: Review) => {
        setEditingId(review.id);
        setRating(review.rating);
        setComment(review.comment || "");
        setIsFormOpen(true);
        // Smooth scroll to form
        const formElement = document.getElementById('ritual-form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const resetForm = () => {
        setEditingId(null);
        setRating(5);
        setComment("");
        setDeleteConfirmationId(null);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    // Removed the "loading" return. We render immediately.

    return (
        <section className="mt-10 py-10 bg-[#FDFBF7]/50 border-t border-[#E8E6E2]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* SUMMARY & INPUT */}
                    <div className="lg:col-span-4 space-y-10">
                        <header>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Community Voice</p>
                            <h2 className="text-4xl font-heading text-[#2D3A3A] tracking-tighter">Shared <span className="italic font-serif font-light text-[#5A7A6A]">Experiences.</span></h2>

                            <div className="mt-8 flex items-end gap-4">
                                <span className="text-6xl font-serif text-[#2D3A3A] leading-none">{averageRating || "—"}</span>
                                <div className="pb-1">
                                    <div className="flex gap-0.5 mb-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className={cn("w-3 h-3", s <= Math.round(Number(averageRating)) ? "fill-[#5A7A6A] text-[#5A7A6A]" : "text-[#E8E6E2]")} />)}
                                    </div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#9AA09A]">{reviews.length} Rituals Shared</p>
                                </div>
                            </div>
                        </header>

                        {user ? (
                            <div className="bg-white p-1 rounded-[2.5rem] border border-[#E8E6E2] shadow-sm overflow-hidden transition-all duration-500 ease-in-out">
                                {!isFormOpen ? (
                                    <button
                                        onClick={() => setIsFormOpen(true)}
                                        className="w-full p-8 flex flex-col items-center text-center gap-4 hover:bg-[#FDFBF7] transition-colors rounded-[2.5rem]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-[#F3F5F3] flex items-center justify-center">
                                            <Pencil className="w-5 h-5 text-[#5A7A6A]" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-heading text-lg text-[#2D3A3A]">Write a Review</p>
                                            <p className="text-xs text-[#9AA09A] font-light">Share your experience with the community</p>
                                        </div>
                                    </button>
                                ) : (
                                    <form id="ritual-form" onSubmit={handleSubmit} className="p-8 animate-in fade-in zoom-in-95 duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-[#2D3A3A] flex items-center gap-2">
                                                {isVerifiedRitualist ? <ShieldCheck className="w-4 h-4 text-[#5A7A6A]" /> : <Sparkles className="w-4 h-4 text-[#C68DFF]" />}
                                                {editingId ? "Refine your Ritual" : "Share your Ritual"}
                                            </h3>
                                            <button type="button" onClick={() => { setIsFormOpen(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                                <X className="w-4 h-4 text-[#9AA09A]" />
                                            </button>
                                        </div>

                                        <div className="flex gap-2 mb-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(null)} className="transition-transform active:scale-90 focus:outline-none">
                                                    <Star className={cn("w-6 h-6 transition-all", (hoveredStar || rating) >= star ? "fill-[#5A7A6A] text-[#5A7A6A]" : "text-[#E8E6E2]")} />
                                                </button>
                                            ))}
                                        </div>

                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Describe the essence of this ritual..."
                                            className="w-full h-32 p-5 bg-[#FDFBF7] border border-[#E8E6E2] rounded-2xl text-sm placeholder:text-[#9AA09A] mb-6 focus:border-[#5A7A6A] outline-none transition-all resize-none"
                                            autoFocus
                                        />

                                        <button disabled={submitting} className="w-full py-4 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-xl transition-all active:scale-95 disabled:opacity-70">
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Review" : "Post Ritual"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="p-10 bg-[#2D3A3A] rounded-[2.5rem] text-white text-center">
                                <p className="text-sm font-light mb-6 opacity-80">Join the collective to share your personal journey with this elixir.</p>
                                <Link href="/login" className="inline-block px-8 py-4 bg-white text-[#2D3A3A] rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">Sign In</Link>
                            </div>
                        )}
                    </div>

                    {/* REVIEWS LIST */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {reviews.map((review) => (
                                <motion.div
                                    key={review.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-[#E8E6E2]/60 relative group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#E8E6E2] flex items-center justify-center text-[#5A7A6A]"><User className="w-5 h-5" /></div>
                                            <div>
                                                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#2D3A3A] flex items-center gap-2">
                                                    {review.author_name}
                                                    <span className="text-[8px] bg-[#5A7A6A]/10 text-[#5A7A6A] px-2 py-0.5 rounded-full">Verified Ritualist</span>
                                                </h4>
                                                <p className="text-[9px] text-[#9AA09A] mt-1">{new Date(review.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-[#5A7A6A] text-[#5A7A6A]" : "text-[#E8E6E2]")} />)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#5A6A6A] leading-relaxed font-light">{review.comment}</p>

                                    {user?.id === review.user_id && (
                                        <div className="absolute bottom-6 right-8 flex gap-3 transition-opacity">
                                            {deleteConfirmationId === review.id ? (
                                                <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-full border border-red-100 animate-in fade-in slide-in-from-right-4">
                                                    <span className="text-[9px] text-red-500 font-bold px-2">Delete?</span>
                                                    <button onClick={() => confirmDelete(review.id)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                                    <button onClick={() => setDeleteConfirmationId(null)} className="p-1.5 bg-[#E8E6E2] text-[#7A8A8A] rounded-full hover:bg-[#D8D6D2] transition-colors"><X className="w-3 h-3" /></button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => startEdit(review)} className="p-2 hover:bg-[#FDFBF7] rounded-full transition-colors text-[#5A7A6A]" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setDeleteConfirmationId(review.id)} className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {reviews.length === 0 && !loading && (
                            <div className="text-center py-12 opacity-50">
                                <p className="text-sm text-[#7A8A8A]">No rituals shared yet. Be the first.</p>
                            </div>
                        )}

                        {loading && reviews.length === 0 && (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-[#E8E6E2]" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}