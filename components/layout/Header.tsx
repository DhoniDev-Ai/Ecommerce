"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, Search, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "@/lib/framer";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useCartContext } from "@/context/CartContext";

const navigation = [
    { name: "Collection", href: "/products" },
    { name: "The Alchemy", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Journal", href: "/journal" }
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { openCart, itemCount } = useCartContext();

    // Listen for auth state changes
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };

        if (profileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileDropdownOpen]);

    // Handle logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setProfileDropdownOpen(false);
        router.push("/");
    };

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white shadow-sm py-3"
                    : "bg-transparent py-4"
            )}
        >
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8"
                aria-label="Global"
            >
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                        <span className="sr-only">Ayuniv</span>
                        <img
                            src="/assets/Logo.png"
                            alt="Ayuniv"
                            className="h-16 w-auto"
                        />
                    </Link>
                </div>

                {/* Mobile Cart & Menu Buttons */}
                <div className="flex lg:hidden items-center gap-3">
                    {/* Cart Button - Mobile */}
                    <button
                        onClick={openCart}
                        className="text-[#2D3A3A]/70 hover:text-[#5A7A6A] transition-colors relative p-2"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute top-0.5 right-0.5 bg-[#5A7A6A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Menu Button */}
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-10">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-[10px] uppercase tracking-[0.25em] font-bold transition-colors",
                                    isActive
                                        ? "text-[#5A7A6A]"
                                        : "text-[#2D3A3A]/70 hover:text-[#5A7A6A]"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-5">
                    <Link href="/search" className="text-[#2D3A3A]/70 hover:text-[#5A7A6A] transition-colors p-2">
                        <Search className="h-5 w-5" />
                    </Link>
                    <button
                        onClick={openCart}
                        className="text-[#2D3A3A]/70 hover:text-[#5A7A6A] cursor-pointer transition-colors relative p-2"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute top-0.5 right-0.5 bg-[#5A7A6A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Auth Section */}
                    {!user ? (
                        <Link
                            href="/login"
                            className="text-[9px] uppercase tracking-[0.35em] font-bold text-[#2D3A3A]/70 hover:text-[#5A7A6A] cursor-pointer transition-colors ml-2"
                        >
                            Login
                        </Link>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="text-[#2D3A3A]/70 cursor-pointer hover:text-[#5A7A6A] transition-colors p-2"
                            >
                                <User className="h-5 w-5 stroke-[1.5]" />
                            </button>

                            {/* Profile Dropdown */}
                            <AnimatePresence>
                                {profileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#E8E6E2] overflow-hidden z-50"
                                    >
                                        <div className="p-3 border-b border-[#E8E6E2]">
                                            <p className="text-[9px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold">
                                                Ritual Member
                                            </p>
                                            <p className="text-xs text-[#2D3A3A] mt-1 truncate font-light">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setProfileDropdownOpen(false)}
                                                className="block px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D3A3A]/70 hover:bg-[#5A7A6A]/5 hover:text-[#5A7A6A] transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D3A3A]/70 hover:bg-red-50 cursor-pointer hover:text-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <LogOut className="h-3.5 w-3.5 stroke-2" />
                                                Log Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "lg:hidden fixed inset-0 z-50 w-full overflow-y-auto bg-[#FDFBF7] transition-transform duration-300 ease-in-out sm:max-w-sm sm:inset-y-0",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full hidden"
                )}
            >
                <div className="flex min-h-full flex-col px-6 py-6 bg-[#FDFBF7]">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                            <img
                                src="/assets/logo.png"
                                alt="Ayuniv"
                                className="h-8 w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-8 flex-1">
                        <div className="space-y-1 pb-6 border-b border-zinc-100">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                                            isActive
                                                ? "bg-[#5A7A6A]/5 text-[#5A7A6A] font-semibold"
                                                : "text-foreground hover:bg-zinc-50 hover:text-[#5A7A6A]"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="pt-6 flex flex-col gap-3">
                            <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-center gap-2 rounded-full" size="sm">
                                    <Search className="h-4 w-4" /> Search Blends
                                </Button>
                            </Link>

                            {/* Auth Buttons */}
                            {!user ? (
                                <div className="flex gap-3">
                                    <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center gap-2 rounded-full" size="sm">
                                            <User className="h-4 w-4" /> Login
                                        </Button>
                                    </Link>
                                    <Button
                                        className="flex-1 justify-center gap-2 rounded-full"
                                        size="sm"
                                        onClick={() => {
                                            openCart();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <ShoppingBag className="h-4 w-4" /> Cart ({itemCount})
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center gap-2 rounded-full" size="sm">
                                            <User className="h-4 w-4" /> Dashboard
                                        </Button>
                                    </Link>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center gap-2 rounded-full"
                                                size="sm"
                                                onClick={() => {
                                                    handleLogout();
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                <LogOut className="h-4 w-4" /> Logout
                                            </Button>
                                        </div>

                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </header>
    );
}
