export default function RatingBars({ rating, max = 5, className = "" }: { rating: number, max?: number, className?: string }) {
    return (
        <div className={`flex items-end gap-[1px] ${className}`}>
            {Array.from({ length: max }).map((_, i) => {
                const isActive = i < rating;
                // Height progression: 40%, 55%, 70%, 85%, 100%
                const height = 40 + (i * (60 / (max - 1)));

                return (
                    <div
                        key={i}
                        style={{ height: `${height}%` }}
                        className={`w-1 rounded-sm transition-all duration-300 ${isActive
                                ? rating >= 4 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                    : rating >= 3 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                        : 'bg-orange-500/80'
                                : 'bg-night-700/30'
                            }`}
                    />
                );
            })}
        </div>
    );
}
