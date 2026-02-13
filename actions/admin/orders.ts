"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

import { Database } from "@/types/database";

type OrderStatus = Database['public']['Tables']['orders']['Row']['status'];

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
        // 1. Fetch order details to check payment method
        const { data: order } = await supabaseAdmin
            .from('orders')
            .select('payment_method')
            .eq('id', orderId)
            .single();

        let updateData: any = { status: newStatus };

        // 2. COD Logic: If Delivered, mark Payment as Succeeded
        if (newStatus === 'delivered' && order?.payment_method === 'COD') {
            updateData.payment_status = 'succeeded';
        }

        const { error } = await supabaseAdmin
            .from('orders')
            .update(updateData)
            .eq('id', orderId);

        if (error) throw error;

        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath(`/admin/orders`);
        revalidatePath(`/admin`); // Update dashboard stats

        return { success: true };
    } catch (e) {
        console.error("Failed to update status:", e);
        return { success: false, error: "Failed to update status" };
    }
}
