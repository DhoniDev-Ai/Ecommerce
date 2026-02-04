import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { WellnessGoals } from "@/components/home/WellnessGoals";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { IngredientTransparency } from "@/components/home/IngredientTransparency";
import { InstagramCommunity } from "@/components/home/InstagramCommunity";
import { AIAssistantTeaser } from "@/components/home/AIAssistantTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { createClient } from '@/lib/supabase/server';
import { getProductStats } from "@/actions/store/stats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ayuniv | Begin Your Ritual",
  description: "A sanctuary of cold-pressed purity. Discover curated wellness boxes, herbal elixirs, and ancient rituals crafted for modern vitality.",
  alternates: {
    canonical: 'https://ayuniv.com',
  },
};

export default async function Home() {
  const supabase = await createClient(); // Use server client

  // Fetch products on the SERVER before rendering
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  // .limit(3); // Don't limit yet, we need to sort by sales first

  const stats = await getProductStats();

  const sortedData = data?.sort((a: any, b: any) => {
    const salesA = stats[a.id] || 0;
    const salesB = stats[b.id] || 0;
    return salesB - salesA; // Descending
  }) || [];

  const products = sortedData.slice(0, 3).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    image_urls: p.image_urls || [],
    category: p.category,
    stock_quantity: p.stock_quantity || 0,
    ingredients: p.ingredients || [],
    benefits: p.benefits || [],
    wellness_goals: p.wellness_goals || [],
    created_at: p.created_at,
    is_on_sale: p.is_on_sale || false,
    sale_price: p.sale_price,
    sale_badge_text: p.sale_badge_text,
    comparison_price: p.comparison_price,
  })) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ayuniv Sanctuary",
    "url": "https://ayuniv.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ayuniv.com/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="grow">
        <Hero />
        <FeaturedProducts products={products} stats={stats} />
        <WellnessGoals />
        <TrustSection />
        <IngredientTransparency />
        <InstagramCommunity />
        <AIAssistantTeaser />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}

// Revalidate every hour since inventory/prices don't change minutely
export const revalidate = 3600;
