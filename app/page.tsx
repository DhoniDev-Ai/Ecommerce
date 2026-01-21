import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { WellnessGoals } from "@/components/home/WellnessGoals";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { IngredientTransparency } from "@/components/home/IngredientTransparency";
import { InstagramCommunity } from "@/components/home/InstagramCommunity";
import { AIAssistantTeaser } from "@/components/home/AIAssistantTeaser";
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (no 'use client')
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  // Fetch products on the SERVER before rendering
  const { data } = await supabase
    .from('products')
    .select('*')
    .limit(3);

  const products = data?.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    image_urls: p.image_urls || [],
    category: p.category,
    stock: p.stock_quantity || 0,
    ingredients: p.ingredients || [],
    benefits: p.benefits || [],
    wellness_goals: p.wellness_goals || [],
    created_at: p.created_at,
  })) || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="grow">
        <Hero />
        <TrustSection />
        <WellnessGoals />
        <FeaturedProducts products={products} />
        <IngredientTransparency />
        <InstagramCommunity />
        <AIAssistantTeaser />
      </main>

      <Footer />
    </div>
  );
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;
