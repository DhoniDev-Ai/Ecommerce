import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Ayuniv - Premium Healthcare & Wellness',
        short_name: 'Ayuniv',
        description: 'Holistic healthcare and wellness solutions for a balanced life.',
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
