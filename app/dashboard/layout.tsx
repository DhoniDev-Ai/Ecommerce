"use client";
import { LayoutDashboard, User, MapPin, Package, LogOut, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { motion } from "@/lib/framer";
import Image from "next/image";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/dashboard/profile", icon: User },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Orders", href: "/dashboard/orders", icon: Package },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-12 max-lg:pb-24 lg:pt-16 selection:bg-[#5A7A6A]/10">
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 grid lg:grid-cols-12 gap-12">

                {/* Desktop Sidebar (Left) */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-16 flex flex-col h-[calc(100vh-160px)]">

                        {/* Enlarged Brand Identity */}
                        <div className="mb-16 pl-2">
                            <Link href="/" className="transition-transform active:scale-95 block w-fit">
                                <Image
                                    width={1000}
                                    height={1000}
                                    src="/assets/Logo.png" alt="Ayuniv" className="h-20 w-auto" />
                            </Link>
                            <Link
                                href="/products"
                                className="mt-10 group flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-[#7A8B7A] hover:text-[#5A7A6A] transition-colors"
                            >
                                <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Return to Rituals
                            </Link>
                        </div>

                        {/* High-End Navigation */}
                        <nav className="space-y-1 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold transition-all",
                                        pathname === item.href
                                            ? "bg-[#2D3A3A] text-white shadow-xl shadow-[#2D3A3A]/10"
                                            : "text-[#2D3A3A]/40 hover:bg-[#F3F1ED] hover:text-[#2D3A3A]"
                                    )}
                                >
                                    <item.icon className="w-4 h-4 stroke-[1.5]" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Minimal Logout */}
                        <div className="mt-auto pl-2">
                            <button className="flex items-center cursor-pointer gap-4 px-4 py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-red-400/50 hover:text-red-500 transition-all">
                                <LogOut className="w-4 h-4 stroke-[1.5]" /> Logout
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Sanctuary Area */}
                <main className="lg:col-span-9 min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            {/* Mobile Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-[#E8E6E2] z-[100] px-6 py-5 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 group">
                            <item.icon className={cn(
                                "w-5 h-5 stroke-[2] transition-colors",
                                pathname === item.href ? "text-[#5A7A6A]" : "text-[#2D3A3A]/20"
                            )} />
                            <span className={cn(
                                "text-[7px] uppercase tracking-widest font-black transition-colors",
                                pathname === item.href ? "text-[#5A7A6A]" : "text-[#2D3A3A]/20"
                            )}>
                                {item.name.split(' ')[1] || item.name}
                            </span>
                        </Link>
                    ))}
                    <Link href="/products" className="flex flex-col items-center gap-1.5 group">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <ChevronLeft className="w-4 h-4 text-[#2D3A3A]/50" />
                        </div>
                        <span className="text-[7px] uppercase tracking-widest font-black text-[#2D3A3A]/50">Shop</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}