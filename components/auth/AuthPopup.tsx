"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export function AuthPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const { user, isLoading } = useAuth();
    const [hasSeen, setHasSeen] = useState(true); // Default true to avoid flash

    useEffect(() => {
        // Check session storage immediately
        const seen = sessionStorage.getItem("has_seen_auth_popup");
        if (!seen) {
            setHasSeen(false);
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem("has_seen_auth_popup", "true");
    };

    // Don't show if user is logged in or loading or has seen
    if (isLoading || user || hasSeen) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-60 flex items-center justify-center p-4 pointer-events-auto"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-70 w-full max-w-md bg-[#FDFBF7] rounded-4xl shadow-2xl border border-[#E8E6E2] overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="relative p-8 md:p-10 text-center">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E8E6E2] text-[#7A8A8A] hover:bg-[#F3F1ED] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="mb-6 flex justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#5A7A6A]/10 flex items-center justify-center">
                                    <Image src="/assets/logo_1by1.png" alt="Logo" width={100} height={100} className="rounded-2xl " />
                                </div>
                            </div>

                            <h2 className="font-heading text-3xl text-[#2D3A3A] mb-3">Join the <span className="italic font-serif text-[#5A7A6A]">Circle.</span></h2>
                            <p className="text-[#6A7A7A] mb-8 font-light leading-relaxed">
                                Create an account to unlock exclusive rituals, early access to new harvests, and personalized wellness insights.
                            </p>

                            <div className="space-y-3">
                                <Link
                                    href="/login?mode=signup"
                                    onClick={handleClose}
                                    className="w-full py-4 bg-[#5A7A6A] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#4A6A5A] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Join Ayuniv <ArrowRight className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 text-[10px] uppercase tracking-widest font-bold text-[#9AA09A] hover:text-[#5A7A6A] transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[#E8E6E2]">
                                <p className="text-xs text-[#9AA09A]">Already a member? <Link href="/login" onClick={handleClose} className="text-[#5A7A6A] font-bold hover:underline">Sign In</Link></p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
