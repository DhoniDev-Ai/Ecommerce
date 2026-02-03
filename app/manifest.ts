import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Ayuniv - Pure Himalayan Wellness',
        short_name: 'Ayuniv',
        description: 'Consciously curated Ayurvedic elixirs from the heart .',
        start_url: '/',
        display: 'standalone',
        background_color: '#FDFBF7',
        theme_color: '#5A7A6A',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
