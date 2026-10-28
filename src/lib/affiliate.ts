// 2Performant affiliate links.
// A merchant's `unique` code appears on its program page (Quick link) once the
// merchant approves the collaboration. Until then links go straight to the shop,
// so the pages work and start earning as soon as the code is filled in.

const AFF_CODE = 'ad956301f';

export type MerchantId = 'pescarExpert' | 'sportDepot' | 'wargear';

interface Merchant {
    name: string;
    origin: string;
    unique: string | null;
}

export const MERCHANTS: Record<MerchantId, Merchant> = {
    // Applied 2026-10-28, waiting for approval.
    pescarExpert: { name: 'Pescar Expert', origin: 'https://www.pescar-expert.ro', unique: null },
    // Applied 2026-10-28, waiting for approval.
    sportDepot: { name: 'SportDepot', origin: 'https://www.sportdepot.ro', unique: null },
    // Approved 2026-10-28.
    wargear: { name: 'WarGear', origin: 'https://wargear.ro', unique: '49271796e' },
};

export function affiliateUrl(merchantId: MerchantId, path: string): string {
    const merchant = MERCHANTS[merchantId];
    const target = merchant.origin + path;
    if (!merchant.unique) return target;
    return `https://event.2performant.com/events/click?ad_type=quicklink&aff_code=${AFF_CODE}&unique=${merchant.unique}&redirect_to=${encodeURIComponent(target)}`;
}
