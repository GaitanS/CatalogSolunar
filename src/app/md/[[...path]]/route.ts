/**
 * Markdown versions of pages. Middleware rewrites here when a request has
 * `Accept: text/markdown` or a `.md` address; see src/lib/pageMarkdown.ts.
 */

import { SITE_URL } from '@/lib/agentApi';
import { pageMarkdown } from '@/lib/pageMarkdown';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
    const { path } = await params;
    const pagePath = `/${(path ?? []).join('/')}`;
    const markdown = pageMarkdown(pagePath);

    if (markdown === null) {
        return new Response('Not found\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    return new Response(markdown, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            // Served at the HTML page's own URL, so a shared cache must never keep it.
            'Cache-Control': 'private, no-store',
            Vary: 'Accept',
            'X-Robots-Tag': 'noindex',
            Link: `<${SITE_URL}${pagePath}>; rel="canonical"`,
        },
    });
}
