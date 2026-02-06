// 1. Fetch data (all cached)
import { getPostBySlug, getSuggestedPosts, Post } from "@/lib/supabase/journal";
import { getProductById } from "@/lib/supabase/products";
import JournalClient from "./JournalClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

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

    // 1. Fetch Post (Cached)
    const post = await getPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    // 2. Fetch Related Data in Parallel (Cached)
    const relatedProductPromise = post.related_product_id
        ? getProductById(post.related_product_id)
        : Promise.resolve(null);

    const suggestedPostsPromise = getSuggestedPosts(slug);

    const [relatedProduct, suggestedPosts] = await Promise.all([
        relatedProductPromise,
        suggestedPostsPromise
    ]);

    return (
        <JournalClient
            post={post}
            relatedProduct={relatedProduct}
            suggestedPosts={suggestedPosts || []}
        />
    );
}