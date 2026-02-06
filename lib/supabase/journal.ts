import { supabase } from './client';
import { supabaseAdmin } from './admin';
import { unstable_cache } from 'next/cache';

export interface Post {
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

/**
 * Fetches all journal posts, ordered by date (CACHED)
 */
export async function getPosts(): Promise<Post[]> {
    return unstable_cache(
        async () => {
            const { data, error } = await supabaseAdmin
                .from('posts')
                .select('*')
                .order('published_at', { ascending: false });

            if (error) {
                console.error("Error fetching posts:", error);
                return [];
            }
            return data as Post[];
        },
        ['journal-posts'],
        { revalidate: 3600, tags: ['posts'] }
    )();
}

/**
 * Fetches a single post by slug (CACHED)
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    return unstable_cache(
        async () => {
            const { data, error } = await supabaseAdmin
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !data) return null;
            return data as Post;
        },
        [`post-${slug}`],
        { revalidate: 3600, tags: [`post-${slug}`, 'posts'] }
    )();
}

/**
 * Fetches recent posts for suggestions, excluding a specific slug (CACHED)
 */
export async function getSuggestedPosts(excludeSlug: string): Promise<Post[]> {
    return unstable_cache(
        async () => {
            const { data } = await supabaseAdmin
                .from('posts')
                .select('*')
                .neq('slug', excludeSlug)
                .limit(3);

            return (data as Post[]) || [];
        },
        [`suggested-posts-${excludeSlug}`],
        { revalidate: 3600, tags: ['posts'] }
    )();
}
