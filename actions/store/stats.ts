"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export interface ProductStats {
    [productId: string]: number;
}

export async function getProductStats(): Promise<ProductStats> {
    try {
        const twentyEightDaysAgo = new Date();
        twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

        // Fetch aggregation of sales
        // Note: Supabase doesn't support complex JOIN + GROUP BY + SUM easily in JS client without Views or RPC.
        // We will fetch all relevant order items and aggregate in memory (assuming manageable scale for now).
        // For larger scale, we should create a Database View or RPC.

        const { data: orderItems, error } = await supabaseAdmin
            .from('order_items')
            .select(`
                product_id,
                quantity,
                orders!inner (
                    created_at,
                    payment_status,
                    status
                )
            `)
            .gte('orders.created_at', twentyEightDaysAgo.toISOString())
            .in('orders.payment_status', ['succeeded']) // Only count real sales
            .neq('orders.status', 'cancelled');

        if (error) {
            console.error("Stats Error:", error);
            return {};
        }

        // Aggregate
        const stats: ProductStats = {};
        orderItems?.forEach((item: any) => {
            if (item.product_id) {
                stats[item.product_id] = (stats[item.product_id] || 0) + (item.quantity || 0);
            }
        });

        return stats;
    } catch (error) {
        console.error("Failed to fetch product stats:", error);
        return {};
    }
}
