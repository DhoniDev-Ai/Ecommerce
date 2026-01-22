"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, PhoneForwarded, UserCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/utils/cn";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        phone: "",
        alt_phone: "",
        created_at: ""
    });

    // Fetch live profile data from the 'users' table
    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single() as { data: { full_name: string | null; email: string; phone: string | null; alt_phone: string | null; created_at: string } | null; error: any };

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    alt_phone: data.alt_phone || "",
                    created_at: new Date(data.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                });
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    // Handle Production Update
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setUpdating(false);
            return;
        }

        const { error } = await supabase
            .from('users')
            // @ts-ignore - Type inference issue with users table
            .update({
                full_name: profile.full_name,
                phone: profile.phone,
                alt_phone: profile.alt_phone,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (!error) {
            alert("Identity Synchronized.");
        }
        setUpdating(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#5A7A6A] opacity-20" />
        </div>
    );

    return (
        <form onSubmit={handleUpdate} className="max-w-3xl">
            <header className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Account Ritual</p>
                <h1 className="font-heading text-5xl text-[#2D3A3A] tracking-tighter">Personal <span className="italic font-serif font-light text-[#5A7A6A]">Identity.</span></h1>
            </header>

            <div className="grid gap-8">
                {/* Section 1: Core Identity */}
                <div className="bg-white p-10 rounded-[3rem] border border-[#E8E6E2]/60 shadow-sm">
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
                        <label className="block">
                            <span className="text-[10px] uppercase tracking-widest text-[#7A8A8A] font-bold block mb-3 ml-2">Full Name</span>
                            <input
                                type="text"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                className="w-full bg-[#FDFBF7] border border-transparent rounded-2xl p-5 text-sm focus:ring-2 focus:ring-[#5A7A6A]/10 focus:border-[#5A7A6A]/20 transition-all outline-none"
                            />
                        </label>

                        <label className="block opacity-60">
                            <div className="flex justify-between items-center mb-3 ml-2">
                                <span className="text-[10px] uppercase tracking-widest text-[#7A8A8A] font-bold">Email Address</span>
                                <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-[#5A7A6A] font-bold"><ShieldCheck className="w-3 h-3" /> Verified</span>
                            </div>
                            <input type="email" value={profile.email} disabled className="w-full bg-[#F3F1ED]/40 border-none rounded-2xl p-5 text-sm text-[#9AA09A] cursor-not-allowed" />
                        </label>
                    </div>
                </div>

                {/* Section 2: Contact Points */}
                <div className="bg-white p-10 rounded-[3rem] border border-[#E8E6E2]/60 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center border border-[#E8E6E2]">
                            <PhoneForwarded className="w-6 h-6 text-[#5A7A6A]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading text-[#2D3A3A]">Contact Points</h2>
                            <p className="text-[9px] uppercase tracking-widest text-[#7A8A8A] font-bold italic">Ensures your elixirs reach you safely</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <label className="block">
                            <span className="text-[10px] uppercase tracking-widest text-[#7A8A8A] font-bold block mb-3 ml-2">Primary Number</span>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="w-full bg-[#FDFBF7] border border-transparent rounded-2xl p-5 text-sm outline-none"
                            />
                        </label>

                        <label className="block">
                            <span className="text-[10px] uppercase tracking-widest text-[#7A8A8A] font-bold block mb-3 ml-2">Alternative Contact</span>
                            <input
                                type="tel"
                                placeholder="+91 00000 00000"
                                value={profile.alt_phone}
                                onChange={(e) => setProfile({ ...profile, alt_phone: e.target.value })}
                                className="w-full bg-[#FDFBF7] border border-transparent rounded-2xl p-5 text-sm placeholder:text-[#9AA09A]/50 outline-none"
                            />
                        </label>
                    </div>
                </div>

                <button
                    disabled={updating}
                    className="py-6 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    {updating ? "Synchronizing..." : "Synchronize Ritual Changes"}
                </button>
            </div>

            <footer className="my-8 pt-5 text-center space-y-2">
                <p className="text-[9px] text-[#9AA09A] uppercase tracking-widest">
                    Ritual Archive Reference: {profile.email.split('@')[0].toUpperCase()}-SEC
                </p>
                <p className="text-[8px] text-[#5A7A6A] italic font-light">
                    Logged in securely via Ritual Link • Ayuniv Jaipur Studio
                </p>
            </footer>
        </form>
    );
}