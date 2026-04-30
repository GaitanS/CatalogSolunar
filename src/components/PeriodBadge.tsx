import { formatTime } from '@/lib/solunar';

interface PeriodBadgeProps {
    type: 'major' | 'minor';
    start: Date;
    end: Date;
}

export default function PeriodBadge({ type, start, end }: PeriodBadgeProps) {
    const isMajor = type === 'major';
    return (
        <div className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full ${
            isMajor
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-white/[0.045] text-amber-200 border border-white/10'
        }`}>
            <div className={`w-1 h-1 rounded-full ${isMajor ? 'bg-amber-400' : 'bg-amber-200/80'}`} />
            <span className="font-mono leading-none">{formatTime(start)}</span>
        </div>
    );
}
