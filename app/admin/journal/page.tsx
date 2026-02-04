"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Eye, Save, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function AdminJournalPage() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("Wellness");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState(""); // Stores HTML directly
    const [imageUrl, setImageUrl] = useState("");
    const [heroImageUrl, setHeroImageUrl] = useState("");

    // Product Linking
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch Products for Dropdown
    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase.from("products").select("id, name");
            if (data) setProducts(data as any);
        }
        fetchProducts();
    }, []);

    // Auto-generate slug from title
    useEffect(() => {
        setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }, [title]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const { error } = await supabase.from("posts").insert({
                title,
                slug,
                category,
                excerpt,
                content,
                image_url: imageUrl,
                hero_image_url: heroImageUrl,
                related_product_id: selectedProductId || null,
                published_at: new Date().toISOString(),
            } as any);

            if (error) throw error;
            setMessage("Post published successfully!");
            // Reset form
            setTitle("");
            setContent("");
            setExcerpt("");
            setImageUrl("");
            setSelectedProductId("");
        } catch (err: any) {
            setMessage("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Placeholder or Link back */}
            {/* Assuming there is a sidebar layout wrapper, but if not we add a simple back link */}

            <div className="flex-1">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </Link>
                        <h1 className="text-xl font-bold font-juana text-gray-900">New Journal Entry</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {message && <span className="text-sm font-medium text-green-600 animate-fade-in">{message}</span>}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-green-800 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : <><Save className="w-4 h-4" /> Publish Post</>}
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] flex gap-8">

                    {/* LEFT: EDITOR */}
                    <div className="w-1/2 overflow-y-auto pr-2 space-y-6 pb-20">

                        {/* 1. Meta Info */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Post Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 font-heading text-lg"
                                    placeholder="e.g., The Magic of Turmeric"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-500 text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                    >
                                        <option>Wellness</option>
                                        <option>Ingredients</option>
                                        <option>Rituals</option>
                                        <option>News</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link Product (Shop the Ritual)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none bg-white"
                                    >
                                        <option value="">-- No Related Product --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. Media */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Media</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Image URL</label>
                                    <div className="flex gap-2">
                                        <div className="relative grow">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={heroImageUrl}
                                        onChange={(e) => setHeroImageUrl(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                                        placeholder="Defaults to Card Image if empty"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Content Editor */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Content (HTML Supported)</h2>
                                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; tags</span>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full grow p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm leading-relaxed resize-none"
                                placeholder={`<h2>Subheading</h2>\n<p>Your paragraph text...</p>`}
                            />
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Excerpt</h2>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm h-24 resize-none"
                                placeholder="Short description for the card..."
                            />
                        </div>

                    </div>

                    {/* RIGHT: LIVE PREVIEW */}
                    <div className="w-1/2 bg-[#FDFBF7] rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 p-3 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest sticky top-0 z-10">
                            <Eye className="w-3.5 h-3.5" /> Live Preview
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
                            {/* Simulate the Page Layout */}
                            <div className="max-w-2xl mx-auto">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5A7A6A] bg-[#E8F0E8] px-3 py-1 rounded-full mb-6 inline-block">
                                    {category}
                                </span>

                                <h1 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] tracking-tighter leading-tight mb-8">
                                    {title || "Your Title Here"}
                                </h1>

                                {(heroImageUrl || imageUrl) && (
                                    <div className="aspect-video bg-gray-200 rounded-2xl mb-10 overflow-hidden relative">
                                        <Image
                                            src={heroImageUrl || imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{ __html: content || "<p>Start typing to see content...</p>" }}
                                />

                                {selectedProductId && (
                                    <div className="mt-12 p-6 bg-[#F3F1ED] rounded-2xl text-center border border-[#E8E6E2] opacity-70">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Linked Product Preview</p>
                                        <p className="font-heading text-xl text-[#2D3A3A]">
                                            {products.find(p => p.id === selectedProductId)?.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
