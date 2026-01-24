"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartContext } from "@/context/CartContext";
import Link from "next/link";

function StatusContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const { clearCart } = useCartContext();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

    useEffect(() => {
        if (!orderId) return;

        const verifyPayment = async () => {
            try {
                const res = await fetch(`/api/payment/verify?order_id=${orderId}`);
                const data = await res.json();

                if (data.status === "SUCCESS") {
                    setStatus("success");
                    clearCart(); // Only clear the cart on verified success
                } else {
                    setStatus("failed");
                }
            } catch (err) {
                setStatus("failed");
            }
        };

        verifyPayment();
    }, [orderId, clearCart]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-12 h-12 text-[#5A7A6A] animate-spin" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#7A8A8A]">Verifying your Ritual...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-32 px-6 text-center">
            {status === "success" ? (
                <div className="space-y-10 animate-in fade-in zoom-in duration-700">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-[#5A7A6A]/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-[#5A7A6A]" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-heading text-[#2D3A3A] tracking-tighter">
                            Ritual <span className="italic font-serif font-light text-[#5A7A6A]">Confirmed.</span>
                        </h1>
                        <p className="text-[#7A8A8A] text-sm leading-relaxed max-w-sm mx-auto">
                            Your elixirs are being prepared in our Jaipur sanctuary. You will receive a notification once the dispatch ritual begins.
                        </p>
                    </div>
                    <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/dashboard/orders" className="px-10 py-5 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:shadow-xl transition-all">
                            Track Order
                        </Link>
                        <Link href="/products" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5A7A6A] flex items-center gap-2 group">
                            Continue Journey <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-10">
                    <div className="flex justify-center">
                        <XCircle className="w-20 h-20 text-red-400" />
                    </div>
                    <h1 className="text-4xl font-heading text-[#2D3A3A]">Alchemy Interrupted.</h1>
                    <p className="text-[#7A8A8A] text-sm">The transfer could not be completed. No elixirs were charged.</p>
                    <Link href="/checkout" className="inline-block px-10 py-5 border border-[#2D3A3A] text-[#2D3A3A] rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">
                        Retry Checkout
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Suspense fallback={<div>Loading...</div>}>
                <StatusContent />
            </Suspense>
        </div>
    );
}