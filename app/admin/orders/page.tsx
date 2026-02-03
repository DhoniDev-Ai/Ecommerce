
import { supabaseAdmin } from '@/lib/supabase/admin';
import { OrdersClient } from '@/components/admin/OrdersClient';
import { PaymentSplitChart } from '@/components/admin/PaymentSplitChart';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    // Fetch Orders using Admin Client
    const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select(`
            id, 
            created_at, 
            status, 
            payment_status, 
            payment_method,
            total_amount,
            user:user_id (
                full_name,
                email
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return <div className="p-8 text-red-500">Failed to load orders.</div>;
    }

    // --- STATS PREPARATION ---
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'succeeded').length;
    const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;

    // --- CHART PREPARATION (COD vs Prepaid) ---
    const shippedOrders = orders.filter((o: any) => o.status === 'shipped').length;
    const codCount = orders.filter((o: any) => o.payment_method === 'COD').length;
    const onlineCount = orders.filter((o: any) => o.payment_method !== 'COD').length;

    const chartData = [
        { name: 'Online (Prepaid)', value: onlineCount, color: '#2D3A3A' },
        { name: 'Cash on Delivery', value: codCount, color: '#5A7A6A' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-juana text-gray-900">Orders</h1>
            </div>

            {/* TOP METRICS & CHART */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="md:col-span-1">
                    <PaymentSplitChart data={chartData} />
                </div>

                {/* Quick Stats Grid */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <StatCard label="Total Orders" value={totalOrders} icon="📦" />
                    <StatCard label="Pending" value={pendingOrders} icon="⏳" highlight />
                    <StatCard label="Completed" value={completedOrders} icon="✅" />
                    <StatCard label="Shipped" value={shippedOrders} icon="🚚" />
                </div>
            </div>
            {/* MAIN ORDERS TABLE (Client Component) */}
            <OrdersClient initialOrders={orders as any} />
        </div>
    );
}

function StatCard({ label, value, icon, highlight = false }: { label: string, value: string | number, icon: string, highlight?: boolean }) {
    return (
        <div className={`p-6 rounded-xl border flex items-center justify-between transition-all ${highlight ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-gray-200'}`}>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</p>
                <p className={`text-2xl font-bold font-heading ${highlight ? 'text-green-800' : 'text-gray-900'}`}>{value}</p>
            </div>
            <div className="text-2xl opacity-80 grayscale">{icon}</div>
        </div>
    );
}


