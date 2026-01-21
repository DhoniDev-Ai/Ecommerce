"use client";

import { useParams, notFound } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, ArrowRight, Share2, Bookmark, Clock } from "lucide-react";
import { cn } from "@/utils/cn";

// RICH MOCK DATA STORE
// In a real app, this content would come from a CMS or Database (Supabase)
const blogDatabase: Record<string, {
    title: string;
    subtitle?: string;
    category: string;
    readTime: string;
    heroImage: string;
    publishDate: string;
    contentBlocks: { type: "p" | "h2" | "quote" | "list"; text: string; items?: string[] }[];
    recommendedProduct?: {
        name: string;
        image: string;
        slug: string;
    };
}> = {
    // 1. ALCHEMY OF SEA BUCKTHORN (Health)
    "alchemy-of-sea-buckthorn": {
        title: "The Alchemy of Sea Buckthorn",
        subtitle: "Himalayan Gold",
        category: "Biological Intelligence",
        readTime: "8 Min Read",
        heroImage: "/assets/blog-hero-1.jpg",
        publishDate: "January 20, 2026",
        contentBlocks: [
            {
                type: "p",
                text: "In the high-altitude valleys of the Himalayas, where the air is thin and the sun is fierce, grows a berry of legendary potency. For centuries, the people of these regions have harvested Sea Buckthorn, calling it 'Himalayan Gold'—not for its color, but for its life-sustaining properties."
            },
            {
                type: "h2",
                text: "The Rare Sigma-7 Nutrient"
            },
            {
                type: "p",
                text: "What makes Sea Buckthorn truly unique isn't just its Vitamin C content (which is 12x that of an orange), but its rare concentration of Omega-7 fatty acids. This 'elusive' fatty acid is a vital component for skin health, mucosal lining repair, and cellular hydration. At Ayuniv, we source our berries from certified organic farms in the Spiti Valley to ensure that every drop of pulp retains its enzymatic life."
            },
            {
                type: "quote",
                text: "Nature doesn't rush, yet everything is accomplished. Our cold-press process honors this patience, extracting nectar without heat to preserve the berry's soul."
            },
            {
                type: "h2",
                text: "Our Extraction Ritual"
            },
            {
                type: "p",
                text: "Unlike industrial juices that use high heat pasteurization, our Jaipur studio utilizes a gentle, slow-press method. We apply 10 tons of hydraulic pressure to extract the juice, ensuring that the delicate lipid layers remain intact. This results in a bioavailable elixir that your body recognizes not as a supplement, but as pure, living food."
            }
        ],
        recommendedProduct: {
            name: "Sea Buckthorn Pulp",
            image: "/assets/sea_buckthorn_pulp_500ml.png",
            slug: "sea-buckthorn-pulp"
        }
    },

    // 2. MORNING RITUALS (Rituals)
    "morning-rituals-vitality": {
        title: "Morning Rituals for Vitality",
        subtitle: "Awaken Agni",
        category: "Daily Rituals",
        readTime: "6 Min Read",
        heroImage: "/assets/blog-2.png",
        publishDate: "January 18, 2026",
        contentBlocks: [
            {
                type: "p",
                text: "The first hour of your day sets the biological tempo for the next twenty-three. In Ayurveda, this time represents 'Brahma Muhurta'—a window of heightened cosmic awareness. How we inhabit these moments determines our clarity, digestion, and energy."
            },
            {
                type: "h2",
                text: "Hydration Before Caffeination"
            },
            {
                type: "p",
                text: "Before the acidity of coffee touches your palate, the body craves alkalinity. We recommend starting with 500ml of warm water infused with a squeeze of lime. This simple act flushes the lymphatic system, clears toxins (Ama) accumulated during sleep, and ignites your Agni (digestive fire) without shocking the adrenals."
            },
            {
                type: "quote",
                text: "A ritual is not a routine. A routine is something you have to do; a ritual is something you get to do. Shift your mindset from obligation to adoration."
            },
            {
                type: "h2",
                text: "The Grounding Practice"
            },
            {
                type: "p",
                text: "Spend just five minutes with your feet on the earth or sitting in silence. In our hyper-connected 2026, this analog connection is the ultimate luxury. Follow this with a nutrient-dense elixir like our Green Goddess Cleanse to flood your cells with chlorophyll, effectively 'plugging in' to the sun's energy for the day ahead."
            }
        ],
        recommendedProduct: {
            name: "Green Goddess Cleanse",
            image: "/assets/sea_buckthorn_pulp_300ml.png",
            slug: "green-goddess-cleanse"
        }
    },

    // 3. BLOOD PURIFIERS (Blood Purifiers)
    "blood-purifiers-guide": {
        title: "Clarity From Within",
        subtitle: "The Blood Purifiers",
        category: "Biological Intelligence",
        readTime: "9 Min Read",
        heroImage: "/assets/blog-3.png",
        publishDate: "January 15, 2026",
        contentBlocks: [
            {
                type: "p",
                text: "True radiance isn't painted on; it surfaces from the bloodstream. When our blood is congested with toxins from processed foods and pollution, our skin dulls and our energy stagnates. Nature provides powerful botanicals that act as 'rivers' to wash away this debris."
            },
            {
                type: "h2",
                text: "The Bitter Truth"
            },
            {
                type: "p",
                text: "In modern diets, we've largely eliminated the 'bitter' taste profile, yet this is the exact flavor that stimulates the liver to detoxify. Ingredients like Neem, Manjistha, and Karela are revered in Ayurveda not for their culinary delight, but for their potent ability to scrub the blood clean."
            },
            {
                type: "h2",
                text: "Signs of Toxic Buildup"
            },
            {
                type: "list",
                text: "Listen to your body's subtle signals before they become loud symptoms:",
                items: [
                    "Persistent brain fog or lethargy upon waking",
                    "Unexplained skin breakouts or dullness",
                    "Digestive sluggishness or bloating after meals",
                    "Coated tongue in the morning"
                ]
            },
            {
                type: "p",
                text: "Our Curated Cleanses introduce these bitter principles in balanced formulations, paired with cooling herbs to ensure the detoxification process is gentle, consistent, and restorative rather than depleting."
            }
        ],
        recommendedProduct: {
            name: "Neem & Giloy Elixir",
            image: "/assets/sea_buckthorn_pulp_500ml.png",
            slug: "neem-giloy-elixir"
        }
    },

    // 4. ART OF SLOW LIVING (Wellness)
    "art-of-slow-living": {
        title: "The Art of Slow Living",
        subtitle: "Why We Hand-Pour",
        category: "Mindful Living",
        readTime: "5 Min Read",
        heroImage: "/assets/blog-hero-1.jpg", // Reusing hero for now
        publishDate: "January 12, 2026",
        contentBlocks: [
            {
                type: "p",
                text: "In an era of AI automation and instant delivery, doing things 'the hard way' is a radical act. At Ayuniv, we embrace the philosophy of slow living not just as a lifestyle choice, but as a manufacturing standard. Speed destroys nutrients; patience preserves them."
            },
            {
                type: "h2",
                text: "Energy Transfer"
            },
            {
                type: "p",
                text: "We believe in the concept of 'Prana'—life force. When a machine violently processes an ingredient, its Prana is diminished. When a human hand intentionally pours, seals, and packages a bottle, there is an energetic transfer of care. You can taste this silence in every sip."
            },
            {
                type: "quote",
                text: "Slowing down allows us to savor the richness of life. We bottle this stillness so you can drink it amidst the chaos."
            },
            {
                type: "p",
                text: "From our small-batch sourcing in local Rajasthan markets to our manual quality checks, we refuse to scale at the cost of soul. This is not just juice; it is a protest against the mindless acceleration of our world."
            }
        ],
        recommendedProduct: {
            name: "Calm Mind Blend",
            image: "/assets/sea_buckthorn_pulp_300ml.png", // Placeholder
            slug: "calm-mind-blend"
        }
    }
};

const suggestedPosts = [
    { title: "The Circadian Sip", cat: "Rituals", img: "/assets/blog-1.png", slug: "morning-rituals-vitality" },
    { title: "Soil to Spirit", cat: "Sourcing", img: "/assets/blog-3.png", slug: "alchemy-of-sea-buckthorn" },
    { title: "Autumn Cleansing", cat: "Health", img: "/assets/blog-1.png", slug: "blood-purifiers-guide" }
];

export default function DynamicJournalReader() {
    const params = useParams();
    const slug = params?.slug as string;

    // Fallback to the first post if slug not found (for dev/demo purposes) 
    // or handle 404 properly in production
    const activePost = blogDatabase[slug] || blogDatabase["alchemy-of-sea-buckthorn"];

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-[#5A7A6A]/10">
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
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5A7A6A] bg-[#E8F0E8] px-3 py-1 rounded-full">{activePost.category}</span>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#9AA09A]">
                                <Clock className="w-3.5 h-3.5" /> {activePost.readTime}
                            </div>
                        </div>

                        <h1 className="font-heading text-5xl lg:text-7xl text-[#2D3A3A] tracking-tighter leading-[0.95] mb-10">
                            {activePost.title} <br />
                            <span className="italic font-serif font-light text-[#5A7A6A]">{activePost.subtitle}</span>
                        </h1>
                    </motion.div>
                </article>

                {/* 2. CINEMATIC HERO (16:9) */}
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-46 mb-24">
                    <div className="relative aspect-[16/9] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/[0.05]">
                        <img
                            src={activePost.heroImage}
                            alt={activePost.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                </div>

                {/* 3. CONTENT CORE */}
                <div className="mx-auto max-w-3xl px-8 lg:px-12">
                    <div className="prose prose-zinc prose-lg max-w-none 
                        prose-p:text-[#6A7A7A] prose-p:font-light prose-p:leading-relaxed prose-p:mb-10 prose-p:text-lg lg:prose-p:text-xl
                        prose-headings:font-heading prose-headings:text-[#2D3A3A] prose-headings:mt-16 prose-headings:mb-8 prose-headings:text-3xl lg:prose-headings:text-4xl
                        prose-blockquote:border-l-2 prose-blockquote:border-[#5A7A6A] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-serif prose-blockquote:text-[#5A7A6A] prose-blockquote:my-16">

                        {/* Dynamic Content Rendering */}
                        {activePost.contentBlocks.map((block, index) => {
                            if (block.type === 'p') return <p key={index}>{block.text}</p>;
                            if (block.type === 'h2') return <h2 key={index}>{block.text}</h2>;
                            if (block.type === 'quote') return <blockquote key={index}>{block.text}</blockquote>;
                            if (block.type === 'list' && block.items) return (
                                <div key={index} className="my-10 p-8 bg-[#F3F1ED] rounded-3xl">
                                    <h4 className="font-heading text-xl mb-6 text-[#2D3A3A]">{block.text}</h4>
                                    <ul className="space-y-4">
                                        {block.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[#6A7A7A] font-light">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#5A7A6A] mt-2.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}

                        {/* PREMIUM PRODUCT CALLOUT - Only if product exists */}
                        {activePost.recommendedProduct && (
                            <div className="my-24 p-10 lg:p-16 rounded-[2.5rem] bg-[#2D3A3A] text-white flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                <div className="relative z-10 w-40 lg:w-56 group-hover:scale-105 transition-transform duration-500">
                                    <img src={activePost.recommendedProduct.image} alt={activePost.recommendedProduct.name} className="w-full drop-shadow-2xl" />
                                </div>
                                <div className="relative z-10 flex-1 text-center lg:text-left">
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#5A7A6A] font-bold">The Ritual</span>
                                    <h3 className="font-heading text-3xl lg:text-4xl text-white mt-4 mb-6 tracking-tighter">Experience {activePost.recommendedProduct.name}</h3>
                                    <Link href={`/products/${activePost.recommendedProduct.slug}`} className="inline-flex items-center gap-4 px-10 py-5 bg-[#5A7A6A] text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#6A8A7A] transition-all">
                                        Shop the Elixir <ShoppingBag className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className="mt-24 pt-12 border-t border-[#E8E6E2] flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-widest text-[#9AA09A] font-bold italic">Published on {activePost.publishDate}</p>
                        <div className="flex gap-8">
                            <button className="text-[10px] uppercase tracking-widest font-bold text-[#7A8A8A] hover:text-[#5A7A6A] flex items-center gap-2 transition-colors"><Share2 className="w-3 h-3" /> Share</button>
                            <button className="text-[10px] uppercase tracking-widest font-bold text-[#7A8A8A] hover:text-[#5A7A6A] flex items-center gap-2 transition-colors"><Bookmark className="w-3 h-3" /> Save</button>
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
                            {suggestedPosts.map((post, i) => (
                                <Link key={i} href={`/journal/${post.slug || '#'}`} className="group block">
                                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl shadow-black/[0.02] bg-white">
                                        <img src={post.img} alt="" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#7A8B7A] font-bold">{post.cat}</span>
                                    <h3 className="font-heading text-2xl text-[#2D3A3A] mt-4 group-hover:text-[#5A7A6A] transition-colors">{post.title}</h3>
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