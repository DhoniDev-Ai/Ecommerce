import { createClient } from "@/lib/supabase/server";
import { getAffiliateStats } from "@/actions/affiliate";
import { AffiliateView } from "@/components/affiliate/AffiliateView";

export default async function AffiliatePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let stats = null;
    if (user) {
        const res = await getAffiliateStats();
        if (res.success && res.data) {
            stats = res.data;
        }
    }

    // Pass serialized data to client component
    return (
        <AffiliateView
            initialUser={user}
            initialStats={stats}
        />
    );
}
