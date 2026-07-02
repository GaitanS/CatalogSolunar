/**
 * Badge „Fereastră de aur" — de afișat lângă o perioadă solunară
 * care se suprapune cu răsăritul/apusul soarelui (isGoldenPeriod).
 */

export default function GoldenWindowBadge() {
    return (
        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-200">
            ✦ Fereastră de aur
        </span>
    );
}
