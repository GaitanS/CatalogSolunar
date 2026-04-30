'use client';

interface SimpleMoon2DProps {
    phase: number; // 0-1, where 0 = new moon, 0.5 = full moon
    illumination: number;
    size?: number;
}

export default function SimpleMoon2D({ phase, illumination, size = 200 }: SimpleMoon2DProps) {
    // Calculate shadow position based on phase
    // Phase 0-0.5: waxing (shadow from left)
    // Phase 0.5-1: waning (shadow from right)
    const isWaxing = phase < 0.5;
    const adjustedPhase = isWaxing ? phase * 2 : (1 - phase) * 2;

    // Shadow offset: 0 = full shadow, 1 = no shadow
    const shadowOffset = adjustedPhase;

    return (
        <div
            className="relative"
            style={{ width: size, height: size }}
        >
            {/* Textured fallback used while WebGL initializes or when it is unavailable. */}
            <div
                className="absolute inset-0 rounded-full bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/moon-texture.jpg)',
                    boxShadow: '0 0 58px rgba(148, 163, 184, 0.2), inset 0 0 30px rgba(2, 6, 23, 0.18)',
                    filter: 'grayscale(1) contrast(1.08) brightness(0.96)',
                }}
            />

            {/* Moon texture overlay */}
            <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                    background: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 65% 72%, rgba(2,6,23,0.22), transparent 34%)',
                }}
            />

            {/* Shadow overlay for phase */}
            {illumination < 98 && (
                <div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                        background: isWaxing
                            ? `linear-gradient(to right, rgba(2, 6, 23, 0.95) ${(1 - shadowOffset) * 100}%, transparent ${(1 - shadowOffset) * 100 + 5}%)`
                            : `linear-gradient(to left, rgba(2, 6, 23, 0.95) ${(1 - shadowOffset) * 100}%, transparent ${(1 - shadowOffset) * 100 + 5}%)`,
                    }}
                />
            )}

            {/* Glow effect */}
            <div
                className="absolute -inset-4 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(148, 163, 184, 0.16) 0%, transparent 70%)',
                }}
            />
        </div>
    );
}
