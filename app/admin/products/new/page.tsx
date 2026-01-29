import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
    return (
        <section>
            <div className="mb-10 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">New Formulation</p>
                <h1 className="font-heading text-4xl text-[#2D3A3A]">Add to <span className="italic font-serif text-[#5A7A6A]">Archive.</span></h1>
            </div>

            <ProductForm />
        </section>
    );
}
