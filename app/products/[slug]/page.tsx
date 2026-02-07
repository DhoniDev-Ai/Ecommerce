import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { Metadata } from "next";
import { Suspense } from "react";

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

import { unstable_cache } from "next/cache";

async function getAllProducts(currentId: string) {
    return unstable_cache(
        async () => {
            const { data: allProducts } = await supabaseAdmin
                .from('products')
                .select('*')
                .eq('is_active', true)
                .neq('id', currentId)
                .order('created_at', { ascending: false });

            return allProducts || [];
        },
        ['all-products-excluding-' + currentId],
        { revalidate: 3600, tags: ['products'] }
    )();
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
    // 1. Start fetching un-dependent data early
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const userPromise = supabase.auth.getUser();

    const { slug } = await params;

    // 2. Fetch Product (Critical)
    const product = await getProduct(slug);

    if (!product) {
        return notFound();
    }

    // 3. Parallelize dependent fetches
    // We need product.id for these, so they start after product is found
    const relatedPromise = getAllProducts(product.id);

    const reviewsPromise = supabaseAdmin
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    // 4. Resolve User to determine if we need to check verification
    const { data: { user: currentUser } } = await userPromise;

    let isVerifiedBuyerPromise: Promise<boolean> | boolean = false;

    if (currentUser) {
        // Import lazily to avoid overhead if not logged in
        const { checkVerifiedPurchase } = await import('@/actions/store/reviews');
        isVerifiedBuyerPromise = checkVerifiedPurchase(product.id);
    }

    // 5. Wait for all
    const [relatedProducts, reviewsResult, isVerifiedBuyer] = await Promise.all([
        relatedPromise,
        reviewsPromise,
        isVerifiedBuyerPromise
    ]);

    const reviews = reviewsResult.data || [];
    let currentUserReview = null;

    if (currentUser && reviews.length > 0) {
        currentUserReview = reviews.find((r: any) => r.user_id === currentUser.id) || null;
    }

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
                reviews={reviews}
                isVerifiedBuyer={!!isVerifiedBuyer}
                currentUserReview={currentUserReview}
            />
        </>
    );
}