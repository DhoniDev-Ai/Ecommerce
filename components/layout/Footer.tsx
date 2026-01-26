import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const footerLinks = {
    shop: [
        { name: "All Products", href: "/products" },
        { name: "By Wellness Goal", href: "/products#goals" },
    ],
    about: [
        { name: "Our Story", href: "/about" },
        { name: "Ingredients", href: "/#Ingredients" },
        { name: "Journal", href: "/journal" },
    ],
    support: [
        { name: "Contact", href: "/contact" },
        { name: "Shipping Policy", href: "/shipping-policy" },
        { name: "FAQ", href: "/faq" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-[#2D3A3A] text-white overflow-hidden relative">
            {/* Decorative Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-8 lg:px-12 py-20 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
                    {/* 1. Brand & Contact */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <Link href="/" className="inline-block mb-6">
                                <h2 className=" text-4xl lg:text-5xl font-bold  font-juana text-white">
                                    Ayuniv
                                </h2>
                            </Link>
                            <p className="text-white/60 text-sm leading-relaxed max-w-sm font-light">
                                Crafting wellness through nature's finest ingredients. Pure,
                                honest, and thoughtfully made for your daily rituals.
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 pt-4">
                            <a href="mailto:info@ayuniv.com" className="flex items-center gap-3 text-sm text-white/70 hover:text-[#5A7A6A] transition-colors group">
                                <span className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </span>
                                info@ayuniv.com
                            </a>
                            <a href="tel:+917852011211" className="flex items-center gap-3 text-sm text-white/70 hover:text-[#5A7A6A] transition-colors group">
                                <span className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </span>
                                +91 78520 11211
                            </a>
                            {/* <div className="flex items-center gap-3 text-sm text-white/70 group">
                                <span className="p-2 bg-white/5 rounded-full">
                                    <MapPin className="w-4 h-4" />
                                </span>
                                H. No.
                            </div> */}
                        </div>

                        {/* Socials */}
                        <div className="flex gap-4 pt-2">
                            <a
                                href="https://www.instagram.com/ayuniv_official/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://facebook.com/ayuniv_official"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* 2. Links */}
                    <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-10 lg:gap-8 content-start">
                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-[#5A7A6A] font-bold mb-6">Explore</h4>
                            <ul className="space-y-3">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors font-light">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-[#5A7A6A] font-bold mb-6">Company</h4>
                            <ul className="space-y-3">
                                {footerLinks.about.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors font-light">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* 3. Partners & Support */}
                    <div className="lg:col-span-4 space-y-10">
                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-[#5A7A6A] font-bold mb-6">We are also on</h4>
                            <div className=" flex   justify-around  rounded-2xl ">
                                <Image
                                    width={1000}
                                    height={1000}
                                    src="/wer/amazon.png"
                                    alt="Available on Amazon"
                                    className="h-15 w-auto object-contain scale-85  opacity-80"
                                />
                                <Image
                                    width={1000}
                                    height={1000}
                                    src="/wer/Flipkart.png"
                                    alt="Available on Flipkart"
                                    className="h-15 w-auto object-contain scale-115  opacity-80"
                                />
                                <Image
                                    width={1000}
                                    height={1000}
                                    src="/wer/jio.png"
                                    alt="Available on JioMart"
                                    className="h-15 w-auto object-contain  opacity-80"
                                />
                                <Image
                                    width={1000}
                                    height={1000}
                                    src="/wer/meesho.png"
                                    alt="Available on Meesho"
                                    className="h-15 w-auto object-contain scale-135  opacity-80"
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-[#5A7A6A] font-bold mb-6">Support</h4>
                            <ul className="space-y-3">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors font-light">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/30 font-light">
                        © {new Date().getFullYear()} Ayuniv Wellness. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy_page" className="text-xs text-white/30 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-xs text-white/30 hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
