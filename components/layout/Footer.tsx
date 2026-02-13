import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin, Twitter, Linkedin } from "lucide-react";
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
        { name: "Affiliate Program", href: "/affiliate" },
    ],
    support: [
        { name: "Contact", href: "/contact" },
        { name: "Shipping Policy", href: "/shipping-policy" },
        { name: "Return Policy", href: "/return-policy" },
        { name: "FAQ", href: "/faq" },
    ],
};

const imgone = [
    {
        src: "/wer/amazon.png",
        alt: "Available on Amazon",
        className: "h-15 w-auto object-contain scale-85  opacity-90",
        href: "https://www.amazon.in/s?k=Ayuniv&ref=bl_dp_s_web_0"
    },
    {
        src: "/wer/Flipkart.png",
        alt: "Available on Flipkart",
        className: "h-15 w-auto object-contain scale-115  opacity-90",
        href: "https://www.flipkart.com/ayuniv-ayurveda/s?marketplace=FLIPKART&otracker=search_search_product_ad_1&otracker_page=search&otracker_query=Ayuniv&otracker_role=ad&otracker_position=1&otracker_mp=dynamic&otracker_uuid=59895879-0568-4745-802f-971931556586&otracker_page_type=search&otracker_page_level=1&otracker_page_number=1"
    },
    {
        src: "/wer/jio.png",
        alt: "Available on JioMart",
        className: "h-15 w-auto object-contain  opacity-90",
        href: "https://www.jiomart.com/groceries/b/ayuniv/225632"
    },
    {
        src: "/wer/meesho.png",
        alt: "Available on Meesho",
        className: "h-15 w-auto object-contain scale-135  opacity-90",
        href: "https://www.meesho.com/Ayuniv"
    },


]

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
                        <div className="flex gap-4 pt-2 flex-wrap">
                            <a
                                href="https://www.instagram.com/ayuniv_official/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Instagram"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.facebook.com/share/1CoD3rQMhV/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Facebook"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="https://x.com/Ayuniv_Official"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Twitter"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/ayuniv/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Connect with us on LinkedIn"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href="https://pin.it/7CdGAx3zH"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Pinterest"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                {/* Pinterest Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="currentColor">
                                    <path d="M16 2.9C8.8 2.9 3 8.6 3 15.8c0 5.3 3.3 9.8 8 11.7-.1-1-.2-2.6 0-3.7l1.6-6.7s-.4-.8-.4-2c0-1.9 1.1-3.3 2.4-3.3 1.1 0 1.7.8 1.7 1.9 0 1.1-.7 2.7-1 4.2-.3 1.3.6 2.3 1.9 2.3 2.3 0 3.8-3 3.8-6.6 0-2.7-1.8-4.7-5.1-4.7-3.7 0-6 2.8-6 5.9 0 1.1.3 1.9.8 2.5.2.2.2.3.2.5-.1.2-.2.8-.3 1-.1.3-.3.4-.6.3-1.7-.7-2.5-2.5-2.5-4.5 0-3.4 2.8-7.4 8.5-7.4 4.6 0 7.6 3.3 7.6 6.8 0 4.7-2.6 8.3-6.4 8.3-1.3 0-2.5-.7-2.9-1.5l-.8 3.2c-.3 1.1-.9 2.4-1.3 3.2.9.3 1.9.4 2.9.4 7.2 0 13-5.8 13-13S23.2 2.9 16 2.9z" />
                                </svg>

                            </a>
                            <a
                                href="https://wa.me/917852011211"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Chat with us on WhatsApp"
                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/70 hover:bg-[#5A7A6A] hover:text-white transition-all hover:-translate-y-1"
                            >
                                {/* WhatsApp Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="currentColor">
                                    <path d="M16 2.9C8.8 2.9 3 8.6 3 15.8c0 2.6.7 5 2.1 7.1L3 29l6.3-2c2 1.1 4.3 1.7 6.7 1.7 7.2 0 13-5.8 13-13S23.2 2.9 16 2.9zm0 23.4c-2.2 0-4.2-.6-6-1.7l-.4-.2-3.7 1.2 1.2-3.6-.2-.4c-1.2-1.9-1.8-4-1.8-6.3C5.1 9.7 10 4.9 16 4.9s10.9 4.8 10.9 10.9S22 26.3 16 26.3zm6-8.1c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.3-.6.1-1.3-.5-2.5-1.6c-.9-.8-1.5-1.8-1.7-2.1s0-.5.2-.6c.2-.2.3-.3.5-.5.2-.2.3-.3.4-.5.1-.2.1-.4 0-.6s-.7-1.8-1-2.4c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.1 3.1 1.3 3.3c.2.2 2.2 3.4 5.4 4.8.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.9-.8 2.2-1.6s.3-1.4.2-1.6c-.1-.2-.3-.3-.6-.4z" />
                                </svg>

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
                                {imgone.map(({ src, alt, className, href }) => (
                                    <Link target="_blank" key={alt} href={href}>
                                        <Image

                                            width={1000}
                                            height={1000}
                                            src={src}
                                            alt={alt}
                                            className={className}
                                        />
                                    </Link>
                                ))}


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
                    <p className="text-xs text-center text-white/30 font-light">
                        Ayuniv is a company of SlightJoy Healthcare © copyright 2026 Ayuniv
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
