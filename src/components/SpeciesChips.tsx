/**
 * Cardul „Specii active in aceasta faza" din designul Solunar Mobile.
 * Chips albastre; speciile cu pagina proprie devin linkuri interne (SEO).
 */

import Link from 'next/link';

interface SpeciesChipsProps {
    fish: string[];
}

const FISH_SLUG_MAP: Record<string, string> = {
    'Crap': '/pescuit-crap', 'Șalău': '/pescuit-salau', 'Somn': '/pescuit-somn',
    'Știucă': '/pescuit-stiuca', 'Păstrăv': '/pescuit-pastrav', 'Caras': '/pescuit-caras',
    'Plătică': '/pescuit-platica', 'Biban': '/pescuit-biban', 'Lin': '/pescuit-lin',
    'Babușcă': '/pescuit-babusca', 'Clean': '/pescuit-clean', 'Fitofag': '/pescuit-fitofag',
};

const chipClass =
    'rounded-full border border-[#93B4E8]/20 bg-[#93B4E8]/[0.09] px-[11px] py-1.5 text-xs text-[#C9D6EE]';

export default function SpeciesChips({ fish }: SpeciesChipsProps) {
    if (!fish.length) return null;

    return (
        <div className="dc-card taste-surface p-4">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#8C96AB]">
                Specii active în această fază
            </div>
            <div className="mt-3 flex flex-wrap gap-[7px]">
                {fish.slice(0, 10).map((name) => {
                    const href = FISH_SLUG_MAP[name];
                    return href ? (
                        <Link key={name} href={href} className={`${chipClass} transition-colors hover:border-[#93B4E8]/50 hover:text-white`}>
                            {name}
                        </Link>
                    ) : (
                        <span key={name} className={chipClass}>{name}</span>
                    );
                })}
            </div>
        </div>
    );
}
