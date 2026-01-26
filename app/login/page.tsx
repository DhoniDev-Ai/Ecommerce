"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Sparkles, Mail, ArrowRight, Loader2, KeyRound } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/");
            }
        };
        checkUser();
    }, [router]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: true }
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setOtpSent(true);
            setMessage({ type: 'success', text: "A secret code has been sent to your email." });
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (otp.length < 6) {
            setMessage({ type: 'error', text: "Please enter a valid code." });
            setLoading(false);
            return;
        }

        const { data: { session }, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email'
        });

        if (error) {
            const errorMessage = error.message || "Invalid OTP";
            if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
                setMessage({ type: 'error', text: "Code expired or invalid. Please request a new one." });
            } else {
                setMessage({ type: 'error', text: errorMessage });
            }
            setLoading(false);
        } else if (session) {
            // Extract name from email if not present
            try {
                const { data } = await supabase.from('users').select('full_name').eq('id', session.user.id).single();
                const userProfile = data as { full_name: string | null } | null;

                if (!userProfile?.full_name) {
                    const emailName = email.split('@')[0];
                    const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

                    // Update profile
                    await supabase.from('users').update({
                        full_name: formattedName
                    }).eq('id', session.user.id);
                }
            } catch (err) {
                //console.error("Auto-name update failed", err);
            }

            setMessage({ type: 'success', text: "Identity verified. Entering sanctuary..." });
            router.refresh();
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col selection:bg-[#5A7A6A]/10">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow flex items-center justify-center px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-[#7A8B7A] font-bold mb-6">Enter the Sanctuary</p>
                        <h1 className="font-heading text-5xl lg:text-6xl text-[#2D3A3A] tracking-tighter leading-none mb-4">
                            Ritual <span className="italic font-serif font-light text-[#5A7A6A]">Access.</span>
                        </h1>
                        <p className="text-sm text-[#7A8A8A] font-light">
                            {otpSent
                                ? `Enter the code sent to ${email}`
                                : "Enter your email for a passwordless, secure login."}
                        </p>
                    </div>

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B7A] transition-colors group-focus-within:text-[#5A7A6A]" />
                                <input
                                    type="email"
                                    placeholder="name@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-[#E8E6E2] rounded-4xl focus:outline-none focus:ring-2 focus:ring-[#5A7A6A]/20 focus:border-[#5A7A6A] transition-all text-sm placeholder:text-[#9AA09A]"
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
                                        Send Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                                    placeholder="Enter 6-8 digit code"
                                    required
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
                                        Verify Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="w-full text-[9px] text-[#9AA09A] hover:text-[#5A7A6A] uppercase tracking-widest transition-colors"
                            >
                                Change Email
                            </button>
                        </form>
                    )}

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`mt-8 p-6 rounded-3xl text-sm font-light leading-relaxed border flex items-start gap-4 ${message.type === 'success'
                                    ? 'bg-[#F3F5F3] border-[#5A7A6A]/10 text-[#5A7A6A]'
                                    : 'bg-red-50 border-red-100 text-red-600'
                                    }`}
                            >
                                <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 text-center">
                        <p className="text-[9px] uppercase tracking-widest text-[#9AA09A] font-medium leading-loose">
                            By continuing, you join the Ayuniv collective <br /> and agree to our pure ritual terms.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}