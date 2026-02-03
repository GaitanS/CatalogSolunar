import { MetadataRoute } from 'next';
import { getAllArticles } from '@/data/blogArticles';
import { getAllCities } from '@/data/cities';
import { getAllSpecies } from '@/data/species';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://calendarsolunar.ro';
    const articles = getAllArticles();
    const cities = getAllCities();
    const species = getAllSpecies();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/azi`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/despre`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/confidentialitate`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/termeni`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/cookies`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // City pages
    const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
        url: `${baseUrl}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Species pages
    const speciesPages: MetadataRoute.Sitemap = species.map((s) => ({
        url: `${baseUrl}/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }));

    // Blog articles
    const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...cityPages, ...speciesPages, ...articlePages];
}
