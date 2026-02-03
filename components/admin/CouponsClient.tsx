"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createCoupon, deleteCoupon } from "@/actions/admin/coupons";
import { Toast } from "@/components/ui/Toast";


// Reusing Input/Select for consistency (can be extracted later)
const Input = ({ label, value, onChange, type = "text", placeholder = "", required = false }: any) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs uppercase font-bold tracking-widest text-[#7A8A8A]">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full bg-[#FAF9F7] border border-[#E8E6E2] rounded-xl px-4 py-3 text-[#2D3A3A] font-medium focus:outline-none focus:border-[#5A7A6A] transition-colors"
        />
    </div>
);

const Select = ({ label, value, onChange, options }: any) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs uppercase font-bold tracking-widest text-[#7A8A8A]">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-[#FAF9F7] border border-[#E8E6E2] rounded-xl px-4 py-3 text-[#2D3A3A] font-medium focus:outline-none focus:border-[#5A7A6A] transition-colors appearance-none"
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

type Coupon = {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_purchase_amount: number | null;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
};

export function CouponsClient({ coupons }: { coupons: Coupon[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: "", type: null });

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount_type: 'percentage' as 'percentage' | 'fixed',
        discount_value: 0,
        usage_limit: 100,
        min_purchase_amount: 0
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await createCoupon({
            code: newCoupon.code,
            discount_type: newCoupon.discount_type,
            discount_value: newCoupon.discount_value,
            usage_limit: newCoupon.usage_limit,
            min_purchase_amount: newCoupon.min_purchase_amount
        });

        if (res.success) {
            setToast({ message: "Coupon created successfully", type: "success" });
            setIsCreating(false);
            setNewCoupon({ code: '', discount_type: 'percentage', discount_value: 0, usage_limit: 100, min_purchase_amount: 0 });
        } else {
            setToast({ message: res.error as string, type: "error" });
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        const res = await deleteCoupon(id);
        if (res.success) {
            setToast({ message: "Coupon deleted", type: "success" });
        } else {
            setToast({ message: res.error as string, type: "error" });
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, type: null })} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading text-[#2D3A3A]">Coupons</h1>
                    <p className="text-[#7A8A8A] mt-1">Manage discount codes and promotions.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-[#2D3A3A] text-[#F3F1ED] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#1A2222] transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Coupon
                </button>
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {isCreating && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleCreate}
                        className="bg-white p-6 rounded-4xl border border-[#E8E6E2] shadow-sm overflow-hidden"
                    >
                        <h3 className="font-heading text-lg mb-4">Create New Coupon</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Input label="Code" value={newCoupon.code} onChange={(v: string) => setNewCoupon({ ...newCoupon, code: v })} placeholder="e.g. SUMMER20" required />
                            <Select
                                label="Type"
                                value={newCoupon.discount_type}
                                onChange={(v: string) => setNewCoupon({ ...newCoupon, discount_type: v as any })}
                                options={[{ value: 'percentage', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed Amount (₹)' }]}
                            />
                            <Input label="Value" type="number" value={newCoupon.discount_value} onChange={(v: string) => setNewCoupon({ ...newCoupon, discount_value: parseFloat(v) })} required />
                            <Input label="Usage Limit" type="number" value={newCoupon.usage_limit} onChange={(v: string) => setNewCoupon({ ...newCoupon, usage_limit: parseInt(v) })} />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-sm font-bold text-[#7A8A8A] hover:text-[#2D3A3A]">Cancel</button>
                            <button type="submit" disabled={loading} className="bg-[#5A7A6A] text-white px-6 py-2 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#4A665A]">{loading ? 'Saving...' : 'Create Coupon'}</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Coupons List */}
            <div className="grid grid-cols-1 gap-4">
                {coupons.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-[#E8E6E2]/60">
                        <Tag className="w-12 h-12 text-[#E8E6E2] mx-auto mb-4" />
                        <h3 className="font-heading text-lg text-[#7A8A8A]">No active coupons</h3>
                    </div>
                ) : (
                    coupons.map(coupon => (
                        <div key={coupon.id} className="bg-white p-6 rounded-4xl border border-[#E8E6E2]/60 flex items-center justify-between group hover:border-[#5A7A6A]/30 transition-colors">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#F3F1ED] flex items-center justify-center text-[#5A7A6A]">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-[#2D3A3A] tracking-tight">{coupon.code}</h3>
                                    <p className="text-sm text-[#7A8A8A] font-medium">
                                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                        <span className="mx-2 text-[#E8E6E2]">•</span>
                                        {coupon.used_count || 0} / {coupon.usage_limit || '∞'} used
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(coupon.id)}
                                className="p-3 text-[#E8E6E2] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
