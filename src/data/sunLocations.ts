import { getAllCities } from './cities';

/**
 * Localitati pentru paginile /rasarit-apus-soare/[loc].
 * Lista vine din cautarile reale (Google Autocomplete RO, oct. 2026): la
 * rasarit se cauta mai ales statiunile de pe litoral, la apus orasele.
 * Coordonatele sunt din Wikidata (punctul localitatii), cu 4 zecimale:
 * o eroare de 0,01 grade schimba ora cu sub 3 secunde.
 */

export type SunLocationKind = 'litoral' | 'delta' | 'dunare' | 'munte' | 'oras';

export interface SunLocation {
    slug: string;
    name: string;
    /** Judetul (sau „București”). */
    county: string;
    lat: number;
    lng: number;
    kind: SunLocationKind;
    /** Text scurt, specific locului; doar fapte verificabile. */
    note?: string;
    /** Localitati alaturate pentru care orele sunt practic aceleasi. */
    alsoFor?: string[];
}

export const KIND_LABELS: Record<SunLocationKind, string> = {
    litoral: 'Litoral',
    delta: 'Delta Dunării',
    dunare: 'Dunăre',
    munte: 'Munte',
    oras: 'Oraș',
};

const SOLUNAR_CITY_COORDS = Object.fromEntries(getAllCities().map((c) => [c.slug, { lat: c.lat, lng: c.lng, county: c.county }]));

// Orasele care au deja pagina solunar folosesc aceleasi coordonate, ca orele sa coincida intre pagini.
function city(slug: string, name: string, kind: SunLocationKind = 'oras', note?: string): SunLocation {
    const c = SOLUNAR_CITY_COORDS[slug];
    return { slug, name, county: c.county, lat: c.lat, lng: c.lng, kind, note };
}

export const sunLocations: SunLocation[] = [
    // Litoral (coasta romaneasca priveste spre est: soarele rasare din mare)
    { slug: 'mamaia', name: 'Mamaia', county: 'Constanța', lat: 44.2464, lng: 28.6228, kind: 'litoral', alsoFor: ['Mamaia Nord'], note: 'Mamaia este fâșia de nisip dintre Marea Neagră și lacul Siutghiol: dimineața soarele răsare direct din mare, iar seara apune spre lac.' },
    city('constanta', 'Constanța', 'litoral', 'Constanța privește spre Marea Neagră, așa că soarele răsare din mare. Faleza din zona Cazinoului este unul dintre cele mai cunoscute locuri din oraș pentru răsărit.'),
    { slug: 'navodari', name: 'Năvodari', county: 'Constanța', lat: 44.3208, lng: 28.6125, kind: 'litoral', note: 'Plajele din Năvodari, în nordul litoralului, sunt orientate spre est, deci soarele răsare din mare.' },
    { slug: 'corbu', name: 'Corbu', county: 'Constanța', lat: 44.3833, lng: 28.65, kind: 'litoral', note: 'Plaja Corbu este una dintre plajele sălbatice din nordul litoralului, fără stațiune construită în spate: un loc liniștit pentru răsărit.' },
    { slug: 'vadu', name: 'Vadu', county: 'Constanța', lat: 44.4506, lng: 28.738, kind: 'litoral', note: 'Vadu are o plajă sălbatică, departe de stațiuni, în nordul litoralului românesc.' },
    { slug: 'eforie-nord', name: 'Eforie Nord', county: 'Constanța', lat: 44.0639, lng: 28.6333, kind: 'litoral', note: 'Eforie Nord se află între mare și lacul Techirghiol: dimineața soarele răsare din mare, seara apune spre lac.' },
    { slug: 'eforie-sud', name: 'Eforie Sud', county: 'Constanța', lat: 44.0253, lng: 28.6508, kind: 'litoral', note: 'Eforie Sud, stațiunea mai liniștită de lângă Eforie Nord, are plaja orientată direct spre răsărit.' },
    { slug: 'costinesti', name: 'Costinești', county: 'Constanța', lat: 43.95, lng: 28.6333, kind: 'litoral', note: 'În Costinești, epava Evangelia, eșuată lângă țărm, este unul dintre cele mai fotografiate locuri de pe litoral la răsărit.' },
    { slug: 'olimp', name: 'Olimp', county: 'Constanța', lat: 43.8839, lng: 28.6058, kind: 'litoral', note: 'Olimp este construit pe faleza înaltă din nordul Mangaliei, cu vedere largă spre mare la răsărit.' },
    { slug: 'neptun', name: 'Neptun', county: 'Constanța', lat: 43.8661, lng: 28.6053, kind: 'litoral', alsoFor: ['Jupiter', 'Cap Aurora'], note: 'Neptun este așezat între mare, pădurea Comorova și lacurile Neptun. Stațiunile Jupiter și Cap Aurora sunt la câțiva kilometri spre sud, cu aceleași ore.' },
    { slug: 'venus', name: 'Venus', county: 'Constanța', lat: 43.845, lng: 28.5956, kind: 'litoral', note: 'Venus este stațiunea dintre Cap Aurora și Saturn, cu plaja orientată spre răsărit.' },
    { slug: 'saturn', name: 'Saturn', county: 'Constanța', lat: 43.8267, lng: 28.5889, kind: 'litoral', note: 'Saturn este stațiunea lipită de nordul orașului Mangalia.' },
    { slug: 'mangalia', name: 'Mangalia', county: 'Constanța', lat: 43.8172, lng: 28.5828, kind: 'litoral', note: 'Mangalia este cel mai sudic oraș de pe litoralul românesc, cu port și faleză spre mare.' },
    { slug: '2-mai', name: '2 Mai', county: 'Constanța', lat: 43.7872, lng: 28.5775, kind: 'litoral', note: '2 Mai este satul liniștit dintre Mangalia și Vama Veche, cu plaja orientată spre răsărit.' },
    { slug: 'vama-veche', name: 'Vama Veche', county: 'Constanța', lat: 43.7522, lng: 28.5711, kind: 'litoral', note: 'Vama Veche este ultima localitate de pe litoral înainte de granița cu Bulgaria. Răsăritul pe plajă este un obicei pentru mulți dintre cei care vin aici.' },
    { slug: 'techirghiol', name: 'Techirghiol', county: 'Constanța', lat: 44.0575, lng: 28.5958, kind: 'litoral', note: 'Orașul Techirghiol se află pe malul lacului cu același nume, cunoscut pentru nămolul terapeutic.' },

    // Delta Dunarii
    { slug: 'sulina', name: 'Sulina', county: 'Tulcea', lat: 45.1594, lng: 29.6528, kind: 'delta', note: 'Sulina este cel mai estic oraș al României, acolo unde brațul Sulina se varsă în Marea Neagră, deci printre primele locuri din țară în care răsare soarele.' },
    { slug: 'sfantu-gheorghe-delta', name: 'Sfântu Gheorghe (Delta)', county: 'Tulcea', lat: 44.8965, lng: 29.5929, kind: 'delta', note: 'Satul Sfântu Gheorghe din Delta Dunării se află la vărsarea brațului Sfântu Gheorghe în mare și are o plajă largă, orientată spre răsărit.' },
    { slug: 'tulcea', name: 'Tulcea', county: 'Tulcea', lat: 45.1775, lng: 28.8036, kind: 'delta', note: 'Tulcea este poarta de intrare în Delta Dunării; de pe faleza orașului pleacă vasele spre Sulina și Sfântu Gheorghe.' },

    // Dunare
    { slug: 'dubova', name: 'Dubova', county: 'Mehedinți', lat: 44.6195, lng: 22.2554, kind: 'dunare', note: 'Dubova se află în golful format de Dunăre la Cazanele Mari. Fiind între munți, soarele apare deasupra crestelor mai târziu decât ora calculată la orizont.' },

    // Munte
    { slug: 'sinaia', name: 'Sinaia', county: 'Prahova', lat: 45.35, lng: 25.5514, kind: 'munte', note: 'Sinaia se află pe Valea Prahovei, la poalele Munților Bucegi.' },
    { slug: 'predeal', name: 'Predeal', county: 'Brașov', lat: 45.5047, lng: 25.5786, kind: 'munte', note: 'Predeal este cel mai înalt oraș din România, între Bucegi, Piatra Mare și Postăvarul.' },
    { slug: 'poiana-brasov', name: 'Poiana Brașov', county: 'Brașov', lat: 45.5958, lng: 25.5542, kind: 'munte', note: 'Poiana Brașov este stațiunea de pe versantul Muntelui Postăvarul, deasupra Brașovului.' },
    { slug: 'vatra-dornei', name: 'Vatra Dornei', county: 'Suceava', lat: 47.35, lng: 25.3667, kind: 'munte', note: 'Vatra Dornei este stațiunea balneară din Bucovina de la confluența Dornei cu Bistrița.' },
    { slug: 'campulung-moldovenesc', name: 'Câmpulung Moldovenesc', county: 'Suceava', lat: 47.5308, lng: 25.5514, kind: 'munte', note: 'Câmpulung Moldovenesc se află pe valea Moldovei, înconjurat de munții Bucovinei.' },
    { slug: 'baile-herculane', name: 'Băile Herculane', county: 'Caraș-Severin', lat: 44.8772, lng: 22.4175, kind: 'munte', note: 'Băile Herculane se află pe valea Cernei, între Munții Cernei și Munții Mehedinți.' },

    // Orase cu pagina solunar
    city('bucuresti', 'București'),
    city('brasov', 'Brașov'),
    city('cluj-napoca', 'Cluj-Napoca'),
    city('timisoara', 'Timișoara'),
    city('iasi', 'Iași'),
    city('galati', 'Galați'),
    city('craiova', 'Craiova'),
    city('oradea', 'Oradea'),
    city('sibiu', 'Sibiu'),
    city('targu-mures', 'Târgu Mureș'),
    city('bacau', 'Bacău'),

    // Alte orase
    { slug: 'arad', name: 'Arad', county: 'Arad', lat: 46.1667, lng: 21.3167, kind: 'oras' },
    { slug: 'suceava', name: 'Suceava', county: 'Suceava', lat: 47.6514, lng: 26.2556, kind: 'oras' },
    { slug: 'satu-mare', name: 'Satu Mare', county: 'Satu Mare', lat: 47.79, lng: 22.89, kind: 'oras' },
    { slug: 'baia-mare', name: 'Baia Mare', county: 'Maramureș', lat: 47.6567, lng: 23.5719, kind: 'oras' },
    { slug: 'sighetu-marmatiei', name: 'Sighetu Marmației', county: 'Maramureș', lat: 47.9309, lng: 23.8947, kind: 'oras' },
    { slug: 'targu-jiu', name: 'Târgu Jiu', county: 'Gorj', lat: 45.0342, lng: 23.2747, kind: 'oras' },
    { slug: 'deva', name: 'Deva', county: 'Hunedoara', lat: 45.8719, lng: 22.9117, kind: 'oras' },
    { slug: 'piatra-neamt', name: 'Piatra Neamț', county: 'Neamț', lat: 46.9275, lng: 26.3708, kind: 'oras' },
    { slug: 'slatina', name: 'Slatina', county: 'Olt', lat: 44.4297, lng: 24.3642, kind: 'oras' },
    { slug: 'ramnicu-valcea', name: 'Râmnicu Vâlcea', county: 'Vâlcea', lat: 45.1047, lng: 24.3756, kind: 'oras' },
    { slug: 'vaslui', name: 'Vaslui', county: 'Vaslui', lat: 46.6383, lng: 27.7292, kind: 'oras' },
    { slug: 'ploiesti', name: 'Ploiești', county: 'Prahova', lat: 44.9411, lng: 26.0225, kind: 'oras' },
    { slug: 'campina', name: 'Câmpina', county: 'Prahova', lat: 45.1281, lng: 25.7383, kind: 'oras' },
    { slug: 'pitesti', name: 'Pitești', county: 'Argeș', lat: 44.8667, lng: 24.8833, kind: 'oras' },
    { slug: 'buzau', name: 'Buzău', county: 'Buzău', lat: 45.1517, lng: 26.8167, kind: 'oras' },
    { slug: 'braila', name: 'Brăila', county: 'Brăila', lat: 45.2692, lng: 27.9575, kind: 'oras' },
    { slug: 'tecuci', name: 'Tecuci', county: 'Galați', lat: 45.8467, lng: 27.4278, kind: 'oras' },
    { slug: 'botosani', name: 'Botoșani', county: 'Botoșani', lat: 47.7486, lng: 26.6694, kind: 'oras' },
    { slug: 'focsani', name: 'Focșani', county: 'Vrancea', lat: 45.6997, lng: 27.1797, kind: 'oras' },
    { slug: 'alba-iulia', name: 'Alba Iulia', county: 'Alba', lat: 46.0764, lng: 23.5728, kind: 'oras' },
    { slug: 'turda', name: 'Turda', county: 'Cluj', lat: 46.5667, lng: 23.7833, kind: 'oras' },
    { slug: 'sighisoara', name: 'Sighișoara', county: 'Mureș', lat: 46.2169, lng: 24.7911, kind: 'oras' },
    { slug: 'bistrita', name: 'Bistrița', county: 'Bistrița-Năsăud', lat: 47.1333, lng: 24.4833, kind: 'oras' },
    { slug: 'zalau', name: 'Zalău', county: 'Sălaj', lat: 47.1911, lng: 23.0572, kind: 'oras' },
    { slug: 'resita', name: 'Reșița', county: 'Caraș-Severin', lat: 45.3, lng: 21.8903, kind: 'oras' },
    { slug: 'drobeta-turnu-severin', name: 'Drobeta-Turnu Severin', county: 'Mehedinți', lat: 44.6361, lng: 22.6556, kind: 'oras' },
    { slug: 'alexandria', name: 'Alexandria', county: 'Teleorman', lat: 43.9686, lng: 25.3333, kind: 'oras' },
    { slug: 'giurgiu', name: 'Giurgiu', county: 'Giurgiu', lat: 43.9, lng: 25.9667, kind: 'oras' },
    { slug: 'calarasi', name: 'Călărași', county: 'Călărași', lat: 44.2, lng: 27.3333, kind: 'oras' },
    { slug: 'slobozia', name: 'Slobozia', county: 'Ialomița', lat: 44.5639, lng: 27.3661, kind: 'oras' },
    { slug: 'targoviste', name: 'Târgoviște', county: 'Dâmbovița', lat: 44.9244, lng: 25.4572, kind: 'oras' },
    { slug: 'miercurea-ciuc', name: 'Miercurea Ciuc', county: 'Harghita', lat: 46.3594, lng: 25.8039, kind: 'oras' },
    { slug: 'sfantu-gheorghe', name: 'Sfântu Gheorghe', county: 'Covasna', lat: 45.8653, lng: 25.7878, kind: 'oras' },
];

export function getSunLocation(slug: string): SunLocation | undefined {
    return sunLocations.find((l) => l.slug === slug);
}

/** Distanta aproximativa in km (haversine). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
}
