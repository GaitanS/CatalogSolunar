/** llms.txt (https://llmstxt.org): what the site is and which pages matter, for AI agents. */

import { getAllCities } from '@/data/cities';
import { annualSeoLandingPages, getAnnualCanonicalSlug, monthlySeoLandingPages } from '@/data/seoLandingPages';
import { getAllSpecies } from '@/data/species';
import { SITE_URL } from '@/lib/agentApi';

export const dynamic = 'force-static';

const link = (label: string, path: string, note?: string) => `- [${label}](${SITE_URL}${path})${note ? `: ${note}` : ''}`;

export function GET() {
    const annualHubs = annualSeoLandingPages.filter((page) => getAnnualCanonicalSlug(page) === page.slug);

    const text = [
        '# Calendar Solunar',
        '',
        '> Calendar solunar pentru pescuit în România: ratingul fiecărei zile (1-5), perioade majore și minore, faze lunare, răsărit și apus pentru orașele din România. Toate orele sunt în ora României (Europe/Bucharest).',
        '',
        'Datele sunt calculate astronomic: fazele Lunii după algoritmii lui Jean Meeus, soarele după algoritmul NOAA. Ratingul zilei crește cu cât ziua e mai aproape de luna nouă sau de luna plină (5/5 în jurul fazei). Perioadele majore (~2 ore) sunt centrate pe trecerea Lunii la meridian și la antimeridian, cele minore (~1 oră) pe răsăritul și apusul Lunii. Fără alt oraș, calculele sunt pentru București.',
        '',
        `Prima pagină, /azi, paginile lunare și paginile anuale au și versiune Markdown: trimiteți \`Accept: text/markdown\` sau adăugați \`.md\` la adresă (de exemplu ${SITE_URL}/solunar-noiembrie-2026.md).`,
        '',
        `Server MCP public, fără autentificare, doar citire (Streamable HTTP): ${SITE_URL}/mcp, cu uneltele get_solunar_day și get_best_fishing_days. Descriere: ${SITE_URL}/.well-known/mcp/server-card.json`,
        '',
        '## Instrumente',
        '',
        link('Solunar azi', '/azi', 'ratingul, perioadele majore și minore și faza Lunii pentru azi'),
        link('Prognoză 14 zile', '/prognoza', 'cea mai bună fereastră de pescuit pentru fiecare din următoarele 14 zile'),
        link('Calendar lunar', '/lunar', 'fazele Lunii, următoarea lună nouă și lună plină'),
        link('Răsărit și apus soare', '/rasarit-apus-soare', 'ore exacte pentru orașele din România'),
        '',
        '## Calendar solunar pe luni',
        '',
        ...monthlySeoLandingPages.map((page) => link(`Solunar ${page.monthName} ${page.year}`, `/${page.slug}`, page.description)),
        '',
        '## Calendar solunar pe an',
        '',
        ...annualHubs.map((page) => link(page.title, `/${page.slug}`, page.description)),
        '',
        '## Orașe',
        '',
        ...getAllCities().map((city) => link(`Solunar ${city.name}`, `/${city.slug}`, city.description)),
        '',
        '## Specii',
        '',
        link('Specii de pești', '/specii', 'sezon, ore optime și fază lunară pentru fiecare specie'),
        ...getAllSpecies().map((species) => link(`Pescuit ${species.name.toLowerCase()}`, `/${species.slug}`)),
        '',
        '## Despre site',
        '',
        link('Despre proiect', '/despre'),
        link('Contact', '/contact'),
        link('Termeni și condiții', '/termeni'),
        link('Confidențialitate', '/confidentialitate'),
        '',
        '## Optional',
        '',
        link('Articole și ghiduri', '/blog', 'ghiduri pe luni, specii și tehnici de pescuit'),
        link('Locuri de pescuit', '/locuri-pescuit', 'lacuri, bălți și râuri din România'),
        '',
    ].join('\n');

    return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
