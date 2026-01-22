"use client";
import { useState, useEffect, useMemo } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import { useCartContext } from "@/context/CartContext";
import Link from "next/link";

export function CartSidebar() {
    const { isOpen, closeCart, refreshCart } = useCartContext();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const fetchCartItems = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setLoading(true);
        const { data } = await supabase
            .from('cart_items')
            .select(`
                id, quantity, price_at_add, currency,
                products ( name, image_urls, slug )
            `)
            .order('updated_at', { ascending: false });

        if (data) setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchCartItems();
            setConfirmDeleteId(null); // Reset alerts on open
        }
    }, [isOpen]);

    const handleQuantity = async (itemId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        // Safety Guard: Prevent 0 quantity via minus button
        if (newQty < 1) return;

        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, quantity: newQty } : item
        ));

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQty })
            .eq('id', itemId);

        if (error) fetchCartItems();
        refreshCart();
    };

    const handleRemove = async (itemId: string) => {
        // Optimistic UI Removal
        setItems(prev => prev.filter(item => item.id !== itemId));
        setConfirmDeleteId(null);

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId);

        if (error) fetchCartItems();
        refreshCart();
    };

    const total = useMemo(() =>
        items.reduce((sum, item) => sum + (item.price_at_add * item.quantity), 0),
        [items]);

    return (
        <>
            <div className={cn("fixed inset-0 bg-[#2D3A3A]/20 backdrop-blur-sm z-[100] transition-opacity duration-500",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={closeCart} />

            <aside className={cn("fixed top-0 right-0 h-full w-full max-w-lg bg-[#FDFBF7] shadow-2xl z-[101] flex flex-col transition-transform duration-500 ease-out",
                isOpen ? "translate-x-0" : "translate-x-full")}>

                <header className="flex items-center justify-between p-8 border-b border-[#E8E6E2]">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-2">The Archive</p>
                        <h2 className="text-2xl font-heading text-[#2D3A3A]">Wellness Bag</h2>
                    </div>
                    <button onClick={closeCart} className="p-3 rounded-full hover:bg-[#F3F1ED] cursor-pointer transition-transform active:scale-90">
                        <X className="w-5 h-5 text-[#2D3A3A]" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading && items.length === 0 ? (
                        <div className="flex items-center justify-center h-full opacity-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <ShoppingBag className="w-12 h-12 text-[#E8E6E2]" />
                            <p className="font-serif italic text-[#7A8A8A]">Your bag is currently silent.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="relative group">
                                    {/* Confirmation Overlay */}
                                    {confirmDeleteId === item.id && (
                                        <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-[2rem] flex items-center justify-between px-8 animate-in fade-in zoom-in duration-300">
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D3A3A]">Dissolve this ritual?</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setConfirmDeleteId(null)} className="text-[9px] uppercase font-bold text-[#7A8A8A] cursor-pointer">Cancel</button>
                                                <button onClick={() => handleRemove(item.id)} className="text-[9px] uppercase font-bold text-red-500 cursor-pointer">Remove</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-5 p-5 bg-white rounded-[2rem] border border-[#E8E6E2]/60 hover:shadow-xl transition-all">
                                        <div className="w-20 h-20 bg-[#F3F1ED] rounded-2xl overflow-hidden p-2 shrink-0">
                                            <img src={item.products.image_urls[0]} className="w-full h-full object-contain" alt="" />
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <h4 className="font-heading text-sm text-[#2D3A3A] line-clamp-1">{item.products.name}</h4>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-[#FDFBF7] border border-[#E8E6E2] rounded-full p-1">
                                                    <button
                                                        onClick={() => handleQuantity(item.id, item.quantity, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className={cn(
                                                            "w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                                                            item.quantity <= 1 ? "opacity-20 cursor-not-allowed" : "hover:bg-white cursor-pointer"
                                                        )}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button onClick={() => handleQuantity(item.id, item.quantity, 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white cursor-pointer transition-colors">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button onClick={() => setConfirmDeleteId(item.id)} className="text-[#9AA09A] hover:text-red-400 cursor-pointer transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#2D3A3A]">₹{(item.price_at_add * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <footer className="p-8 bg-white border-t border-[#E8E6E2] space-y-8">
                        <div>
                            <div className="flex justify-between text-[8px] uppercase tracking-[0.4em] font-bold mb-3">
                                <span className="text-[#7A8A8A]">Shipping Ritual</span>
                                <span className={total >= 2500 ? "text-[#5A7A6A]" : "text-[#7A8A8A]"}>
                                    {total >= 2500 ? "Unlocked ✓" : `₹${(2500 - total).toLocaleString()} to go`}
                                </span>
                            </div>
                            <div className="h-1 bg-[#F3F1ED] rounded-full overflow-hidden">
                                <div className="h-full bg-[#5A7A6A] transition-all duration-700" style={{ width: `${Math.min((total / 2500) * 100, 100)}%` }} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#7A8A8A]">Archive Total</span>
                            <span className="text-3xl font-heading italic text-[#2D3A3A]">₹{total.toLocaleString()}</span>
                        </div>

                        <Link href="/checkout" onClick={closeCart} className="w-full py-6 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:shadow-2xl cursor-pointer transition-all active:scale-95">
                            <ShoppingBag className="w-4 h-4" /> Finalize Ritual
                        </Link>
                    </footer>
                )}
            </aside>
        </>
    );
}