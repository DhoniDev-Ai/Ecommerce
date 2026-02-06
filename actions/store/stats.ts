"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export interface ProductStats {
    [productId: string]: number;
}

import { unstable_cache } from 'next/cache';

// Wrap the entire logic in unstable_cache
export const getProductStats = unstable_cache(
    async (): Promise<ProductStats> => {
        const stats: ProductStats = {};

        try {
            // 1. Try Optimized RPC call
            // @ts-ignore - RPC type not yet generated
            const { data: rpcData, error: rpcError } = await (supabaseAdmin as any)
                .rpc('get_product_sales_stats', { days_lookback: 28 });

            if (!rpcError && rpcData) {
                // console.log("✅ Using Optimized RPC Stats");
                rpcData.forEach((item: any) => {
                    if (item.product_id) {
                        stats[item.product_id] = Number(item.total_sold);
                    }
                });
                return stats;
            }

            // If RPC fails (e.g. doesn't exist yet), fall back to manual aggregation
            if (rpcError?.code === '42883') { // undefined_function code
                console.warn("⚠️ Stats RPC not found, falling back to slow aggregation.");
            } else if (rpcError) {
                console.warn("⚠️ Stats RPC failed:", rpcError.message);
            }

            // 2. Slow Fallback: Manual Fetches
            const twentyEightDaysAgo = new Date();
            twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

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
                console.error("Stats Fallback Error:", error);
                return {};
            }

            // Aggregate
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
    },
    ['product-stats'], // Cache Key
    { revalidate: 3600, tags: ['stats'] } // Cache for 1 hour
);
