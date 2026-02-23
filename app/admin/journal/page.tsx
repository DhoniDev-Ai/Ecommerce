"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft, Eye, Save, Image as ImageIcon, Link as LinkIcon,
    Plus, Pencil, Trash2, X, ArrowLeft, Search, Upload, Loader2
} from "lucide-react";
import imageCompression from 'browser-image-compression';

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

export default function AdminJournalPage() {
    // --- VIEW STATE ---
    const [view, setView] = useState<"list" | "editor">("list");
    const [editingId, setEditingId] = useState<string | null>(null);

    // --- POST LIST ---
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingPosts, setLoadingPosts] = useState(true);

    // --- EDITOR FORM ---
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("Wellness");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [heroImageUrl, setHeroImageUrl] = useState("");

    // --- PRODUCT LINKING ---
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>("");

    // --- STATUS ---
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [uploadingCard, setUploadingCard] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);

    // --- IMAGE UPLOAD ---
    const uploadImage = async (rawFile: File, target: "card" | "hero") => {
        const isCard = target === "card";
        isCard ? setUploadingCard(true) : setUploadingHero(true);

        try {
            // Compress the image before uploading
            const options = {
                maxSizeMB: 0.8, // Limit file size to 800KB max
                maxWidthOrHeight: 1920, // Max dimension
                useWebWorker: true,
            };
            const file = await imageCompression(rawFile, options);

            const ext = file.name.split(".").pop() || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const filePath = `journal/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("journal-images")
                .upload(filePath, file, { cacheControl: "3600", upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("journal-images")
                .getPublicUrl(filePath);

            if (isCard) setImageUrl(publicUrl);
            else setHeroImageUrl(publicUrl);
        } catch (err: any) {
            alert("Upload failed: " + err.message);
        } finally {
            isCard ? setUploadingCard(false) : setUploadingHero(false);
        }
    };

    // --- FETCH POSTS ---
    const fetchPosts = async () => {
        setLoadingPosts(true);
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("published_at", { ascending: false });
        if (data) setPosts(data as Post[]);
        setLoadingPosts(false);
    };

    useEffect(() => { fetchPosts(); }, []);

    // --- FETCH PRODUCTS ---
    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase.from("products").select("id, name");
            if (data) setProducts(data as any);
        }
        fetchProducts();
    }, []);

    // --- AUTO SLUG ---
    useEffect(() => {
        if (!editingId) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
        }
    }, [title, editingId]);

    // --- RESET FORM ---
    const resetForm = () => {
        setTitle(""); setSlug(""); setCategory("Wellness"); setExcerpt("");
        setContent(""); setImageUrl(""); setHeroImageUrl(""); setSelectedProductId("");
        setEditingId(null); setMessage("");
    };

    // --- LOAD POST FOR EDITING ---
    const loadPost = (post: Post) => {
        setTitle(post.title);
        setSlug(post.slug);
        setCategory(post.category);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setImageUrl(post.image_url);
        setHeroImageUrl(post.hero_image_url || "");
        setSelectedProductId(post.related_product_id || "");
        setEditingId(post.id);
        setView("editor");
        setMessage("");
    };

    // --- CREATE NEW ---
    const startNew = () => {
        resetForm();
        setView("editor");
    };

    // --- SUBMIT (CREATE OR UPDATE) ---
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMessage("");

        const payload = {
            title,
            slug,
            category,
            excerpt,
            content,
            image_url: imageUrl,
            hero_image_url: heroImageUrl || null,
            related_product_id: selectedProductId || null,
        } as any;

        try {
            if (editingId) {
                // UPDATE
                const { error } = await supabase
                    .from("posts")
                    .update(payload)
                    .eq("id", editingId);
                if (error) throw error;
                setMessage("✅ Post updated successfully!");
            } else {
                // CREATE
                payload.published_at = new Date().toISOString();
                const { error } = await supabase.from("posts").insert(payload);
                if (error) throw error;
                setMessage("✅ Post published successfully!");
            }
            await fetchPosts();
        } catch (err: any) {
            setMessage("❌ Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE ---
    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("posts").delete().eq("id", id);
            if (error) throw error;
            setDeleteConfirm(null);
            await fetchPosts();
            if (editingId === id) {
                resetForm();
                setView("list");
            }
        } catch (err: any) {
            alert("Delete failed: " + err.message);
        }
    };

    // --- FILTERED POSTS ---
    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // =========================================================================
    //  RENDER: LIST VIEW
    // =========================================================================
    if (view === "list") {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </Link>
                        <h1 className="text-xl font-bold font-juana text-gray-900">Journal Posts</h1>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-mono">
                            {posts.length} posts
                        </span>
                    </div>
                    <button
                        onClick={startNew}
                        className="bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-green-800 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Post
                    </button>
                </header>

                <div className="max-w-5xl mx-auto p-8">
                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts by title or category..."
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                        />
                    </div>

                    {/* Posts Grid */}
                    {loadingPosts ? (
                        <div className="text-center py-20 text-gray-400">Loading posts...</div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 mb-4">No posts found.</p>
                            <button onClick={startNew} className="text-green-700 font-bold text-sm hover:underline">
                                Create your first post →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredPosts.map(post => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md overflow-hidden"
                                >
                                    <div className="flex items-center gap-5 p-5">
                                        {/* Thumbnail */}
                                        <div className="w-20 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
                                            {post.image_url ? (
                                                <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-heading text-base font-bold text-gray-900 truncate">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                                    {post.category}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(post.published_at).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </span>
                                                <span className="text-xs text-gray-300 font-mono truncate max-w-[200px]">
                                                    /{post.slug}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link
                                                href={`/journal/${post.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                                title="View live"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => loadPost(post)}
                                                className="p-2 hover:bg-blue-50 rounded-full transition-colors text-gray-400 hover:text-blue-600"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>

                                            {deleteConfirm === post.id ? (
                                                <div className="flex items-center gap-1 bg-red-50 rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="text-red-600 text-xs font-bold hover:underline"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="p-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(post.id)}
                                                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // =========================================================================
    //  RENDER: EDITOR VIEW (Create / Edit) with Live Preview
    // =========================================================================
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => { setView("list"); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <h1 className="text-xl font-bold font-juana text-gray-900">
                            {editingId ? "Edit Post" : "New Journal Entry"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {message && (
                            <span className={`text-sm font-medium animate-fade-in ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
                                {message}
                            </span>
                        )}
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading || !title.trim()}
                            className="bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-green-800 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : <><Save className="w-4 h-4" /> {editingId ? "Update Post" : "Publish Post"}</>}
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

                        {/* 2. Media — Upload */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Media</h2>

                            {/* Card Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Image</label>
                                {imageUrl ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                        <Image src={imageUrl} alt="Card" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <label className="cursor-pointer bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors">
                                                Replace
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0], "card"); }} />
                                            </label>
                                            <button onClick={() => setImageUrl("")} className="bg-red-500/90 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-600 transition-colors">Remove</button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 cursor-pointer transition-colors ${uploadingCard ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50/50'}`}>
                                        {uploadingCard ? <Loader2 className="w-6 h-6 text-green-600 animate-spin" /> : <Upload className="w-6 h-6 text-gray-400" />}
                                        <span className="text-xs text-gray-500 font-medium">{uploadingCard ? "Uploading..." : "Click to upload card image"}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0], "card"); }} />
                                    </label>
                                )}
                            </div>

                            {/* Hero Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image <span className="text-gray-400 font-normal">(Optional — defaults to card image)</span></label>
                                {heroImageUrl ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                        <Image src={heroImageUrl} alt="Hero" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <label className="cursor-pointer bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors">
                                                Replace
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0], "hero"); }} />
                                            </label>
                                            <button onClick={() => setHeroImageUrl("")} className="bg-red-500/90 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-600 transition-colors">Remove</button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 cursor-pointer transition-colors ${uploadingHero ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50/50'}`}>
                                        {uploadingHero ? <Loader2 className="w-5 h-5 text-green-600 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400" />}
                                        <span className="text-xs text-gray-500 font-medium">{uploadingHero ? "Uploading..." : "Click to upload hero image"}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0], "hero"); }} />
                                    </label>
                                )}
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

                        {/* 4. Excerpt */}
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
