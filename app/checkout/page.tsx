// app/checkout/page.tsx - Part 1: Logic & State
"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { load } from "@cashfreepayments/cashfree-js";
import { ShieldCheck, MapPin, Package, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Fetch Ritual Data
    useEffect(() => {
        async function prepareCheckout() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch Items & Addresses
            const [itemsRes, addrRes] = await Promise.all([
                supabase.from('cart_items').select('*, products(*)'),
                supabase.from('addresses').select('*').eq('user_id', user.id)
            ]);

            setCartItems(itemsRes.data || []);
            setAddresses(addrRes.data || []);

            const defaultAddr = addrRes.data?.find(a => a.is_default);
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);

            setLoading(false);
        }
        prepareCheckout();
    }, []);

    const subtotal = useMemo(() =>
        cartItems.reduce((acc, item) => acc + (item.price_at_add * item.quantity), 0),
        [cartItems]);

    // Final Calculation
    const shipping = subtotal >= 2500 ? 0 : 150;
    const finalTotal = subtotal + shipping;

    /**
     * The Payment Ritual Handshake
     */
    const handlePayment = async () => {
        setProcessing(true);
        const cashfree = await load({ mode: "sandbox" }); // Change to "production" when live

        try {
            // 1. Create order in your Supabase backend (or API route)
            // This would normally call your server to get the 'payment_session_id'
            const response = await fetch('/api/checkout/create-ritual', {
                method: 'POST',
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    amount: finalTotal
                })
            });
            const { paymentSessionId } = await response.json();

            // 2. Launch Cashfree Checkout
            await cashfree.checkout({
                paymentSessionId,
                redirectTarget: "_self", // Keeps the premium feel on your domain
            });

        } catch (err) {
            console.error("Ritual Interrupted:", err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-32 grid lg:grid-cols-12 gap-20">
            {/* Left Column: Logistics Ritual */}
            <div className="lg:col-span-7 space-y-12">
                <header>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Step 01</p>
                    <h1 className="font-heading text-6xl text-[#2D3A3A] tracking-tighter">Shipping <span className="italic font-serif font-light text-[#5A7A6A]">Sanctuary.</span></h1>
                </header>

                <div className="grid gap-6">
                    {addresses.map((addr) => (
                        <button
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={cn(
                                "p-8 rounded-[2.5rem] border text-left transition-all relative group",
                                selectedAddressId === addr.id ? "border-[#5A7A6A] bg-white shadow-xl" : "border-[#E8E6E2] opacity-60"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[8px] uppercase tracking-widest font-black text-[#5A7A6A]">{addr.is_default ? "Primary Base" : "Ritual Point"}</span>
                                <MapPin className={cn("w-4 h-4", selectedAddressId === addr.id ? "text-[#5A7A6A]" : "text-[#E8E6E2]")} />
                            </div>
                            <h3 className="font-heading text-xl text-[#2D3A3A]">{addr.full_name}</h3>
                            <p className="text-sm text-[#7A8A8A] font-light mt-2">{addr.address_line_1}, {addr.city}, {addr.pincode}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:col-span-5">
                <div className="bg-white rounded-[3rem] p-10 border border-[#E8E6E2] sticky top-32">
                    <h2 className="text-2xl font-heading text-[#2D3A3A] mb-10">Ritual Summary</h2>

                    <div className="space-y-6 mb-10 border-b border-[#E8E6E2] pb-10">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-[#7A8A8A]">{item.products.name} <span className="text-[10px] ml-2 opacity-50">x{item.quantity}</span></span>
                                <span className="font-bold text-[#2D3A3A]">₹{(item.price_at_add * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#7A8A8A]">Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#7A8A8A]">Logistics (Shipping)</span>
                            <span className={shipping === 0 ? "text-[#5A7A6A] font-bold" : ""}>
                                {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-end pt-6 border-t border-[#E8E6E2]">
                            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#7A8A8A]">Total Ritual</span>
                            <span className="text-4xl font-serif italic text-[#2D3A3A]">₹{finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={processing || !selectedAddressId}
                        className="w-full py-6 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                    >
                        {processing ? "Synchronizing..." : <><ShieldCheck className="w-4 h-4" /> Finalize Ritual</>}
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[7px] uppercase tracking-widest font-bold">Secure Alchemy via Cashfree Jaipur</span>
                    </div>
                </div>
            </div>
        </div>
    );
}