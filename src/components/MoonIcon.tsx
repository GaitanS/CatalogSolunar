export default function MoonIcon({ phase, className = "w-6 h-6" }: { phase: string, className?: string }) {
    // Simple geometric representation using SVG masks or paths
    // Phase keys: 'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 'full', 'waning-gibbous', 'last-quarter', 'waning-crescent'

    // Default to a simple circle if unknown
    // We will simulate the shadow using a path

    // Normalize phase name
    const p = phase.toLowerCase();

    const isNew = p.includes('new') || p.includes('nou');
    const isFull = p.includes('full') || p.includes('plin');
    const isFirstQ = p.includes('first') || p.includes('prim'); // Right half lit
    const isLastQ = p.includes('last') || p.includes('ultim'); // Left half lit

    // Determine fill color
    const moonColor = "currentColor"; // Expect text-color to be set by parent (e.g. text-moon)
    const shadowColor = "rgba(255,255,255,0.1)";

    if (isNew) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={moonColor} strokeWidth="1.5" className="opacity-30" />
                <circle cx="12" cy="12" r="9" fill={shadowColor} />
            </svg>
        );
    }

    if (isFull) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill={moonColor} />
            </svg>
        );
    }

    if (isFirstQ) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={moonColor} strokeWidth="1.5" className="opacity-30" />
                <path d="M12 2A10 10 0 0 1 12 22Z" fill={moonColor} />
            </svg>
        );
    }

    if (isLastQ) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={moonColor} strokeWidth="1.5" className="opacity-30" />
                <path d="M12 2A10 10 0 0 0 12 22Z" fill={moonColor} />
            </svg>
        );
    }

    // Generic crescent/gibbous handling (Simplified for "Professional Minimalist" look)
    // If we want exact phases we'd need complex paths, but often standardizing to 4 key phases + 2 intermediate states is cleaner.

    // Default fallback (Outline)
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={moonColor} strokeWidth="2" />
        </svg>
    );
}
