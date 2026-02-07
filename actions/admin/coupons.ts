"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type CouponInsert = {
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_purchase_amount: number | null;
    usage_limit: number | null;
    expiry_date?: string | null;
};

export async function createCoupon(data: CouponInsert) {
    try {
        const { error } = await supabaseAdmin
            .from('coupons')
            .insert({
                ...data,
                code: data.code.toUpperCase(), // Ensure uppercase
                is_active: true
            } as any);

        if (error) throw error;

        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (e: any) {
        console.error("Create Coupon Error:", e);
        return { success: false, error: e.message || "Failed to create coupon" };
    }
}

export async function deleteCoupon(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from('coupons')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (e: any) {
        console.error("Delete Coupon Error:", e);
        return { success: false, error: e.message || "Failed to delete coupon" };
    }
}
