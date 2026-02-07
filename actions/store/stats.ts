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

export async function getDashboardStats() {
    try {
        // Fetch ALL orders (for now, scalable until ~10k orders) to calculate stats accurately in JS
        const { data: orders, error } = await supabaseAdmin
            .from('orders')
            .select('id, total_amount, status, payment_status, payment_method, created_at');

        if (error) {
            console.error("Dashboard Stats Error:", error);
            return null;
        }

        const now = new Date();
        const twentyEightDaysAgo = new Date();
        twentyEightDaysAgo.setDate(now.getDate() - 28);

        const todayStr = now.toISOString().split('T')[0];

        let totalRevenue = 0;
        let last28Revenue = 0;
        let todayRevenue = 0;
        let activeOrders = 0;
        let succeededCount = 0;

        orders.forEach((order: any) => {
            // REVENUE LOGIC:
            // Include if Payment Succeeded OR (COD and NOT Cancelled)
            // Also checking status='succeeded'/'delivered' as a fallback for consistency with user observation
            const isPaidOrCod =
                order.payment_status === 'succeeded' ||
                (order.payment_method === 'COD' && order.status !== 'cancelled' && order.status !== 'failed') ||
                order.status === 'succeeded' ||
                order.status === 'delivered';

            const isCancelled = order.status === 'cancelled' || order.status === 'failed';

            if (isPaidOrCod && !isCancelled) {
                const amount = Number(order.total_amount) || 0;
                totalRevenue += amount;
                succeededCount++;

                const orderDate = new Date(order.created_at);
                if (orderDate >= twentyEightDaysAgo) {
                    last28Revenue += amount;
                }

                if (order.created_at.startsWith(todayStr)) {
                    todayRevenue += amount;
                }
            }

            // ACTIVE ORDERS LOGIC:
            // Status is pending, processing, shipped (and NOT delivered)
            if (['pending', 'processing', 'shipped'].includes(order.status)) {
                activeOrders++;
            }
        });

        const aov = succeededCount > 0 ? totalRevenue / succeededCount : 0;

        return {
            total_revenue: totalRevenue,
            last_28_days_revenue: last28Revenue,
            today_revenue: todayRevenue,
            active_orders: activeOrders,
            aov: aov
        };

    } catch (e) {
        console.error("Dashboard Stats Exception:", e);
        return null;
    }
}
