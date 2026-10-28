import type { MerchantId } from '@/lib/affiliate';

export interface AffiliateProduct {
    /** What the reader needs, e.g. "Lansetă telescopică". */
    role: string;
    name: string;
    /** Price in lei on the day it was checked. */
    price: number;
    /** Why this one, in one short sentence. */
    note: string;
    merchant: MerchantId;
    /** Product path on the merchant's site. */
    path: string;
}

export interface AffiliateProductGroup {
    title: string;
    /** ISO date the prices were checked. */
    checked: string;
    products: AffiliateProduct[];
    showTotal?: boolean;
}

export const affiliateProductGroups: Record<string, AffiliateProductGroup> = {
    'incepatori-set-baza': {
        title: 'Setul de bază, gata de cumpărat',
        checked: '2026-10-28',
        showTotal: true,
        products: [
            {
                role: 'Lansetă telescopică',
                name: 'Baracuda Storm 3,60 m, 150–250 g',
                price: 139.2,
                note: '23 de păreri de la cumpărători. Bună pentru pescuit la fund.',
                merchant: 'pescarExpert',
                path: '/cumpara/lanseta-telescopica-baracuda-storm-3-6m-150-250g-7756529',
            },
            {
                role: 'Mulinetă',
                name: 'Cormoran Cormaxx BR 3500',
                price: 140.93,
                note: 'Mărimea potrivită pentru lanseta de mai sus, de la un brand de încredere.',
                merchant: 'pescarExpert',
                path: '/cumpara/mulineta-cormaxx-br-3500-cormoran-7768248',
            },
            {
                role: 'Fir monofilament',
                name: 'Jaxon Monolith Premium, 150 m',
                price: 16.5,
                note: 'Alege diametrul 0,25–0,30 mm.',
                merchant: 'pescarExpert',
                path: '/cumpara/fir-monofilament-jaxon-monolith-premium-150m-7761874',
            },
            {
                role: 'Montură gata făcută',
                name: 'Linie: fir 0,16, plută 2,5 g, cârlig nr. 10',
                price: 8.52,
                note: 'Fir, plută și cârlig deja legate. Ia 2–3, se agață și se rup.',
                merchant: 'pescarExpert',
                path: '/cumpara/linie-pescuit-fir-016-pluta-026-2-5gr-cirlig-10-4889924',
            },
            {
                role: 'Plumbi',
                name: 'Set plumbi despicați Energo Team, 100 g',
                price: 14,
                note: 'Mărimi asortate, pentru echilibrat pluta.',
                merchant: 'pescarExpert',
                path: '/cumpara/set-plumbi-despicati-energo-team-styl-100g-7773571',
            },
        ],
    },
    'incepatori-upgrade': {
        title: 'Upgradeuri care merită, după primul an',
        checked: '2026-10-28',
        products: [
            {
                role: 'Mulinetă mai bună',
                name: 'Okuma Longbow XT BF 4000',
                price: 284.71,
                note: 'Are baitrunner: peștele poate trage firul fără să-ți ia lanseta în apă.',
                merchant: 'pescarExpert',
                path: '/cumpara/mulineta-longbow-xt-bf-4000-okuma-7761372',
            },
            {
                role: 'Lansetă de crap',
                name: 'Okuma Custom Black 3,90 m, 3,5 lbs',
                price: 450.45,
                note: 'Carbon, două tronsoane, 7 păreri de la cumpărători. Pentru crap la fund, cu boilies sau porumb.',
                merchant: 'pescarExpert',
                path: '/cumpara/lanseta-okuma-custom-black-3-90m-3-5lbs-2buc-7767895',
            },
            {
                role: 'Lansetă de spinning',
                name: 'Baracuda Razor X 2,40 m, 7–28 g',
                price: 320,
                note: 'Pentru biban, știucă mică și șalău, cu năluci ușoare.',
                merchant: 'pescarExpert',
                path: '/cumpara/lanseta-baracuda-razor-x-2-40m-7-28g-2-tronsoane-7771584',
            },
            {
                role: 'Împletitură',
                name: 'Daiwa J-Braid X8, 150 m',
                price: 67.48,
                note: 'Simți fiecare atingere la spinning (7 păreri).',
                merchant: 'pescarExpert',
                path: '/cumpara/fir-daiwa-j-braid-x8-chartreuse-150m-7759756',
            },
            {
                role: 'Minciog',
                name: 'Baracuda XXL 3,17 m, 65×60 cm',
                price: 132,
                note: 'Coadă lungă și cap mare, ca să nu pierzi peștele la mal.',
                merchant: 'pescarExpert',
                path: '/cumpara/minciog-xxl-3-17m-65x60cm-baracuda-7767913',
            },
        ],
    },
};
