import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/data/cities';
import { getSpeciesBySlug } from '@/data/species';

export const runtime = 'edge';
export const alt = 'Calendar Solunar';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Check if it's a city
    const city = getCityBySlug(slug);
    if (city) {
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
                    <div style={{ fontSize: 60, marginBottom: 16 }}>📍</div>
                    <h1 style={{ fontSize: 64, fontWeight: 'bold', color: '#ffffff', margin: 0, textAlign: 'center' }}>
                        Calendar Solunar {city.name}
                    </h1>
                    <p style={{ fontSize: 28, color: '#94a3b8', margin: '12px 0 0 0' }}>
                        Județul {city.county}
                    </p>
                    <p style={{ fontSize: 32, color: '#fbbf24', margin: '24px 0 0 0', textAlign: 'center' }}>
                        Orele Optime pentru Pescuit
                    </p>
                    <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
                        {['Predicții locale', 'Actualizat zilnic', '100% Gratuit'].map((text) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 22 }}>
                                <span style={{ color: '#fbbf24' }}>✓</span> {text}
                            </div>
                        ))}
                    </div>
                    <p style={{ position: 'absolute', bottom: 40, fontSize: 22, color: '#64748b' }}>
                        calendarsolunar.ro/{slug}
                    </p>
                </div>
            ),
            { ...size }
        );
    }

    // Check if it's a species
    const species = getSpeciesBySlug(slug);
    if (species) {
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
                    <div style={{ fontSize: 80, marginBottom: 16 }}>{species.icon}</div>
                    <h1 style={{ fontSize: 64, fontWeight: 'bold', color: '#ffffff', margin: 0, textAlign: 'center' }}>
                        Pescuit {species.name}
                    </h1>
                    <p style={{ fontSize: 24, color: '#94a3b8', margin: '12px 0 0 0', fontStyle: 'italic' }}>
                        {species.scientificName}
                    </p>
                    <p style={{ fontSize: 32, color: '#fbbf24', margin: '24px 0 0 0', textAlign: 'center' }}>
                        Ghid Complet + Calendar Solunar
                    </p>
                    <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
                        {['Tehnici', 'Momeli', 'Sezon optim'].map((text) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 22 }}>
                                <span style={{ color: '#fbbf24' }}>✓</span> {text}
                            </div>
                        ))}
                    </div>
                    <p style={{ position: 'absolute', bottom: 40, fontSize: 22, color: '#64748b' }}>
                        calendarsolunar.ro/{slug}
                    </p>
                </div>
            ),
            { ...size }
        );
    }

    // Default fallback
    return new ImageResponse(
        (
            <div style={{ background: '#0a0f1a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ color: '#ffffff', fontSize: 48 }}>Calendar Solunar</h1>
            </div>
        ),
        { ...size }
    );
}
