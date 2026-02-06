import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductFeed } from "@/components/product/ProductFeed";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Product } from "@/types";
import { Suspense } from "react";

export const revalidate = 3600; // Cache for 1 hour

export default async function ProductsPage() {
    // Server-Side Fetching
    const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
    }

    // Map to simplified Product type if needed, or pass directly
    const products: Product[] = (data ?? []).map((product: any) => ({
        id: product.id,
        slug: product.slug || '',
        name: product.name,
        description: product.description,
        price: product.price,
        image_urls: product.image_urls || [],
        category: product.category,
        stock_quantity: product.stock_quantity || 0,
        ingredients: product.ingredients || [],
        benefits: product.benefits || [],
        wellness_goals: product.wellness_goals || [],
        created_at: product.created_at,
        is_on_sale: product.is_on_sale || false,
        sale_price: product.sale_price,
        sale_badge_text: product.sale_badge_text,
        comparison_price: product.comparison_price,
    }));

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header />

            <main className="grow pt-40 pb-32 relative z-10">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#5A7A6A] font-bold text-xs uppercase tracking-widest">Loading Collection...</div>}>
                    <ProductFeed initialProducts={products} />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}