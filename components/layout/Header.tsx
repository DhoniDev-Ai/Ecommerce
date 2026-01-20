"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Search, User, Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md shadow-sm py-4"
                    : "bg-transparent py-6"
            )}
        >
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
                        <span className="sr-only">Ayuniv</span>
                        <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                            <Leaf className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-heading font-bold text-2xl text-foreground tracking-tight">
                            Ayuniv
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden">
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
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-foreground/80 hover:text-primary transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
                    <button className="text-foreground/80 hover:text-primary transition-colors">
                        <Search className="h-5 w-5" />
                    </button>
                    <button className="text-foreground/80 hover:text-primary transition-colors relative">
                        <ShoppingBag className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
                    </button>
                    <button className="text-foreground/80 hover:text-primary transition-colors">
                        <User className="h-5 w-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dialog */}
            <div
                className={cn(
                    "lg:hidden fixed inset-0 z-50 bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-transform duration-300 ease-in-out",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <span className="sr-only">Ayuniv</span>
                        <Leaf className="h-6 w-6 text-primary" />
                        <span className="font-heading font-bold text-xl text-foreground">Ayuniv</span>
                    </Link>
                    <button
                        type="button"
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="sr-only">Close menu</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-gray-50 hover:text-primary"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="py-6 flex gap-4">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <User className="h-4 w-4" /> Account
                            </Button>
                            <Button className="w-full justify-start gap-2">
                                <ShoppingBag className="h-4 w-4" /> Cart (2)
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Overlay for mobile menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}
        </header>
    );
}
