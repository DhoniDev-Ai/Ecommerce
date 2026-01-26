"use client";
import { useState, useCallback } from "react";
import { X, CheckCircle2, Loader2, AlertCircle, Sparkles, Flag, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import { validateWhatsApp, validatePincode } from "@/utils/validation";
import { Database } from "@/types/database";

type AddressInsert = Database['public']['Tables']['addresses']['Insert'];

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

export default function AddressForm({ initialData, onClose, onSuccess }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: initialData?.full_name || "",
        phone: initialData?.phone || "",
        address_line_1: initialData?.address_line_1 || "",
        landmark: initialData?.address_line_2 || "", // Map address_line_2 to landmark
        city: initialData?.city || "",
        state: initialData?.state || "",
        pincode: initialData?.pincode || "",
        is_default: initialData?.is_default || false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Visual Status Logic: Icons appear on the left as user types
    const getFieldStatus = (name: string, value: string) => {
        if (!touched[name]) return null;
        if (name === 'phone') return validateWhatsApp(value) ? 'valid' : 'invalid';
        if (name === 'pincode') return validatePincode(value) ? 'valid' : 'invalid';
        if (name === 'full_name') return value.length >= 3 ? 'valid' : 'invalid';
        if (name === 'address_line_1') return value.length >= 5 ? 'valid' : 'invalid';
        if (name === 'state' || name === 'city') return value !== "" ? 'valid' : 'invalid';
        return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (formData.full_name.length < 3) newErrors.full_name = "Required";
        if (!validateWhatsApp(formData.phone)) newErrors.phone = "Invalid";
        if (formData.address_line_1.length < 5) newErrors.address_line_1 = "Too short";
        if (!validatePincode(formData.pincode)) newErrors.pincode = "Invalid";
        if (!formData.city) newErrors.city = "Required";
        if (!formData.state) newErrors.state = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized access to sanctuary.");

            // LOGIC: If selecting as default, dissolve previous default first
            // We do this sequentially to ensure the database state is clean before adding the new one.
            if (formData.is_default) {
                // Determine which ID to exclude from the unset operation (if editing)
                // Actually, simplest is to unset ALL for this user, then set this one.
                await (supabase.from('addresses') as any)
                    .update({ is_default: false })
                    .eq('user_id', user.id);
            } else {
                // OPTIONAL: If this is the *first* address for the user, force it to be default?
                // For now, respect user choice, but smart defaults are better.
                // Let's not force it silently.
            }

            // Construct payload matching the database schema exactly
            const payload: AddressInsert = {
                user_id: user.id,
                full_name: formData.full_name,
                phone: formData.phone,
                address_line_1: formData.address_line_1,
                address_line_2: formData.landmark, // Map landmark back to address_line_2
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                is_default: formData.is_default,
                updated_at: new Date().toISOString()
            };

            const { error } = initialData
                ? await (supabase.from('addresses') as any).update(payload).eq('id', initialData.id)
                : await (supabase.from('addresses') as any).insert(payload);

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (error: any) {
            //console.error("Ritual Sync Error:", error.message);
            alert("The sanctuary base could not be established. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-150 flex items-center justify-end selection:bg-[#5A7A6A]/10">
            <div className="absolute inset-0 bg-[#2D3A3A]/40 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-xl h-full bg-[#FDFBF7] shadow-2xl p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-[#7A8B7A] font-bold mb-2">Logistics Ritual</p>
                        <h2 className="text-5xl font-heading text-[#2D3A3A] tracking-tighter leading-none">
                            Establish <span className="italic font-serif font-light text-[#5A7A6A]">Sanctuary.</span>
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 rounded-full hover:bg-[#F3F1ED] transition-all active:scale-90">
                        <X className="w-5 h-5 text-[#2D3A3A]" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField
                            label="Receiver Full Name"
                            name="full_name"
                            value={formData.full_name}
                            status={getFieldStatus('full_name', formData.full_name)}
                            onChange={handleInputChange}
                            placeholder="Hardik Jain"
                            labelIcon={<Sparkles className="w-4 h-4 text-[#C68DFF] animate-pulse" />}
                        />
                        <InputField
                            label="WhatsApp Number"
                            name="phone"
                            value={formData.phone}
                            status={getFieldStatus('phone', formData.phone)}
                            onChange={handleInputChange}
                            placeholder="99XXXXXXXX"
                        />
                    </div>

                    <div className="h-px bg-[#E8E6E2]" />

                    <InputField
                        label="Address Line (House/Flat/Street)"
                        name="address_line_1"
                        value={formData.address_line_1}
                        status={getFieldStatus('address_line_1', formData.address_line_1)}
                        onChange={handleInputChange}
                        placeholder="b-18, gali-2, Mohanbari, Surajpole gate"
                    />

                    <InputField
                        label="Landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="e.g. Near The Great Banyan Tree"
                        labelIcon={<Flag className="w-3 h-3 text-[#7A8A8A]" />}
                    />

                    <div className="grid grid-cols-2 gap-8">
                        <InputField
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            status={getFieldStatus('pincode', formData.pincode)}
                            onChange={handleInputChange}
                            placeholder="302003"
                        />
                        <InputField
                            label="City"
                            name="city"
                            value={formData.city}
                            status={getFieldStatus('city', formData.city)}
                            onChange={handleInputChange}
                            placeholder="Jaipur"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#7A8A8A] ml-4">State</label>
                        <div className="relative group">
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full bg-[#EBF1FA] border border-[#E8E6E2] rounded-3xl px-8 py-5 text-sm appearance-none outline-none focus:border-[#5A7A6A] transition-all"
                            >
                                <option value="">Select Ritual Territory</option>
                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* REFINED TOGGLE: Single Primary Sanctuary Anchor */}
                    <div className="flex items-center justify-between p-8 bg-white rounded-4xl border border-[#E8E6E2] shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500",
                                formData.is_default ? "bg-[#5A7A6A]/10 border-[#5A7A6A]" : "bg-[#FDFBF7] border-[#E8E6E2]"
                            )}>
                                <MapPin className={cn("w-5 h-5", formData.is_default ? "text-[#5A7A6A]" : "text-[#7A8A8A]/30")} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#2D3A3A]">Primary Sanctuary</p>
                                <p className="text-[8px] text-[#7A8A8A] font-medium mt-0.5">
                                    {formData.is_default ? "Only one primary sanctuary allowed." : "Establish as your main delivery base."}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, is_default: !p.is_default }))}
                            className={cn("w-14 h-7 rounded-full relative transition-all duration-500", formData.is_default ? "bg-[#5A7A6A]" : "bg-[#F3F1ED]")}
                        >
                            <div className={cn("absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md", formData.is_default ? "left-8" : "left-1")} />
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

const InputField = ({ label, name, value, status, onChange, placeholder, labelIcon }: any) => {
    return (
        <div className="space-y-3 group relative">
            <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#9AA09A] ml-4 flex items-center gap-2 transition-colors group-focus-within:text-[#5A7A6A]">
                {label} {labelIcon}
            </label>
            <div className="relative">
                {/* ICON POSITIONING */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-300">
                    {status === 'valid' ? <CheckCircle2 className="w-4 h-4 text-[#5A7A6A] scale-110" /> :
                        status === 'invalid' ? <AlertCircle className="w-4 h-4 text-red-400 scale-110" /> :
                            <div className="w-2 h-2 rounded-full bg-[#E8E6E2] group-hover:bg-[#D4D2CE] transition-colors" />}
                </div>

                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-white border rounded-3xl py-5 px-14 text-sm transition-all duration-300 outline-none placeholder:text-[#D4D2CE]",
                        status === 'valid' ? "border-[#5A7A6A] shadow-[0_4px_20px_rgba(90,122,106,0.1)]" :
                            status === 'invalid' ? "border-red-200 bg-red-50/10" :
                                "border-[#E8E6E2] hover:border-[#D4D2CE] focus:border-[#5A7A6A] focus:shadow-[0_4px_20px_rgba(45,58,58,0.05)]"
                    )}
                />
            </div>
        </div>
    );
};