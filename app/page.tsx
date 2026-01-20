import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Green Goddess Cleanse",
    description: "A powerful detox blend of kale, spinach, apple, and lemon. Restore your alkali balance.",
    price: 9.50,
    category: "Cleanse",
    image_urls: [],
    ingredients: ["Kale", "Spinach", "Apple", "Lemon"],
    benefits: ["Detox", "Energy"],
    stock_quantity: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sunrise Citrus Roots",
    description: "Energizing carrot, orange, and ginger blend. The perfect morning kick-starter.",
    price: 8.50,
    category: "Juice",
    image_urls: [],
    ingredients: ["Carrot", "Orange", "Ginger"],
    benefits: ["Immunity", "Vision"],
    stock_quantity: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Beet It Up",
    description: "Earthy beets mixed with sweet apple and refreshing cucumber.",
    price: 9.00,
    category: "Juice",
    image_urls: [],
    ingredients: ["Beetroot", "Apple", "Cucumber"],
    benefits: ["Stamina", "Blood Pressure"],
    stock_quantity: 100,
    created_at: new Date().toISOString(),
  }
];

export default function Home() {
  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      <Header />
      <main className="grow">
        <Hero />

        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-heading font-bold text-foreground sm:text-4xl">Our Favorites</h2>
              <p className="mt-4 text-lg text-foreground/70 font-body">
                Discover our most loved wellness elixirs, crafted for your health.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
