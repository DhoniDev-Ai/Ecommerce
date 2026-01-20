import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { WellnessGoals } from "@/components/home/WellnessGoals";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { IngredientTransparency } from "@/components/home/IngredientTransparency";
import { InstagramCommunity } from "@/components/home/InstagramCommunity";
import { AIAssistantTeaser } from "@/components/home/AIAssistantTeaser";
import { Product } from "@/types";

const featuredProducts: Product[] = [
  {
    id: "1",
    slug: "green-goddess-cleanse",
    name: "Green Goddess Cleanse",
    description:
      "A powerful detox blend of kale, spinach, apple, and lemon. Restore your natural balance.",
    price: 12.0,
    category: "Cleanse",
    image_urls: [],
    ingredients: ["Kale", "Spinach", "Apple", "Lemon", "Ginger"],
    benefits: ["Supports natural detox", "Gentle energy boost"],
    wellness_goals: ["Detox", "Energy"],
    stock: 100,
    is_featured: true,
    popularity_score: 95,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "sunrise-citrus-roots",
    name: "Sunrise Citrus Roots",
    description:
      "Energizing carrot, orange, and ginger blend. The perfect morning companion.",
    price: 11.0,
    category: "Juice",
    image_urls: [],
    ingredients: ["Carrot", "Orange", "Ginger", "Turmeric"],
    benefits: ["Supports immunity", "Natural vitamin C"],
    wellness_goals: ["Immunity", "Energy"],
    stock: 100,
    is_featured: true,
    popularity_score: 88,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "sea-buckthorn-elixir",
    name: "Sea Buckthorn Elixir",
    description:
      "Himalayan sea buckthorn with amla and honey. Ancient wisdom, modern wellness.",
    price: 14.0,
    category: "Wellness",
    image_urls: [],
    ingredients: ["Sea Buckthorn", "Amla", "Raw Honey", "Ginger"],
    benefits: ["Rich in antioxidants", "Supports overall wellness"],
    wellness_goals: ["Immunity", "Vitality"],
    stock: 50,
    is_featured: true,
    popularity_score: 92,
    created_at: new Date().toISOString(),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="grow">
        <Hero />
        <TrustSection />
        <WellnessGoals />
        <FeaturedProducts products={featuredProducts} />
        <IngredientTransparency />
        <InstagramCommunity />
        <AIAssistantTeaser />
      </main>

      <Footer />
    </div>
  );
}
