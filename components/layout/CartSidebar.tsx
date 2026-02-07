"use client";
import { useState, useEffect, useMemo } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Info, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "@/lib/framer";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/context/CartContext";

export function CartSidebar() {
    const { isOpen, closeCart, cartItems, addToCart, removeFromCart, updateQuantity, cartTotal } = useCartContext(); // Added addToCart
    const [showShippingInfo, setShowShippingInfo] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

    useEffect(() => {
        async function fetchRecommendations() {
            const { data } = await supabase
                .from('products')
                .select('id, name, price, image_urls, slug, sale_price')
                .eq('is_active', true)
                .limit(3);

            if (data) setRecommendedProducts(data);
        }
        fetchRecommendations();
    }, []);

    // Reset confirm delete when cart closes
    useEffect(() => {
        if (!isOpen) {
            setConfirmDeleteId(null);
        }
    }, [isOpen]);

    const handleQuantity = (itemId: string, currentQty: number, delta: number) => {
        updateQuantity(itemId, currentQty + delta);
    };

    const handleRemove = (itemId: string) => {
        removeFromCart(itemId);
        setConfirmDeleteId(null);
    };

    const total = cartTotal;
    const isFreeShipping = true; // LAUNCH OFFER
    // const isFreeShipping = total >= 2500;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#2D3A3A]/10 backdrop-blur-md z-100"
                        onClick={closeCart}
                    />
                )}
            </AnimatePresence>

            <aside className={cn(
                "fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFBF7] shadow-[0_0_100px_rgba(45,58,58,0.08)] z-101 flex flex-col transition-transform duration-700 cubic-bezier(0.19, 1, 0.22, 1)",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <header className="p-10 flex items-center justify-between border-b border-[#E8E6E2]/40">
                    <div>
                        <p className="text-[8px] uppercase tracking-[0.5em] text-[#7A8B7A] font-bold mb-1">Ritual Archive</p>
                        <h2 className="text-xl font-heading text-[#2D3A3A] tracking-tighter">Wellness Bag</h2>
                    </div>
                    <button onClick={closeCart} className="p-2 hover:bg-[#F3F1ED] rounded-full cursor-pointer transition-colors">
                        <X className="w-4 h-4 text-[#2D3A3A]" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-10 py-6 space-y-10 custom-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                            <ShoppingBag className="w-8 h-8 stroke-[1px]" />
                            <p className="text-[10px] uppercase tracking-[0.3em] font-medium italic">Your Bag is waiting to be filled</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="group relative flex gap-6 items-center">
                                <AnimatePresence>
                                    {confirmDeleteId === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-between px-6"
                                        >
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3 text-red-500" />
                                                <p className="text-[8px] uppercase tracking-widest font-bold">Dissolve?</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setConfirmDeleteId(null)} className="text-[8px] uppercase font-bold text-[#7A8A8A] cursor-pointer">Cancel</button>
                                                <button onClick={() => handleRemove(item.id)} className="text-[8px] uppercase font-bold text-red-500 cursor-pointer">Remove</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Link href={`/products/${item.slug}`} onClick={closeCart} className="w-16 h-16 bg-[#F3F1ED] rounded-2xl p-2 shrink-0 cursor-pointer hover:scale-105 transition-transform duration-500">
                                    <Image
                                        width={1000}
                                        height={1000} src={item.image_urls?.[0]} className="w-full h-full object-contain" alt="" />
                                </Link>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <Link href={`/products/${item.slug}`} onClick={closeCart} className="block group-hover:text-[#5A7A6A] transition-colors cursor-pointer">
                                        <h4 className="text-xs font-heading text-[#2D3A3A] truncate">{item.name}</h4>
                                    </Link>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-[#FDFBF7] border border-[#E8E6E2]/40 rounded-full px-2">
                                            <button onClick={() => handleQuantity(item.id, item.quantity, -1)} disabled={item.quantity <= 1} className="p-1 opacity-40 hover:opacity-100 disabled:opacity-10 cursor-pointer"><Minus className="w-2.5 h-2.5" /></button>
                                            <span className="w-6 text-center text-[10px] font-bold">{item.quantity}</span>
                                            <button onClick={() => handleQuantity(item.id, item.quantity, 1)} className="p-1 opacity-40 hover:opacity-100 cursor-pointer"><Plus className="w-2.5 h-2.5" /></button>
                                        </div>
                                        <button onClick={() => setConfirmDeleteId(item.id)} className="text-[#5A6A6A] hover:text-red-400 ld:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-xs font-bold text-[#2D3A3A]">₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Recommendations Section */}
                {recommendedProducts.length > 0 && (
                    <div className="px-10 py-6 border-t border-[#E8E6E2]/40 bg-[#F8F6F3]">
                        <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#7A8A8A] mb-4">You Might Also Like</p>
                        <div className="space-y-4">
                            {recommendedProducts.filter(p => !cartItems.some(item => item.id === p.id)).slice(0, 2).map((product) => (
                                <div key={product.id} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-white rounded-xl p-1 shrink-0 border border-[#E8E6E2]">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={product.image_urls?.[0]}
                                            alt={product.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/products/${product.slug}`} onClick={closeCart}>
                                            <h4 className="text-xs font-heading text-[#2D3A3A] truncate group-hover:text-[#5A7A6A] transition-colors">{product.name}</h4>
                                        </Link>
                                        <p className="text-[10px] font-bold text-[#5A6A6A]">₹{product.sale_price || product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product, 1)}
                                        className="w-8 h-8 rounded-full border border-[#5A7A6A]/20 flex items-center justify-center text-[#5A7A6A] hover:bg-[#5A7A6A] hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer remained consistent with your design */}
                {cartItems.length > 0 && (
                    <footer className="p-10 bg-white border-t border-[#E8E6E2]/40 space-y-8 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                        <div className="space-y-3 relative">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#7A8A8A]">Shipping Ritual</span>
                                    <button onMouseEnter={() => setShowShippingInfo(true)} onMouseLeave={() => setShowShippingInfo(false)} className="cursor-help opacity-40 hover:opacity-100 transition-opacity"><Info className="w-2.5 h-2.5 text-[#5A7A6A]" /></button>
                                </div>
                                <AnimatePresence>
                                    <motion.span initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#5A7A6A] animate-pulse">
                                        Launch Gift Unlocked
                                    </motion.span>
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {showShippingInfo && (
                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full mb-3 left-0 w-full bg-[#2D3A3A] text-white p-4 rounded-2xl text-[9px] tracking-[0.15em] leading-relaxed z-10 shadow-2xl">
                                        Enjoy <span className="text-[#5A7A6A] font-bold">Complimentary Shipping</span> on all orders during our launch month.
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="h-0.5 bg-[#F3F1ED] rounded-full overflow-hidden">
                                <motion.div className="h-full bg-[#5A7A6A]" initial={{ width: "100%" }} animate={{ width: "100%" }} />
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#2D3A3A]">Archive Total</span>
                            <span className="text-3xl font-heading italic text-[#2D3A3A]">₹{total.toLocaleString()}</span>
                        </div>

                        <Link href="/checkout" onClick={closeCart} className="w-full py-6 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:shadow-2xl transition-all active:scale-95">
                            Finalize Ritual <ShoppingBag className="w-3 h-3" />
                        </Link>
                    </footer>
                )}
            </aside>
        </>
    );
}