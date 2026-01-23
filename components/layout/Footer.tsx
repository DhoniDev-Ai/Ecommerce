import Link from "next/link";

const footerLinks = {
    shop: [
        { name: "All Products", href: "/products" },
        { name: "By Wellness Goal", href: "/products#goals" },
        { name: "Subscriptions", href: "/subscriptions" },
        { name: "Gift Cards", href: "/gift-cards" },
    ],
    about: [
        { name: "Our Story", href: "/about" },
        { name: "Ingredients", href: "/ingredients" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Journal", href: "/journal" },
    ],
    support: [
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-[#2D3A3A] text-white">
            <div className="mx-auto max-w-7xl px-8 lg:px-12 py-20">
                {/* Top Section */}
                <div className="grid lg:grid-cols-12 gap-16 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block mb-6">
                            <img
                                src="/assets/logo_1by1.jpg"
                                alt="Ayuniv"
                                className="h-12 w-auto brightness-0 invert opacity-90"
                            />
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs font-light">
                            Crafting wellness through nature's finest ingredients. Pure,
                            honest, and thoughtfully made.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-8 grid sm:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                                Shop
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/70 hover:text-white transition-colors font-light"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                                About
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.about.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/70 hover:text-white transition-colors font-light"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                                Support
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/70 hover:text-white transition-colors font-light"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-white/10 pt-12 mb-12">
                    <div className="grid  lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h4 className="font-heading text-xl text-white mb-2">
                                Join our wellness journey
                            </h4>
                            <p className="text-sm text-white/60 font-light">
                                Thoughtful updates on new products, recipes, and wellness tips.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                            />
                            <button className="px-8 py-3 bg-white text-[#2D3A3A] text-sm font-medium rounded-full hover:bg-white/90 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} Ayuniv Wellness. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="text-xs text-white/40 hover:text-white/60 transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-xs text-white/40 hover:text-white/60 transition-colors"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
