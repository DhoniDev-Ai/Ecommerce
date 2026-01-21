"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Supabase Magic Link - Sends a secure link to the user's email
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        });

        if (error) setMessage(error.message);
        else setMessage("A secure ritual link has been sent to your email.");
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <main className="grow flex items-center justify-center px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-6">Account Ritual</p>
                    <h1 className="font-heading text-5xl text-[#2D3A3A] mb-8 tracking-tighter">Welcome <span className="italic font-serif font-light text-[#5A7A6A]">Back.</span></h1>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input
                            type="email" placeholder="Email address" required
                            className="w-full p-5 bg-[#F3F1ED] rounded-2xl border-none focus:ring-2 focus:ring-[#5A7A6A] transition-all text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button disabled={loading} className="w-full py-5 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1D2A2A] transition-all">
                            {loading ? "Sending..." : "Continue"}
                        </button>
                    </form>
                    {message && <p className="mt-8 text-sm text-[#5A7A6A] italic font-light">{message}</p>}
                </motion.div>
            </main>
        </div>
    );
}