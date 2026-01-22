"use client";
import { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
type AddressRow = Database['public']['Tables']['addresses']['Row'];

interface AddressFormProps {
    initialData?: AddressRow; // Populated when refining an existing ritual base
    onClose: () => void;
    onSuccess: () => void; // Triggers a re-fetch on the parent page
}

export default function AddressForm({ initialData, onClose, onSuccess }: AddressFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: initialData?.full_name || "",
        phone: initialData?.phone || "",
        address_line_1: initialData?.address_line_1 || "",
        address_line_2: initialData?.address_line_2 || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        pincode: initialData?.pincode || "",
        is_default: initialData?.is_default || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated sanctuary member found.");

            // SENIOR MOVE: If this address is set as default, unset all others for this user first
            if (formData.is_default) {
                await supabase
                    .from('addresses')
                    .update({ is_default: false })
                    .eq('user_id', user.id);
            }

            const payload: AddressInsert = {
                ...formData,
                user_id: user.id,
                updated_at: new Date().toISOString(),
            };

            // Perform Update or Insert Ritual
            let error;
            if (initialData) {
                const result = await (supabase.from('addresses') as any).update(payload).eq('id', initialData.id);
                error = result.error;
            } else {
                const result = await (supabase.from('addresses') as any).insert(payload);
                error = result.error;
            }

            if (error) throw error;

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Ritual Sync Error:", error.message);
            alert("Could not synchronize the ritual base. Please verify your details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-end selection:bg-[#5A7A6A]/10">
            {/* Ethereal Backdrop */}
            <div
                className="absolute inset-0 bg-[#2D3A3A]/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Form Side-Panel */}
            <div className="relative w-full max-w-xl h-full bg-[#FDFBF7] shadow-2xl p-8 lg:p-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-2">
                            {initialData ? "Refine Location" : "New Ritual Base"}
                        </p>
                        <h2 className="text-3xl font-heading text-[#2D3A3A] tracking-tighter leading-none">
                            {initialData ? "Edit" : "Add"} <span className="italic font-serif font-light text-[#5A7A6A]">Location.</span>
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-3 rounded-full hover:bg-[#F3F1ED] transition-all active:scale-90"
                    >
                        <X className="w-5 h-5 text-[#2D3A3A]" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    {/* Identity & Contact */}
                    <div className="space-y-6">
                        <label className="block">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold block mb-3 ml-2">Receiver Name</span>
                            <input
                                required
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="e.g. Aravind Sharma"
                                className="w-full bg-white border border-[#E8E6E2] rounded-2xl p-5 text-sm focus:ring-2 focus:ring-[#5A7A6A]/10 focus:border-[#5A7A6A]/20 transition-all outline-none"
                            />
                        </label>
                        <label className="block">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold block mb-3 ml-2">Contact Number</span>
                            <input
                                required
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 00000 00000"
                                className="w-full bg-white border border-[#E8E6E2] rounded-2xl p-5 text-sm outline-none focus:border-[#5A7A6A]/20 transition-all"
                            />
                        </label>
                    </div>

                    <div className="h-px bg-[#F3F1ED]" />

                    {/* Geography & Logistics */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="col-span-2">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold block mb-3 ml-2">Address Line 1</span>
                            <input
                                required
                                type="text"
                                value={formData.address_line_1}
                                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                                placeholder="House / Flat No., Street, Area"
                                className="w-full bg-white border border-[#E8E6E2] rounded-2xl p-5 text-sm outline-none focus:border-[#5A7A6A]/20 transition-all"
                            />
                        </label>
                        <label className="col-span-2">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold block mb-3 ml-2">Address Line 2 (Optional)</span>
                            <input
                                type="text"
                                value={formData.address_line_2}
                                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                                placeholder="Landmark or Apartment Name"
                                className="w-full bg-white border border-[#E8E6E2] rounded-2xl p-5 text-sm outline-none focus:border-[#5A7A6A]/20 transition-all"
                            />
                        </label>

                        <label>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold block mb-3 ml-2">Pincode</span>
                            <input
                                required
                                type="text"
                                maxLength={6}
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                placeholder="6 Digits"
                                className="w-full bg-white border border-[#E8E6E2] rounded-2xl p-5 text-sm outline-none focus:border-[#5A7A6A]/20 transition-all"
                            />
                        </label>
                        <label>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold block mb-3 ml-2">City</span>
                            <input
                                required
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-white border border-[#E8E6E2] rounded-2xl p-5 text-sm outline-none focus:border-[#5A7A6A]/20 transition-all"
                            />
                        </label>

                        <label className="col-span-2">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold block mb-3 ml-2">State</span>
                            <select
                                required
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="w-full bg-white border border-[#E8E6E2] rounded-2xl p-5 text-sm outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Select State</option>
                                {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                            </select>
                        </label>
                    </div>

                    {/* Default Sanctuary Anchor */}
                    <div className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-[#E8E6E2]/60">
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className={cn("w-5 h-5 transition-colors", formData.is_default ? "text-[#5A7A6A]" : "text-[#E8E6E2]")} />
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#2D3A3A]">Primary Sanctuary</p>
                                <p className="text-[8px] text-[#7A8A8A] font-medium">Use as default shipping ritual</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_default: !formData.is_default })}
                            className={cn("w-12 h-6 rounded-full relative transition-colors", formData.is_default ? "bg-[#5A7A6A]" : "bg-[#F3F1ED]")}
                        >
                            <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm", formData.is_default ? "left-7" : "left-1")} />
                        </button>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-6 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            "Synchronizing Ritual Base..."
                        ) : (
                            <>{initialData ? "Update Ritual Base" : "Establish Ritual Base"}</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}