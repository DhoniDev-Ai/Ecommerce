import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { Metadata } from "next";

// Force dynamic rendering since we rely on slug params
export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
    const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !data) return null;
    return data;
}

async function getRelatedProducts(category: string, currentId: string) {
    const { data: related } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .neq('id', currentId)
        .limit(4);

    if (related && related.length > 0) return related;

    // Fallback
    const { data: anyProducts } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', currentId)
        .limit(4);

    return anyProducts || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: "Product Not Found | Ayuniv",
        };
    }

    return {
        title: `${product.name} | Ayuniv Rituals`,
        description: product.meta_description || product.description,
        openGraph: {
            title: `${product.name} - Ayuniv Wellness`,
            description: product.meta_description || product.description,
            images: product.image_urls?.[0] ? [product.image_urls[0]] : [],
        }
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return notFound();
    }

    const relatedProducts = await getRelatedProducts(product.category, product.id);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image_urls,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: 'Ayuniv',
        },
        offers: {
            '@type': 'Offer',
            url: `https://ayuniv.com/products/${product.slug}`,
            priceCurrency: 'INR',
            price: product.sale_price || product.price,
            availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient
                product={product}
                relatedProducts={relatedProducts}
            />
        </>
    );
}