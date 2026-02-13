"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateAffiliateCommission(id: string, rate: number) {
    try {
        if (rate < 0 || rate > 100) {
            return { success: false, error: "Rate must be between 0 and 100" };
        }

        const { error } = await supabaseAdmin
            .from('affiliates')
            .update({ commission_rate: rate })
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/affiliates');
        return { success: true };
    } catch (e: any) {
        console.error("Update Affiliate Commission Error:", e);
        return { success: false, error: e.message || "Failed to update commission rate" };
    }
}
