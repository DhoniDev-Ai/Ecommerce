'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow flex items-center justify-center relative z-10 px-6 py-24">
                <div className="text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-400 mb-8">
                        <AlertCircle className="w-8 h-8" />
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.4em] text-red-800/60 font-bold mb-6">System Error</p>
                    <h1 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] tracking-tighter leading-none mb-6">
                        A Momentary <span className="italic font-serif font-light text-red-400">Interruption.</span>
                    </h1>
                    <p className="text-sm text-[#7A8A8A] font-light leading-relaxed mb-10">
                        Our digital sanctuary encountered an unexpected issue. Please try refreshing the ritual.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#1D2A2A] hover:scale-105 transition-all shadow-xl shadow-[#2D3A3A]/10 group cursor-pointer"
                        >
                            Try Again <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                        <Link
                            href="/"
                            className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#7A8A8A] hover:text-[#2D3A3A] transition-colors py-4 px-6"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
