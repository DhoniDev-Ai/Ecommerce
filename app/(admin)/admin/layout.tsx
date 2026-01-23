"use client";
import Link from "next/link";
import { LayoutDashboard, Leaf, ShoppingBag, Ticket, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Sanctuary Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Manage Elixirs", href: "/admin/products", icon: Leaf },
        { name: "Order Rituals", href: "/admin/orders", icon: ShoppingBag },
        { name: "Sacred Vouchers", href: "/admin/coupons", icon: Ticket },
        { name: "Members", href: "/admin/users", icon: Users },
    ];

    const { data: { user } } = await supabase.auth.getUser();

    // Check the role we set up in the SQL earlier
    // const { data: profile } = await supabase
    //     .from('users')
    //     .select('role')
    //     .eq('id', user?.id)
    //     .single();

    // if (profile?.role !== 'admin') {
    //     redirect('/'); // Send non-admins back to the sanctuary entrance
    // }

    return (
        <div className="flex min-h-screen bg-[#FDFBF7]">
            {/* Sidebar Archive */}
            <aside className="w-72 bg-white border-r border-[#E8E6E2] flex flex-col p-8 sticky top-0 h-screen">
                <div className="mb-12">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#5A7A6A] font-bold">Ayuniv</p>
                    <h2 className="text-xl font-heading text-[#2D3A3A]">Sanctuary Admin</h2>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all",
                                pathname === item.href
                                    ? "bg-[#2D3A3A] text-white shadow-xl"
                                    : "text-[#7A8A8A] hover:bg-[#F3F1ED] hover:text-[#2D3A3A]"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <button className="flex items-center gap-4 px-6 py-4 text-[#7A8A8A] hover:text-red-500 transition-colors text-xs uppercase tracking-widest font-bold">
                    <LogOut className="w-4 h-4" />
                    Dissolve Session
                </button>
            </aside>

            {/* Main Command Center */}
            <main className="flex-1 p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}