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
            {/* Moon base - golden/amber gradient */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle at 35% 35%, #fcd34d 0%, #f59e0b 50%, #d97706 100%)',
                    boxShadow: '0 0 60px rgba(251, 191, 36, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.2)',
                }}
            />

            {/* Moon texture overlay */}
            <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                    background: `
                        radial-gradient(circle at 30% 40%, rgba(0,0,0,0.3) 0%, transparent 20%),
                        radial-gradient(circle at 60% 30%, rgba(0,0,0,0.2) 0%, transparent 15%),
                        radial-gradient(circle at 45% 65%, rgba(0,0,0,0.25) 0%, transparent 18%),
                        radial-gradient(circle at 70% 60%, rgba(0,0,0,0.2) 0%, transparent 12%)
                    `,
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
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
                }}
            />
        </div>
    );
}
