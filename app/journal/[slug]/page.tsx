import { supabaseAdmin } from "@/lib/supabase/admin";
import JournalClient from "./JournalClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Product } from "@/types";

// Define interfaces if they aren't globally available matching the Client
interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image_url: string;
    hero_image_url?: string;
    published_at: string;
    related_product_id?: string;
}

// SEO Metadata Generator
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: post } = await supabaseAdmin
        .from('posts')
        .select('title, excerpt, image_url')
        .eq('slug', slug)
        .single();

    if (!post) {
        return {
            title: 'Post Not Found | Ayuniv',
            description: 'The journal entry could not be found.'
        };
    }

    return {
        title: `${post.title} | Ayuniv Journal`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image_url],
        }
    };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Fetch Post
    const { data: postData } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!postData) {
        return notFound();
    }

    const post = postData as unknown as Post;

    // 2. Fetch Related Product (if linked)
    let relatedProduct: Product | null = null;
    if (post.related_product_id) {
        const { data: productData } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', post.related_product_id)
            .single();

        if (productData) {
            relatedProduct = productData as unknown as Product;
        }
    }

    // 3. Fetch suggested posts
    const { data: suggestedPosts } = await supabaseAdmin
        .from('posts')
        .select('*')
        .neq('slug', slug)
        .limit(3);

    return (
        <JournalClient
            post={post}
            relatedProduct={relatedProduct}
            suggestedPosts={suggestedPosts || []}
        />
    );
}