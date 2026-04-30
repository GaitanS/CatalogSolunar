import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Calendar Solunar - Pescuit în România';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        boxShadow: '0 0 60px rgba(251, 191, 36, 0.4)',
                    }}
                />

                <div style={{ fontSize: 80, marginBottom: 20, color: '#fbbf24', fontWeight: 800 }}>CS</div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: 72,
                        fontWeight: 'bold',
                        color: '#ffffff',
                        margin: 0,
                        textAlign: 'center',
                    }}
                >
                    Calendar Solunar
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: 32,
                        color: '#fbbf24',
                        margin: '20px 0 0 0',
                        textAlign: 'center',
                    }}
                >
                    Orele Optime pentru Pescuit în România
                </p>

                {/* Features */}
                <div
                    style={{
                        display: 'flex',
                        gap: 40,
                        marginTop: 50,
                    }}
                >
                    {['Faze Lunare', 'Răsărit/Apus', 'Predicții zilnice'].map((text) => (
                        <div
                            key={text}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: '#94a3b8',
                                fontSize: 24,
                            }}
                        >
                            <span style={{ color: '#fbbf24' }}>✓</span> {text}
                        </div>
                    ))}
                </div>

                {/* URL */}
                <p
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 24,
                        color: '#64748b',
                    }}
                >
                    calendarsolunar.ro
                </p>
            </div>
        ),
        { ...size }
    );
}
