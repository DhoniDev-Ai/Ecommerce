"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Package, MapPin, ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

export default function DashboardOverview() {
    const [data, setData] = useState({
        activeOrders: [] as any[],
        totalCompleted: 0,
        primaryBase: "Establishing...",
        loading: true
    });

    useEffect(() => {
        async function fetchSanctuaryStats() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Fetch Primary Base (Address)
            const { data: addr } = await supabase
                .from('addresses')
                .select('city')
                .eq('user_id', user.id)
                .eq('is_default', true)
                .single() as { data: { city: string } | null };

            // 2. Fetch Active Rituals (All non-delivered/non-cancelled)
            const { data: active } = await supabase
                .from('orders')
                .select('*')
                .limit(4)
                .eq('user_id', user.id)
                .neq('status', 'delivered')
                .neq('status', 'cancelled')
                .order('created_at', { ascending: false });

            // 3. Count Completed Rituals
            const { count } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('status', 'delivered');
            //console.log(count);
            //console.log(user.id);

            setData({
                activeOrders: active || [],
                totalCompleted: count || 0,
                primaryBase: addr?.city || "Not Set",
                loading: false
            });
        }
        fetchSanctuaryStats();
    }, []);
    //console.log(data);
    if (data.loading) return <div className="animate-pulse h-96 bg-[#F3F1ED] rounded-[3rem]" />;

    return (
        <section className="space-y-10">
            <header className="text-right mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold">Welcome Back</p>
                <h1 className="font-heading text-6xl text-[#2D3A3A] tracking-tighter mt-2">
                    The <span className="italic font-serif font-light text-[#5A7A6A]">Sanctuary.</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Active Rituals Container */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-[#5A7A6A] animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A8A8A]">Active Rituals</span>
                    </div>

                    {data.activeOrders.length > 0 ? (
                        <div className="space-y-4">
                            {data.activeOrders.map((order) => (
                                <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="bg-white rounded-[2.5rem] p-8 border border-[#E8E6E2]/60 hover:border-[#5A7A6A]/30 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-[#F3F1ED] flex items-center justify-center text-[#5A7A6A] group-hover:bg-[#5A7A6A] group-hover:text-white transition-colors">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-heading text-xl text-[#2D3A3A]">Order #{order.id?.slice(-6) || '---'}</h3>
                                                <span className="px-3 py-1 rounded-full bg-[#F3F1ED] text-[#5A7A6A] text-[8px] uppercase tracking-widest font-bold">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#7A8A8A] font-light">
                                                Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] p-12 text-center border border-[#E8E6E2]/60 border-dashed">
                            <p className="text-sm text-[#7A8A8A] italic mb-6">No active rituals at this moment.</p>
                            <Link href="/products" className="inline-block px-8 py-4 bg-[#2D3A3A] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A7A6A] transition-colors">
                                Begin a new journey
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right Column Stack */}
                <div className="space-y-6">
                    {/* Insight Card */}
                    <div className="bg-[#2D3A3A] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden h-fit">
                        <Eye className="w-8 h-8 text-[#5A7A6A] mb-8" />
                        <h3 className="text-2xl font-heading mb-4">Daily <br /><span className="italic font-serif font-light">Insight.</span></h3>
                        <p className="text-xs text-white/50 leading-relaxed font-light mb-8">Maintain consistency. Your last ritual was observed recently.</p>
                        <button onClick={() => redirect('/dashboard/orders')} className="w-full py-4 bg-white/10 hover:bg-white/20 cursor-pointer text-white rounded-full text-[8px] font-bold uppercase tracking-[0.3em] transition-colors">View Insights</button>
                    </div>

                    {/* Stats */}
                    <Link href="/dashboard/orders" className="bg-white rounded-[2.5rem] p-8 border border-[#E8E6E2]/60 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E8E6E2] flex items-center justify-center text-[#5A7A6A]">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-[#7A8A8A] font-bold">History</p>
                            <p className="text-sm text-[#2D3A3A] font-medium tracking-tight">{data.totalCompleted} Rituals</p>
                        </div>
                    </Link>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-[#E8E6E2]/60 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E8E6E2] flex items-center justify-center text-[#5A7A6A]">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-[#7A8A8A] font-bold">Primary Base</p>
                            <p className="text-sm text-[#2D3A3A] font-medium tracking-tight">{data.primaryBase}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}