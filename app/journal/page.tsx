"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const categories = ["All", "Health", "Wellness", "Blood Purifiers", "Diabetic Wellness", "Rituals"];

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    image_url: string;
    published_at: string;
}

export default function JournalPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    // Fetch posts from Supabase
    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .order('published_at', { ascending: false });

                if (error) throw error;

                setPosts(data || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    const filteredPosts = useMemo(() => {
        return activeCategory === "All"
            ? posts
            : posts.filter(p => p.category === activeCategory);
    }, [activeCategory, posts]);

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Header />
            <main className="grow pt-40 pb-24 relative z-10">
                <div className="mx-auto max-w-7xl px-8 lg:px-12">

                    {/* Header */}
                    <header className="max-w-3xl mb-20">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-6">Seasonal Wisdom</p>
                            <h1 className="font-heading text-5xl lg:text-7xl text-[#2D3A3A] tracking-tighter mb-8 leading-none">
                                The <span className="italic font-serif font-light text-[#5A7A6A]">Journal.</span>
                            </h1>
                        </motion.div>
                    </header>

                    {/* Category Filter */}
                    <div className="flex items-center gap-8 border-b border-[#E8E6E2] mb-16 pb-4 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                                className={`text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? "text-[#5A7A6A]" : "text-[#2D3A3A]/40 hover:text-[#2D3A3A]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[4/5] rounded-[2.5rem] bg-[#F3F1ED] mb-8" />
                                    <div className="h-4 bg-[#F3F1ED] rounded mb-4 w-3/4" />
                                    <div className="h-6 bg-[#F3F1ED] rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ) : currentPosts.length > 0 ? (
                        <>
                            {/* Blog Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                                <AnimatePresence mode="popLayout">
                                    {currentPosts.map((post, idx) => (
                                        <motion.article
                                            key={post.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group cursor-pointer"
                                        >
                                            <Link href={`/journal/${post.slug}`}>
                                                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#F3F1ED] mb-8 shadow-2xl shadow-black/[0.02]">
                                                    <img src={post.image_url} alt="" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-[#7A8B7A]">
                                                        <span>{post.category}</span>
                                                        <span>{formatDate(post.published_at)}</span>
                                                    </div>
                                                    <h3 className="font-heading text-2xl text-[#2D3A3A] group-hover:text-[#5A7A6A] transition-colors leading-tight">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-sm text-[#7A8A8A] font-light line-clamp-2 leading-relaxed">
                                                        {post.excerpt}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.article>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Pagination Controls */}
                            {filteredPosts.length > postsPerPage && (
                                <div className="mt-32 flex items-center justify-center gap-8 border-t border-[#E8E6E2] pt-12">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="disabled:opacity-20 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#2D3A3A]"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </button>
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold">
                                        Page {currentPage} of {Math.ceil(filteredPosts.length / postsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={indexOfLastPost >= filteredPosts.length}
                                        className="disabled:opacity-20 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#2D3A3A]"
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="font-heading text-2xl text-[#2D3A3A] mb-4">No posts found</h3>
                            <p className="text-[#7A8A8A]">Check back soon for new wellness insights.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}