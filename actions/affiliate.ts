"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type AffiliateStats = {
    total_earnings: number;
    pending_payout: number;
    coupon_code: string;
    commission_rate: number; // e.g. 5.0
    sales_count: number;
    payout_info?: {
        bank_name?: string;
        account_number?: string;
        ifsc?: string;
        upi_id?: string;
    };
};

/**
 * Join the affiliate program.
 * - Generates a unique coupon code (First Name + Random Number).
 * - Creates an Affiliate record.
 */
export async function joinAffiliateProgram(preferredCode?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to join." };
    }

    try {
        // 1. Check if already an affiliate
        const { data: existing } = await supabaseAdmin
            .from('affiliates')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return { success: false, error: "You are already an affiliate." };
        }

        // 2. Generate Coupon Code
        let code = '';
        if (preferredCode && preferredCode.trim().length >= 3) {
            // Clean code: alphanumeric, uppercase
            code = preferredCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (code.length < 3) return { success: false, error: "Code must be at least 3 characters." };

            // Check availability
            const { data: codeExists } = await supabaseAdmin
                .from('coupons')
                .select('id')
                .eq('code', code)
                .single();

            if (codeExists) {
                return { success: false, error: "This code is already taken. Please try another." };
            }
        } else {
            // Fallback: Generate First Name + Random
            const name = user.user_metadata?.full_name?.split(' ')[0] || 'PARTNER';
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            code = `${name.toUpperCase()}${randomSuffix}`.replace(/[^A-Z0-9]/g, '');
        }

        // 3. Create Coupon (5% Discount)
        const { data: coupon, error: couponError } = await (supabaseAdmin
            .from('coupons') as any) // Forced cast to avoid stale types
            .insert({
                code: code,
                discount_type: 'percentage', // Correct column
                discount_value: 5,           // Correct column
                is_active: true,
                usage_limit: null,           // Correct column
                used_count: 0,               // Correct column
                max_uses: null,              // Duplicate column for compatibility
                times_used: 0                // Duplicate column for compatibility
            })
            .select('id')
            .single();

        if (couponError) {
            // Handle duplicate key error gracefully if random gen failed (highly unlikely)
            if (couponError.code === '23505') return { success: false, error: "Code generation collision. Please try again." };
            throw couponError;
        }

        // 4. Create Affiliate Record
        const { error: affiliateError } = await supabaseAdmin
            .from('affiliates')
            .insert({
                user_id: user.id,
                coupon_id: coupon.id,
                status: 'active',
                payout_info: {},
                total_earnings: 0,
                commission_rate: 5.00 // Default, but explicit
            });

        if (affiliateError) throw affiliateError;

        revalidatePath('/affiliate');
        return { success: true };

    } catch (error: any) {
        console.error("Join Affiliate Error:", error);
        return { success: false, error: error.message || "Failed to join program." };
    }
}

/**
 * Get Affiliate Dashboard Data
 */
export async function getAffiliateStats(): Promise<{ success: boolean; data?: AffiliateStats; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // 1. Get Affiliate Record with Coupon AND Commissions in ONE query
        const { data: affiliate, error } = await supabaseAdmin
            .from('affiliates')
            .select(`
                *,
                coupons (
                    code,
                    used_count
                ),
                affiliate_commissions (
                    amount,
                    status
                )
            `)
            .eq('user_id', user.id)
            .single();

        if (error || !affiliate) {
            // Not an affiliate yet
            return { success: false, error: "Not an affiliate" }; // Frontend handles this to show Join UI
        }

        // 2. Calculate Stats in-memory
        const commissions = (affiliate as any).affiliate_commissions || [];

        const validCommissions = commissions.filter((c: any) => c.status !== 'cancelled');

        const pendingPayout = commissions
            .filter((c: any) => c.status === 'pending')
            .reduce((acc: number, c: any) => acc + c.amount, 0);

        return {
            success: true,
            data: {
                total_earnings: affiliate.total_earnings || 0,
                pending_payout: pendingPayout,
                coupon_code: (affiliate as any).coupons?.code || 'ERROR',
                commission_rate: (affiliate as any).commission_rate || 5.0,
                sales_count: validCommissions.length, // Use actual commissions count
                payout_info: (affiliate.payout_info as any) || {} // Return payout info
            }
        };

    } catch (error: any) {
        console.error("Get Affiliate Stats Error:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePayoutSettings(data: { bank_name: string; account_number: string; ifsc: string; upi_id?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const { error } = await supabaseAdmin
            .from('affiliates')
            .update({ payout_info: data as any })
            .eq('user_id', user.id);

        if (error) throw error;

        revalidatePath('/affiliate');
        return { success: true };
    } catch (error: any) {
        console.error("Update Payout Settings Error:", error);
        return { success: false, error: error.message };
    }
}
