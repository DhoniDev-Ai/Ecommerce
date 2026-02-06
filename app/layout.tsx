import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { AIProvider } from "@/context/AIContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { Analytics } from "@vercel/analytics/next"
import NextTopLoader from 'nextjs-toploader';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const juana = Cormorant_Garamond({
  variable: "--font-juana",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ayuniv",
  "url": "https://ayuniv.com",
  "logo": "https://ayuniv.com/assets/logo_1by1.png",
  "sameAs": [
    "https://instagram.com/ayuniv.wellness",
    "https://twitter.com/ayuniv"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9999999999",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": "en"
  }
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ayuniv.com"),
  title: {
    default: "Ayuniv | The Sanctuary of Natural Wellness",
    template: "%s | Ayuniv Sanctuary"
  },
  description: "Experience the purity of nature with Ayuniv. Handcrafted cold-pressed elixirs, ancient Ayurvedic rituals, and holistic wellness solutions designed to restore your vitality.",
  keywords: ["organic juice", "ayurveda", "cold-pressed", "wellness sanctuary", "natural health", "detox rituals", "immunity boosters", "fresh juices india"],
  authors: [{ name: "Ayuniv Artisans" }],
  creator: "Ayuniv",
  publisher: "Ayuniv Wellness",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ayuniv.com",
    siteName: "Ayuniv Sanctuary",
    title: "Ayuniv | The Sanctuary of Natural Wellness",
    description: "Reclaim your harmony with nature. Pure, preservative-free elixirs and wellness rituals.",
    images: [
      {
        url: "/assets/Logo_nav.png",
        width: 1200,
        height: 630,
        alt: "Ayuniv Wellness Sanctuary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayuniv | Natural Wellness & Elixirs",
    description: "Pure, cold-pressed wellness elixirs. Nature's wisdom, bottled.",
    creator: "@ayuniv",
    images: ["/assets/Logo_nav.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "verification_token", // Placeholder
  },
  alternates: {
    canonical: 'https://ayuniv.com',
  },
};

export const viewport = {
  themeColor: "#5A7A6A",
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${juana.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextTopLoader
          color="#5A7A6A"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #5A7A6A,0 0 5px #5A7A6A"
        />
        <Analytics />
        <AuthProvider>
          <AIProvider>
            <CartProvider>
              {children}
              <ChatWidget />
              <CartSidebar />
            </CartProvider>
          </AIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
