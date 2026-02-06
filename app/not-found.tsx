import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Leaf } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow flex items-center justify-center relative z-10 px-6 py-24">
                <div className="text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-[#5A7A6A]/5 rounded-full flex items-center justify-center mx-auto text-[#5A7A6A] mb-8">
                        <Leaf className="w-8 h-8" />
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-6">404 Error</p>
                    <h1 className="font-heading text-5xl lg:text-6xl text-[#2D3A3A] tracking-tighter leading-none mb-6">
                        Lost in the <span className="italic font-serif font-light text-[#5A7A6A]">Wilderness?</span>
                    </h1>
                    <p className="text-sm text-[#7A8A8A] font-light leading-relaxed mb-10">
                        The page you are looking for has wandered off the path. It may have been moved or does not exist. Let's guide you back to the sanctuary.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#1D2A2A] hover:scale-105 transition-all shadow-xl shadow-[#2D3A3A]/10 group"
                    >
                        Return Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
