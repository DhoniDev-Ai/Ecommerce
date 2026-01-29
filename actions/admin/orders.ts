"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

import { Database } from "@/types/database";

type OrderStatus = Database['public']['Tables']['orders']['Row']['status'];

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    try {
        const { error } = await supabaseAdmin
            .from('orders')
            .update({ status: newStatus })
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
