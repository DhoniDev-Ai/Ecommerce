import { Metadata } from "next";
import { AboutClient } from "@/components/about/AboutClient";

export const metadata: Metadata = {
    title: "Our Story | Ayuniv - Ancient Wisdom, Bottled",
    description: "Founded in December 2025 in majestic Jaipur. Ayuniv brings you Himalayan sourced, cold-pressed wellness elixirs. Pure, potent, and scientifically verified.",
    openGraph: {
        title: "Ayuniv - The Intelligence of Nature",
        description: "From the Pink City to the world. Discover the story behind our cold-pressed, bio-active wellness rituals.",
        images: ['/assets/about_1.png'],
        type: 'website',
    }
};

export default function AboutPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ayuniv',
        url: 'https://ayuniv.com',
        logo: 'https://ayuniv.com/assets/logo.png',
        foundingDate: '2025-12-01',
        description: 'A premium Ayurvedic wellness brand blending ancient wisdom with modern cold-press technology.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jaipur',
            addressRegion: 'Rajasthan',
            addressCountry: 'India'
        },
        founder: {
            '@type': 'Person',
            name: 'Ayuniv Founders'
        },
        sameAs: [
            'https://www.instagram.com/ayuniv_official',
            'https://facebook.com/ayuniv_official'
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutClient />
        </>
    );
}