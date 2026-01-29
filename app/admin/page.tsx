import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    // Parallel Data Fetching using Admin Client (Bypasses RLS)
    const [revenueRes, activeOrdersRes, customersRes, recentRes] = await Promise.all([
        // 1. Total Revenue (Succeeded Payments)
        supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'succeeded'),

        // 2. Active Orders (Not delivered/cancelled)
        supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }).in('status', ['pending', 'processing', 'shipped']),

        // 3. Total Customers
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('role', 'user'),

        // 4. Recent activity
        supabaseAdmin.from('orders')
            .select('id, total_amount, status, created_at, user:user_id(full_name)')
            .order('created_at', { ascending: false })
            .limit(5)
    ]);

    const totalRevenue = revenueRes.data?.reduce((acc, order) => acc + order.total_amount, 0) || 0;
    const activeOrdersCount = activeOrdersRes.count || 0;
    const totalCustomers = customersRes.count || 0;
    const recentOrders = recentRes.data || [];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold font-juana text-gray-900">Dashboard Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} change="Lifetime" />
                <KPICard title="Active Orders" value={activeOrdersCount.toString()} change="Pending fulfillment" />
                <KPICard title="Total Customers" value={totalCustomers.toString()} change="Registered users" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* RECENT ORDERS */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
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

                {/* Quick Actions (Placeholder for now) */}
                <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                        <p className="text-green-100 text-sm opacity-80">Manage your store efficiently.</p>
                    </div>
                    <div className="space-y-3 mt-8">
                        <Link href="/admin/products" className="block w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-center text-sm font-bold transition-colors">
                            Manage Products
                        </Link>
                        <Link href="/admin/orders" className="block w-full py-3 bg-white text-green-900 rounded-lg text-center text-sm font-bold shadow-sm hover:shadow-md transition-all">
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, change }: { title: string, value: string, change: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-green-600 mt-3 font-medium flex items-center gap-1">
                {change}
            </p>
        </div>
    );
}
