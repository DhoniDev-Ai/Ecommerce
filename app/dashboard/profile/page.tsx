"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, PhoneForwarded, UserCircle, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/utils/cn";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        phone: "",
        alt_phone: "", // This will handle the Alt_Number field
        created_at: ""
    });

    // Helper: Derives a dummy name from email prefix if name is empty
    const getMagicName = (email: string, name: string) => {
        if (name && name.trim() !== "") return name;
        return email.split('@')[0].replace(/[._]/g, ' ').toUpperCase();
    };

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await (supabase.from('users') as any)
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    alt_phone: data.Alt_Number ? String(data.Alt_Number) : "",
                    created_at: new Date(data.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                });
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // --- SCHEMA SYNC LOGIC ---
        // phone: text | Alt_Number: numeric
        const { error } = await (supabase.from('users') as any)
            .update({
                full_name: profile.full_name,
                phone: profile.phone,
                Alt_Number: profile.alt_phone ? parseInt(profile.alt_phone) : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (!error) {
            alert("Ritual Identity Updated.");
        } else {
            console.error("Alchemy Error:", error.message);
        }
        setUpdating(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#5A7A6A] opacity-20" />
        </div>
    );

    return (
        <form onSubmit={handleUpdate} className="max-w-3xl pb-20 animate-in fade-in duration-700">
            <header className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Account Ritual</p>
                <h1 className="font-heading text-5xl text-[#2D3A3A] tracking-tighter leading-none">
                    Your <span className="italic font-serif font-light text-[#5A7A6A]">Identity.</span>
                </h1>
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#5A7A6A]/5 rounded-full w-fit border border-[#5A7A6A]/10">
                    <Sparkles className="w-3 h-3 text-[#5A7A6A]" />
                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#5A7A6A]">
                        Known as: {getMagicName(profile.email, profile.full_name)}
                    </p>
                </div>
            </header>

            <div className="grid gap-8">
                {/* CORE IDENTITY */}
                <div className="bg-white p-10 rounded-[3.5rem] border border-[#E8E6E2]/60 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[#F3F1ED]">
                        <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center border border-[#E8E6E2]">
                            <UserCircle className="w-6 h-6 text-[#5A7A6A]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading text-[#2D3A3A]">Primary Profile</h2>
                            <p className="text-[9px] uppercase tracking-widest text-[#7A8A8A] font-bold">Member Since {profile.created_at}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <InputField
                            label="Ritual Name"
                            value={profile.full_name}
                            placeholder={getMagicName(profile.email, "")}
                            onChange={(v) => setProfile({ ...profile, full_name: v })}
                        />
                        <div className="space-y-3 opacity-60">
                            <div className="flex justify-between items-center ml-4">
                                <span className="text-[9px] uppercase tracking-widest text-[#7A8A8A] font-bold">Email Base</span>
                                <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-[#5A7A6A] font-bold">
                                    <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                            </div>
                            <input disabled value={profile.email} className="w-full bg-[#F3F1ED]/40 border-none rounded-full px-8 py-5 text-sm text-[#9AA09A] cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* CONTACT SECTION */}
                <div className="bg-white p-10 rounded-[3.5rem] border border-[#E8E6E2]/60 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center border border-[#E8E6E2]">
                            <PhoneForwarded className="w-6 h-6 text-[#5A7A6A]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading text-[#2D3A3A]">Contact Points</h2>
                            <p className="text-[9px] uppercase tracking-widest text-[#7A8A8A] font-bold italic leading-none">Ensures your elixirs reach the sanctuary</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <InputField
                            label="WhatsApp Number"
                            value={profile.phone}
                            placeholder="91XXXXXXXX"
                            onChange={(v) => setProfile({ ...profile, phone: v })}
                        />
                        <InputField
                            label="Emergency Alt"
                            value={profile.alt_phone}
                            placeholder="Alt numeric base"
                            onChange={(v) => setProfile({ ...profile, alt_phone: v.replace(/\D/g, '') })}
                        />
                    </div>
                </div>

                <button
                    disabled={updating}
                    className="group relative py-7 bg-[#2D3A3A] text-white rounded-full text-[11px] font-bold uppercase tracking-[0.5em] hover:shadow-[0_20px_50px_rgba(45,58,58,0.2)] transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Synchronize Ritual Changes"}
                </button>
            </div>
        </form>
    );
}

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

function InputField({ label, value, onChange, placeholder }: InputFieldProps) {
    return (
        <div className="space-y-3">
            <span className="text-[9px] uppercase tracking-widest text-[#7A8A8A] font-bold block ml-4">{label}</span>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#E8E6E2] rounded-full px-8 py-5 text-sm focus:border-[#5A7A6A] focus:bg-white outline-none transition-all placeholder:text-[#D4D2CE]"
            />
        </div>
    );
}