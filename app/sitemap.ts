import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Admin not needed for public data)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ayuniv.com';

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/products',
        '/journal',
        '/contact',
        '/return-policy',
        '/shipping-policy',
        '/terms',
        '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Products
    const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true);

    const productRoutes = (products || []).map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Dynamic Blog Posts (Journal)
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, published_at')
        .not('published_at', 'is', null);

    const postRoutes = (posts || []).map((post) => ({
        url: `${baseUrl}/journal/${post.slug}`,
        lastModified: new Date(post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...postRoutes];
}
