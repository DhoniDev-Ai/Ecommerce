import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JournalFeed } from "@/components/journal/JournalFeed";
import { getPosts, Post } from "@/lib/supabase/journal";

export const dynamic = 'force-dynamic';



export default async function JournalPage() {

    // Server-side fetch (Cached)
    const posts = await getPosts();

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Header />
            <main className="grow pt-40 pb-24 relative z-10">
                <JournalFeed initialPosts={posts} />
            </main>
            <Footer />
        </div>
    );
}