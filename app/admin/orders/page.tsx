
import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Badge } from 'lucide-react'; // Placeholder - we will build custom badges

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
            total_amount, 
            payment_method,
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-juana text-gray-900">Orders</h1>
                <div className="text-sm text-gray-500">
                    Total: {orders?.length || 0}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders?.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            #{order.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.user?.full_name || 'Guest'}</div>
                                            <div className="text-xs text-gray-400">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} type="order" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.payment_status} type="payment" />
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mt-1">{order.payment_method}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{order.total_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-green-700 font-medium hover:underline text-xs uppercase tracking-widest"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Simple Badge Component
function StatusBadge({ status, type }: { status: string, type: 'order' | 'payment' }) {
    const styles: Record<string, string> = {
        // Order Statuses
        pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
        processing: "bg-blue-50 text-blue-700 border-blue-100", // "Confirmed"
        shipped: "bg-purple-50 text-purple-700 border-purple-100",
        delivered: "bg-green-50 text-green-700 border-green-100",
        cancelled: "bg-red-50 text-red-700 border-red-100",

        // Payment Statuses
        succeeded: "bg-green-50 text-green-700 border-green-100",
        paid: "bg-green-50 text-green-700 border-green-100",
        failed: "bg-red-50 text-red-700 border-red-100",
    };

    const defaultStyle = "bg-gray-50 text-gray-600 border-gray-100";
    const className = styles[status] || defaultStyle;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className} capitalize`}>
            {status}
        </span>
    );
}
