import { MetadataRoute } from 'next';
import { getAllArticles } from '@/data/blogArticles';
import { getAllCities } from '@/data/cities';
import { getAllSpecies } from '@/data/species';
import { getAllLocations, getAllCountySlugs } from '@/data/fishingLocations';
import { annualSeoLandingPages, monthlySeoLandingPages } from '@/data/seoLandingPages';

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
            url: `${baseUrl}/lunar`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
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

    const seoLandingPages: MetadataRoute.Sitemap = [
        ...monthlySeoLandingPages.map((page) => ({
            url: `${baseUrl}/${page.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: page.slug === 'solunar-mai-2026' ? 0.98 : 0.92,
        })),
        ...annualSeoLandingPages.map((page) => ({
            url: `${baseUrl}/${page.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: page.slug === 'solunar-pescuit-2026' ? 0.96 : 0.93,
        })),
    ];

    // Blog articles
    const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Fishing locations
    const locations = getAllLocations();
    const locationIndexPage: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/locuri-pescuit`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];
    const locationPages: MetadataRoute.Sitemap = locations.map((loc) => ({
        url: `${baseUrl}/locuri-pescuit/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.85,
    }));

    // County index pages — target "balti pescuit [judet]" queries
    const countyPages: MetadataRoute.Sitemap = getAllCountySlugs().map((c) => ({
        url: `${baseUrl}/locuri-pescuit/judet/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        ...staticPages,
        ...seoLandingPages,
        ...cityPages,
        ...speciesPages,
        ...articlePages,
        ...locationIndexPage,
        ...locationPages,
        ...countyPages,
    ];
}
