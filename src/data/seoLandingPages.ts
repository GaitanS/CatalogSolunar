export interface MonthlySeoLandingPage {
    slug: string;
    monthIndex: number;
    monthName: string;
    year: number;
    title: string;
    metaTitle: string;
    description: string;
    primaryKeyword: string;
    keywords: string[];
    blogHref: string;
    seasonContext: string;
    speciesFocus: string[];
    strategy: string;
}

export interface AnnualSeoLandingPage {
    slug: string;
    year: number;
    title: string;
    metaTitle: string;
    description: string;
    primaryKeyword: string;
    keywords: string[];
    intent: 'solunar' | 'calendar';
}

const year = 2026;

export const monthlySeoLandingPages: MonthlySeoLandingPage[] = [
    {
        slug: 'solunar-ianuarie-2026',
        monthIndex: 0,
        monthName: 'Ianuarie',
        year,
        title: 'Solunar Ianuarie 2026 - Calendar Pescuit pe Zile',
        metaTitle: 'Solunar Ianuarie 2026 - Calendar Pescuit și Ore Bune',
        description: 'Solunar Ianuarie 2026 pentru pescuit: zile bune, perioade majore, faze lunare, specii active și ore recomandate pentru ieșiri de iarnă.',
        primaryKeyword: 'solunar ianuarie 2026',
        keywords: ['solunar ianuarie 2026', 'calendar pescuit ianuarie 2026', 'ore pescuit ianuarie', 'solunar pescuit ianuarie 2026'],
        blogHref: '/blog/solunar-ianuarie-2026-ghid',
        seasonContext: 'Ianuarie cere pescuit lent, în ferestre scurte, pe ape reci și stabile.',
        speciesFocus: ['biban', 'șalău', 'clean'],
        strategy: 'Caută praguri adânci, zone ferite de curent și ferestrele majore din mijlocul zilei.',
    },
    {
        slug: 'solunar-februarie-2026',
        monthIndex: 1,
        monthName: 'Februarie',
        year,
        title: 'Solunar Februarie 2026 - Calendar Pescuit și Ore Optime',
        metaTitle: 'Solunar Februarie 2026 - Calendar Pescuit pe Ore',
        description: 'Solunar Februarie 2026 cu zile favorabile la pescuit, faze lunare, perioade majore și recomandări pentru pescuit de iarnă târzie.',
        primaryKeyword: 'solunar februarie 2026',
        keywords: ['solunar februarie 2026', 'calendar pescuit februarie 2026', 'ore pescuit februarie', 'solunar pescuit februarie 2026'],
        blogHref: '/blog/solunar-februarie-2026-ghid',
        seasonContext: 'Februarie rămâne rece, dar răpitorii pot avea ferestre bune când presiunea este stabilă.',
        speciesFocus: ['șalău', 'biban', 'clean'],
        strategy: 'Alege monturi fine, năluci lente și perioadele solunare care se suprapun cu orele mai calde.',
    },
    {
        slug: 'solunar-martie-2026',
        monthIndex: 2,
        monthName: 'Martie',
        year,
        title: 'Solunar Martie 2026 - Când Trage Peștele',
        metaTitle: 'Solunar Martie 2026 - Calendar Pescuit și Zile Bune',
        description: 'Solunar Martie 2026 pentru pescuit: calendar pe zile, perioade majore, fazele lunii și specii active la început de primăvară.',
        primaryKeyword: 'solunar martie 2026',
        keywords: ['solunar martie 2026', 'calendar pescuit martie 2026', 'ore pescuit martie', 'solunar pescuit martie 2026'],
        blogHref: '/blog/solunar-martie-2026-ghid',
        seasonContext: 'Martie aduce apă în încălzire și pești care încep să urce spre zone mai puțin adânci.',
        speciesFocus: ['caras', 'plătică', 'șalău'],
        strategy: 'Prioritizează gurile de canal, golfurile încălzite și perioadele majore apropiate de răsărit.',
    },
    {
        slug: 'solunar-aprilie-2026',
        monthIndex: 3,
        monthName: 'Aprilie',
        year,
        title: 'Solunar Aprilie 2026 - Cele Mai Bune Zile de Pescuit',
        metaTitle: 'Solunar Aprilie 2026 - Calendar Pescuit pe Zile',
        description: 'Solunar Aprilie 2026 cu zile bune de pescuit, faze lunare, ore exacte și recomandări înaintea perioadelor de prohibiție.',
        primaryKeyword: 'solunar aprilie 2026',
        keywords: ['solunar aprilie 2026', 'calendar pescuit aprilie 2026', 'ore pescuit aprilie', 'solunar pescuit aprilie 2026'],
        blogHref: '/blog/solunar-aprilie-2026-ghid',
        seasonContext: 'Aprilie este o lună puternică, dar trebuie verificată mereu prohibiția locală.',
        speciesFocus: ['caras', 'plătică', 'crap'],
        strategy: 'Caută ape mai calde, zone liniștite și ferestrele solunare dinaintea schimbărilor meteo.',
    },
    {
        slug: 'solunar-mai-2026',
        monthIndex: 4,
        monthName: 'Mai',
        year,
        title: 'Solunar Mai 2026 - Calendar Pescuit, Ore Exacte și Zile Bune',
        metaTitle: 'Solunar Mai 2026 - Calendar Pescuit și Ore Exacte',
        description: 'Solunar Mai 2026 pentru pescuit: cele mai bune zile, ore exacte, perioade majore și minore, faze lunare și specii active în luna mai.',
        primaryKeyword: 'solunar mai 2026',
        keywords: ['solunar mai 2026', 'solunar pescuit mai 2026', 'calendar pescuit mai 2026', 'calendar solunar mai 2026', 'ore pescuit mai 2026', 'solunar luna mai 2026'],
        blogHref: '/blog/solunar-mai-2026-ghid',
        seasonContext: 'Mai este luna în care apa se stabilizează, zilele sunt lungi și peștii caută hrană mai agresiv.',
        speciesFocus: ['crap', 'caras', 'lin', 'plătică', 'șalău'],
        strategy: 'Planifică ieșirile în jurul lunii pline, lunii noi și perioadelor majore care cad dimineața sau seara.',
    },
    {
        slug: 'solunar-iunie-2026',
        monthIndex: 5,
        monthName: 'Iunie',
        year,
        title: 'Solunar Iunie 2026 - Calendar Pescuit și Ore Bune',
        metaTitle: 'Solunar Iunie 2026 - Calendar Pescuit pe Ore',
        description: 'Solunar Iunie 2026 pentru pescuit: zile favorabile, perioade majore, faze lunare, specii active și ore bune după ridicarea prohibiției.',
        primaryKeyword: 'solunar iunie 2026',
        keywords: ['solunar iunie 2026', 'solunar pescuit iunie 2026', 'calendar pescuit iunie 2026', 'ore pescuit iunie 2026'],
        blogHref: '/blog/solunar-iunie-2026-ghid',
        seasonContext: 'Iunie deschide sezonul de vară, cu activitate bună la răsărit, apus și noaptea.',
        speciesFocus: ['somn', 'crap', 'șalău', 'avat'],
        strategy: 'Folosește sesiunile de seară și noapte, mai ales când perioada majoră cade după apus.',
    },
    {
        slug: 'solunar-iulie-2026',
        monthIndex: 6,
        monthName: 'Iulie',
        year,
        title: 'Solunar Iulie 2026 - Ore Optime și Zile de Pescuit',
        metaTitle: 'Solunar Iulie 2026 - Calendar Pescuit și Zile Bune',
        description: 'Solunar Iulie 2026 cu ore optime de pescuit, perioade majore, faze lunare și recomandări pentru caniculă și pescuit nocturn.',
        primaryKeyword: 'solunar iulie 2026',
        keywords: ['solunar iulie 2026', 'calendar pescuit iulie 2026', 'ore pescuit iulie', 'solunar pescuit iulie 2026'],
        blogHref: '/blog/solunar-iulie-2026-ghid',
        seasonContext: 'Iulie cere atenție la temperatură: cele mai bune ferestre sunt devreme, seara și noaptea.',
        speciesFocus: ['somn', 'crap', 'șalău'],
        strategy: 'Evită orele de caniculă și pescuiește când solunarul se suprapune cu răcoarea.',
    },
    {
        slug: 'solunar-august-2026',
        monthIndex: 7,
        monthName: 'August',
        year,
        title: 'Solunar August 2026 - Zile și Ore Optime Pescuit',
        metaTitle: 'Solunar August 2026 - Calendar Pescuit pe Zile',
        description: 'Solunar August 2026 pentru pescuit: calendar cu perioade majore, faze lunare, zile bune și strategii pentru ape calde.',
        primaryKeyword: 'solunar august 2026',
        keywords: ['solunar august 2026', 'calendar pescuit august 2026', 'ore pescuit august', 'solunar pescuit august 2026'],
        blogHref: '/blog/solunar-august-2026-ghid',
        seasonContext: 'August este productiv când pescuiești în ferestre scurte, noaptea sau la schimbări stabile de vreme.',
        speciesFocus: ['crap', 'somn', 'șalău'],
        strategy: 'Caută ape oxigenate, zone adânci și perioade majore apropiate de apus.',
    },
    {
        slug: 'solunar-septembrie-2026',
        monthIndex: 8,
        monthName: 'Septembrie',
        year,
        title: 'Solunar Septembrie 2026 - Sezonul de Aur al Pescuitului',
        metaTitle: 'Solunar Septembrie 2026 - Calendar Pescuit și Zile Bune',
        description: 'Solunar Septembrie 2026: zile excelente de pescuit, faze lunare, perioade majore și specii active în sezonul de toamnă.',
        primaryKeyword: 'solunar septembrie 2026',
        keywords: ['solunar septembrie 2026', 'calendar pescuit septembrie 2026', 'ore pescuit septembrie', 'solunar pescuit septembrie 2026'],
        blogHref: '/blog/solunar-septembrie-2026-ghid',
        seasonContext: 'Septembrie este una dintre cele mai bune luni: apa se răcește ușor, iar peștii se hrănesc înainte de iarnă.',
        speciesFocus: ['crap', 'șalău', 'știucă', 'biban'],
        strategy: 'Alege diminețile, serile și zilele cu presiune stabilă; nadirea constantă contează mult.',
    },
    {
        slug: 'solunar-octombrie-2026',
        monthIndex: 9,
        monthName: 'Octombrie',
        year,
        title: 'Solunar Octombrie 2026 - Calendar Pescuit Toamnă',
        metaTitle: 'Solunar Octombrie 2026 - Ore și Zile Bune Pescuit',
        description: 'Solunar Octombrie 2026 cu zile bune pentru pescuit de toamnă, perioade majore, faze lunare și specii active.',
        primaryKeyword: 'solunar octombrie 2026',
        keywords: ['solunar octombrie 2026', 'calendar pescuit octombrie 2026', 'ore pescuit octombrie', 'solunar pescuit octombrie 2026'],
        blogHref: '/blog/solunar-octombrie-2026-ghid',
        seasonContext: 'Octombrie aduce pescuit tehnic, cu răpitori activi și crap pe ferestre scurte.',
        speciesFocus: ['știucă', 'șalău', 'crap', 'biban'],
        strategy: 'Urmărește perioadele majore din mijlocul zilei și schimbările lente de presiune.',
    },
    {
        slug: 'solunar-noiembrie-2026',
        monthIndex: 10,
        monthName: 'Noiembrie',
        year,
        title: 'Solunar Noiembrie 2026 - Calendar Pescuit Rece',
        metaTitle: 'Solunar Noiembrie 2026 - Calendar Pescuit și Ore Bune',
        description: 'Solunar Noiembrie 2026 pentru pescuit: zile favorabile, perioade majore, faze lunare și recomandări pentru apă rece.',
        primaryKeyword: 'solunar noiembrie 2026',
        keywords: ['solunar noiembrie 2026', 'calendar pescuit noiembrie 2026', 'ore pescuit noiembrie', 'solunar pescuit noiembrie 2026'],
        blogHref: '/blog/solunar-noiembrie-2026-ghid',
        seasonContext: 'Noiembrie favorizează pescuitul de răpitor și sesiunile scurte, bine alese.',
        speciesFocus: ['șalău', 'știucă', 'biban'],
        strategy: 'Pescuiește lent, pe structuri, în ferestrele solunare care coincid cu lumină bună.',
    },
    {
        slug: 'solunar-decembrie-2026',
        monthIndex: 11,
        monthName: 'Decembrie',
        year,
        title: 'Solunar Decembrie 2026 - Calendar Pescuit de Iarnă',
        metaTitle: 'Solunar Decembrie 2026 - Ore Bune pentru Pescuit',
        description: 'Solunar Decembrie 2026 cu perioade majore, faze lunare și zile bune pentru pescuit de iarnă la răpitori.',
        primaryKeyword: 'solunar decembrie 2026',
        keywords: ['solunar decembrie 2026', 'calendar pescuit decembrie 2026', 'ore pescuit decembrie', 'solunar pescuit decembrie 2026'],
        blogHref: '/blog/solunar-decembrie-2026-ghid',
        seasonContext: 'Decembrie este despre precizie: puține ferestre, dar unele pot fi excelente pentru răpitori.',
        speciesFocus: ['șalău', 'biban', 'clean'],
        strategy: 'Alege zone adânci, apă limpede și perioade majore din orele mai luminoase.',
    },
];

export const annualSeoLandingPages: AnnualSeoLandingPage[] = [
    {
        slug: 'solunar-2026',
        year,
        title: 'Solunar 2026 - Calendar Solunar pe Luni, Zile și Ore',
        metaTitle: 'Solunar 2026 - Calendar Solunar pe Luni și Ore',
        description: 'Solunar 2026 complet pentru pescuit: calendar pe luni, zile bune, perioade majore și minore, faze lunare și ore recomandate.',
        primaryKeyword: 'solunar 2026',
        keywords: ['solunar 2026', 'calendar solunar 2026', 'tabela solunar 2026', 'solunare 2026', '2026 solunar calendar'],
        intent: 'solunar',
    },
    {
        slug: 'solunar-pescuit-2026',
        year,
        title: 'Solunar Pescuit 2026 - Calendar pe Luni, Zile și Ore',
        metaTitle: 'Solunar Pescuit 2026 - Calendar pe Luni și Ore Exacte',
        description: 'Solunar pescuit 2026 complet: calendar pe luni, zile bune, perioade majore și minore, faze lunare, specii active și linkuri către fiecare lună.',
        primaryKeyword: 'solunar pescuit 2026',
        keywords: ['solunar pescuit 2026', 'solunar 2026 pescuit', 'calendar solunar pescuit 2026', 'solunar pe luni 2026'],
        intent: 'solunar',
    },
    {
        slug: 'calendar-pescuit-2026',
        year,
        title: 'Calendar Pescuit 2026 - Zile Bune, Solunar și Faze Lunare',
        metaTitle: 'Calendar Pescuit 2026 - Zile Bune și Solunar',
        description: 'Calendar pescuit 2026 cu zile bune pe luni, solunar, faze lunare, ore recomandate și perioade majore pentru pescarii din România.',
        primaryKeyword: 'calendar pescuit 2026',
        keywords: ['calendar pescuit 2026', 'calendarul pescarului 2026', 'zile bune pescuit 2026', 'solunar pescuit 2026'],
        intent: 'calendar',
    },
];

export function getMonthlyLandingBySlug(slug: string) {
    return monthlySeoLandingPages.find((page) => page.slug === slug);
}

export function getAnnualLandingBySlug(slug: string) {
    return annualSeoLandingPages.find((page) => page.slug === slug);
}

export function getAllSeoLandingSlugs() {
    return [
        ...monthlySeoLandingPages.map((page) => page.slug),
        ...annualSeoLandingPages.map((page) => page.slug),
    ];
}
