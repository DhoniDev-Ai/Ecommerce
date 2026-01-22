"use client";
import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Navigation, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import AddressForm from "@/components/dashboard/AdressForm";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track specific dissolution
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);

    const fetchAddresses = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false });
            if (data) setAddresses(data);
        }
        setLoading(false);
    };

    /**
     * Dissolve Ritual Base Logic
     */
    const deleteAddress = async (id: string) => {
        setIsDeleting(id);

        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id);

        if (!error) {
            // Immediate local update for a seamless, jitter-free experience
            setAddresses(prev => prev.filter(addr => addr.id !== id));
        } else {
            console.error("Dissolution Error:", error.message);
        }
        setIsDeleting(null);
    };

    useEffect(() => { fetchAddresses(); }, []);

    return (
        <div className="max-w-5xl">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Ritual Archive</p>
                    <h1 className="font-heading text-6xl text-[#2D3A3A] tracking-tighter leading-none">Shipping <span className="italic font-serif font-light text-[#5A7A6A]">Points.</span></h1>
                </div>
                {addresses.length > 0 && (
                    <button
                        onClick={() => { setEditingAddress(null); setShowForm(true); }}
                        className="flex items-center gap-3 px-10 py-5 bg-[#2D3A3A] text-white rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:shadow-2xl transition-all"
                    >
                        <Plus className="w-4 h-4" /> Establish New Base
                    </button>
                )}
            </header>

            {loading ? (
                <EtherealPulse />
            ) : addresses.length === 0 ? (
                <EmptyRitualBase onAdd={() => setShowForm(true)} />
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {addresses.map((addr) => (
                        <div key={addr.id} className={cn(
                            "p-10 rounded-[3rem] border transition-all relative group",
                            addr.is_default ? "bg-white border-[#5A7A6A] shadow-lg shadow-[#5A7A6A]/5" : "bg-white border-[#E8E6E2] opacity-60 hover:opacity-100"
                        )}>
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-[8px] uppercase tracking-[0.2em] font-black px-4 py-1.5 bg-[#F3F1ED] rounded-full text-[#5A7A6A]">
                                    {addr.is_default ? "Primary Sanctuary" : "Ritual Point"}
                                </span>
                                {addr.is_default && <CheckCircle2 className="w-5 h-5 text-[#5A7A6A]" />}
                            </div>

                            <h3 className="font-heading text-2xl text-[#2D3A3A] mb-4">{addr.full_name}</h3>
                            <p className="text-sm text-[#7A8A8A] font-light leading-relaxed mb-10">
                                {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}<br />
                                {addr.city}, {addr.state} — {addr.pincode}<br />
                                India
                            </p>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => { setEditingAddress(addr); setShowForm(true); }}
                                    className="text-[9px] uppercase tracking-widest font-bold text-[#5A7A6A] border-b border-[#5A7A6A]/10 pb-1 hover:border-[#5A7A6A] transition-all"
                                >
                                    Refine Details
                                </button>

                                {/* Dissolve Action - Protected for Primary Sanctuary */}
                                {!addr.is_default && (
                                    <button
                                        disabled={isDeleting === addr.id}
                                        onClick={() => deleteAddress(addr.id)}
                                        className="text-[9px] uppercase tracking-widest font-bold text-red-400/40 hover:text-red-500 transition-all flex items-center gap-2"
                                    >
                                        {isDeleting === addr.id ? "Dissolving..." : (
                                            <>
                                                <Trash2 className="w-3.5 h-3.5" /> Dissolve Base
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <AddressForm
                    initialData={editingAddress}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => { setShowForm(false); fetchAddresses(); }}
                />
            )}
        </div>
    );
}

function EtherealPulse() {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2].map((i) => (
                <div key={i} className="h-80 bg-[#F3F1ED] rounded-[3rem] border border-[#E8E6E2]" />
            ))}
        </div>
    );
}

function EmptyRitualBase({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="py-10 mb-2 px-12 text-center bg-white rounded-[4rem] border border-[#E8E6E2]/50 shadow-sm overflow-hidden relative">
            <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-10 border border-[#E8E6E2]">
                <Navigation className="w-8 h-8 text-[#E8E6E2]" />
            </div>

            <div className="max-w-md mx-auto space-y-6">
                <h2 className="font-heading text-4xl text-[#2D3A3A] leading-tight">
                    The Sanctuary Map is <span className="italic font-serif font-light text-[#5A7A6A]">Awaiting.</span>
                </h2>
                <p className="text-sm text-[#7A8A8A] font-light leading-relaxed">
                    A true ritual requires a destination. Establish your primary delivery sanctuary to synchronize your Ayuniv journey.
                </p>
            </div>

            <button
                onClick={onAdd}
                className="mt-12 inline-flex items-center gap-4 py-6 px-14 bg-[#2D3A3A] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
                Establish Ritual Base <Plus className="w-3 h-3" />
            </button>

            <div className="absolute top-0 left-0 w-64 h-64 bg-[#5A7A6A]/5 blur-3xl rounded-full -ml-32 -mt-32" />
        </div>
    );
}