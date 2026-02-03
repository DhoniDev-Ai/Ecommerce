import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ayuniv.com'; // Fallback

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/dashboard/',
                '/api/',
                '/checkout/',
                '/auth/'
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
