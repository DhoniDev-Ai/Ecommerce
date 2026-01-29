"use strict";
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "@/lib/framer";
import { ChevronLeft, MapPin, CreditCard, Package, Truck, CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Cancellation State
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);

    const handleCancel = async () => {
        if (!order || !cancelReason.trim()) return;
        setCancelLoading(true);

        try {
            const res = await fetch('/api/orders/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                },
                body: JSON.stringify({
                    orderId: order.id,
                    reason: cancelReason
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Cancellation failed");

            // Update UI Locally to reflect cancellation
            setOrder((prev: any) => ({
                ...prev,
                status: 'cancelled',
                payment: {
                    ...prev.payment,
                    ref: data.refund ? 'Refund Initiated' : 'Cancelled'
                },
                tracking: [
                    { state: "Order Placed", desc: "Ritual Initiated", date: prev.tracking[0].date, done: true },
                    { state: "Cancelled", desc: "Ritual Stopped", date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), done: true },
                ]
            }));
            setIsCancelling(false);
        } catch (err) {
            console.error("Cancellation Error:", err);
            alert("Failed to cancel ritual. Please try again.");
        } finally {
            setCancelLoading(false);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            const idParam = params.id;
            const orderId = Array.isArray(idParam) ? idParam[0] : idParam;

            if (!orderId) return;

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        quantity,
                        price_at_purchase,
                        products (
                            name,
                            image_urls,
                            slug
                        )
                    )
                `)
                .eq('id', orderId)
                .single();

            if (data) {
                const orderData = data as any;
                // Transform to UI model
                const address = typeof orderData.shipping_address === 'string'
                    ? JSON.parse(orderData.shipping_address)
                    : orderData.shipping_address || {};

                const items = orderData.order_items.map((item: any) => ({
                    name: item.products?.name,
                    slug: item.products?.slug,
                    qty: item.quantity,
                    price: item.price_at_purchase,
                    img: item.products?.image_urls?.[0] || '/placeholder.png'
                }));

                const createdDate = new Date(orderData.created_at);

                // Delivery Logic:
                // 1. Calculate Shipping Date (1 Day processing, or 2 days if after 8 PM IST)
                // convert to IST string to get hour
                const istDateString = createdDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                const istDate = new Date(istDateString);
                const istHour = istDate.getHours();

                // If before 8 PM (20:00), ship same day (0). Else tomorrow (1).
                const daysToShip = istHour >= 20 ? 1 : 0;

                const expectedShippingDate = new Date(createdDate);
                expectedShippingDate.setDate(createdDate.getDate() + daysToShip);

                // 2. Calculate Delivery Date (7 Days after shipping)
                const expectedDeliveryDate = new Date(expectedShippingDate);
                expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

                const isCancelled = orderData.status === 'cancelled';
                const updatedDate = new Date(orderData.updated_at);

                let trackingSteps = [
                    {
                        state: "Order Placed",
                        desc: "Ritual Initiated",
                        date: createdDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                        done: true
                    },
                    {
                        state: "Processing",
                        desc: "Alchemy in Progress",
                        date: orderData.status === 'processing'
                            ? "In Progress"
                            : (orderData.status !== 'pending' ? "Completed" : "Pending"),
                        done: !isCancelled && orderData.status !== 'pending'
                    },
                    {
                        state: "Shipped",
                        desc: orderData.status === 'shipped' || orderData.status === 'delivered'
                            ? `Shipped on ${updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                            : `Expected Ship: ${expectedShippingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
                        date: orderData.status === 'shipped'
                            ? updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                            : expectedShippingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        done: !isCancelled && (orderData.status === 'shipped' || orderData.status === 'delivered')
                    },
                    {
                        state: "Delivered",
                        desc: "Ritual Complete",
                        date: orderData.status === 'delivered'
                            ? updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                            : `Expected: ${expectedDeliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
                        done: !isCancelled && orderData.status === 'delivered'
                    },
                ];

                if (isCancelled) {
                    trackingSteps = [
                        { state: "Order Placed", desc: "Ritual Initiated", date: createdDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), done: true },
                        { state: "Cancelled", desc: "Ritual Stopped", date: updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), done: true },
                    ];
                }

                const transformed = {
                    id: orderData.id,
                    date: createdDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                    status: orderData.status,
                    tracking: trackingSteps,
                    address: {
                        name: address.fullName || "Guest",
                        line: address.addressLine || "",
                        city: `${address.city || ''}, ${address.state || ''} ${address.pincode || ''}`
                    },
                    payment: {
                        method: orderData.payment_method === 'COD' ? 'Cash on Delivery' : 'Online (Cashfree)',
                        ref: orderData.payment_method === 'COD'
                            ? (orderData.status === 'delivered' ? 'Paid' : 'Due on Delivery')
                            : (['success', 'paid', 'succeeded', 'captured'].includes(orderData.payment_status) ? 'Paid' : (isCancelled ? 'Cancelled' : 'Pending')),
                        subtotal: orderData.total_amount, // Simplified
                        shipping: 0,
                        tax: 0,
                        total: orderData.total_amount
                    },
                    items: items
                };
                setOrder(transformed);
            }
            setLoading(false);
        };
        fetchOrder();
    }, [params.id]);

    // Verify payment on mount if pending
    useEffect(() => {
        if (order && order.payment.ref === 'Pending' && order.status !== 'cancelled' && order.payment.method !== 'Cash on Delivery') {
            fetch(`/api/payment/verify?order_id=${order.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'SUCCESS' || data.status === 'succeeded') {
                        // Refresh local state instead of reloading page to prevent loops
                        setOrder((prev: any) => ({
                            ...prev,
                            // Update Status
                            status: prev.status === 'pending' ? 'confirmed' : prev.status,
                            // Update Payment Ref
                            payment: {
                                ...prev.payment,
                                ref: 'Paid'
                            },
                            // Update Tracking Step 2 (Processing) to done if applicable
                            tracking: prev.tracking.map((t: any) =>
                                t.state === "Processing" ? { ...t, done: true, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) } : t
                            )
                        }));
                    }
                })
                .catch(err => console.error("Auto-verify failed", err));
        }
    }, [order]);

    if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin w-8 h-8 text-[#5A7A6A]" /></div>;
    if (!order) return <div className="text-center py-40">Ritual not found.</div>;

    const completedSteps = order.tracking.filter((s: any) => s.done).length;
    const totalSteps = order.tracking.length;
    const progressPercent = totalSteps > 1 ? ((completedSteps - 1) / (totalSteps - 1)) * 100 : 0;

    return (
        <section className="max-w-5xl space-y-12 pb-32">
            {/* Header Nav */}
            <header className="flex justify-between items-center">
                <Link href="/dashboard/orders" className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7A8A8A] hover:text-[#5A7A6A] transition-colors">
                    <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Back to Archive
                </Link>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold">
                    Ritual #{order.id.slice(0, 8)}
                </p>
            </header>

            <div className="grid lg:grid-cols-5 gap-12">

                {/* Left Column: Timeline & Items */}
                <div className="lg:col-span-3 space-y-12">

                    {/* Ritual Tracking Timeline */}
                    <div className="bg-white rounded-[3rem] p-10 border border-[#E8E6E2]/60 shadow-sm relative overflow-hidden">
                        <h2 className="text-xl font-heading text-[#2D3A3A] mb-10">Ritual <span className="italic font-serif font-light text-[#5A7A6A]">Progress.</span></h2>

                        <div className="relative pl-2"> {/* Added padding for alignment */}
                            {/* Static Background Line */}
                            <div className="absolute left-[19px] top-3 bottom-3 h-[80%] w-px bg-[#F3F1ED]" />

                            {/* Animated Progress Line */}
                            <div className="absolute left-[19px] top-3 bottom-3 w-px">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(0, Math.min(100, progressPercent))}%` }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="w-full bg-[#5A7A6A]"
                                />
                            </div>

                            <div className="space-y-8 relative">
                                {order.tracking.map((step: any, i: number) => {
                                    const isCompleted = step.done;
                                    const isCurrent = isCompleted && (i === order.tracking.length - 1 || !order.tracking[i + 1]?.done);

                                    return (
                                        <div key={i} className="flex gap-6 relative items-start">
                                            <div className="relative z-10 shrink-0">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-[] border-white flex items-center justify-center  transition-all duration-500",
                                                    isCompleted
                                                        ? (step.state === "Cancelled" ? "bg-red-300  border-red-700 shadow-red-500/20 scale-110" : "bg-[#5A7A6A] shadow-lg shadow-[#5A7A6A]/30 scale-110")
                                                        : "bg-[#F3F1ED]"
                                                )}>
                                                    {isCompleted && (step.state === "Cancelled" ? <XCircle className="w-3 h-3 text-red-500" /> : <CheckCircle2 className="w-3 h-3 text-white" />)}
                                                </div>
                                                {/* Pulse effect for current active step */}
                                                {isCurrent && !step.state.includes("Complete") && !step.state.includes("Cancelled") && (
                                                    <div className="absolute inset-0 rounded-full bg-[#5A7A6A]/30 animate-ping opacity-50" />
                                                )}
                                            </div>

                                            <div className={cn("transition-all duration-500 pt-0.5", isCompleted ? "opacity-100 translate-x-0" : "opacity-40 translate-x-1")}>
                                                <p className={cn("text-[10px] font-bold uppercase tracking-widest", isCompleted ? "text-[#2D3A3A]" : "text-[#7A8A8A]")}>
                                                    {step.state}
                                                </p>
                                                <p className="text-[11px] text-[#7A8A8A] font-light mt-0.5">{step.desc}</p>
                                                {step.date && step.date !== 'Pending' && (
                                                    <p className="text-[9px] text-[#9AA09A] mt-1 font-medium transform-none">{step.date}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Itemized List */}
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold ml-6">Your Selection</p>
                        {order.items.map((item: any, i: number) => (
                            <Link href={`/products/${item.slug || '#'}`} key={i} className="group block bg-white rounded-[2.5rem] p-6 flex items-center justify-between border border-[#E8E6E2]/40 hover:border-[#5A7A6A]/30 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-[#FDFBF7] rounded-2xl border border-[#E8E6E2] p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <Image
                                            width={1000}
                                            height={1000}
                                            alt={item.img}
                                            src={item.img} className="max-h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#2D3A3A] uppercase tracking-wider group-hover:text-[#5A7A6A] transition-colors">{item.name}</h4>
                                        <p className="text-xs text-[#7A8A8A] font-light">Quantity: {item.qty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm font-medium text-[#2D3A3A]">₹{item.price.toLocaleString()}</p>
                                    <ArrowRight className="w-4 h-4 text-[#E8E6E2] group-hover:text-[#5A7A6A] -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Column: Address & Payment Summary */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Shipping Card */}
                    <div className="bg-[#FDFBF7] border border-[#E8E6E2] rounded-[3rem] p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <MapPin className="w-5 h-5 text-[#5A7A6A]" />
                            <h3 className="text-sm uppercase tracking-widest font-bold text-[#2D3A3A]">Sanctuary Base</h3>
                        </div>
                        <p className="text-base font-heading text-[#2D3A3A] mb-2">{order.address.name}</p>
                        <p className="text-sm text-[#7A8A8A] font-light leading-relaxed">
                            {order.address.line}<br />
                            {order.address.city}
                        </p>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white border border-[#E8E6E2]/60 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <CreditCard className="w-5 h-5 text-[#5A7A6A]" />
                            <h3 className="text-sm uppercase tracking-widest font-bold text-[#2D3A3A]">Alchemy Exchange</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-xs text-[#7A8A8A]">
                                <span>Subtotal</span>
                                <span>₹{order.payment.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-[#7A8A8A]">
                                <span>Shipping Ritual</span>
                                <span>₹{order.payment.shipping.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-[#7A8A8A]">
                                <span>Wellness Tax</span>
                                <span>₹{order.payment.tax.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-[#F3F1ED] my-2" />
                            <div className="flex justify-between text-lg font-heading text-[#2D3A3A]">
                                <span>Total</span>
                                <span>₹{order.payment.total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E8E6E2]">
                            <p className="text-[8px] uppercase tracking-widest text-[#9AA09A] font-bold mb-1">
                                {['Paid', 'Succeeded'].includes(order.payment.ref) ? 'Paid via' : 'Payment Method'} {order.payment.method}
                            </p>
                            <p className="text-[10px] text-[#2D3A3A] font-medium font-mono">{order.payment.ref}</p>
                        </div>
                    </div>

                    {/* Help Section */}
                    <Link href="/contact" className="flex items-center justify-center gap-3 py-6 w-full border border-[#E8E6E2] rounded-full text-[9px] uppercase tracking-widest font-bold text-[#7A8A8A] hover:bg-[#F3F1ED] transition-all">
                        Ask about this Ritual
                    </Link>

                    {/* Cancel Button (Conditional) */}
                    {['pending', 'confirmed', 'processing'].includes(order.status) && (
                        <button
                            onClick={() => setIsCancelling(true)}
                            className="w-full cursor-pointer border rounded-4xl py-4 text-red-500 text-[10px] uppercase tracking-widest font-bold hover:text-red-600 transition-colors"
                        >
                            Cancel Ritual
                        </button>
                    )}
                </div>
            </div>

            {/* Cancellation Modal */}
            {isCancelling && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-heading text-[#2D3A3A]">Stop the Ritual?</h3>
                            <p className="text-xs text-[#7A8A8A]">This action cannot be undone. If paid online, a refund will be initiated.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-[#7A8A8A] font-bold">Reason for Cancellation</label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Why do you wish to cancel?"
                                className="w-full h-32 p-4 rounded-xl bg-[#F9F8F6] border-none text-sm text-[#2D3A3A] focus:ring-1 focus:ring-[#5A7A6A] resize-none placeholder:text-[#9AA09A]"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setIsCancelling(false)}
                                disabled={cancelLoading}
                                className="flex-1 py-4 cursor-pointer rounded-xl border border-[#E8E6E2] text-[10px] uppercase tracking-widest font-bold text-[#7A8A8A] hover:bg-[#F3F1ED]"
                            >
                                Keep Ritual
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelLoading || !cancelReason.trim()}
                                className="flex-1 py-4 rounded-xl bg-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold hover:bg-red-200 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
                            >
                                {cancelLoading && <Loader2 className="animate-spin w-3 h-3" />}
                                {cancelLoading ? "Stopping..." : "Confirm Cancel"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
}