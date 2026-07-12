/**
 * Luna „hero" din designul Solunar Mobile: disc de 200px cu textura lunara
 * derulata continuu (csMoonSpin), umbra de faza pozitionata dupa iluminare,
 * stele discrete si halo auriu. Server component — animatia e pur CSS.
 */

interface MoonHeroProps {
    phaseName: string;
    illumination: number; // 0-100
    moonAgeDays: number;  // 0-29.53
}

const STARS: Array<{ side: 'left' | 'right'; x: string; y: string; s: number; o: number }> = [
    { side: 'left', x: '11%', y: '14%', s: 2, o: 0.6 },
    { side: 'left', x: '22%', y: '52%', s: 1.5, o: 0.4 },
    { side: 'left', x: '16%', y: '76%', s: 2, o: 0.35 },
    { side: 'left', x: '30%', y: '22%', s: 1.5, o: 0.5 },
    { side: 'left', x: '40%', y: '6%', s: 2, o: 0.35 },
    { side: 'right', x: '12%', y: '18%', s: 2, o: 0.55 },
    { side: 'right', x: '24%', y: '60%', s: 1.5, o: 0.4 },
    { side: 'right', x: '17%', y: '80%', s: 2, o: 0.3 },
    { side: 'right', x: '32%', y: '10%', s: 1.5, o: 0.45 },
    { side: 'right', x: '42%', y: '88%', s: 1.5, o: 0.3 },
];

export default function MoonHero({ phaseName, illumination, moonAgeDays }: MoonHeroProps) {
    const fraction = Math.max(0, Math.min(1, illumination / 100));
    const waxing = moonAgeDays / 29.53058867 <= 0.5;
    const dpx = fraction * 200 * 1.9;

    return (
        <div className="relative flex flex-col items-center px-0 pb-1 pt-4">
            {STARS.map((st, i) => (
                <span
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                        [st.side]: st.x,
                        top: st.y,
                        width: st.s,
                        height: st.s,
                        opacity: st.o,
                    }}
                />
            ))}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(242,206,114,0.10) 0%, rgba(147,180,232,0.05) 45%, transparent 70%)' }}
            />
            <div
                className="relative h-[200px] w-[200px] overflow-hidden rounded-full"
                style={{ boxShadow: '0 0 70px rgba(242,206,114,0.16), inset 0 0 26px rgba(0,0,0,0.55)' }}
            >
                <div
                    className="animate-moon-spin absolute inset-0 rounded-full"
                    style={{
                        backgroundImage: 'url(/moon-texture-512.webp)',
                        backgroundSize: 'auto 100%',
                        backgroundRepeat: 'repeat-x',
                    }}
                />
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.13) 0%, transparent 44%), radial-gradient(circle at 50% 50%, transparent 56%, rgba(4,8,16,0.5) 90%, rgba(4,8,16,0.78) 100%)',
                        boxShadow: 'inset -16px -12px 36px rgba(4,8,16,0.55)',
                    }}
                />
                {fraction <= 0.985 && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '-4%',
                            background: 'rgba(5,9,18,0.95)',
                            transform: `translateX(${(waxing ? -dpx : dpx).toFixed(0)}px)`,
                            filter: 'blur(10px)',
                        }}
                    />
                )}
            </div>
            <div className="relative mt-4 text-[22px] font-semibold text-white">{phaseName}</div>
            <div className="relative mt-1 text-[12.5px] text-[#8C96AB]">
                {illumination}% iluminare · ziua {Math.round(moonAgeDays)} a ciclului lunar
            </div>
        </div>
    );
}
