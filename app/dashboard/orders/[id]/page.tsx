"use strict";
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "@/lib/framer";
import { ChevronLeft, MapPin, CreditCard, Package, Truck, CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!params.id) return;

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
                .eq('id', params.id)
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
                const expectedDate = new Date(createdDate);
                expectedDate.setDate(createdDate.getDate() + 7); // 7 days expected

                const isCancelled = orderData.status === 'cancelled';

                const updatedDate = new Date(orderData.updated_at);

                let trackingSteps = [
                    { state: "Order Placed", desc: "Ritual Initiated", date: createdDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), done: true },
                    { state: "Processing", desc: "Alchemy in Progress", date: orderData.status === 'processing' ? updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Pending", done: !isCancelled && orderData.status !== 'pending' },
                    { state: "Shipped", desc: orderData.status === 'shipped' || orderData.status === 'delivered' ? `Shipped on ${updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : `Expected by ${expectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, date: orderData.status === 'shipped' ? updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Pending", done: !isCancelled && (orderData.status === 'shipped' || orderData.status === 'delivered') },
                    { state: "Delivered", desc: "Ritual Complete", date: orderData.status === 'delivered' ? updatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Pending", done: !isCancelled && orderData.status === 'delivered' },
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
                        method: "Cashfree",
                        ref: ['success', 'paid', 'succeeded', 'captured'].includes(orderData.payment_status) ? 'Succeeded' : (isCancelled ? 'Cancelled' : 'Pending'),
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
        if (order && order.payment.ref === 'Pending' && order.status !== 'cancelled') {
            fetch(`/api/payment/verify?order_id=${order.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'SUCCESS' || data.status === 'succeeded') {
                        // Refresh order data if status changed
                        window.location.reload();
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
                            <div className="absolute left-[19px] top-3 bottom-3 w-px bg-[#F3F1ED]" />

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
                                            <div className="relative z-10 flex-shrink-0">
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
                                        <img src={item.img} className="max-h-full object-contain mix-blend-multiply" />
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
                            <p className="text-[8px] uppercase tracking-widest text-[#9AA09A] font-bold mb-1">Paid via {order.payment.method}</p>
                            <p className="text-[10px] text-[#2D3A3A] font-medium font-mono">{order.payment.ref}</p>
                        </div>
                    </div>

                    {/* Help Section */}
                    <Link href="/contact" className="flex items-center justify-center gap-3 py-6 w-full border border-[#E8E6E2] rounded-full text-[9px] uppercase tracking-widest font-bold text-[#7A8A8A] hover:bg-[#F3F1ED] transition-all">
                        Ask about this Ritual
                    </Link>
                </div>
            </div>
        </section>
    );
}