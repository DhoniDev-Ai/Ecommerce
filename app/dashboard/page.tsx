"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Package, MapPin, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
    const [data, setData] = useState({
        ongoingOrder: null as any,
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

            // 2. Fetch Ongoing Ritual (Latest non-delivered order)
            const { data: ongoing } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .neq('status', 'delivered')
                .neq('status', 'cancelled')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // 3. Count Completed Rituals
            const { count } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('status', 'delivered');

            setData({
                ongoingOrder: ongoing,
                totalCompleted: count || 0,
                primaryBase: addr?.city || "Not Set",
                loading: false
            });
        }
        fetchSanctuaryStats();
    }, []);

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
                {/* Dynamic Ongoing Ritual Card */}
                <div className="md:col-span-2 bg-white rounded-[3rem] p-10 border border-[#E8E6E2]/60 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
                    {data.ongoingOrder ? (
                        <>
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E8E6E2]">
                                        <Package className="w-6 h-6 text-[#5A7A6A]" />
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full bg-[#F3F1ED] text-[#5A7A6A] text-[8px] uppercase tracking-[0.2em] font-black">
                                        {data.ongoingOrder.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-heading text-[#2D3A3A] mb-3">Ongoing Ritual</h3>
                                <p className="text-base text-[#7A8A8A] font-light">
                                    Ritual <span className="font-medium text-[#2D3A3A]">#{data.ongoingOrder.cashfree_order_id || 'Pending'}</span> is active.
                                </p>
                            </div>
                            <Link href={`/dashboard/orders/${data.ongoingOrder.id}`} className="mt-12 flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-[#5A7A6A] group-hover:gap-4 transition-all">
                                Track Shipment <ArrowRight className="w-3 h-3" />
                            </Link>
                        </>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-sm text-[#7A8A8A] italic">No active rituals at this moment.</p>
                            <Link href="/products" className="text-[9px] uppercase tracking-widest font-bold text-[#5A7A6A] mt-4 block">Begin a new journey</Link>
                        </div>
                    )}
                </div>

                {/* Insight Card (Static or Predicted) */}
                <div className="bg-[#2D3A3A] rounded-[4rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    <Eye className="w-8 h-8 text-[#5A7A6A] mb-8" />
                    <h3 className="text-3xl font-heading mb-4">Daily <br /><span className="italic font-serif font-light">Insight.</span></h3>
                    <p className="text-xs text-white/50 leading-relaxed font-light">Your last ritual was 14 days ago. Time to replenish?</p>
                    <button className="mt-10 w-full py-5 bg-white text-[#2D3A3A] rounded-full text-[9px] font-bold uppercase tracking-[0.3em]">Quick Replenish</button>
                </div>

                {/* Summary Row */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-[#E8E6E2]/60 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E8E6E2] flex items-center justify-center text-[#5A7A6A]">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest text-[#7A8A8A] font-bold">Primary Base</p>
                        <p className="text-sm text-[#2D3A3A] font-medium tracking-tight">{data.primaryBase}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-[#E8E6E2]/60 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E8E6E2] flex items-center justify-center text-[#5A7A6A]">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest text-[#7A8A8A] font-bold">Total Rituals</p>
                        <p className="text-sm text-[#2D3A3A] font-medium tracking-tight">{data.totalCompleted} Completed</p>
                    </div>
                </div>
            </div>
        </section>
    );
}