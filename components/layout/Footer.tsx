import Link from "next/link";
import { Facebook, Instagram, Twitter, Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navigation = {
    shop: [
        { name: "All Products", href: "/products" },
        { name: "Cleanses", href: "/products/cleanses" },
        { name: "Juices", href: "/products/juices" },
        { name: "Subscriptions", href: "/subscriptions" },
    ],
    company: [
        { name: "About Us", href: "/about" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Press", href: "/press" },
        { name: "Careers", href: "/careers" },
    ],
    support: [
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Shipping & Returns", href: "/shipping" },
    ],
    social: [
        { name: "Facebook", href: "#", icon: Facebook },
        { name: "Instagram", href: "#", icon: Instagram },
        { name: "Twitter", href: "#", icon: Twitter },
    ],
};

export function Footer() {
    return (
        <footer className="bg-[#EADDCD] pt-16 pb-8" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2">
                            <Leaf className="h-8 w-8 text-primary" />
                            <span className="font-heading font-bold text-2xl text-foreground">Ayuniv</span>
                        </Link>
                        <p className="text-sm leading-6 text-foreground/80 max-w-xs">
                            Nourishing your body with nature's purest ingredients. Handcrafted juices for a vibrant life.
                        </p>
                        <div className="flex space-x-6">
                            {navigation.social.map((item) => (
                                <a key={item.name} href={item.href} className="text-foreground/60 hover:text-primary">
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Shop</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.shop.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm leading-6 text-foreground/70 hover:text-primary">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.company.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm leading-6 text-foreground/70 hover:text-primary">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.support.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm leading-6 text-foreground/70 hover:text-primary">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Newsletter</h3>
                                <p className="mt-2 text-sm leading-6 text-foreground/70">
                                    Subscribe for wellness tips and exclusive offers.
                                </p>
                                <form className="mt-6 sm:flex sm:max-w-md">
                                    <label htmlFor="email-address" className="sr-only">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        name="email-address"
                                        id="email-address"
                                        autoComplete="email"
                                        required
                                        className="w-full min-w-0 appearance-none rounded-full border-2 border-primary/20 bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:text-sm sm:leading-6"
                                        placeholder="Enter your email"
                                    />
                                    <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                                        <Button type="submit">Subscribe</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-gray-500">
                        &copy; {new Date().getFullYear()} Ayuniv Wellness. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
