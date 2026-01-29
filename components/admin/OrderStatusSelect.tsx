"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/admin/orders";

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!confirm(`Change order status to ${newStatus}?`)) return;

        setLoading(true);
        setStatus(newStatus); // Optimistic

        const result = await updateOrderStatus(orderId, newStatus as any);

        if (!result.success) {
            alert("Failed to update status");
            setStatus(currentStatus); // Revert
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-2">
            <select
                value={status}
                onChange={handleChange}
                disabled={loading}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6 disabled:opacity-50"
            >
                {statuses.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                ))}
            </select>
            {loading && <span className="text-xs text-gray-500 animate-pulse">Saving...</span>}
        </div>
    );
}
