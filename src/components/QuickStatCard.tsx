interface QuickStatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext?: string;
    colorClass: string;
}

export default function QuickStatCard({ icon, label, value, subtext, colorClass }: QuickStatCardProps) {
    return (
        <div className="min-w-[100px] p-2 rounded-xl bg-[#111827] border border-white/5 flex flex-col items-center justify-center gap-1 snap-start text-center">
            <div className={`hidden md:block p-1.5 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-[8px] text-night-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
                <p className="text-xs font-bold text-white leading-tight">{value}</p>
                {subtext && <p className="text-[8px] text-night-400 mt-0.5">{subtext}</p>}
            </div>
        </div>
    );
}
