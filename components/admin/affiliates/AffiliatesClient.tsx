"use client";

import { useState } from "react";
import { Search, Loader2, Edit2, Check, X, TrendingUp } from "lucide-react";
import { updateAffiliateCommission } from "@/actions/admin/affiliates";
import { Toast } from "@/components/ui/Toast";

type Affiliate = {
    id: string;
    total_earnings: number;
    commission_rate: number;
    sales_count: number; // Derived from coupons used_count
    payout_info: any;
    user: {
        email: string | null;
        full_name: string | null;
    };
    coupon: {
        code: string;
    };
};

export function AffiliatesClient({ initialAffiliates }: { initialAffiliates: Affiliate[] }) {
    const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showBankInfo, setShowBankInfo] = useState<Affiliate | null>(null);
    const [editRate, setEditRate] = useState<string>("");
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: "", type: null });
    const [loading, setLoading] = useState(false);

    const filteredAffiliates = affiliates.filter(aff =>
        aff.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aff.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aff.coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startEdit = (aff: Affiliate) => {
        setEditingId(aff.id);
        setEditRate(aff.commission_rate.toString());
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRate("");
    };

    const saveRate = async (id: string) => {
        const rate = parseFloat(editRate);
        if (isNaN(rate) || rate < 0 || rate > 100) {
            setToast({ message: "Invalid rate (0-100)", type: "error" });
            return;
        }

        setLoading(true);
        const res = await updateAffiliateCommission(id, rate);
        if (res.success) {
            setToast({ message: "Commission rate updated", type: "success" });
            setAffiliates(prev => prev.map(a => a.id === id ? { ...a, commission_rate: rate } : a));
            setEditingId(null);
        } else {
            setToast({ message: res.error as string, type: "error" });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, type: null })} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading text-[#2D3A3A]">Affiliates</h1>
                    <p className="text-[#7A8A8A] mt-1">Manage partners and commission rates.</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8A8A]" />
                <input
                    type="text"
                    placeholder="Search by name, email, or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E6E2] rounded-xl focus:outline-none focus:border-[#5A7A6A] transition-colors"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-4xl border border-[#E8E6E2] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FAF9F7] text-[#7A8A8A] text-xs font-bold uppercase tracking-widest border-b border-[#E8E6E2]">
                            <tr>
                                <th className="px-6 py-4">Partner</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Sales</th>
                                <th className="px-6 py-4">Earnings</th>
                                <th className="px-6 py-4">Commission Rate</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E6E2]">
                            {filteredAffiliates.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#7A8A8A]">
                                        No affiliates found.
                                    </td>
                                </tr>
                            ) : (
                                filteredAffiliates.map((aff) => (
                                    <tr key={aff.id} className="group hover:bg-[#FAF9F7]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-[#2D3A3A] text-sm">{aff.user.full_name || "Unknown"}</p>
                                                <p className="text-xs text-[#7A8A8A]">{aff.user.email}</p>
                                                {aff.payout_info && Object.keys(aff.payout_info).length > 0 && (
                                                    <button
                                                        onClick={() => setShowBankInfo(aff)}
                                                        className="text-[10px] text-[#5A7A6A] underline mt-1"
                                                    >
                                                        View Bank Details
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-bold bg-[#FAF9F7] px-2 py-1 rounded-md text-[#5A7A6A]">{aff.coupon.code}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#2D3A3A]">
                                            {aff.sales_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#2D3A3A]">
                                            ₹{aff.total_earnings.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === aff.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={editRate}
                                                        onChange={(e) => setEditRate(e.target.value)}
                                                        className="w-16 px-2 py-1 border border-[#5A7A6A] rounded-md text-sm focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <span className="text-xs text-[#7A8A8A]">%</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-medium text-[#2D3A3A] bg-[#F3F1ED] px-2 py-1 rounded-md">{aff.commission_rate}%</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === aff.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => saveRate(aff.id)} disabled={loading} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={cancelEdit} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => startEdit(aff)} className="text-[#5A7A6A] hover:text-[#2D3A3A] text-xs font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Edit2 className="w-3 h-3" /> Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bank Info Modal */}
            {showBankInfo && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBankInfo(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-heading text-xl text-[#2D3A3A]">Bank Details</h3>
                            <button onClick={() => setShowBankInfo(null)}><X className="w-5 h-5 text-[#7A8A8A]" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-[#7A8A8A]">Bank Name</label>
                                <p className="text-[#2D3A3A] font-medium">{showBankInfo.payout_info?.bank_name || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-[#7A8A8A]">Account Number</label>
                                <p className="text-[#2D3A3A] font-medium font-mono">{showBankInfo.payout_info?.account_number || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-[#7A8A8A]">IFSC Code</label>
                                <p className="text-[#2D3A3A] font-medium font-mono">{showBankInfo.payout_info?.ifsc || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-[#7A8A8A]">UPI ID</label>
                                <p className="text-[#2D3A3A] font-medium">{showBankInfo.payout_info?.upi_id || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
