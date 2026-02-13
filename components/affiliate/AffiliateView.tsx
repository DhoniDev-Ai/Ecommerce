"use client";

import { joinAffiliateProgram, getAffiliateStats, updatePayoutSettings, type AffiliateStats } from "@/actions/affiliate";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Copy, Check, TrendingUp, DollarSign, Users, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { Toast } from "@/components/ui/Toast";
import { User as AuthUser } from "@supabase/supabase-js";
import { Header } from "../layout/Header";
import { motion, AnimatePresence } from "framer-motion";

interface AffiliateViewProps {
    initialUser: AuthUser | null;
    initialStats: AffiliateStats | null;
}

export function AffiliateView({ initialUser, initialStats }: AffiliateViewProps) {
    const router = useRouter();
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: "", type: null });

    // We can use local state to track updates (e.g. after joining)
    // Initialize with server data
    const [stats, setStats] = useState<AffiliateStats | null>(initialStats);
    const [user] = useState<AuthUser | null>(initialUser); // User from server is stable enough for this page

    const [joining, setJoining] = useState(false);
    const [copied, setCopied] = useState(false);
    const [preferredCode, setPreferredCode] = useState("");

    // Payout Settings State
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [payoutForm, setPayoutForm] = useState({
        bank_name: stats?.payout_info?.bank_name || "",
        account_number: stats?.payout_info?.account_number || "",
        ifsc: stats?.payout_info?.ifsc || "",
        upi_id: stats?.payout_info?.upi_id || ""
    });
    const [savingPayout, setSavingPayout] = useState(false);

    // If we wanted to sync with client-side AuthProvider we could, but server data is faster for FCP.
    // For this specific page, server user is sufficient.

    const handleJoin = async () => {
        if (!user) {
            router.push('/login?redirect=/affiliate');
            return;
        }

        setJoining(true);
        const res = await joinAffiliateProgram(preferredCode);
        if (res.success) {
            setToast({ message: "Welcome to the Partner Program! 🎉", type: 'success' });
            // Refetch stats to show dashboard
            const statsRes = await getAffiliateStats();
            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data);
            }
        } else {
            setToast({ message: res.error || "Failed to join.", type: 'error' });
        }
        setJoining(false);
    };

    const copyCode = () => {
        if (stats?.coupon_code) {
            navigator.clipboard.writeText(stats.coupon_code);
            setCopied(true);
            setToast({ message: "Code copied to clipboard!", type: 'success' });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSavePayout = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingPayout(true);
        const res = await updatePayoutSettings(payoutForm);
        if (res.success) {
            setToast({ message: "Payout settings saved.", type: 'success' });
            setIsPayoutModalOpen(false);
            // Update local stats directly
            if (stats) {
                setStats({ ...stats, payout_info: payoutForm });
            }
        } else {
            setToast({ message: res.error || "Failed to save settings.", type: 'error' });
        }
        setSavingPayout(false);
    };

    // 1. Not Joined / Not Logged In View
    if (!stats) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-[#FDFBF7]">
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, type: null })} />
                <Header />
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A8A8A]">Ayuniv Partner Program</span>
                    <h1 className="font-heading text-4xl md:text-6xl text-[#2D3A3A] leading-tight">
                        Grow with us.<br />
                        <span className="text-[#5A7A6A] italic">Earn together.</span>
                    </h1>
                    <p className="text-lg text-[#7A8A8A] max-w-2xl mx-auto leading-relaxed">
                        Join our wellness community as a partner. Share the gift of Ayurveda and earn commissions for every new member you welcome to the family.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12 mb-12">
                        {[
                            { title: "5% Commission", desc: "Earn 5% on every referred sale, tracked instantly." },
                            { title: "5% Discount", desc: "Your audience gets a 5% discount code." },
                            { title: "Bi-Weekly Payouts", desc: "Automatic payouts directly to your account." }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-[#E8E6E2] shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-heading text-xl text-[#2D3A3A] mb-2">{feature.title}</h3>
                                <p className="text-sm text-[#7A8A8A]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-md mx-auto mb-8">
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#7A8A8A] mb-2">
                            Preferred Partner Code (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. RAHUL"
                            value={preferredCode}
                            onChange={(e) => setPreferredCode(e.target.value.toUpperCase())}
                            className="w-full bg-white border border-[#E8E6E2] rounded-xl px-4 py-3 text-center font-heading text-lg tracking-widest text-[#2D3A3A] focus:outline-none focus:border-[#5A7A6A] placeholder:text-[#D1D1D1]"
                            maxLength={10}
                        />
                        <p className="text-[10px] text-[#7A8A8A] mt-2">
                            Leave blank to auto-generate based on your name.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => handleJoin()}
                            disabled={joining}
                            className="px-10 py-5 bg-[#2D3A3A] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#5A7A6A] transition-all disabled:opacity-70 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {user ? "Activate Partner Account" : "Login to Join"}
                        </button>
                        <Link href="/legal/affiliate-policy" className="text-xs text-[#7A8A8A] underline hover:text-[#5A7A6A]">
                            View Program Terms
                        </Link>
                    </div>
                </div>
            </div >
        );
    }

    // 2. Dashboard View (Logged In & Joined)
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-[#FDFBF7]">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, type: null })} />
            <Header />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A8A8A]">Dashboard</span>
                        <h1 className="font-heading text-4xl text-[#2D3A3A] mt-2">Hello, <span className="italic text-[#5A7A6A]">{user?.user_metadata?.full_name?.split(' ')[0]}</span></h1>
                    </div>
                    <Link href="/legal/affiliate-policy" className="flex items-center gap-2 text-sm font-bold text-[#7A8A8A] hover:text-[#2D3A3A] transition-colors">
                        Program Policy <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Coupon Card */}
                    <div className="bg-[#2D3A3A] text-[#F3F1ED] p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Your Partner Code</span>
                            <div className="mt-4 flex items-center gap-4">
                                <h2 className="font-heading text-4xl tracking-wider">{stats.coupon_code}</h2>
                                <button
                                    onClick={copyCode}
                                    className="p-3 rounded-full cursor-copy bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    {copied ? <Check className="w-5 h-5 cursor-default" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="mt-6 text-sm opacity-60">
                                Share this code to give 5% OFF. You earn {stats.commission_rate}% commission on every sale.
                            </p>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#5A7A6A] rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    </div>

                    {/* Earnings Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E8E6E2] flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#7A8A8A]">Total Earnings</span>
                            <h2 className="font-heading text-5xl text-[#2D3A3A] mt-4">₹{stats.total_earnings.toLocaleString()}</h2>
                        </div>
                        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-[#F3F1ED] rounded-full self-start">
                            <ArrowRight className="w-4 h-4 text-[#5A7A6A] -rotate-45" />
                            <span className="text-xs font-bold text-[#7A8A8A]">Lifetime</span>
                        </div>
                    </div>

                    {/* Payout Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E8E6E2] flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#7A8A8A]">Next Payout</span>
                            <h2 className="font-heading text-4xl text-[#5A7A6A] mt-4">₹{stats.pending_payout.toLocaleString()}</h2>
                            <p className="text-sm text-[#7A8A8A] mt-2">Processed every 14 days</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-[#E8E6E2]">
                        <h3 className="font-heading text-xl text-[#2D3A3A] mb-8">Performance Overview</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <span className="text-xs text-[#7A8A8A] block mb-1">Total Sales Referred</span>
                                <p className="font-heading text-3xl text-[#2D3A3A]">{stats.sales_count}</p>
                            </div>
                            <div>
                                <span className="text-xs text-[#7A8A8A] block mb-1">Commission Rate</span>
                                <p className="font-heading text-3xl text-[#2D3A3A]">{stats.commission_rate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F3F1ED] p-8 rounded-[2.5rem] border border-[#E8E6E2] flex flex-col justify-center">
                        <h3 className="font-heading text-xl text-[#2D3A3A] mb-4">Payout Details</h3>
                        <p className="text-sm text-[#7A8A8A] mb-6 leading-relaxed">
                            Payouts are processed bi-weekly via UPI or Bank Transfer. Please ensure your details are up to date.
                        </p>
                        <button
                            onClick={() => setIsPayoutModalOpen(true)}
                            className="w-full py-4 border cursor-pointer border-[#2D3A3A] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2D3A3A] hover:text-white transition-all transform hover:-translate-y-1"
                        >
                            Manage Payout Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* PAYOUT SETTINGS MODAL */}
            <AnimatePresence>
                {isPayoutModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPayoutModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto max-w-lg h-fit bg-white rounded-3xl p-8 z-50 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading text-2xl text-[#2D3A3A]">Payout Settings</h3>
                                <button onClick={() => setIsPayoutModalOpen(false)} className="p-2 hover:bg-[#F3F1ED] rounded-full">
                                    <X className="w-5 h-5 text-[#7A8A8A]" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePayout} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#7A8A8A]">Bank Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#FAF9F7] border border-[#E8E6E2] rounded-xl px-4 py-3 text-[#2D3A3A]"
                                        value={payoutForm.bank_name}
                                        onChange={(e) => setPayoutForm({ ...payoutForm, bank_name: e.target.value })}
                                        placeholder="e.g. HDFC Bank"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#7A8A8A]">Account Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#FAF9F7] border border-[#E8E6E2] rounded-xl px-4 py-3 text-[#2D3A3A]"
                                        value={payoutForm.account_number}
                                        onChange={(e) => setPayoutForm({ ...payoutForm, account_number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#7A8A8A]">IFSC Code</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#FAF9F7] border border-[#E8E6E2] rounded-xl px-4 py-3 text-[#2D3A3A]"
                                            value={payoutForm.ifsc}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, ifsc: e.target.value.toUpperCase() })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#7A8A8A]">UPI ID (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#FAF9F7] border border-[#E8E6E2] rounded-xl px-4 py-3 text-[#2D3A3A]"
                                            value={payoutForm.upi_id}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, upi_id: e.target.value })}
                                            placeholder="user@upi"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        required
                                        className="mt-1 accent-[#2D3A3A]"
                                    />
                                    <label htmlFor="terms" className="text-xs text-[#7A8A8A] leading-tight">
                                        I certify that the above details are correct and belong to me. I agree to the <Link href="/legal/affiliate-policy" className="underline hover:text-[#2D3A3A]">Partner Terms</Link>.
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={savingPayout}
                                        className="w-full bg-[#2D3A3A] text-white rounded-xl py-4 font-bold uppercase tracking-widest hover:bg-[#1A2222] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {savingPayout ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Details"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

