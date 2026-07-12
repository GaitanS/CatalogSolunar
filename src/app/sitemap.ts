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

    const now = new Date();
    // Truncate to the day: honest lastmod for pages whose data refreshes daily
    // (the actual time-of-day churn would make Google ignore the signal).
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Stable date for evergreen/static pages so their lastmod doesn't change
    // on every crawl (which trains Google to ignore it).
    const evergreen = new Date(now.getFullYear(), 0, 1);

    const currentMonthIdx = now.getMonth();
    const nextMonthIdx = (currentMonthIdx + 1) % 12;
    const isCurrentOrNextMonth = (monthIndex: number) => monthIndex === currentMonthIdx || monthIndex === nextMonthIdx;

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: today, changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/azi`, lastModified: today, changeFrequency: 'daily', priority: 0.95 },
        { url: `${baseUrl}/lunar`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/prognoza`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/specii`, lastModified: today, changeFrequency: 'weekly', priority: 0.85 },
        { url: `${baseUrl}/rasarit-apus-soare`, lastModified: today, changeFrequency: 'daily', priority: 0.85 },
        { url: `${baseUrl}/despre`, lastModified: evergreen, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: evergreen, changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/confidentialitate`, lastModified: evergreen, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${baseUrl}/termeni`, lastModified: evergreen, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${baseUrl}/cookies`, lastModified: evergreen, changeFrequency: 'yearly', priority: 0.2 },
    ];

    // City pages — show today's solunar data
    const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
        url: `${baseUrl}/${city.slug}`,
        lastModified: today,
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Species pages
    const speciesPages: MetadataRoute.Sitemap = species.map((s) => ({
        url: `${baseUrl}/${s.slug}`,
        lastModified: today,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }));

    const seoLandingPages: MetadataRoute.Sitemap = [
        ...monthlySeoLandingPages.map((page) => {
            const priority = isCurrentOrNextMonth(page.monthIndex) ? 0.98 : 0.85;
            // Current/next month change daily; past months are settled.
            const isPast = page.year < now.getFullYear() || (page.year === now.getFullYear() && page.monthIndex < currentMonthIdx);
            const changeFrequency: 'monthly' | 'daily' = isPast ? 'monthly' : 'daily';
            return {
                url: `${baseUrl}/${page.slug}`,
                lastModified: isPast ? evergreen : today,
                changeFrequency,
                priority,
            };
        }),
        ...annualSeoLandingPages.map((page) => ({
            url: `${baseUrl}/${page.slug}`,
            lastModified: today,
            changeFrequency: 'weekly' as const,
            priority: page.slug === 'solunar-2026' ? 0.97 : 0.93,
        })),
    ];

    // Blog articles — use the real edit date (updated ?? published)
    const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date((article as { updated?: string }).updated ?? article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Fishing locations
    const locations = getAllLocations();
    const locationIndexPage: MetadataRoute.Sitemap = [
        { url: `${baseUrl}/locuri-pescuit`, lastModified: evergreen, changeFrequency: 'weekly', priority: 0.9 },
    ];
    const locationPages: MetadataRoute.Sitemap = locations.map((loc) => ({
        url: `${baseUrl}/locuri-pescuit/${loc.slug}`,
        lastModified: today,
        changeFrequency: 'daily' as const,
        priority: 0.85,
    }));

    // County index pages — target "balti pescuit [judet]" queries
    const countyPages: MetadataRoute.Sitemap = getAllCountySlugs().map((c) => ({
        url: `${baseUrl}/locuri-pescuit/judet/${c.slug}`,
        lastModified: today,
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
