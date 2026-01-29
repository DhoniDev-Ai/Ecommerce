import { supabaseAdmin } from "@/lib/supabase/admin";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PriceDisplay } from "@/components/product/PriceDisplay";

export default async function AdminProductsPage() {
    // 1. Fetch Products with Order Items to calculate sales
    const { data: products, error } = await supabaseAdmin
        .from('products')
        .select(`
            *,
            order_items (
                quantity
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Products Error:", error);
        return <div className="p-10 text-red-500">Failed to load products</div>;
    }

    // 2. Calculate Stats
    const productStats = (products as any[])?.map(product => {
        // Calculate total quantity sold
        const totalSold = product.order_items?.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0) || 0;
        return {
            ...product,
            totalSold
        };
    }) || [];

    return (
        <section className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="font-heading text-4xl text-[#2D3A3A]">Ritual <span className="italic font-serif text-[#5A7A6A]">Inventory.</span></h1>
                    <p className="text-xs text-[#7A8A8A] mt-2 font-light tracking-wide">
                        {products.length} active formulations
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-6 py-3 bg-[#2D3A3A] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:shadow-lg active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Ritual
                </Link>
            </header>

            <div className="bg-white rounded-[2rem] border border-[#E8E6E2]/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#Fdfbf7] border-b border-[#E8E6E2]">
                            <tr>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold">Product</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold text-center">Status</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold text-center">Stock</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold text-center">Purchased</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold text-right">Price</th>
                                <th className="py-6 px-8 text-[9px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E6E2]/60">
                            {productStats.map((product) => (
                                <tr key={product.id} className="group hover:bg-[#Fdfbf7]/50 transition-colors">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-xl bg-[#F3F1ED] p-2 border border-[#E8E6E2]">
                                                {product.image_urls?.[0] ? (
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        src={product.image_urls[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <Package className="w-full h-full text-[#E8E6E2]" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-heading text-lg text-[#2D3A3A]">{product.name}</p>
                                                <p className="text-[9px] uppercase tracking-wider text-[#7A8A8A]">{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className={`inline-block px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold ${product.is_active
                                            ? "bg-green-50 text-green-700"
                                            : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {product.is_active ? 'Active' : 'Draft'}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <span className={`font-mono text-sm ${product.stock_quantity <= (product.low_stock_threshold || 5) ? 'text-red-500 font-bold' : 'text-[#5A6A6A]'}`}>
                                            {product.stock_quantity}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="font-heading text-xl text-[#2D3A3A]">{product.totalSold}</span>
                                            <span className="text-[8px] uppercase text-[#7A8A8A]">Units Sold</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <PriceDisplay
                                            price={product.price}
                                            comparisonPrice={product.comparison_price}
                                            priceClassName="text-sm font-bold text-[#2D3A3A]"
                                        />
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="inline-flex py-2 px-4 rounded-full border border-[#E8E6E2] text-[#5A6A6A] hover:bg-[#2D3A3A] hover:text-white transition-colors text-xs items-center gap-2"
                                        >
                                            <Edit className="w-3 h-3" /> Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
