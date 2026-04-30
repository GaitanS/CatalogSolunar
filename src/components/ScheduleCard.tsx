interface ScheduleCardProps {
    type: 'good' | 'bad';
    start: string;
    end: string;
}

export default function ScheduleCard({ type, start, end }: ScheduleCardProps) {
    const isGood = type === 'good';
    return (
        <div className="mb-4 last:mb-0">
            <div className={`flex items-center gap-2 mb-2 ${isGood ? 'text-amber-200' : 'text-slate-300'}`}>
                {isGood ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                    </svg>
                )}
                <span className="font-bold text-sm tracking-wide">
                    {isGood ? 'Orar pescuit favorabil:' : 'Orar pescuit nefavorabil:'}
                </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#111827]/70 rounded-2xl border border-white/10">
                <div className="bg-white/[0.055] px-3 py-1.5 rounded-xl text-white font-mono font-bold text-lg shadow-inner">
                    {start}
                </div>
                <div className={`text-lg ${isGood ? 'text-amber-200' : 'text-slate-400'}`}>→</div>
                <div className="bg-white/[0.055] px-3 py-1.5 rounded-xl text-white font-mono font-bold text-lg shadow-inner">
                    {end}
                </div>
            </div>
        </div>
    );
}
