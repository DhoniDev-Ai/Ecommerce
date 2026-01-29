import { ProductForm } from "@/components/admin/ProductForm";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        return notFound();
    }

    return (
        <section>
            <div className="mb-10 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">Edit Formulation</p>
                <h1 className="font-heading text-4xl text-[#2D3A3A]">Refine <span className="italic font-serif text-[#5A7A6A]">Details.</span></h1>
            </div>

            <ProductForm initialData={product} />
        </section>
    );
}
