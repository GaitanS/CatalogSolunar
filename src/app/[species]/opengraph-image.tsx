import { ImageResponse } from 'next/og';
import { getSpeciesBySlug } from '@/data/species';

export const runtime = 'edge';
export const alt = 'Calendar Solunar - Pescuit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ species: string }> }) {
    const { species: slug } = await params;
    const species = getSpeciesBySlug(slug);
    const name = species?.name || slug;
    const icon = species?.icon || '🐟';
    const season = species?.season || '';
    const bestMoonPhase = species?.bestMoonPhase || '';

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
                {/* Moon decoration */}
                <div
                    style={{
                        position: 'absolute',
                        top: 60,
                        right: 100,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        boxShadow: '0 0 50px rgba(251, 191, 36, 0.4)',
                    }}
                />

                {/* Fish icon */}
                <div style={{ fontSize: 80, marginBottom: 16 }}>{icon}</div>

                {/* Species name */}
                <h1
                    style={{
                        fontSize: 60,
                        fontWeight: 'bold',
                        color: '#ffffff',
                        margin: 0,
                        textAlign: 'center',
                        textTransform: 'capitalize',
                    }}
                >
                    Pescuit {name}
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: 30,
                        color: '#fbbf24',
                        margin: '20px 0 0 0',
                        textAlign: 'center',
                    }}
                >
                    Calendar Solunar și Ghid Complet
                </p>

                {/* Info boxes */}
                <div
                    style={{
                        display: 'flex',
                        gap: 30,
                        marginTop: 40,
                    }}
                >
                    {season && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '16px 24px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: 12,
                            }}
                        >
                            <span style={{ color: '#64748b', fontSize: 16, marginBottom: 4 }}>Sezon</span>
                            <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 'bold' }}>{season}</span>
                        </div>
                    )}
                    {bestMoonPhase && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '16px 24px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: 12,
                            }}
                        >
                            <span style={{ color: '#64748b', fontSize: 16, marginBottom: 4 }}>Fază Lunară</span>
                            <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 'bold' }}>{bestMoonPhase}</span>
                        </div>
                    )}
                </div>

                {/* URL */}
                <p
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 22,
                        color: '#64748b',
                    }}
                >
                    calendarsolunar.ro/{slug}
                </p>
            </div>
        ),
        { ...size }
    );
}
