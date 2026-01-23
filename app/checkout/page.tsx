"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { load } from "@cashfreepayments/cashfree-js";
import { ShieldCheck, MapPin, Ticket, ChevronRight, Loader2, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "@/lib/framer";
import { cn } from "@/utils/cn";

/**
 * SHADOW LOADING RITUAL (Skeletons)
 */
const CheckoutSkeleton = () => (
    <div className="max-w-7xl mx-auto px-8 lg:px-12 py-32 grid lg:grid-cols-12 gap-20 animate-pulse">
        <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
                <div className="h-2 w-24 bg-[#E8E6E2] rounded-full" />
                <div className="h-16 w-3/4 bg-[#E8E6E2] rounded-3xl" />
            </div>
            <div className="space-y-6">
                <div className="h-40 w-full bg-[#E8E6E2] rounded-[2.5rem]" />
                <div className="h-40 w-full bg-[#E8E6E2] rounded-[2.5rem]" />
            </div>
        </div>
        <div className="lg:col-span-5">
            <div className="h-[500px] w-full bg-white rounded-[3rem] border border-[#E8E6E2]" />
        </div>
    </div>
);

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Sacred Voucher State
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
    const [voucherError, setVoucherError] = useState("");
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

    useEffect(() => {
        async function prepareCheckout() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [itemsRes, addrRes] = await Promise.all([
                supabase.from('cart_items').select('*, products(*)'),
                (supabase.from('addresses') as any).select('*').eq('user_id', user.id)
            ]);

            setCartItems(itemsRes.data || []);
            setAddresses(addrRes.data || []);
            const defaultAddr = addrRes.data?.find((a: any) => a.is_default);
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);

            setLoading(false);
        }
        prepareCheckout();
    }, []);

    const subtotal = useMemo(() =>
        cartItems.reduce((acc, item) => acc + (item.price_at_add * item.quantity), 0),
        [cartItems]);

    // VOUCHER RITUAL LOGIC
    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        setIsApplyingVoucher(true);
        setVoucherError("");

        const { data, error } = await (supabase
            .from('coupons') as any)
            .select('*')
            .eq('code', voucherCode.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !data) {
            setVoucherError("This code is not found in our archive.");
        } else if (subtotal < data.min_purchase_amount) {
            setVoucherError(`Requires a minimum ritual of ₹${data.min_purchase_amount}.`);
        } else {
            setAppliedVoucher(data);
            setVoucherCode("");
        }
        setIsApplyingVoucher(false);
    };

    const discount = useMemo(() => {
        if (!appliedVoucher) return 0;
        return appliedVoucher.discount_type === 'percentage'
            ? (subtotal * appliedVoucher.discount_value) / 100
            : appliedVoucher.discount_value;
    }, [subtotal, appliedVoucher]);

    const shipping = subtotal >= 2500 ? 0 : 150;
    const finalTotal = subtotal - discount + shipping;

    const handlePayment = async () => {
        setProcessing(true);
        const cashfree = await load({ mode: "sandbox" });

        try {
            const response = await fetch('/api/checkout/create-ritual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    amount: finalTotal,
                    couponId: appliedVoucher?.id || null
                })
            });
            const { paymentSessionId } = await response.json();

            await cashfree.checkout({
                paymentSessionId,
                redirectTarget: "_self",
            });
        } catch (err) {
            console.error("Ritual Interrupted:", err);
            setProcessing(false);
        }
    };

    if (loading) return <CheckoutSkeleton />;

    return (
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-32 grid lg:grid-cols-12 gap-20 relative">
            {/* Background Texture Ritual */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* LEFT: Logistics Sanctuary */}
            <div className="lg:col-span-7 space-y-12 relative z-10">
                <header>
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[#7A8B7A] font-bold mb-4">Step 01</p>
                    <h1 className="font-heading text-6xl text-[#2D3A3A] tracking-tighter">Shipping <span className="italic font-serif font-light text-[#5A7A6A]">Sanctuary.</span></h1>
                </header>

                <div className="grid gap-6">
                    {addresses.map((addr) => (
                        <button
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={cn(
                                "p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative group overflow-hidden",
                                selectedAddressId === addr.id ? "border-[#5A7A6A] bg-white shadow-2xl" : "border-[#E8E6E2] bg-white/40 opacity-60 hover:opacity-100"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[8px] uppercase tracking-[0.4em] font-black text-[#5A7A6A]">{addr.is_default ? "Primary Base" : "Ritual Point"}</span>
                                <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", selectedAddressId === addr.id ? "bg-[#5A7A6A] border-[#5A7A6A]" : "border-[#E8E6E2]")}>
                                    {selectedAddressId === addr.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                            </div>
                            <h3 className="font-heading text-xl text-[#2D3A3A]">{addr.full_name}</h3>
                            <p className="text-sm text-[#7A8A8A] font-light mt-2 leading-relaxed">{addr.address_line_1}, {addr.city} — {addr.pincode}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: Order Summary Ritual (Sticky) */}
            <div className="lg:col-span-5 relative z-10">
                <div className="bg-white rounded-[3rem] p-10 border border-[#E8E6E2] sticky top-32 shadow-[0_40px_100px_rgba(45,58,58,0.05)]">
                    <h2 className="text-2xl font-heading text-[#2D3A3A] mb-10 tracking-tight">Ritual Summary</h2>

                    {/* Cart Items Summary */}
                    <div className="space-y-6 mb-10 border-b border-[#E8E6E2]/60 pb-10">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-sm">
                                <div className="flex flex-col">
                                    <span className="text-[#2D3A3A] font-medium">{item.products.name}</span>
                                    <span className="text-[10px] text-[#7A8A8A] uppercase tracking-widest mt-1">Quantity: {item.quantity}</span>
                                </div>
                                <span className="font-bold text-[#2D3A3A]">₹{(item.price_at_add * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    {/* SACRED VOUCHER INPUT RITUAL */}
                    <div className="mb-10">
                        {!appliedVoucher ? (
                            <div className="space-y-4">
                                <p className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#7A8A8A]">Sacred Voucher</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="CODE"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        className="flex-1 bg-[#FDFBF7] border border-[#E8E6E2] rounded-2xl px-5 py-3 text-[10px] tracking-widest outline-none focus:border-[#5A7A6A] transition-colors uppercase"
                                    />
                                    <button
                                        onClick={handleApplyVoucher}
                                        disabled={isApplyingVoucher || !voucherCode}
                                        className="px-6 py-3 bg-[#2D3A3A] text-white rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 disabled:opacity-30"
                                    >
                                        {isApplyingVoucher ? <Loader2 className="w-3 h-3 animate-spin" /> : "Invoke"}
                                    </button>
                                </div>
                                {voucherError && <p className="text-[8px] text-red-500 font-bold italic">{voucherError}</p>}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-[#5A7A6A]/5 p-4 rounded-2xl border border-[#5A7A6A]/20">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[#5A7A6A]" />
                                    <div>
                                        <p className="text-[9px] font-bold text-[#5A7A6A] uppercase tracking-widest">{appliedVoucher.code} Applied</p>
                                        <p className="text-[8px] text-[#7A8A8A] font-medium italic">Alchemy synchronization complete.</p>
                                    </div>
                                </div>
                                <button onClick={() => setAppliedVoucher(null)} className="text-[#9AA09A] hover:text-red-400 p-1">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#7A8A8A]">Archive Value</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-[#5A7A6A] font-medium">
                                <span className="italic font-serif">Ritual Reward</span>
                                <span>- ₹{discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-[#7A8A8A]">Logistics Ritual</span>
                            <span className={shipping === 0 ? "text-[#5A7A6A] font-bold" : ""}>
                                {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-end pt-8 border-t border-[#E8E6E2]">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#2D3A3A]">Final Total</span>
                            <span className="text-4xl font-serif italic text-[#2D3A3A]">₹{finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={processing || !selectedAddressId}
                        className="w-full py-6 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                    >
                        {processing ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Handshaking Alchemy...</>
                        ) : (
                            <><ShieldCheck className="w-4 h-4" /> Finalize Ritual</>
                        )}
                    </button>

                    <p className="mt-8 text-center text-[7px] uppercase tracking-[0.3em] text-[#9AA09A] font-medium leading-relaxed">
                        Secure SSL Encryption via Cashfree Jaipur Sanctuary.<br />
                        Your wellness data is strictly protected.
                    </p>
                </div>
            </div>
        </div>
    );
}