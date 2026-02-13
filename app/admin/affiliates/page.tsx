import { supabaseAdmin } from "@/lib/supabase/admin";
import { AffiliatesClient } from "@/components/admin/affiliates/AffiliatesClient";

export default async function AffiliatesPage() {
    // Fetch affiliates with relations
    const { data: affiliates, error } = await supabaseAdmin
        .from('affiliates')
        .select(`
            id,
            total_earnings,
            commission_rate,
            payout_info,
            user:users (
                email,
                full_name
            ),
            coupon:coupons (
                code,
                used_count,
                 times_used
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Affiliates Fetch Error:", error);
        return <div className="p-10 text-red-500">Failed to load affiliates</div>;
    }

    // Transform data to match Client Component expectation
    // usage count might be in times_used or used_count depending on legacy
    const formattedAffiliates = (affiliates || []).map((aff: any) => ({
        id: aff.id,
        total_earnings: aff.total_earnings || 0,
        commission_rate: aff.commission_rate || 5.0, // Default to 5 if null
        sales_count: aff.coupon?.used_count || aff.coupon?.times_used || 0,
        payout_info: aff.payout_info || null,
        user: {
            email: aff.user?.email || "No Email",
            full_name: aff.user?.full_name || "Unknown"
        },
        coupon: {
            code: aff.coupon?.code || "N/A"
        }
    }));

    return <AffiliatesClient initialAffiliates={formattedAffiliates} />;
}
