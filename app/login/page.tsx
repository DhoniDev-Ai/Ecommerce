"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Sparkles, Mail, ArrowRight, Loader2, KeyRound, Smartphone, MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    // const [phone, setPhone] = useState(""); // WhatsApp Auth (Paused)
    // const [phone, setPhone] = useState(""); // WhatsApp Auth (Paused)
    const [otp, setOtp] = useState("");

    // Auth State
    const [linkSent, setLinkSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const router = useRouter();

    // Optimize: Single robust listener for auth state changes
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || session) {
                router.replace("/"); // Use replace to prevent back-button loops
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Basic Email Validation
            if (!email.includes('@') || !email.includes('.')) throw new Error("Please enter a valid email address.");

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) throw error;

            setLinkSent(true);
            setLinkSent(true);
            setMessage({ type: 'success', text: `OTP Code sent to ${email}` });
        } catch (err: any) {
            console.error("Auth Error:", err);
            setMessage({ type: 'error', text: err.message || "Failed to send link." });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email'
            });

            if (error) throw error;

            // Session is handled by onAuthStateChange listener
            setMessage({ type: 'success', text: "Login successful!" });
        } catch (err: any) {
            console.error("Auth Error:", err);
            setMessage({ type: 'error', text: err.message || "Invalid Code" });
            setLoading(false);
        }
    };

    /* 
    // WHATSAPP AUTH LOGIC (PAUSED FOR META VERIFICATION)
    const handleSendOtp = async (e: React.FormEvent) => { ... }
    const handleVerifyOtp = async (e: React.FormEvent) => { ... }
    */

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col selection:bg-[#5A7A6A]/10">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow flex items-center justify-center px-8 relative z-10 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-[#7A8B7A] font-bold mb-6">Enter the Sanctuary</p>
                        <h1 className="font-heading text-5xl lg:text-6xl text-[#2D3A3A] tracking-tighter leading-none mb-4">
                            Ritual <span className="italic font-serif font-light text-[#5A7A6A]">Access.</span>
                        </h1>
                        <p className="text-xs text-[#7A8A8A] font-light max-w-xs mx-auto leading-relaxed">
                            {linkSent
                                ? "Check your inbox for the magic link."
                                : "Begin your journey with a secure, passwordless login."}
                        </p>
                    </div>

                    {!linkSent ? (
                        <form onSubmit={handleSendMagicLink} className="space-y-6">
                            <div className="relative group">
                                <>
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B7A] transition-colors group-focus-within:text-[#5A7A6A]" />
                                    <div className="flex items-center w-full bg-white border border-[#E8E6E2] rounded-4xl focus-within:ring-2 focus-within:ring-[#5A7A6A]/20 focus-within:border-[#5A7A6A] transition-all overflow-hidden">
                                        <input
                                            type="email"
                                            placeholder="hello@ayuniv.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-14 pr-4 py-5 bg-transparent focus:outline-none text-sm placeholder:text-[#9AA09A] font-mono tracking-wider"
                                        />
                                    </div>
                                </>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-5 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1D2A2A] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-black/5 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Send Login Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="bg-white p-8 rounded-4xl border border-[#E8E6E2] shadow-sm text-center">
                                <div className="w-16 h-16 bg-[#5A7A6A]/10 rounded-full flex items-center justify-center mx-auto text-[#5A7A6A] mb-4">
                                    <KeyRound className="w-8 h-8" />
                                </div>
                                <div className="space-y-2 mb-6">
                                    <h3 className="font-heading text-lg text-[#2D3A3A]">OTP Sent</h3>
                                    <p className="text-xs text-[#7A8A8A] leading-relaxed">
                                        Enter the 6-digit code sent to <br />
                                        <span className="font-bold text-[#2D3A3A]">{email}</span>
                                    </p>
                                </div>

                                <div className="relative group mb-6">
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full text-center py-4 bg-[#F9F8F6] rounded-2xl border border-[#E8E6E2] focus:outline-none focus:border-[#5A7A6A] focus:ring-1 focus:ring-[#5A7A6A] text-2xl font-mono tracking-[0.5em] text-[#2D3A3A] placeholder:text-[#D4D2CE]"
                                    />
                                </div>

                                <button
                                    disabled={loading || otp.length < 6}
                                    type="submit"
                                    className="w-full py-4 bg-[#2D3A3A] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1D2A2A] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Verify & Enter <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <div className="pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLinkSent(false);
                                            setMessage(null);
                                            setOtp("");
                                        }}
                                        className="text-[9px] text-[#9AA09A] hover:text-[#5A7A6A] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <ArrowRight className="w-3 h-3 rotate-180" /> Use different email
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`mt-8 p-6 rounded-3xl text-xs font-light leading-relaxed border flex items-start gap-4 ${message.type === 'success'
                                    ? 'bg-[#F3F5F3] border-[#5A7A6A]/10 text-[#5A7A6A]'
                                    : 'bg-red-50 border-red-100 text-red-600'
                                    }`}
                            >
                                <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block mb-1 uppercase tracking-wider text-[10px]">
                                        {message.type === 'success' ? 'Sent' : 'Error'}
                                    </span>
                                    {message.text}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}