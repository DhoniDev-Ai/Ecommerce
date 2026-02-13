"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    ArrowLeft,
    Menu,
    X,
    LogOut,
    Tag,
    BookOpen
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export function AdminNav() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/coupons", label: "Coupons", icon: Tag },
        { href: "/admin/affiliates", label: "Affiliates", icon: Tag },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/journal", label: "Journal", icon: BookOpen },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E6E2] h-screen sticky top-0">
                <div className="h-20 flex items-center px-8 border-b border-[#E8E6E2]/60">
                    <span className="font-heading text-xl text-[#2D3A3A] tracking-tight">Admin<span className="text-[#5A7A6A] italic">Panel</span></span>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ease-out duration-300 group relative overflow-hidden",
                                isActive(item.href)
                                    ? "bg-[#2D3A3A] text-white shadow-lg shadow-[#2D3A3A]/20"
                                    : "text-[#7A8A8A] hover:bg-[#F3F1ED] hover:text-[#2D3A3A]"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", isActive(item.href) ? "text-[#7cae95] " : "group-hover:text-[#a2c6b4] transition-colors")} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-[#E8E6E2]/60 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide text-[#5A7A6A] bg-[#5A7A6A]/10 hover:bg-[#5A7A6A] hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* MOBILE HEADER */}
            <header className="md:hidden h-16 bg-white border-b border-[#E8E6E2] flex items-center justify-between px-6 sticky top-0 z-40">
                <span className="font-heading text-lg text-[#2D3A3A]">Admin<span className="text-[#5A7A6A] italic">Panel</span></span>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 text-[#2D3A3A] hover:bg-[#F3F1ED] rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
                        >
                            <div className="h-16 flex items-center justify-between px-6 border-b border-[#E8E6E2]">
                                <span className="font-heading text-lg text-[#2D3A3A]">Menu</span>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-2 text-[#9AA09A] hover:text-[#2D3A3A] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex-1 p-6 space-y-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold tracking-wide transition-all",
                                            isActive(item.href)
                                                ? "bg-[#2D3A3A] text-white shadow-md"
                                                : "text-[#7A8A8A] hover:bg-[#F3F1ED] hover:text-[#2D3A3A]"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive(item.href) ? "text-[#5A7A6A]" : "")} />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-6 border-t border-[#E8E6E2] mt-auto">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-sm font-bold tracking-wide text-[#5A7A6A] bg-[#5A7A6A]/10 active:scale-95 transition-transform"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Store
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
