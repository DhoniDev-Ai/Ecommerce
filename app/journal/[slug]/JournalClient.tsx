"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronLeft, Share2, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { Post, Product } from "@/types";

// We need to redefine interface locally if not available globally, 
// but ideally we should import. I will assume they match the previous file's logic.
interface JournalClientProps {
    post: Post;
    relatedProduct: Product | null;
    suggestedPosts: Post[];
}

export default function JournalClient({ post, relatedProduct, suggestedPosts }: JournalClientProps) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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
                            width={1200}
                            height={675}
                            priority
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
                                            width={800}
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
