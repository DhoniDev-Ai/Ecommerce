"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Categories as requested
const categories = ["All", "Health", "Wellness", "Blood Purifiers", "Diabetic Wellness", "Rituals"];

// Sample Data (9 items for the first page)
const mockPosts = [
    {
        id: "1",
        title: "The Alchemy of Sea Buckthorn: Himalayan Gold",
        slug: "alchemy-of-sea-buckthorn",
        excerpt: "Discover why this ancient berry is the cornerstone of modern Ayuniv elixirs.",
        category: "Health",
        date: "Jan 20, 2026",
        image: "/assets/blog-1.png"
    },
    {
        id: "2",
        title: "Morning Rituals for Sustained Vitality",
        slug: "morning-rituals-vitality",
        excerpt: "How to structure your first hour for a day of focused, natural energy.",
        category: "Rituals",
        date: "Jan 18, 2026",
        image: "/assets/blog-2.png"
    },
    {
        id: "3",
        title: "Natural Blood Purifiers: A Guide to Clarity",
        slug: "blood-purifiers-guide",
        excerpt: "Deep dive into the botanical ingredients that help cleanse your system from within.",
        category: "Blood Purifiers",
        date: "Jan 15, 2026",
        image: "/assets/blog-3.png"
    },
    {
        id: "4",
        title: "The Art of Slow Living: Why We Hand-Pour",
        slug: "art-of-slow-living",
        excerpt: "In a world of instant gratification, we choose the path of patience. Learn about our small-batch process.",
        category: "Wellness",
        date: "Jan 12, 2026",
        image: "/assets/blog-hero-1.jpg"
    },
    {
        id: "5",
        title: "Immunity from the Roots: Turmeric & Ginger",
        slug: "immunity-roots-turmeric-ginger",
        excerpt: "Ancient Ayurvedic staples that form the backbone of modern immunity rituals.",
        category: "Health",
        date: "Jan 08, 2026",
        image: "/assets/blog-2.png"
    },
    {
        id: "6",
        title: "Sleep Sanctuaries: Creating Your Evening Routine",
        slug: "sleep-sanctuaries-routine",
        excerpt: "Transform your bedroom into a haven of rest with these simple, effective changes.",
        category: "Rituals",
        date: "Jan 05, 2026",
        image: "/assets/blog-3.png"
    },
    {
        id: "7",
        title: "Detox Myths vs. Reality",
        slug: "detox-myths-reality",
        excerpt: "Separating marketing hype from biological fact when it comes to cleansing your body.",
        category: "Blood Purifiers",
        date: "Jan 02, 2026",
        image: "/assets/blog-1.png"
    }
];

export default function JournalPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    const filteredPosts = useMemo(() => {
        return activeCategory === "All"
            ? mockPosts
            : mockPosts.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

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
                                            <img src={post.image} alt="" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-[#7A8B7A]">
                                                <span>{post.category}</span>
                                                <span>{post.date}</span>
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
                </div>
            </main>
            <Footer />
        </div>
    );
}