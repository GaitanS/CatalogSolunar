/**
 * Ghidul de pescuit al fiecarei luni calendaristice, afisat pe paginile lunare
 * (/solunar-<luna>-<an>) si in versiunea lor Markdown. Textul e scris pentru
 * luna, nu pentru an, asa ca decembrie 2026 si decembrie 2027 il impart.
 *
 * Reguli verificate pe 2026-11-23 (Capital 4 si 9 aprilie 2026, TVR 8 iunie 2026,
 * despre Ordinul 23/297/2025 cu modificarile ulterioare; nu textul ordinului):
 * - prohibitia generala 2026: 9 aprilie - 7 iunie, 60 de zile, toate habitatele
 *   piscicole naturale; pe apele de granita 24 aprilie - 7 iunie;
 * - in Delta Dunarii: stiuca 1 februarie - 20 martie, salau si biban
 *   20 martie - 7 iunie (presa le da doar pentru Delta);
 * - pastravul: 1 octombrie - 31 martie in ordinul pentru 2025.
 * Articolul /blog/prohibitie-pescuit-2026 foloseste aceleasi date.
 * Cand apare ordinul pentru 2027, actualizeaza aprilie, iunie si martie.
 */

export interface MonthGuideSpecies {
    name: string;
    text: string;
}

export interface MonthGuide {
    heading: string;
    intro: string;
    species: MonthGuideSpecies[];
    /** Cum folosesti solunarul in luna asta. */
    timing: string;
    /** Reguli sau siguranta (titlu "Atenție"), ori un sfat (titlu "Bine de știut"). */
    note: { kind: 'caution' | 'tip'; text: string };
}

const ICE_SAFETY =
    'nu urca pe gheață până nu are cel puțin aproximativ 10 cm de gheață nouă, transparentă; gheața albă, veche sau acoperită de zăpadă ține mai puțin. Nu merge singur, evită zonele cu vegetație sau curent, unde gheața e mai subțire, și ia o funie cu tine. La urgență, sună la 112.';

/** Indexat dupa luna: 0 = ianuarie, 11 = decembrie. */
export const MONTH_GUIDES: MonthGuide[] = [
    {
        heading: 'Pescuitul în ianuarie: apă rece și ferestre scurte',
        intro:
            'Ianuarie este de obicei cea mai rece lună a anului. Temperatura apei coboară la câteva grade, peștii își încetinesc metabolismul și stau grupați în zonele adânci, unde apa e mai stabilă. Partidele bune sunt scurte, iar diferența o face ora aleasă, nu durata.',
        species: [
            { name: 'Știuca', text: 'rămâne activă și în apă rece. Caut-o lângă gropi și margini de stuf, cu peștișor mort pe fund sau cu năluci trase foarte lent.' },
            { name: 'Bibanul', text: 'stă în cârduri lângă structuri: copaci căzuți, piloni, praguri. Răspunde la jiguri mici și la pescuitul vertical, inclusiv la copcă.' },
            { name: 'Șalăul', text: 'se hrănește mai ales la lumină slabă. Caută-l pe fundul gropilor, cu twistere mici trase lent.' },
            { name: 'Cleanul', text: 'pe râuri, în apa lentă de lângă mal. Ia la momeli mici: pâine, cașcaval sau viermi.' },
        ],
        timing:
            'Iarna contează ca perioada majoră să cadă în orele cele mai calde, între prânz și după-amiază. O zi de 4/5 cu fereastra majoră la 3 dimineața aduce de multe ori mai puțin decât o zi de 3/5 cu fereastra la ora 13. Cele mai bune sunt zilele însorite care vin după câteva zile de vreme stabilă.',
        note: { kind: 'caution', text: `Dacă pescuiești la copcă: ${ICE_SAFETY}` },
    },
    {
        heading: 'Pescuitul în februarie: sfârșitul iernii',
        intro:
            'Februarie rămâne rece, dar zilele cresc vizibil, iar o săptămână de vreme blândă încălzește repede apele mici. Peștii se mișcă puțin, însă profită de orice creștere a temperaturii. Spre sfârșitul lunii, gheața de pe bălți devine nesigură.',
        species: [
            { name: 'Bibanul', text: 'cea mai sigură țintă a lunii: stă în grupuri, pe structuri adânci, și ia la năluci mici prezentate lent.' },
            { name: 'Șalăul', text: 'activ la apus și pe vreme înnorată. Caută-l pe muchii și în gropi, cu shad-uri sau twistere mici.' },
            { name: 'Cleanul', text: 'pe râuri, în apa lentă de lângă mal, mai ales după câteva zile cu temperaturi peste zero.' },
            { name: 'Carasul', text: 'pe bălțile mici, care se încălzesc primele, poate începe să tragă în zilele cu soare, la momeli fine.' },
        ],
        timing:
            'Ca în ianuarie, caută perioadele majore din mijlocul zilei. Prima zi însorită după un val de frig e de multe ori mai bună decât arată ratingul ei, mai ales pe apele mici și puțin adânci.',
        note: {
            kind: 'caution',
            text: 'Știuca intră în reproducere la sfârșitul iernii. În Delta Dunării, pescuitul ei a fost interzis separat între 1 februarie și 20 martie în 2026; pe alte ape, verifică ordinul în vigoare înainte să pleci după știucă. La copcă, ai grijă la gheața care se topește: ce te-a ținut în ianuarie poate ceda acum.',
        },
    },
    {
        heading: 'Pescuitul în martie: trezirea apelor',
        intro:
            'În martie apa începe să se încălzească, iar peștii urcă din gropile de iarnă spre zonele puțin adânci, care primesc soare. Primele zile calde pot aduce partide foarte bune, dar o răcire bruscă îi trimite înapoi în adânc.',
        species: [
            { name: 'Carasul și plătica', text: 'primii pașnici care pornesc. Caută golfurile însorite și apa mică de lângă stuf, cu momeli fine și nadă puțină.' },
            { name: 'Bibanul', text: 'se apropie de zonele de depunere și e activ pe malurile cu vegetație și structuri.' },
            { name: 'Șalăul', text: 'se hrănește intens înainte de reproducere, mai ales la lumină slabă.' },
            { name: 'Crapul', text: 'poate trage pe bălțile private în zilele calde. E încă lent, așa că pune nadă puțină: ce rămâne nemâncat strică locul.' },
        ],
        timing:
            'Cele mai bune ferestre sunt perioadele majore de la prânz și din după-amiază, când apa mică s-a încălzit. Câteva zile calde și stabile fac mai mult decât o singură zi de 5/5 venită imediat după un front rece.',
        note: {
            kind: 'caution',
            text: 'Pe apele naturale, prohibiția generală de primăvară începe de obicei în aprilie (în 2026: 9 aprilie – 7 iunie). În Delta Dunării, în 2026 știuca a fost protejată până pe 20 martie, iar șalăul și bibanul de la 20 martie. Păstrăvul din apele de munte e protejat din toamnă până în primăvară: în ordinul pentru 2025, între 1 octombrie și 31 martie.',
        },
    },
    {
        heading: 'Pescuitul în aprilie: prohibiție pe apele naturale, sezon pe bălți',
        intro:
            'Aprilie aduce apă tot mai caldă și pești care se hrănesc tot mai mult, dar și începutul prohibiției generale. Pe râuri, lacuri naturale, Dunăre și în Deltă, pescuitul este interzis pentru toate speciile cât durează prohibiția. În 2026 ea a ținut 60 de zile, între 9 aprilie și 7 iunie. Pescuitul legal se mută pe bălțile private.',
        species: [
            { name: 'Crapul', text: 'pe bălțile private devine tot mai activ pe măsură ce apa se încălzește. Pescuiește în zonele cu apă mică, încălzite de soare, cu nadă moderată.' },
            { name: 'Carasul', text: 'trage bine pe apă mică și liniștită, mai ales după-amiaza.' },
            { name: 'Plătica', text: 'se adună în cârduri și răspunde la nadă fină, pe fund.' },
            { name: 'Linul', text: 'începe să se arate lângă vegetație, dimineața devreme și seara.' },
        ],
        timing:
            'Folosește ratingul ca să alegi ziua de baltă și perioada majoră pentru ora de vârf. Ferestrele dinaintea unei schimbări de vreme sunt de multe ori foarte bune; după un front rece, peștii au nevoie de o zi sau două ca să-și revină.',
        note: {
            kind: 'caution',
            text: 'Prohibiția acoperă habitatele piscicole naturale; bălțile private (amenajări piscicole) nu intră aici, așa că acolo contează regulamentul bălții. Pentru 2027, verifică datele în ordinul de prohibiție în vigoare înainte de primele ieșiri din aprilie.',
        },
    },
    {
        heading: 'Pescuitul în mai: luna reproducerii',
        intro:
            'În mai apa ajunge la temperaturi bune pentru majoritatea speciilor, iar multe dintre ele se reproduc. Crapul depune icrele când apa ajunge în jur de 18–20 °C, de obicei între mai și iunie. Pe apele naturale, mai este în întregime în prohibiție.',
        species: [
            { name: 'Crapul', text: 'pe bălțile private, se hrănește intens înainte și după depunere, dar aproape deloc în zilele de reproducere, când îl vezi la suprafață, în apă mică.' },
            { name: 'Linul', text: 'mai este una dintre cele mai bune luni pentru el: dimineața devreme, lângă nuferi și stuf.' },
            { name: 'Carasul și plătica', text: 'trag constant la nadă fină, pe fund sau la plută.' },
        ],
        timing:
            'Zilele sunt lungi, așa că perioadele majore de dimineață și de seară cad des în lumină bună. Când o fereastră majoră se suprapune cu răsăritul sau apusul, merită prioritate.',
        note: {
            kind: 'tip',
            text: 'Peștele prins în perioada de reproducere merită eliberat cu grijă, mai ales femelele pline de icre. Pe apele naturale, pescuitul rămâne interzis până la sfârșitul prohibiției.',
        },
    },
    {
        heading: 'Pescuitul în iunie: se redeschid apele naturale',
        intro:
            'La începutul lui iunie se încheie de obicei prohibiția generală (în 2026, după 7 iunie), iar râurile, lacurile naturale și Dunărea se redeschid. Majoritatea peștilor au terminat reproducerea și sunt flămânzi, așa că primele zile după prohibiție sunt de multe ori printre cele mai bune din an.',
        species: [
            { name: 'Somnul', text: 'se reproduce la început de vară, în apă caldă. Seara și noaptea, pe Dunăre și pe lacurile mari, cu momeli mari, pe fund.' },
            { name: 'Crapul', text: 'după reproducere se hrănește intens: seara, noaptea și dimineața devreme.' },
            { name: 'Șalăul', text: 'revine pe muchii și praguri după prohibiție. Năluci la apus și în zori.' },
            { name: 'Avatul', text: 'vânează la suprafață după peștișori, pe Dunăre și pe râurile mari, mai ales în zori.' },
        ],
        timing:
            'Mută partidele spre seară și noapte. O perioadă majoră care cade după apus, într-o zi de 4/5 sau 5/5, este cea mai bună fereastră a lunii pentru somn și crap.',
        note: {
            kind: 'caution',
            text: 'Data la care se termină prohibiția diferă de la an la an, iar pe apele de graniță perioada a fost mai scurtă; Delta Dunării are și reguli proprii. Verifică ordinul anului înainte de prima ieșire. Pe apele naturale ai nevoie de permis de pescuit recreativ.',
        },
    },
    {
        heading: 'Pescuitul în iulie: caniculă și pescuit de noapte',
        intro:
            'Iulie este de obicei cea mai caldă lună. Apa caldă ține mai puțin oxigen, așa că la amiază peștii stau în adânc, la umbră sau în apă cu curent, și se hrănesc puțin. Activitatea se mută spre zori, seară și noapte.',
        species: [
            { name: 'Somnul', text: 'cea mai bună perioadă pentru pescuitul de noapte, pe Dunăre și pe râurile mari.' },
            { name: 'Crapul', text: 'noaptea și dimineața devreme, în zonele adânci sau cu apă oxigenată. Ziua îl găsești uneori la suprafață, la momeli plutitoare.' },
            { name: 'Șalăul', text: 'în zori și la apus, pe praguri și muchii.' },
            { name: 'Avatul', text: 'vânează la suprafață dimineața devreme, pe râurile mari.' },
        ],
        timing:
            'Alege perioadele solunare care cad în răcoare: dimineața devreme, după apus și noaptea. O perioadă majoră la ora 14, într-o zi de caniculă, valorează de obicei puțin, chiar și cu rating mare.',
        note: {
            kind: 'tip',
            text: 'Pe caniculă, peștele ținut în juvelnic suferă repede în apa caldă și săracă în oxigen; dacă îl eliberezi, fă-o cât mai repede. Ai grijă și de tine: apă, umbră și pauze în orele fierbinți.',
        },
    },
    {
        heading: 'Pescuitul în august: nopți mai lungi și primele răciri',
        intro:
            'August pornește cald, dar nopțile se lungesc și, spre final, apar primele dimineți răcoroase. Apa începe să se răcească încet, iar peștii prind din nou ferestre bune de hrănire, mai ales seara și în zori.',
        species: [
            { name: 'Crapul', text: 'trage bine noaptea și în zori. Spre sfârșitul lunii, nadirea constantă în același loc începe să conteze.' },
            { name: 'Somnul', text: 'rămâne activ noaptea, mai ales înaintea și după furtunile de vară.' },
            { name: 'Șalăul', text: 'în zori și la apus, iar după primele răciri și în mijlocul zilei, pe vreme înnorată.' },
            { name: 'Știuca', text: 'începe să se miște mai mult pe măsură ce apa se răcește, pe marginile de vegetație.' },
        ],
        timing:
            'Caută perioadele majore apropiate de apus și de răsărit. După o furtună care răcește vremea, a doua sau a treia zi stabilă e de multe ori mai bună decât ziua de imediat după front.',
        note: {
            kind: 'tip',
            text: 'În bălțile mici și puțin adânci, apa poate rămâne aproape fără oxigen în nopțile calde și fără vânt. Atunci peștele se mută în zonele mai adânci sau acolo unde intră apă proaspătă.',
        },
    },
    {
        heading: 'Pescuitul în septembrie: hrănirea de dinaintea iernii',
        intro:
            'Septembrie este pentru mulți pescari cea mai bună lună a anului. Apa se răcește treptat, oxigenul revine, iar peștii încep să se hrănească intens ca să-și facă rezerve pentru iarnă. Activitatea se întinde din nou pe tot parcursul zilei.',
        species: [
            { name: 'Crapul', text: 'se hrănește susținut. Partidele lungi pe bălți, cu nadire constantă, dau cele mai bune rezultate.' },
            { name: 'Știuca', text: 'devine tot mai activă pe marginile de stuf și vegetație, la năluci.' },
            { name: 'Șalăul', text: 'activ dimineața, seara și pe vreme înnorată.' },
            { name: 'Bibanul', text: 'vânează în cârduri după peștișori; urmărește agitația de la suprafață.' },
        ],
        timing:
            'În septembrie pot fi bune perioadele majore din orice moment al zilei. Prioritate au zilele de 4/5 și 5/5 cu presiune stabilă; o scădere lentă a presiunii înaintea unui front aduce adesea o fereastră scurtă și foarte activă.',
        note: {
            kind: 'tip',
            text: 'Prima răcire puternică poate opri crapul câteva zile. Dacă temperatura apei scade brusc, mută-te pe răpitori, care suportă mai bine răcirea.',
        },
    },
    {
        heading: 'Pescuitul în octombrie: sezonul răpitorilor',
        intro:
            'În octombrie apa se răcește vizibil, iar diferența dintre zi și noapte crește. Răpitorii intră în cea mai bună perioadă a anului, iar crapul se hrănește încă, dar pe ferestre mai scurte, de obicei în orele calde.',
        species: [
            { name: 'Știuca', text: 'la cel mai bun nivel al anului: năluci mai mari, linguri și voblere, pe marginile de vegetație care se rărește.' },
            { name: 'Șalăul', text: 'se adună pe muchii și în gropi. Jiguri pe fund, dimineața, seara și pe vreme înnorată.' },
            { name: 'Bibanul', text: 'în cârduri mari, lângă structuri. Năluci mici, trase pe fund.' },
            { name: 'Crapul', text: 'pe ferestrele calde de la prânz și din după-amiază, cu mai puțină nadă decât vara.' },
        ],
        timing:
            'Pe măsură ce nopțile se răcesc, perioadele majore din mijlocul zilei devin tot mai valoroase. O zi de 4/5 cu fereastra majoră la prânz, pe vreme stabilă, este ținta ideală pentru răpitori.',
        note: {
            kind: 'caution',
            text: 'Păstrăvul din apele de munte intră de regulă în prohibiție din toamnă (în ordinul pentru 2025, de la 1 octombrie). Verifică ordinul în vigoare înainte de o ieșire la munte.',
        },
    },
    {
        heading: 'Pescuitul în noiembrie: partide scurte, bine alese',
        intro:
            'Noiembrie aduce zile scurte, apă rece și primele brume. Pașnicii încetinesc, iar răpitorii rămân activi, dar se mută spre zonele adânci. Câteva ore puse pe momentul potrivit aduc mai mult decât o zi întreagă la apă.',
        species: [
            { name: 'Șalăul', text: 'una dintre cele mai bune luni pentru el: gropi și muchii, la lumină slabă și pe vreme înnorată.' },
            { name: 'Știuca', text: 'încă activă, mai ales în zilele blânde. Prezentările trebuie să fie mai lente decât în octombrie.' },
            { name: 'Bibanul', text: 'în cârduri strânse, pe structuri adânci.' },
            { name: 'Crapul', text: 'pe bălțile private, doar în zilele mai calde, cu foarte puțină nadă.' },
        ],
        timing:
            'Alege perioadele majore care cad între prânz și apus, când apa e cea mai caldă și lumina e bună. Cele mai sigure sunt zilele cu presiune stabilă, după câteva zile de vreme liniștită.',
        note: {
            kind: 'tip',
            text: 'Ceața și frigul de dimineață scad activitatea în primele ore. Spre deosebire de vară, nu e nevoie să fii la apă înainte de răsărit.',
        },
    },
    {
        heading: 'Pescuitul în decembrie: precizie pe apă rece',
        intro:
            'În decembrie apa se apropie de temperaturile de iarnă, iar pe bălțile mici poate apărea prima gheață. Peștii se adună în gropile adânci și se hrănesc rar, așa că alegerea zilei și a orei contează mai mult decât în orice altă lună.',
        species: [
            { name: 'Știuca', text: 'una dintre cele mai bune ținte de iarnă: peștișor mort pe fund sau năluci trase foarte lent, lângă gropi.' },
            { name: 'Bibanul', text: 'în cârduri, pe structuri adânci. Jiguri mici și pescuit vertical.' },
            { name: 'Șalăul', text: 'activ la apus și pe vreme înnorată, pe fundul gropilor.' },
            { name: 'Cleanul', text: 'pe râuri, în apă lentă, la momeli mici.' },
        ],
        timing:
            'Caută zilele de 4/5 și 5/5 în care perioada majoră cade între prânz și apus. O zi însorită, după câteva zile de vreme stabilă, bate de multe ori o zi cu rating mare dar cu frig brusc și vânt.',
        note: { kind: 'caution', text: `Prima gheață este cea mai înșelătoare: ${ICE_SAFETY}` },
    },
];

export function getMonthGuide(monthIndex: number): MonthGuide {
    const guide = MONTH_GUIDES[monthIndex];
    if (!guide) throw new Error(`Nu există ghid pentru luna ${monthIndex}`);
    return guide;
}

/**
 * Ora din zi in care sfatul lunii cauta perioada majora: la pranz iarna,
 * dimineata devreme, seara si noaptea vara, ziua primavara si toamna.
 */
export type GuideWindow = 'midday' | 'cool' | 'daylight';

const GUIDE_WINDOWS: GuideWindow[] = [
    'midday', 'midday', 'midday', 'daylight', 'cool', 'cool',
    'cool', 'cool', 'daylight', 'midday', 'midday', 'midday',
];

export function getMonthGuideWindow(monthIndex: number): GuideWindow {
    return GUIDE_WINDOWS[monthIndex];
}

export const MONTH_GUIDE_NOTE_LABEL: Record<MonthGuide['note']['kind'], string> = {
    caution: 'Atenție',
    tip: 'Bine de știut',
};
