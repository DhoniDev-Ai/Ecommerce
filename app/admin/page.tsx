import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { getProductStats } from "@/actions/store/stats";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    // Parallel Data Fetching
    const [ordersRes, activeOrdersRes, customersRes] = await Promise.all([
        // 1. All Orders (for charts & revenue) - Optimized: Fetch last 30 days only for charts if scale is huge, but fetching all for simple revenue total is fine for now
        supabaseAdmin.from('orders').select('id, total_amount, status, created_at, payment_status, user:user_id(full_name)').order('created_at', { ascending: false }),

        // 2. Active Orders Count(Not delivered/cancelled)
        supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }).in('status', ['pending', 'processing', 'shipped']),

        // 3. Total Customers Count (Count all profiles)
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
    ]);

    const allOrders = ordersRes.data || [];
    const recentOrders = allOrders.slice(0, 4);

    // --- STATISTICS CALCULATION ---
    const succeededOrders = allOrders.filter(o => o.payment_status === 'succeeded');

    // 1. Last 28 Days Revenue
    const totalRevenue = succeededOrders.reduce((acc, order) => acc + (order.total_amount || 0), 0);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 28);

    const last28DaysRevenue = succeededOrders
        .filter(o => new Date(o.created_at) >= cutoffDate)
        .reduce((acc, order) => acc + (order.total_amount || 0), 0);

    // 2. Today's Revenue
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = succeededOrders
        .filter(o => o.created_at.startsWith(today))
        .reduce((acc, order) => acc + (order.total_amount || 0), 0);

    // 3. Average Order Value (AOV)
    const aov = succeededOrders.length > 0 ? totalRevenue / succeededOrders.length : 0;

    // --- CHART DATA PREPARATION (Last 30 Days) ---
    const chartDataMap = new Map<string, { date: string, revenue: number, orders: number }>();

    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const displayDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        chartDataMap.set(dateStr, { date: displayDate, revenue: 0, orders: 0 });
    }

    // Populate with actual data
    succeededOrders.forEach(order => {
        const dateStr = order.created_at.split('T')[0];
        if (chartDataMap.has(dateStr)) {
            const entry = chartDataMap.get(dateStr)!;
            entry.revenue += order.total_amount;
            entry.orders += 1;
        }
    });

    const chartData = Array.from(chartDataMap.values());

    // 5. Fetch Product Stats for Top Chart
    const productStats = await getProductStats();
    const { data: rawProducts } = await supabaseAdmin.from('products').select('*');

    // Fix Type Mismatch & Map
    const allProducts = (rawProducts || []).map((p: any) => ({
        ...p,
        slug: p.slug || '',
        image_urls: p.image_urls || [],
        ingredients: p.ingredients || [],
        benefits: p.benefits || [],
        wellness_goals: p.wellness_goals || []
    }));

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold font-juana text-gray-900">Dashboard Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard title="Revenue (Last 28 Days)" value={`₹${last28DaysRevenue.toLocaleString()}`} change="Since last month" />
                <KPICard title="Today's Revenue" value={`₹${todayRevenue.toLocaleString()}`} change={today} />
                <KPICard title="Active Orders" value={(activeOrdersRes.count || 0).toString()} change="Pending fulfillment" />
                <KPICard title="Avg. Order Value" value={`₹${Math.round(aov).toLocaleString()}`} change="Per succeeded order" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* CHART SECTION */}
                <div className="lg:col-span-2 space-y-8">
                    <AdminCharts data={chartData} />



                    {/* RECENT ORDERS TABLE */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-xs font-bold text-green-700 uppercase tracking-widest hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{order.user?.full_name || 'Guest'}</p>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">#{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'succeeded' || order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentOrders.length === 0 && <p className="text-sm text-gray-400">No recent orders.</p>}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Side Stats */}
                <div className="space-y-6">
                    <div className="bg-linear-to-br from-green-900 to-green-800 p-6 rounded-xl text-white shadow-lg flex flex-col justify-between h-[200px]">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                            <p className="text-green-100 text-sm opacity-80">Manage your store efficiently.</p>
                        </div>
                        <div className="space-y-3">
                            <Link href="/admin/products" className="block w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-center text-sm font-bold transition-colors">
                                Manage Products
                            </Link>
                            <Link href="/admin/orders" className="block w-full py-3 bg-white text-green-900 rounded-lg text-center text-sm font-bold shadow-sm hover:shadow-md transition-all">
                                View All Orders
                            </Link>
                        </div>
                    </div>

                    {/* Customer Summary Card could go here */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Customer Insights</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Total Authenticated</span>
                                <span className="font-bold text-gray-900">{customersRes.count || 0}</span>
                            </div>
                            {/* Add more metrics here later if needed */}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <Link href="/admin/customers" className="text-xs font-bold text-green-700 uppercase tracking-widest hover:underline width-full block text-center">
                                View Customer Base
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, change }: { title: string, value: string, change: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 font-heading">{value}</p>
            <p className="text-[10px] text-green-600 mt-2 font-medium flex items-center gap-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                {change}
            </p>
        </div>
    );
}
