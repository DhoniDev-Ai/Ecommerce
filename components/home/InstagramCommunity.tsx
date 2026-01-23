"use client";

import { motion } from "@/lib/framer";
import { Instagram, ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/utils/cn";

// Premium placeholder data - Replace with your actual post images
const communityPosts = [
    {
        id: 1,
        url: "https://www.instagram.com/reel/DTvGSxiExlW/",
        image: "/assets/post3.png",
        type: "image",
        size: "square", // 1:1
    },
    {
        id: 2,
        url: "https://www.instagram.com/reel/DP9WchKknhZ",
        image: "/assets/post2.png",
        type: "video",
        size: "tall", // 4:5
    },
    {
        id: 3,
        url: "https://www.instagram.com/p/DSrGFUgkicg/",
        image: "/assets/post1.png",
        type: "video",
        size: "square", // 1:1
    },

    {
        id: 4,
        url: "https://www.instagram.com/reel/DP_uG0sEiMg/",
        image: "/assets/post4.png",
        type: "image",
        size: "tall", // 4:5
    },
];

export function InstagramCommunity() {
    return (
        <section className="relative py-16 lg:py-12 bg-[#FDFBF7] overflow-hidden">
            {/* Consistent Digital Grain Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10 mx-auto max-w-7xl px-8 lg:px-12">

                {/* Header: Editorial & Aligned */}
                <div className="flex md:flex-row justify-between items-end mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-md"
                    >
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold mb-4">
                            The Community
                        </p>
                        <h2 className="font-heading text-4xl lg:text-5xl text-[#2D3A3A] tracking-tighter leading-none">
                            Inside the <br />
                            <span className="italic font-serif font-light text-[#5A7A6A]">Circle.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <a
                            href="https://www.instagram.com/ayuniv_official/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-[#5A7A6A] border-b border-[#5A7A6A]/10 pb-1 hover:border-[#5A7A6A] transition-all"
                        >
                            <Instagram className="w-3.5 h-3.5" />
                            @ayuniv_official
                            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </motion.div>
                </div>

                {/* Grid: Masonry-style with Vertical Rhythm */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 items-start">
                    {communityPosts.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "group relative block overflow-hidden rounded-[2rem] bg-[#F3F1ED] transition-all duration-700 hover:shadow-2xl",
                                post.size === "tall" ? "aspect-[4/5]" : "aspect-square",
                                index % 2 === 1 ? "lg:mt-12" : "" // Staggered laptop rhythm
                            )}
                        >
                            {/* Post Image with Hover Zoom */}
                            <img
                                src={post.image}
                                alt="Community Moment"
                                className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                            />

                            {/* Type Indicator (Play for Video) */}
                            {post.type === "video" && (
                                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                    <Play className="w-3 h-3 fill-current" />
                                </div>
                            )}

                            {/* Minimal Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
                                <Instagram className="text-white w-8 h-8 opacity-60" />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Subtext/Join CTA */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-[#7A8A8A] font-light italic">
                        Growing since 2025. Share your ritual with <span className="text-[#5A7A6A] font-medium">#AyunivWellness</span>
                    </p>
                </div>
            </div>
        </section>
    );
}