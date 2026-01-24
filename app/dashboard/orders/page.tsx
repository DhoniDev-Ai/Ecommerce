"use client";
import { useState, useEffect } from "react";
import { motion } from "@/lib/framer";
import { Package, ArrowRight, ShoppingBag, Clock, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        quantity,
                        price_at_purchase,
                        products (
                            name,
                            image_urls
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setOrders(data);
            setLoading(false);
        }
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <section className="max-w-4xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-40 bg-[#F3F1ED] rounded-[2.5rem]" />
                    <div className="h-40 bg-[#F3F1ED] rounded-[2.5rem]" />
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-4xl space-y-12 pb-20">
            <header>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Past & Present</p>
                <h1 className="font-heading text-5xl text-[#2D3A3A] tracking-tighter">Ritual <span className="italic font-serif font-light text-[#5A7A6A]">Archive.</span></h1>
            </header>

            {orders.length === 0 ? (
                <EmptyRitualState />
            ) : (
                <div className="grid gap-6">
                    {orders.map((order, idx) => (
                        <OrderCard key={order.id} order={order} index={idx} />
                    ))}
                </div>
            )}
        </section>
    );
}

function OrderCard({ order, index }: { order: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group bg-white rounded-[2.5rem] p-8 lg:p-10 border border-[#E8E6E2]/60 shadow-sm hover:shadow-xl hover:border-[#5A7A6A]/20 transition-all"
        >
            {/* Order Meta Header */}
            <div className="flex flex-wrap justify-between items-start gap-6 mb-10 pb-8 border-b border-[#F3F1ED]">
                <div className="flex gap-5">
                    <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl border border-[#E8E6E2] flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#5A7A6A]/40" />
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold mb-1">ID: {order.id.slice(0, 8)}...</p>
                        <p className="text-lg text-[#2D3A3A] font-light">
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold mb-1">Status</p>
                        <span className={cn(
                            "inline-block px-4 py-1 rounded-full text-[8px] uppercase tracking-widest font-black",
                            order.status === "Delivered" ? "bg-green-50 text-green-600" : "bg-[#F3F1ED] text-[#5A7A6A]"
                        )}>
                            {order.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Product Preview Items */}
            <div className="flex flex-wrap gap-4 mb-10">
                {(!order.order_items || order.order_items.length === 0) ? (
                    <div className="flex items-center gap-4 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E6E2]/40 w-full text-[#7A8A8A] text-xs italic">
                        <ShoppingBag className="w-4 h-4 opacity-50" />
                        <span>Legacy Ritual - Details not digitized.</span>
                    </div>
                ) : (
                    order.order_items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 bg-[#FDFBF7] pr-6 rounded-2xl border border-[#E8E6E2]/40">
                            <div className="w-16 h-16 p-2">
                                <img
                                    src={item.products?.image_urls?.[0] || '/placeholder.png'}
                                    alt={item.products?.name || 'Product'}
                                    className="w-full rounded-xl h-full object-contain grayscale-[0.3] group-hover:grayscale-0 transition-all"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#2D3A3A] uppercase tracking-wider">{item.products?.name}</p>
                                <p className="text-[9px] text-[#7A8A8A]">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Total & Action */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold mb-1">Ritual Total</p>
                    <p className="text-2xl text-[#2D3A3A] font-heading tracking-tighter">₹{(order.total_amount || 0).toLocaleString()}</p>
                </div>
                <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center gap-2 px-6 py-4 bg-[#2D3A3A] text-white rounded-full text-[9px] uppercase tracking-[0.2em] font-bold hover:shadow-lg active:scale-95 transition-all"
                >
                    View Details <ChevronRight className="w-3 h-3" />
                </Link>
            </div>
        </motion.div>
    );
}

function EmptyRitualState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center bg-white rounded-[4rem] border border-[#E8E6E2]/50 shadow-sm"
        >
            <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#E8E6E2]">
                <ShoppingBag className="w-10 h-10 text-[#E8E6E2]" />
            </div>
            <h2 className="font-heading text-4xl text-[#2D3A3A] mb-4">The Archive is <span className="italic font-serif font-light text-[#5A7A6A]">Silent.</span></h2>
            <p className="text-sm text-[#7A8A8A] font-light mb-12 max-w-xs mx-auto leading-relaxed">
                Your journey toward pure wellness begins with your first elixir. Start a new ritual today.
            </p>
            <Link
                href="/products"
                className="inline-flex py-5 px-14 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
                Browse Collection
            </Link>
        </motion.div>
    );
}