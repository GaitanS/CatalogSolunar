interface QuickStatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext?: string;
    colorClass: string;
}

export default function QuickStatCard({ icon, label, value, subtext, colorClass }: QuickStatCardProps) {
    return (
        <div className="interactive-lift min-w-[118px] p-3 rounded-2xl bg-[#151b25]/86 border border-white/10 flex flex-col items-start justify-center gap-2 snap-start text-left taste-surface">
            <div className={`p-1.5 rounded-lg bg-white/[0.055] ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-[8px] text-night-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-bold text-white leading-tight">{value}</p>
                {subtext && <p className="text-[8px] text-night-400 mt-0.5">{subtext}</p>}
            </div>
        </div>
    );
}
