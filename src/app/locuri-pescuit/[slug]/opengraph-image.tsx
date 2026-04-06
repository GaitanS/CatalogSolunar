import { ImageResponse } from 'next/og';
import { getLocationBySlug } from '@/data/fishingLocations';

export const runtime = 'edge';
export const alt = 'Calendar Solunar - Loc de Pescuit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const loc = getLocationBySlug(slug);

    if (!loc) {
        return new ImageResponse(
            <div style={{ background: '#0a0f1a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48 }}>
                Calendar Solunar
            </div>,
            { ...size }
        );
    }

    const typeLabels: Record<string, string> = {
        lac: 'Lac', balta: 'Baltă', acumulare: 'Acumulare', iaz: 'Iaz', rau: 'Râu', canal: 'Canal', delta: 'Delta',
    };

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0a0f1a 0%, #1a2744 50%, #0a0f1a 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif',
                    position: 'relative',
                }}
            >
                {/* Location pin icon */}
                <div style={{ position: 'absolute', top: 50, right: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', border: '2px solid rgba(59, 130, 246, 0.4)' }}>
                    <div style={{ fontSize: 40, display: 'flex' }}>📍</div>
                </div>

                {/* Type badge */}
                <div style={{ display: 'flex', padding: '8px 24px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 50, color: '#93c5fd', fontSize: 20, marginBottom: 20 }}>
                    {typeLabels[loc.type] || loc.type} · {loc.county}
                </div>

                {/* Location name */}
                <div style={{ fontSize: 56, fontWeight: 800, color: 'white', textAlign: 'center', maxWidth: 900, lineHeight: 1.2, display: 'flex' }}>
                    {loc.name}
                </div>

                {/* Fish species */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 800 }}>
                    {loc.fish.slice(0, 5).map((fish) => (
                        <div key={fish} style={{ padding: '6px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 20, color: '#6ee7b7', fontSize: 18, display: 'flex' }}>
                            {fish}
                        </div>
                    ))}
                    {loc.fish.length > 5 && (
                        <div style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, color: '#94a3b8', fontSize: 18, display: 'flex' }}>
                            +{loc.fish.length - 5} specii
                        </div>
                    )}
                </div>

                {/* Solunar GPS badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 30, color: '#fbbf24', fontSize: 18 }}>
                    <div style={{ display: 'flex' }}>✓</div>
                    <div style={{ display: 'flex' }}>Solunar pe coordonate GPS exacte</div>
                </div>

                {/* Footer branding */}
                <div style={{ position: 'absolute', bottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'white', display: 'flex' }}>calendarsolunar.ro</div>
                    <div style={{ color: '#64748b', fontSize: 16, display: 'flex' }}>· {loc.paid ? 'Cu taxă' : 'Acces gratuit'}</div>
                </div>
            </div>
        ),
        { ...size }
    );
}
