import { supabaseAdmin } from "@/lib/supabase/admin";
import { CouponsClient } from "@/components/admin/CouponsClient";

export default async function CouponsPage() {
    // Fetch coupons on the server securely
    const { data: coupons, error } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Coupons Error:", error);
        return <div className="p-10 text-red-500">Failed to load coupons</div>;
    }

    return <CouponsClient coupons={coupons as any} />;
}
