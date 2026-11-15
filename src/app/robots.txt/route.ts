/**
 * robots.txt as a route, because Next's robots.ts has no field for Content-Signal
 * (https://contentsignals.org): search results and AI answers that use the pages
 * are allowed, training AI models on them is not.
 */

export const dynamic = 'force-static';

const ROBOTS_TXT = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
Disallow: /api/

User-Agent: Mediapartners-Google
Allow: /

Sitemap: https://calendarsolunar.ro/sitemap.xml
`;

export function GET() {
    return new Response(ROBOTS_TXT, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
