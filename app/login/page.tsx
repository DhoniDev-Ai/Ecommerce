"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Sparkles, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Supabase Magic Link Logic
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // This must match your site URL and the callback route we'll create next
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: "A sacred ritual link has been sent to your inbox." });
        }
        setLoading(false);
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
                        <p className="text-sm text-[#7A8A8A] font-light">Enter your email for a passwordless, secure login.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B7A] transition-colors group-focus-within:text-[#5A7A6A]" />
                            <input
                                type="email"
                                placeholder="name@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white border border-[#E8E6E2] rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-[#5A7A6A]/20 focus:border-[#5A7A6A] transition-all text-sm placeholder:text-[#9AA09A]"
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
                                    Send Magic Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

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