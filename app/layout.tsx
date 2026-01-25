import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/layout/CartSidebar";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ayuniv.com"),
  title: {
    default: "Ayuniv | Natural Juice & Wellness",
    template: "%s | Ayuniv"
  },
  description: "Experience the purity of nature with Ayuniv. Cold-pressed elixirs, organic blends, and wellness rituals designed for your vitality.",
  keywords: ["organic juice", "wellness", "cold-pressed", "ayurveda", "natural health", "detox", "immunity"],
  authors: [{ name: "Ayuniv Team" }],
  creator: "Ayuniv",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ayuniv.com",
    title: "Ayuniv | Natural Juice & Wellness",
    description: "Experience the purity of nature with Ayuniv. Cold-pressed elixirs for your daily ritual.",
    siteName: "Ayuniv",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists or use a product image
        width: 1200,
        height: 630,
        alt: "Ayuniv Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayuniv | Natural Juice & Wellness",
    description: "Pure, cold-pressed wellness elixirs.",
    creator: "@ayuniv",
    images: ["/assets/logo_1by1.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#5A7A6A",
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
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
