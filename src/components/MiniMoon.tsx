/**
 * Discul de mini-luna din designul Solunar Mobile (Prognoza + calendarul lunar):
 * disc crem cu umbra de faza deplasata dupa iluminare. Pur CSS, server-safe.
 */

interface MiniMoonProps {
    /** Iluminare 0-1 */
    fraction: number;
    /** Faza 0-1 (0 = luna noua, 0.5 = plina) */
    phaseValue: number;
    size: number;
}

export default function MiniMoon({ fraction, phaseValue, size }: MiniMoonProps) {
    const waxing = phaseValue <= 0.5;
    const dpx = fraction * size * 1.9;
    const tx = waxing ? -dpx : dpx;

    return (
        <span
            className="relative inline-block shrink-0 overflow-hidden rounded-full"
            style={{ width: size, height: size, background: 'linear-gradient(145deg, #EFEBDD, #B9B4A4)' }}
        >
            {fraction <= 0.985 && (
                <span
                    className="absolute rounded-full"
                    style={{
                        inset: '-8%',
                        background: '#131A2B',
                        transform: `translateX(${tx.toFixed(1)}px)`,
                        filter: `blur(${(size * 0.07).toFixed(1)}px)`,
                    }}
                />
            )}
        </span>
    );
}
