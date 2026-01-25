"use client";
import { Plus, Edit3, Trash2, ExternalLink } from "lucide-react";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import Image from "next/image";

export default function AdminProducts() {
    // Logic to fetch all products from Supabase would go here...

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.5em] text-[#7A8B7A] font-bold mb-4">Inventory</p>
                    <h1 className="text-5xl font-heading text-[#2D3A3A]">Manage <span className="italic font-serif font-light text-[#5A7A6A]">Elixirs.</span></h1>
                </div>
                <button className="bg-[#2D3A3A] text-white px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3">
                    <Plus className="w-4 h-4" /> Manifest New Product
                </button>
            </header>

            {/* Product Table Ritual */}
            <div className="bg-white rounded-[3rem] border border-[#E8E6E2] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#FDFBF7] border-b border-[#E8E6E2]">
                        <tr className="text-[9px] uppercase tracking-[0.3em] text-[#7A8B7A] font-black">
                            <th className="px-10 py-6">Product</th>
                            <th className="px-10 py-6">Ritual Category</th>
                            <th className="px-10 py-6">Current Value</th>
                            <th className="px-10 py-6">Stock Level</th>
                            <th className="px-10 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E6E2]/50">
                        {/* Example Row */}
                        <tr className="group hover:bg-[#FDFBF7]/50 transition-colors">
                            <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#F3F1ED] rounded-xl p-2 shrink-0">
                                        <Image
                                            width={1000}
                                            height={1000}
                                            src="/assets/sea_buckthorn_pulp_300ml.png" className="object-contain w-full h-full" alt="" />
                                    </div>
                                    <div>
                                        <p className="font-heading text-sm text-[#2D3A3A]">Sea Buckthorn Elixir</p>
                                        <p className="text-[10px] text-[#9AA09A] mt-1 italic">slug: sea-buckthorn-elixir</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-8">
                                <span className="text-[9px] px-3 py-1 bg-[#5A7A6A]/10 text-[#5A7A6A] rounded-full font-bold uppercase tracking-widest">
                                    Immunity
                                </span>
                            </td>
                            <td className="px-10 py-8">
                                <PriceDisplay price={1299} comparisonPrice={1999} />
                            </td>
                            <td className="px-10 py-8 text-sm font-medium text-[#2D3A3A]">
                                48 Units
                            </td>
                            <td className="px-10 py-8 text-right space-x-4">
                                <button className="text-[#7A8A8A] hover:text-[#5A7A6A] transition-colors"><Edit3 className="w-4 h-4" /></button>
                                <button className="text-[#7A8A8A] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}