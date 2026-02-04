"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, ArrowRight, Share2, Bookmark, Clock } from "lucide-react";
import { cn } from "@/utils/cn";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

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

export default function DynamicJournalReader() {
    const params = useParams();
    const slug = params?.slug as string;
    const [post, setPost] = useState<Post | null>(null);
    const [suggestedPosts, setSuggestedPosts] = useState<Post[]>([]);
    const [relatedProduct, setRelatedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Fetch post by slug
    useEffect(() => {
        async function fetchPost() {
            try {
                setLoading(true);
                // 1. Fetch Post
                const { data: postData, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;

                // Cast to local interface until DB types are regenerated
                const typedPost = postData as unknown as Post;
                setPost(typedPost);

                // 2. Fetch Related Product (if linked)
                if (typedPost.related_product_id) {
                    const { data: productData } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', typedPost.related_product_id)
                        .single();

                    if (productData) setRelatedProduct(productData as unknown as Product);
                }

                // 3. Fetch suggested posts (other posts, limit 3)
                const { data: suggested } = await supabase
                    .from('posts')
                    .select('*')
                    .neq('slug', slug)
                    .limit(3);

                if (suggested) setSuggestedPosts(suggested);
            } catch (err) {
                console.error('Error fetching post:', err);
                setPost(null);
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
                <Header />
                <main className="grow pt-32 pb-24 relative z-10">
                    <div className="mx-auto max-w-4xl px-8 lg:px-12">
                        <div className="h-16 bg-[#F3F1ED] rounded animate-pulse mb-8 w-3/4" />
                        <div className="aspect-video rounded-[3rem] bg-[#F3F1ED] animate-pulse mb-20" />
                        <div className="space-y-4">
                            <div className="h-4 bg-[#F3F1ED] rounded animate-pulse" />
                            <div className="h-4 bg-[#F3F1ED] rounded animate-pulse w-5/6" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // 404
    if (!post) {
        return (
            <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
                <Header />
                <main className="grow pt-32 pb-24 relative z-10 flex items-center justify-center">
                    <div className="text-center max-w-xl px-8">
                        <h1 className="font-heading text-4xl lg:text-6xl text-[#2D3A3A] mb-6">Post Not Found</h1>
                        <p className="text-[#7A8A8A] mb-12">The article you're looking for doesn't exist.</p>
                        <Link
                            href="/journal"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-[#5A7A6A] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#2D3A3A] transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Journal
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Split title for styling
    const titleParts = post.title.split(':');
    const mainTitle = titleParts[0];
    const subtitle = titleParts[1] || '';

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#5A7A6A] z-110 origin-left"
                style={{ scaleX }}
            />

            <Header />

            <main className="grow pt-32 pb-24 relative z-10">

                {/* 1. EDITORIAL HEADER */}
                <article className="mx-auto max-w-4xl px-8 lg:px-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link href="/journal" className="text-[10px] uppercase tracking-[0.4em] text-[#7A8A8A] hover:text-[#5A7A6A] mb-12 inline-flex items-center gap-2 transition-colors">
                            <ChevronLeft className="w-3 h-3" /> Journal
                        </Link>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5A7A6A] bg-[#E8F0E8] px-3 py-1 rounded-full">{post.category}</span>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#9AA09A]">
                                <Clock className="w-3.5 h-3.5" /> 6 Min Read
                            </div>
                        </div>

                        <h1 className="font-heading text-4xl lg:text-6xl text-[#2D3A3A] tracking-tighter leading-[1.1] mb-10">
                            {mainTitle}{subtitle && ':'} <br />
                            {subtitle && <span className="italic font-serif font-light text-[#5A7A6A]">{subtitle}</span>}
                        </h1>
                    </motion.div>
                </article>

                {/* 2. CINEMATIC HERO (16:9) */}
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-46 mb-24">
                    <div className="relative aspect-video rounded-4xl lg:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5">
                        <Image
                            src={post.hero_image_url || post.image_url}
                            alt={post.title}
                            width={1000}
                            height={1000}

                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                    </div>
                </div>

                {/* 3. CONTENT CORE */}
                <div className="mx-auto max-w-5xl px-8 lg:px-12">
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* 3.1 SHOP THE RITUAL (Related Product) */}
                    {relatedProduct && (
                        <div className="my-24 py-16 px-8 bg-[#F3F1ED] rounded-[2.5rem] flex flex-col items-center text-center">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#7A8A8A] mb-4">Integrate This Wisom</span>
                            <h2 className="font-heading text-3xl md:text-4xl text-[#2D3A3A] mb-10 tracking-tight">Shop the <span className="italic font-serif text-[#5A7A6A]">Ritual.</span></h2>

                            <div className="w-full border rounded-4xl p-2 max-w-sm">
                                <ProductCard
                                    product={relatedProduct}
                                    trendingRank={0}
                                    salesCount={0}
                                />
                            </div>
                        </div>
                    )}

                    <footer className="mt-24 pt-12 border-t border-[#E8E6E2] flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-widest text-[#9AA09A] font-bold italic">Published on {formatDate(post.published_at)}</p>
                        <div className="flex gap-8">
                            <button className="text-[10px] uppercase tracking-widest font-bold text-[#7A8A8A] hover:text-[#5A7A6A] flex items-center gap-2 transition-colors"><Share2 className="w-3 h-3" /> Share</button>

                        </div>
                    </footer>
                </div>

                {/* 4. FURTHER WISDOM (3-COLUMN 4:5 GRID) */}
                <section className="bg-[#F8F6F2] py-32 mt-32">
                    <div className="mx-auto max-w-7xl px-8 lg:px-12">
                        <div className="flex justify-between items-end mb-20">
                            <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] tracking-tighter">Further <span className="italic font-serif font-light text-[#5A7A6A]">Wisdom.</span></h2>
                            <Link href="/journal" className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#5A7A6A] border-b border-[#5A7A6A]/10 pb-1">View Library <ArrowRight className="w-3 h-3" /></Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {suggestedPosts.map((suggestedPost, i) => (
                                <Link key={i} href={`/journal/${suggestedPost.slug}`} className="group block">
                                    <div className="aspect-4/5 rounded-[2.5rem] overflow-hidden mb-8 shadow-xl shadow-black/2 bg-white">
                                        <Image
                                            width={1000}
                                            height={1000}
                                            src={suggestedPost.image_url} alt={suggestedPost.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold">{suggestedPost.category}</span>
                                    <h3 className="font-heading text-2xl text-[#2D3A3A] mt-4 group-hover:text-[#5A7A6A] transition-colors">{suggestedPost.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}