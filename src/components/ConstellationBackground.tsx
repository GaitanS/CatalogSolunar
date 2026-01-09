export default function ConstellationBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* Deep Space Gradient Base */}
            <div className="absolute inset-0 bg-[#020617]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-[#020617] to-[#020617]" />

            {/* Topographic/Wave lines (Subtle texture) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <pattern id="topo-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                    <path d="M0 50 Q 50 0 100 50 T 200 50" fill="none" stroke="white" strokeWidth="1" />
                    <path d="M0 100 Q 50 50 100 100 T 200 100" fill="none" stroke="white" strokeWidth="1" />
                    <path d="M0 150 Q 50 100 100 150 T 200 150" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#topo-pattern)" />
            </svg>

            {/* Constellations SVG */}
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Group 1: Big Dipper -ish (Top Left) */}
                <g className="text-white/20" stroke="currentColor" strokeWidth="0.5" filter="url(#glow)">
                    <circle cx="10%" cy="15%" r="1.5" fill="white" className="animate-pulse" style={{ animationDuration: '4s' }} />
                    <circle cx="15%" cy="18%" r="1" fill="white" />
                    <circle cx="18%" cy="22%" r="1" fill="white" />
                    <circle cx="22%" cy="28%" r="1.5" fill="white" />
                    <circle cx="28%" cy="26%" r="1" fill="white" />
                    <circle cx="32%" cy="32%" r="1.5" fill="white" className="animate-pulse" style={{ animationDuration: '5s' }} />
                    <circle cx="26%" cy="35%" r="1" fill="white" />

                    {/* Lines */}
                    <line x1="10%" y1="15%" x2="15%" y2="18%" />
                    <line x1="15%" y1="18%" x2="18%" y2="22%" />
                    <line x1="18%" y1="22%" x2="22%" y2="28%" />
                    <line x1="22%" y1="28%" x2="28%" y2="26%" />
                    <line x1="28%" y1="26%" x2="32%" y2="32%" />
                    <line x1="32%" y1="32%" x2="26%" y2="35%" />
                    <line x1="26%" y1="35%" x2="22%" y2="28%" />
                </g>

                {/* Group 2: Cassiopeia -ish (Top Right) */}
                <g className="text-white/10" stroke="currentColor" strokeWidth="0.5">
                    <circle cx="80%" cy="10%" r="1.5" fill="white" className="animate-pulse" style={{ animationDuration: '3s' }} />
                    <circle cx="85%" cy="15%" r="1" fill="white" />
                    <circle cx="82%" cy="20%" r="1" fill="white" />
                    <circle cx="90%" cy="18%" r="1" fill="white" />
                    <circle cx="95%" cy="25%" r="1.5" fill="white" />

                    <line x1="80%" y1="10%" x2="85%" y2="15%" />
                    <line x1="85%" y1="15%" x2="82%" y2="20%" />
                    <line x1="82%" y1="20%" x2="90%" y2="18%" />
                    <line x1="90%" y1="18%" x2="95%" y2="25%" />
                </g>

                {/* Creates scattered background stars */}
                {Array.from({ length: 50 }).map((_, i) => (
                    <circle
                        key={i}
                        cx={`${Math.random() * 100}%`}
                        cy={`${Math.random() * 100}%`}
                        r={Math.random() * 1.5}
                        fill="white"
                        className="opacity-20 animate-pulse"
                        style={{
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
