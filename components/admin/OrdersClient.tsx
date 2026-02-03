"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Download, Filter, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Order {
    id: string;
    created_at: string;
    status: string;
    payment_status: string;
    payment_method: string;
    total_amount: number;
    user: {
        full_name: string;
        email: string;
    } | null;
}

interface OrdersClientProps {
    initialOrders: Order[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed, cancelled
    const [filterPayment, setFilterPayment] = useState('all'); // all, cod, online
    const [searchQuery, setSearchQuery] = useState('');

    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
        return initialOrders.filter(order => {
            // 1. Status Filter
            if (filterStatus !== 'all') {
                if (filterStatus === 'active' && !['pending', 'processing', 'shipped'].includes(order.status)) return false;
                if (filterStatus === 'not_shipped' && !['pending', 'processing'].includes(order.status)) return false;
                if (filterStatus === 'completed' && !['delivered', 'succeeded'].includes(order.status)) return false;
                if (filterStatus === 'cancelled' && order.status !== 'cancelled') return false;
            }

            // 2. Payment Filter
            if (filterPayment !== 'all') {
                if (filterPayment === 'cod' && order.payment_method !== 'COD') return false;
                if (filterPayment === 'online' && order.payment_method === 'COD') return false;
            }

            // 3. Search
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const userName = order.user?.full_name?.toLowerCase() || '';
                const email = order.user?.email?.toLowerCase() || '';
                const id = order.id.toLowerCase();
                if (!userName.includes(q) && !email.includes(q) && !id.includes(q)) return false;
            }

            return true;
        });
    }, [initialOrders, filterStatus, filterPayment, searchQuery]);

    // --- ACTIONS ---
    const handleExport = () => {
        // Simple CSV Export
        const headers = ["Order ID", "Date", "Customer", "Email", "Amount", "Status", "Payment", "Method"];
        const rows = filteredOrders.map(o => [
            o.id,
            new Date(o.created_at).toLocaleDateString(),
            o.user?.full_name || "Guest",
            o.user?.email || "",
            o.total_amount,
            o.status,
            o.payment_status,
            o.payment_method
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {/* Status Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['all', 'active', 'not_shipped', 'completed', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilterStatus(tab)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-bold capitalize rounded-md transition-all",
                                    filterStatus === tab ? "bg-white text-green-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Payment Toggle */}
                    <select
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none cursor-pointer hover:bg-gray-50"
                    >
                        <option value="all">All Payments</option>
                        <option value="cod">COD Only</option>
                        <option value="online">Online Only</option>
                    </select>

                    {/* Export */}
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-1.5 bg-green-800 text-white rounded-lg text-xs font-bold hover:bg-green-900 transition-colors ml-auto md:ml-2"
                    >
                        <Download className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#Fdfbf7] border-b border-gray-100 text-gray-400 font-medium text-[10px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#Fdfbf7]/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</div>
                                            <div className="text-[10px] text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 text-sm">{order.user?.full_name || 'Guest'}</div>
                                            <div className="text-xs text-gray-400">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    order.payment_status === 'succeeded' || order.payment_status === 'paid' ? "bg-green-500" :
                                                        order.payment_status === 'failed' ? "bg-red-500" : "bg-yellow-500"
                                                )} />
                                                <span className="font-medium text-gray-700 capitalize">{order.payment_method || 'Online'}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-0.5 capitalize">{order.payment_status}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900 font-heading">
                                            ₹{order.total_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold hover:bg-green-100 hover:text-green-800 transition-colors"
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

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        processing: "bg-blue-50 text-blue-700 border-blue-200",
        shipped: "bg-purple-50 text-purple-700 border-purple-200",
        delivered: "bg-green-50 text-green-700 border-green-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            styles[status] || "bg-gray-50 text-gray-600 border-gray-200"
        )}>
            {status}
        </span>
    );
}
