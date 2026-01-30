import { supabaseAdmin } from "@/lib/supabase/admin";
import { Users, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default async function CustomersPage() {
    // 1. Fetch Users
    const { data: users, error } = await supabaseAdmin
        .from('users')
        .select(`
            *,
            orders (
                id,
                total_amount,
                status
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Customers Error:", error);
        return <div className="p-10 text-red-500">Failed to load customers</div>;
    }

    // 2. Calculate Stats
    const customers = (users as any[])?.map(user => {
        const orderCount = user.orders?.length || 0;
        // Provide 0 as initial value to reduce
        const totalSpend = user.orders?.reduce((acc: number, order: any) => acc + (order.total_amount || 0), 0) || 0;
        // Assuming last order is the first one since we might not have sorted orders inside the join, 
        // actually standard Supabase join doesn't sort. Let's not show "Last Order" for now to keep it simple or sort manually.
        return {
            ...user,
            orderCount,
            totalSpend
        };
    }) || [];

    return (
        <section className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="font-heading text-4xl text-[#2D3A3A]">Our <span className="italic font-serif text-[#5A7A6A]">Community.</span></h1>
                    <p className="text-xs text-[#7A8A8A] mt-2 font-light tracking-wide">
                        {customers.length} registered members
                    </p>
                </div>
            </header>

            <div className="bg-white rounded-[2rem] border border-[#E8E6E2]/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#Fdfbf7] border-b border-[#E8E6E2]">
                            <tr>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold">User</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold">Contact</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold">Joined</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold text-center">Orders</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold text-right">Lifetime Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E6E2]/60">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-[#Fdfbf7]/50 transition-colors">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#2D3A3A] text-white flex items-center justify-center font-heading text-sm">
                                                {customer.full_name?.[0] || customer.email?.[0]?.toUpperCase() || customer.phone?.slice(-1) || "?"}
                                            </div>
                                            <div>
                                                <p className="font-heading text-lg text-[#2D3A3A]">{customer.full_name || 'Guest'}</p>
                                                <span className="text-[9px] uppercase tracking-wider text-[#5A7A6A] bg-[#5A7A6A]/10 px-2 py-0.5 rounded-full">
                                                    {customer.role}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-[#5A6A6A]">
                                            <Mail className="w-3 h-3 opacity-50" /> {customer.email}
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-2 text-xs text-[#5A6A6A]">
                                                <Phone className="w-3 h-3 opacity-50" /> {customer.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2 text-xs text-[#7A8A8A]">
                                            <Calendar className="w-3 h-3 opacity-50" />
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F1ED] text-xs font-bold text-[#5A6A6A]">
                                            <ShoppingBag className="w-3 h-3" /> {customer.orderCount}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <p className="font-heading text-lg text-[#2D3A3A]">
                                            ₹{customer.totalSpend.toLocaleString()}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
