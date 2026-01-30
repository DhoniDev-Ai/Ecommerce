"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Sparkles, Mail, ArrowRight, Loader2, KeyRound, Smartphone, MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    // Auth State
    const [otpSent, setOtpSent] = useState(false);
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

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const digits = phone.replace(/\D/g, '');
            if (digits.length !== 10) throw new Error("Please enter a valid 10-digit phone number.");

            const { error } = await supabase.auth.signInWithOtp({
                phone: '+91' + digits,
                options: { channel: 'whatsapp' }
            });

            if (error) throw error;

            setOtpSent(true);
            setMessage({ type: 'success', text: `WhatsApp code sent to +91 ${digits}` });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to send code." });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Keep loading true on success to prevent UI flicker
        setMessage(null);

        if (otp.length < 6) {
            setMessage({ type: 'error', text: "Please enter a valid 6-digit code." });
            setLoading(false);
            return;
        }

        try {
            const digits = phone.replace(/\D/g, '');
            const { error } = await supabase.auth.verifyOtp({
                phone: '+91' + digits,
                token: otp,
                type: 'sms'
            });

            if (error) throw error;

            // Success: Show message but KEEP loading state true while redirecting
            setMessage({ type: 'success', text: "Verified! Entering Sanctuary..." });

            // The useEffect listener will handle the redirect automatically and faster
            // We just wait here to avoid resetting loading state

        } catch (err: any) {
            setLoading(false); // Only stop loading on error
            const msg = err.message || "Invalid OTP";
            if (msg.includes("expired") || msg.includes("invalid")) {
                setMessage({ type: 'error', text: "Code expired or invalid. Try again." });
            } else {
                setMessage({ type: 'error', text: msg });
            }
        }
    };

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
                            {otpSent
                                ? "Enter the secret code we just sent you."
                                : "Begin your journey with a secure, passwordless login."}
                        </p>
                    </div>

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="relative group">
                                <>
                                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B7A] transition-colors group-focus-within:text-[#5A7A6A]" />
                                    <div className="flex items-center w-full bg-white border border-[#E8E6E2] rounded-4xl focus-within:ring-2 focus-within:ring-[#5A7A6A]/20 focus-within:border-[#5A7A6A] transition-all overflow-hidden">
                                        <div className="pl-14 pr-2 py-5 bg-gray-50 border-r border-[#E8E6E2] text-sm font-mono text-[#5A7A6A] select-none">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="99999 99999"
                                            required
                                            maxLength={10}
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhone(val);
                                            }}
                                            className="w-full px-4 py-5 bg-transparent focus:outline-none text-sm placeholder:text-[#9AA09A] font-mono tracking-widest"
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
                                        Send OTP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="relative group">
                                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B7A] transition-colors group-focus-within:text-[#5A7A6A]" />
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-[#E8E6E2] rounded-4xl focus:outline-none focus:ring-2 focus:ring-[#5A7A6A]/20 focus:border-[#5A7A6A] transition-all text-sm placeholder:text-[#9AA09A] tracking-[0.5em] font-mono text-center"
                                />
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
                                        Verify & Enter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtp("");
                                    setMessage(null);
                                }}
                                className="w-full text-[9px] text-[#9AA09A] hover:text-[#5A7A6A] uppercase tracking-widest transition-colors"
                            >
                                Change Number
                            </button>
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