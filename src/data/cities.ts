export interface CityData {
    slug: string;
    name: string;
    lat: number;
    lng: number;
    county: string;
    nearbyWaters: string[];
    description: string;
}

export const cities: CityData[] = [
    {
        slug: 'bucuresti',
        name: 'București',
        lat: 44.4268,
        lng: 26.1025,
        county: 'București',
        nearbyWaters: ['Lacul Morii', 'Lacul Snagov', 'Lacul Cernica', 'Râul Dâmbovița', 'Lacul Buftea'],
        description: 'Capitala României oferă acces rapid la numeroase lacuri de agrement și bălți din zona Ilfov, ideale pentru pescuit recreational.',
    },
    {
        slug: 'cluj-napoca',
        name: 'Cluj-Napoca',
        lat: 46.7712,
        lng: 23.6236,
        county: 'Cluj',
        nearbyWaters: ['Lacul Tarnița', 'Lacul Gilău', 'Lacul Beliș-Fântânele', 'Râul Someșul Mic'],
        description: 'Cluj-Napoca beneficiază de lacuri montane spectaculoase în Munții Apuseni, perfecte pentru pescuitul de păstrăv și salmonide.',
    },
    {
        slug: 'timisoara',
        name: 'Timișoara',
        lat: 45.7489,
        lng: 21.2087,
        county: 'Timiș',
        nearbyWaters: ['Râul Bega', 'Lacul Surduc', 'Lacul Satchinez', 'Balta Ivanda'],
        description: 'Timișoara și împrejurimile oferă pescuit variat pe canalul Bega și lacurile din câmpia Banatului, cu specii diverse de apă dulce.',
    },
    {
        slug: 'iasi',
        name: 'Iași',
        lat: 47.1585,
        lng: 27.6014,
        county: 'Iași',
        nearbyWaters: ['Lacul Ciric', 'Râul Prut', 'Lacul Podu Iloaiei', 'Balta Hălceni'],
        description: 'Iași oferă oportunități excelente de pescuit pe lacurile din zonă și pe râul Prut, una dintre cele mai productive ape din Moldova.',
    },
    {
        slug: 'constanta',
        name: 'Constanța',
        lat: 44.1598,
        lng: 28.6348,
        county: 'Constanța',
        nearbyWaters: ['Marea Neagră', 'Lacul Siutghiol', 'Delta Dunării', 'Canalul Dunăre-Marea Neagră'],
        description: 'Constanța combină pescuitul marin pe Marea Neagră cu lacurile costiere și proximitatea Deltei Dunării, paradisul pescarilor.',
    },
    {
        slug: 'brasov',
        name: 'Brașov',
        lat: 45.6427,
        lng: 25.5887,
        county: 'Brașov',
        nearbyWaters: ['Lacul Noua', 'Râul Olt', 'Lacul Bâlea', 'Lacul Colțești'],
        description: 'Brașov oferă acces la râuri montane cu păstrăv și lacuri din zona Făgăraș, într-un cadru natural spectaculos.',
    },
    {
        slug: 'galati',
        name: 'Galați',
        lat: 45.4353,
        lng: 28.0080,
        county: 'Galați',
        nearbyWaters: ['Dunărea', 'Lacul Brateș', 'Râul Siret', 'Balta Mălina'],
        description: 'Galați, situat la confluența Dunării cu Siretul, este un paradis pentru pescarii de somn, șalău și crap pe ape mari.',
    },
    {
        slug: 'craiova',
        name: 'Craiova',
        lat: 44.3302,
        lng: 23.7949,
        county: 'Dolj',
        nearbyWaters: ['Râul Jiu', 'Lacul Fântânele', 'Balta Craiovei', 'Lacul Ișalnița'],
        description: 'Craiova și Oltenia oferă pescuit excelent pe Jiu și lacurile de acumulare din zona colinară, cu varietate mare de specii.',
    },
    {
        slug: 'oradea',
        name: 'Oradea',
        lat: 47.0458,
        lng: 21.9187,
        county: 'Bihor',
        nearbyWaters: ['Râul Crișul Repede', 'Lacul Paleu', 'Lacul Cârja', 'Balta Cefa'],
        description: 'Oradea beneficiază de râurile Crișului și lacurile naturale din vestul țării, cunoscute pentru populațiile sănătoase de crap și caras.',
    },
    {
        slug: 'sibiu',
        name: 'Sibiu',
        lat: 45.7983,
        lng: 24.1256,
        county: 'Sibiu',
        nearbyWaters: ['Râul Olt', 'Lacul Bâlea', 'Lacul Avrig', 'Râul Cibin'],
        description: 'Sibiu oferă pescuit montan de excepție pe văile Oltului și în lacurile glaciare din Munții Făgăraș.',
    },
    {
        slug: 'targu-mures',
        name: 'Târgu Mureș',
        lat: 46.5386,
        lng: 24.5575,
        county: 'Mureș',
        nearbyWaters: ['Râul Mureș', 'Lacul Bezid', 'Lacul Zau de Câmpie', 'Balta Cipău'],
        description: 'Târgu Mureș beneficiază de râul Mureș și lacurile din Câmpia Transilvaniei, excelente pentru pescuit de ciprinide.',
    },
    {
        slug: 'bacau',
        name: 'Bacău',
        lat: 46.5670,
        lng: 26.9146,
        county: 'Bacău',
        nearbyWaters: ['Râul Bistrița', 'Lacul Lilieci', 'Lacul Poiana Uzului', 'Râul Siret'],
        description: 'Bacău oferă pescuit pe râurile montane Bistrița și Siret, cu lacuri de acumulare populate cu păstrăv și clean.',
    },
];

export function getCityBySlug(slug: string): CityData | undefined {
    return cities.find(c => c.slug === slug);
}

export function getAllCities(): CityData[] {
    return cities;
}
