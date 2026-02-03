export interface FishSpecies {
    slug: string;
    name: string;
    scientificName: string;
    icon: string;
    season: string;
    bestMoonPhase: string;
    bestTime: string;
    techniques: string[];
    bait: string[];
    description: string;
    habitat: string;
    solunarTip: string;
}

export const fishSpecies: FishSpecies[] = [
    {
        slug: 'pescuit-crap',
        name: 'Crap',
        scientificName: 'Cyprinus carpio',
        icon: '🐟',
        season: 'Aprilie - Octombrie',
        bestMoonPhase: 'Luna plina si luna noua',
        bestTime: 'Dimineata devreme (05:00-09:00) si seara (18:00-22:00)',
        techniques: ['Pescuit la pluta', 'Pescuit la feeder', 'Pescuit pe sesiuni (48h)', 'Method feeder', 'Pescuit la boilies'],
        bait: ['Porumb fiert', 'Boilies', 'Pelete', 'Aluat', 'Cartofi fierti', 'Nada cu pesmet'],
        description: 'Crapul este cel mai popular peste de apa dulce din Romania, prezent in majoritatea lacurilor si raurilor. Este un peste puternic care ofera lupte memorabile si poate atinge greutati de peste 20 kg.',
        habitat: 'Lacuri, balti, rauri cu curs lent, canale. Prefera zonele cu vegetatie subacvatica si fund moale.',
        solunarTip: 'Crapul este foarte sensibil la fazele lunare. In perioadele majore solunar, activitatea de hranire creste semnificativ. Luna plina si luna noua sunt cele mai productive perioade pentru pescuitul de crap.',
    },
    {
        slug: 'pescuit-salau',
        name: 'Salau',
        scientificName: 'Sander lucioperca',
        icon: '🐠',
        season: 'Martie - Noiembrie',
        bestMoonPhase: 'Luna noua si ultimul patrar',
        bestTime: 'Zorii zilei (05:00-08:00) si amurg (17:00-20:00)',
        techniques: ['Pescuit la spinning', 'Pescuit la jig', 'Pescuit la twister', 'Pescuit la voblere', 'Trolling'],
        bait: ['Twistere', 'Shad-uri', 'Voblere', 'Jig-uri', 'Peste viu mic'],
        description: 'Salaul este unul dintre cei mai cautati pradatori de apa dulce din Romania. Este apreciat atat pentru sportivitate cat si pentru calitatea carnii. Poate depasi 10 kg in apele romanesti.',
        habitat: 'Lacuri de acumulare, rauri mari, Delta Dunarii. Prefera apele adanci, curate, cu fund pietros sau nisipos.',
        solunarTip: 'Salaul este un pradator nocturn care reactioneaza puternic la perioadele solunar minore, in special in timpul zorilor si amurgului. Luminozitatea redusa a lunii noi il activeaza maxim.',
    },
    {
        slug: 'pescuit-pastrav',
        name: 'Pastrav',
        scientificName: 'Salmo trutta fario',
        icon: '🐟',
        season: 'Aprilie - Septembrie',
        bestMoonPhase: 'Luna noua si primul patrar',
        bestTime: 'Dimineata (06:00-10:00) si dupa-amiaza tarziu (16:00-19:00)',
        techniques: ['Pescuit la musca', 'Spinning ultralight', 'Pescuit la rotativa', 'Nymphing', 'Dry fly'],
        bait: ['Muste artificiale', 'Nimfe', 'Rotative mici', 'Viermi', 'Larve de insecte'],
        description: 'Pastravul de rau este simbolul pescuitului sportiv din Romania. Traieste in raurile montane curate si reci. Lupta sa spectaculoasa si habitatul natural superb il fac favoritul pescarilor sportivi.',
        habitat: 'Rauri montane cu apa rece si curata, paraie, lacuri glaciare. Necesita apa oxigenata cu temperatura sub 18°C.',
        solunarTip: 'Pastravul se hraneste activ in perioadele solunar majore, mai ales dimineata devreme. Ecloziunea insectelor acvatice coincide adesea cu aceste perioade, crescand eficienta pescuitului la musca.',
    },
    {
        slug: 'pescuit-somn',
        name: 'Somn',
        scientificName: 'Silurus glanis',
        icon: '🐋',
        season: 'Mai - Octombrie',
        bestMoonPhase: 'Luna noua',
        bestTime: 'Noapte (21:00-04:00)',
        techniques: ['Pescuit la somn cu clonc', 'Spinning heavy', 'Pescuit cu peste viu', 'Pescuit la fund', 'Catfishing'],
        bait: ['Peste viu', 'Calmar', 'Ficat de pui', 'Lipitori', 'Raci'],
        description: 'Somnul este cel mai mare peste de apa dulce din Europa, putand depasi 100 kg in Dunare si Delta. Este un pradator nocturn care ofera cele mai intense lupte din pescuitul romanesc.',
        habitat: 'Dunarea, rauri mari, lacuri de acumulare, Delta Dunarii. Prefera gropile adanci, malurile abrupte si zonele cu adapost.',
        solunarTip: 'Somnul este extrem de activ in perioadele majore solunar nocturne. Luna noua combinata cu o perioada majora intre orele 22:00-02:00 ofera cele mai bune sanse de captura.',
    },
    {
        slug: 'pescuit-stiuca',
        name: 'Stiuca',
        scientificName: 'Esox lucius',
        icon: '🐊',
        season: 'Martie - Decembrie',
        bestMoonPhase: 'Luna plina si luna noua',
        bestTime: 'Dimineata (07:00-11:00) si dupa-amiaza (14:00-17:00)',
        techniques: ['Spinning', 'Pescuit cu momeli artificiale', 'Pescuit cu peste viu', 'Trolling', 'Jerkbait'],
        bait: ['Voblere', 'Spinnerbaits', 'Jerkbaits', 'Shad-uri mari', 'Peste viu'],
        description: 'Stiuca este un pradator agresiv si spectaculos, prezent in lacuri si rauri din toata Romania. Atacurile sale explozive si lupta violenta o fac una dintre cele mai cautate specii sportive.',
        habitat: 'Lacuri cu vegetatie, balti, rauri cu curs lent, canale. Prefera zonele cu stuf, nuferi si vegetatie subacvatica unde pandeste prada.',
        solunarTip: 'Stiuca reactioneaza puternic la tranzitul lunar. Perioadele majore solunar din timpul zilei sunt ideale, deoarece stiuca este un pradator vizual care se hraneste activ la lumina.',
    },
    {
        slug: 'pescuit-caras',
        name: 'Caras',
        scientificName: 'Carassius gibelio',
        icon: '🐟',
        season: 'Martie - Noiembrie',
        bestMoonPhase: 'Primul patrar si ultimul patrar',
        bestTime: 'Dimineata (06:00-10:00) si seara (17:00-20:00)',
        techniques: ['Pescuit la pluta', 'Pescuit la fund', 'Pescuit la feeder light', 'Pescuit la bologneza'],
        bait: ['Viermi de pamant', 'Porumb', 'Aluat', 'Larve de libelula', 'Mamaliga'],
        description: 'Carasul este pestele cel mai raspandit in apele romanesti si favoritul pescarilor incepatori. Desi nu atinge dimensiuni mari, ofera pescuit relaxant si constant in aproape orice apa.',
        habitat: 'Balti, lacuri, canale, rauri cu curs lent, iazuri. Se adapteaza la aproape orice tip de apa dulce statatoare sau cu curs lent.',
        solunarTip: 'Carasul se hraneste constant, dar perioadele solunar minore aduc o crestere vizibila a muscarilor. Este mai putin sensibil la fazele lunare decat crapul sau salaul.',
    },
];

export function getSpeciesBySlug(slug: string): FishSpecies | undefined {
    return fishSpecies.find(s => s.slug === slug);
}

export function getAllSpecies(): FishSpecies[] {
    return fishSpecies;
}
