"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getRecentOrders(userId: string) {
    if (!userId) return [];

    try {
        const { data: orders, error } = await supabaseAdmin
            .from('orders')
            .select(`
                id,
                created_at,
                status,
                total_amount,
                items:order_items (
                    quantity,
                    price_at_purchase,
                    product:products (
                        name
                    )
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(3) as any;

        if (error) {
            console.error("Error fetching orders for context:", error);
            return [];
        }

        // Simplify for AI consumption
        return (orders as any[]).map((order) => ({
            id: order.id.slice(0, 8), // Short ID for easier reading
            date: new Date(order.created_at).toLocaleDateString(),
            status: order.status,
            total: order.total_amount,
            items: order.items.map((item: any) => `${item.quantity}x ${item.product.name}`).join(", ")
        }));
    } catch (err) {
        console.error("Unexpected error in getRecentOrders:", err);
        return [];
    }
}
