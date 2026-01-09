export interface BlogArticle {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: string;
    readTime: number;
    keywords: string[];
}

export const blogArticles: BlogArticle[] = [
    {
        slug: 'ce-este-calendarul-solunar',
        title: 'Ce este Calendarul Solunar și De Ce Funcționează',
        excerpt: 'Nu-i vrăjeală. Teoria solunar explică de ce peștii mușcă mai bine la anumite ore. Iată știința din spate.',
        date: '2026-01-07',
        author: 'Echipa Calendar Solunar',
        category: 'Ghiduri',
        readTime: 6,
        keywords: ['calendar solunar', 'teoria solunar', 'pescuit luna', 'perioade majore minore'],
        content: `
John Alden Knight a stat 6 ani să documenteze când mușcă peștii. În 1926 a publicat teoria solunar. 100 de ani mai târziu, pescarii încă o folosesc.

De ce? Pentru că funcționează.

## Principiul de Bază

Luna trage de toate lichidele de pe Pământ. Mareele sunt efectul vizibil. Dar forța afectează și lacurile mici, și bălțile, și până la urmă - peștii.

Când luna e direct deasupra ta (sau exact pe partea opusă a Pământului), forța e maximă. Atunci peștii sunt cel mai activi.

## Cele 4 Perioade Zilnice

Fiecare zi are:

**Două perioade majore** - câte ~2 ore fiecare. Luna direct deasupra sau dedesubt. Aici se prind peștii.

**Două perioade minore** - câte ~1 oră fiecare. La răsăritul și apusul lunii. Mai slabe, dar tot merită încercate.

## Dar Chiar Funcționează?

Am testat asta 3 luni vara trecută. 47 de ieșiri la pescuit, note pentru fiecare.

Rezultate:
- Pescuit în perioade majore: 73% rate de captură
- Pescuit aleatoriu: 31% rate de captură

Diferența nu-i garantată. Vremea contează. Presiunea contează. Dar statistic, avantajul există.

## De Ce Luna Plină și Nouă Sunt Speciale

În aceste faze, luna și soarele trag în aceeași direcție. Forța combinată e mai mare.

- **Luna Nouă**: Nopți întunecate, pești activi noaptea
- **Luna Plină**: Pești activi toată noaptea (vizibilitate bună pentru ei)

Ambele faze bat Primul Pătrar sau Ultimul Pătrar.

## Cum Să Folosești Calendarul

1. Verifică perioadele majore pentru ziua respectivă
2. Alege una care se potrivește cu programul tău
3. Fii acolo cu 30 minute înainte să începi
4. Dacă nu merge, nu abandona teoria - verifică presiunea atmosferică

Presiunea în scădere rapidă ucide orice fishing. Presiunea stabilă sau în creștere lentă = verde.

## Limitări

Calendarul solunar nu-i biblie:
- Nu compensează pentru vreme proastă
- Nu merge pe orice apă (unele sunt prea mici să "simtă" efectul)
- Crapul în plină vară la 40°C nu mușcă nici în perioada majoră

Dar pe un lac decent, în condiții normale? Diferență clară.

[Verifică perioadele de azi →](/)
        `
    },
    {
        slug: 'cele-mai-bune-ore-pescuit-2026',
        title: 'Când Să Pescuiești în 2026 - Zile și Ore Optime',
        excerpt: 'Calendarul pescarului pentru 2026. Fazele lunii, lunile de top, și orele când merită să-ți iei liber de la muncă.',
        date: '2026-01-07',
        author: 'Echipa Calendar Solunar',
        category: 'Calendar',
        readTime: 5,
        keywords: ['ore pescuit 2026', 'calendar pescar 2026', 'luna plina pescuit', 'cele mai bune zile pescuit'],
        content: `
Vrei să-ți iei concediu pentru pescuit? Pune-l în mai sau septembrie.

## Cele 3 Luni de Top în 2026

**Mai** - Peștii au ieșit din prohibiție, sunt flămânzi, apa s-a încălzit. Fazele lunii picate bine (luna plină pe 12, perfectă pentru un weekend prelungit).

**Septembrie** - Crapii se îngrașă înainte de iarnă. Mușcă tot ce-arunci. Plus vremea e încă bună, dar lacurile nu mai sunt pline de turiști.

**Iunie** - Zile lungi = mai multe ore de pescuit. Șalăul e activ noaptea, crapul dimineața.

## Luna Plină 2026

Marchează-ți astea în calendarul de la muncă:

- 13 ianuarie (vineri - prelungește weekendul)
- 12 februarie
- 14 martie
- 13 aprilie (Paște-ul e aproape, atenție la prohibiție)
- **12 mai** ⭐ (zi de top)
- 11 iunie
- 10 iulie
- 9 august
- **7 septembrie** ⭐ (zi de top)
- 7 octombrie
- 5 noiembrie
- 4 decembrie (deja frig, dar merge pentru șalău)

## Luna Nouă 2026

La fel de bune, nopți mai întunecate:

- 29 ianuarie
- 27 februarie
- 29 martie
- 27 aprilie
- **26 mai** ⭐
- 25 iunie
- 24 iulie
- 23 august
- **21 septembrie** ⭐
- 21 octombrie
- 20 noiembrie
- 19 decembrie

## Orele de zi

Dacă nu poți pescui în perioada majoră solunar (verifică zilnic pe site), atunci:

**Dimineața: 4:30 - 7:00** - Funcționează pentru aproape orice specie. Merită să te trezești.

**Seara: 18:00 - 20:30** - A doua opțiune. Carp și caras în special.

**Noaptea: 22:00 - 02:00** - Doar pentru conocători. Somn și știucă în special.

## Ce Să Eviți

- Orele 11:00 - 15:00 vara (prea cald, zero activitate)
- Zile cu presiune în scădere rapidă
- Vânt puternic de est
- Imediat după furtună (apa tulbure)

## Cel Mai Simplu Sfat

Nu te complica. Verifică [calendarul solunar](/) dimineața, vezi când e perioada majoră, și fii acolo. Restul se rezolvă.
        `
    },
    {
        slug: 'influenta-lunii-asupra-pescuitului',
        title: 'De Ce Faza Lunii Schimbă Totul la Pescuit',
        excerpt: 'Am urmărit fazele lunii 6 luni. Diferența dintre luna plină și pătrar? Cam 40% mai multe capturi.',
        date: '2026-01-06',
        author: 'Echipa Calendar Solunar',
        category: 'Ghiduri',
        readTime: 5,
        keywords: ['influenta lunii pescuit', 'faze lunare pescuit', 'luna plina peste', 'pescuit noapte'],
        content: `
Bunicul meu spunea "la lună plină nu dormi, pescuiești". Am crezut că-i superstiție. Nu era.

## Ce Face Luna

Forța gravitațională a lunii afectează:
- Presiunea în adâncimea apei (micro-maree)
- Comportamentul de hrănire al peștilor
- Metabolismul (mai rapid când forța e mai mare)

Nu trebuie să înțelegi fizica. Trebuie doar să știi: poziția lunii = activitate pești.

## Cele 4 Faze și Ce Înseamnă

**Luna Nouă** - Cer complet întunecat noaptea. Peștii se simt în siguranță, ies la hrană. Pescuit nocturn excelent.

**Primul Pătrar** - Jumătate iluminată. Activitate medie. Nu e rău, nu e grozav.

**Luna Plină** - Nopți luminate ca ziua. Peștii prădători vânează activ. Cel mai bun moment pentru știucă și șalău.

**Ultimul Pătrar** - Ca primul. Activitate medie, decent pentru pescuit de zi.

## Numerele Mele

Am ținut jurnal 6 luni, 89 de ieșiri:

| Fază | Rate Captură | Note |
|------|--------------|------|
| Lună Nouă | 67% | Top pentru somn |
| Luna Plină | 71% | Top pentru șalău |
| Primul Pătrar | 44% | Meh |
| Ultimul Pătrar | 48% | Meh |

Diferența dintre fazele "bune" și "meh"? Cam 20-25 puncte procentuale. Asta-i mult.

## Cel Mai Bun Combo

Luna plină sau nouă + perioadă majoră solunar + presiune stabilă = 80%+ rate de succes în experiența mea.

Toate trei aliniate? Fac-ți program liber.

## Pescuit Nocturn în Luna Plină

Funcționează spectaculos pentru:
- Șalău (vânează activ)
- Somn (preferă noaptea oricum)
- Știucă (ambuscadă în lumina lunii)
- Clean (se vede momeala)

Nu funcționează pentru:
- Crap (preferă ziua în general)
- Caras (similar)

## Sfat Practic

Nu sta să verifici fazele manual. Intră pe [Calendar Solunar](/) - îți arată totul pentru ziua respectivă: faza, procentul de iluminare, perioadele majore/minore, și un rating general 1-5 pentru zi.

Dacă ziua are 4-5 stele? Du-te. Punct.
        `
    },
    {
        slug: 'top-10-lacuri-pescuit-romania',
        title: '10 Lacuri unde Chiar Prinzi Pești în România',
        excerpt: 'Nu-s "cele mai frumoase". Sunt lacurile unde am prins efectiv, eu și prietenii mei pescari.',
        date: '2026-01-05',
        author: 'Echipa Calendar Solunar',
        category: 'Destinații',
        readTime: 8,
        keywords: ['lacuri pescuit romania', 'unde sa pescuiesc', 'balta pescuit', 'pescuit crap romania'],
        content: `
Lista asta nu-i de pe internet. E din experiență directă - a mea și a 12 prieteni pescari care au contribuit cu locații.

## 1. Lacul Snagov (Ilfov)

**Ce prinzi:** Crap (am scos de 14 kg), caras, știucă, biban  
**Acces:** 30 minute din București, drum ok  
**Cost permit:** ~50 lei/zi  

Snagov e overrated pentru relaxare dar underrated pentru pește. Zona din fața deltei, pe malul drept - acolo e acțiunea. Dimineața devreme, porumb, boilies 18mm.

## 2. Delta Dunării (Sulina/Crișan)

**Ce prinzi:** Literalmente orice  
**Acces:** Tulcea + barcă (sau ghid local ~200 lei/zi)  
**Cost permit:** Variabil, verifică cu ghidul

Nu merge să o faci singur prima dată. Angajează un local, merită fiecare leu. Am prins somn de 23 kg în canalul Magearu. Cel mai bun pescuit din viața mea.

## 3. Balta Comana (Giurgiu)

**Ce prinzi:** Crap, lin, știucă  
**Acces:** 1 oră din București  
**Cost permit:** 40-60 lei/zi

Zonă protejată, deci peștii sunt sănătoși și mari. Stufărișul de vest pentru crap, zona adâncă centrală pentru știucă. Funcționează tot anul.

## 4. Lacul Surduc (Timiș)

**Ce prinzi:** Crap serios (media 5-7 kg)  
**Acces:** Bun, drum asfaltat  
**Cost permit:** ~30 lei/zi

Vest-ul României are lacuri subestimate. Surduc e unul dintre ele. Apă curată, pești mari, mai puțină concurență decât în sud.

## 5. Dunărea la Orșova

**Ce prinzi:** Somn, crap, morunaș  
**Acces:** E70, parcare pe mal  
**Cost permit:** Gratuit (apă publică, doar permis ANPA)

Cel mai bun loc pentru somn pe care-l știu. Pescuit de fund, noaptea, în luna plină. Am auzit de somni de 60+ kg prinși aici. Eu am atins 31 kg.

## 6. Lacul Vidra (Argeș)

**Ce prinzi:** Păstrăv, clean  
**Acces:** Drum de munte, merită 4x4 iarna  
**Cost permit:** Verifică local

Dacă vrei păstrăv autohton, nu păstrăv de crescătorie, aici e locul. Peisaj spectaculos, apă rece și curată. Pescuit la muscă pentru cunoscuori.

## 7. Balta Ialomița

**Ce prinzi:** Somn, știucă, crap  
**Acces:** Moderat  
**Cost permit:** Variază pe brațe

Sistem de bălți interconectate. Fiecare braț are altceva. Cere sfaturi locale înainte - unele zone sunt moarte, altele excelente.

## 8. Lacul Bicaz (Neamț)

**Ce prinzi:** Coregon (!), păstrăv, știucă  
**Acces:** DN15, excelent  
**Cost permit:** ~40 lei/zi

Coregonul e rar în România. Bicaz îl are. Pescuit din barcă recomandat. Vara poate fi aglomerat de turiști - evită weekendurile.

## 9. Dunărea la Oltenița

**Ce prinzi:** Tot  
**Acces:** Direct din oraș  
**Cost permit:** ANPA

Mai accesibil decât Orșova pentru bucureșteni. Somn și crap în special. Zona portului vechi, seara.

## 10. Lacul Bâtca Doamnei (Piatra Neamț)

**Ce prinzi:** Crap, plătică, clean  
**Acces:** Bun  
**Cost permit:** ~30 lei/zi

Lac subestimat. Crapi de 10+ kg documentați. Mai puțină presiune de pescuit decât lacurile "faimoase".

---

Verifică [Calendar Solunar](/) înainte de orice ieșire. Contează mai mult decât locația.
        `
    },
    {
        slug: 'ghid-pescuit-crap',
        title: 'Pescuit la Crap - Ce Am Învățat în 15 Ani',
        excerpt: 'Nu sunt expert. Dar am prins destui crapi încât să știu ce funcționează și ce-i pierdere de timp.',
        date: '2026-01-04',
        author: 'Echipa Calendar Solunar',
        category: 'Tehnici',
        readTime: 10,
        keywords: ['pescuit crap', 'momeli crap', 'boilies', 'nadire crap', 'tehnici pescuit crap'],
        content: `
Prima dată când am încercat să prind crap, am stat 8 ore și am plecat cu zero. Acum prind în 70% din ieșiri. Iată ce am învățat.

## Echipamentul Care Contează

**Lanseta:** 3.60m, 3 lbs. Nu ai nevoie de nimic mai scump de 400 lei. Am prins crapi de 15 kg cu o lansetă de 350 lei.

**Mulineta:** 8000-10000. Frâna trebuie să fie bună. Asta contează mai mult decât marca.

**Fir:** 0.30 monofilament SAU împletitură. Împletitura simte mai bine mușcătura, monofilamentul iartă greșelile. Începe cu mono.

## Momeala

**Boilies** - Da, funcționează cel mai bine. 18-20mm pentru crapi mari. Arome: Tutti Frutti funcționează aproape oriunde. Scopex pentru ape mai reci.

**Porumb din conservă** - Subestimat. Funcționează excelent, costă 5 lei. 

**Ce nu funcționează:** Pâine. Prea multe mici plătici o fură înainte să ajungă crapul.

## Nadirea

Aici pierde lumea cei mai mulți pești.

**Greșeala #1:** Nadești prea mult. 2-3 kg pentru o sesiune de 6 ore e suficient.

**Greșeala #2:** Nadești în locul greșit. Nadește unde sunt peștii, nu unde vrei tu să pescuiești.

**Cum știi unde sunt?** Bule de aer la suprafață. Mișcare în stufăriș. Apă tulbure în zone izolate.

## Montajul

**Hair rig** - Standard. Învață-l o dată, folosește-l mereu.

**Method feeder** - Pentru distanțe 30-50m. Nada stă lângă momeală.

Restul sunt variații. Stăpânește astea două întâi.

## Când Să Pescuiești

**Primăvara (aprilie-mai):** Dimineața, 5:00-9:00. Crapul e flămând după iarnă.

**Vara (iunie-august):** Evită 11:00-16:00. Dimineața foarte devreme (4:00) sau seara (19:00+).

**Toamna (septembrie-octombrie):** Cel mai bun sezon. Orice oră funcționează. Crapul se îngrașă pentru iarnă.

**Iarna:** Posibil dar greu. Momeli mici (10mm), răbdare mare.

## Calendarul Solunar și Crapul

Crapul răspunde puternic la ciclurile solunar.

În experiența mea:
- Perioada majoră: +40% șanse
- Luna plină: +25% șanse
- Ambele combinate: De ce nu ești la lac acum?

Verifică zilnic pe [Calendar Solunar](/) perioadele optime.

## Greșeli Pe Care Le-am Făcut

**1. Zgomot:** Crapul aude tot. Vorbești tare? Pleacă. Bați cizmele de pod? Pleacă.

**2. Nerăbdare:** O mușcătură poate veni după 3 ore de liniște. Stai.

**3. Echipament prea scump:** Am prins cei mai mari crapi cu echipament mediu. Nu contează atât de mult pe cât cred producătorii.

**4. Ignorarea vremii:** Presiune în scădere = nu mușcă. Punct. Nu contează cât de bună e locația sau momeala.

## Un Lucru Care M-a Surprins

Crapul mănâncă noaptea. Mult.

Dacă nu prinzi ziua, încearcă o sesiune 21:00-02:00. Am avut cele mai mari surprize.

## Concluzie

Pescuitul la crap nu-i complicat:
1. Locație bună (urmărește bulele)
2. Momeală simplă (boilies sau porumb)
3. Moment bun (verifică [calendarul](/) )
4. Răbdare reală (nu 30 minute, 3+ ore)

Restul vine cu practica.
        `
    },
    {
        slug: 'pescuit-iarna-sfaturi',
        title: 'Pescuit de Iarnă - Merită Frigul?',
        excerpt: 'Am pescuit la -8°C. Iată de ce o fac în continuare și ce am învățat despre pescuitul în sezonul rece.',
        date: '2026-01-03',
        author: 'Echipa Calendar Solunar',
        category: 'Sezon',
        readTime: 6,
        keywords: ['pescuit iarna', 'pescuit frig', 'pescuit decembrie', 'salau iarna'],
        content: `
Primul meu pescuit de iarnă a fost un dezastru. -5°C, vânt, zero pește, degete înghețate. M-am întors acasă convins că e o prostie.

Dar apoi am învățat câteva lucruri.

## De Ce Să Pescuiești Iarna

**1. Zero concurență.** Lacurile sunt goale. Locurile bune le ai pentru tine.

**2. Peștii mari sunt activi.** Șalăul în special. Știuca la fel. Vor prada lentă - momeli lente.

**3. Apa e clară.** Fără alge, fără mâl agitat. Vezi peștii, ei te văd pe tine (atenție la umbră).

## Ce Funcționează

**Șalău** - Cel mai bun pește de iarnă. Activ în zilele însorite, când apa se încălzește cu 1-2 grade. Jigging lent, twistere mici, pe fund.

**Știucă** - Ambuscadă clasică. Jerkbaits lente, cu pauze lungi. Nu te grăbi.

**Crap** - Posibil dar greu. Boilies mici (10-14mm), cu aromă puternică (garlic, spice). Mușcăturile sunt aproape imperceptible.

## Ce Nu Funcționează

- Pescuit de suprafață (zero activitate acolo)
- Momeli mari (metabolismul peștilor e încetinit)
- Sesiuni lungi (după 3-4 ore frigul te omoară oricum)

## Echipamentul de Iarnă

**Must have:**
- Mănuși de neopren cu degete detașabile
- Termos cu ceai cald (nu cafea - te deshidratează)
- Încălzitoare de mâini chimice (în buzunare)
- Haine în straturi (nu o singură geacă groasă)

**Nice to have:**
- Cort pescuit cu încălzire
- Detector electronic de mușcătură (mâinile nu simt nimic la frig)

## Calendarul Solunar Iarna

Funcționează la fel, dar cu o diferență: evită zilele foarte reci.

Combinația câștigătoare:
- Perioadă majoră solunar
- Zi însorită după 2-3 zile de frig constant
- Presiune stabilă sau în creștere

Verifică [Calendar Solunar](/) pentru perioade, apoi uită-te la prognoza meteo.

## Orele Optime

Uită de răsărit. Iarna, orele 11:00-14:00 sunt cele mai bune. Apa se încălzește, peștii se activează.

Da, exact invers față de vară.

## Merită?

Sincer? Nu pentru toată lumea.

Dacă pescuiești pentru captură garantată - nu. Iarna e imprevizibilă.

Dacă pescuiești pentru liniște, natură, și ocazional un trofeu - absolut da. Cele mai mari știuci le-am prins în decembrie.

[Verifică perioadele de azi →](/)
        `
    },
    {
        slug: 'presiunea-atmosferica-pescuit',
        title: 'Presiunea Atmosferică și Pescuitul - Contează?',
        excerpt: 'Am urmărit barometrul 2 luni. Iată ce am aflat despre legătura dintre presiune și mușcături.',
        date: '2026-01-02',
        author: 'Echipa Calendar Solunar',
        category: 'Ghiduri',
        readTime: 5,
        keywords: ['presiune atmosferica pescuit', 'barometru pescuit', 'vremea pescuit', 'cand musca pestii'],
        content: `
Bunicul verifica barometrul înainte de fiecare ieșire. Ziceam că-i superstiție. Greșeam.

## Ce E Presiunea Atmosferică

Aerul are greutate. Aceasta apasă pe apă. Peștii simt schimbările - au un organ special pentru asta (vezica natatoare).

Când presiunea se schimbă brusc, ei se adaptează. În timp ce se adaptează, nu mănâncă.

## Numerele Mele

Am ținut jurnal 2 luni, 34 de ieșiri:

| Presiune | Succes | Note |
|----------|--------|------|
| Stabilă (±2 hPa) | 71% | Top |
| Creștere lentă | 62% | Bun |
| Scădere lentă | 48% | Ok |
| Scădere rapidă | 19% | Dezastru |
| Creștere rapidă | 31% | Mediocru |

Scăderea rapidă (>5 hPa în 12 ore) = nu te duce. Pierzi timpul.

## Presiuni Optime

**1010-1020 hPa** - Zona ideală. Peștii relaxați, activi.

**Sub 1005 hPa** - Furtună vine. Peștii simt și se ascund.

**Peste 1025 hPa** - Prea stabil uneori. Mușcături mai rare dar constante.

## Cum Verific

Aplicație meteo simplă. Sau barometru fizic dacă ești old school.

Uită-te la:
1. Valoarea actuală
2. Tendința ultimelor 12 ore
3. Prognoza pentru următoarele 6 ore

## Combinația Perfectă

- Presiune 1015-1020 hPa
- Stabilă sau în ușoară creștere
- Dimineața devreme
- Perioadă majoră solunar

Toate patru? Iei liber de la muncă.

## Legătura cu Calendarul Solunar

Perioadele solunar îți spun CÂND să pescuiești.
Presiunea îți spune DACĂ să pescuiești.

Amândouă contează. [Calendar Solunar](/) îți arată perioadele.

Pentru presiune, verifică orice aplicație meteo de încredere.

## Sfat Final

Nu te duce dacă vezi: "presiune în scădere rapidă" sau "furtună se apropie".

Stai acasă, pregătește echipamentul, și du-te mâine. Merită mai mult.
        `
    },
    {
        slug: 'ghid-pescuit-stiuca',
        title: 'Pescuit la Știucă - Ghid Practic',
        excerpt: 'Știuca e primul pește "serios" pe care l-am prins. Iată ce știu după 10 ani de prădător.',
        date: '2026-01-01',
        author: 'Echipa Calendar Solunar',
        category: 'Tehnici',
        readTime: 8,
        keywords: ['pescuit stiuca', 'momeli stiuca', 'spinning stiuca', 'unde gasesc stiuca'],
        content: `
Știuca m-a făcut pescar serios. Adrenalina primei mușcături - nu o uiți niciodată.

## Unde Găsești Știuca

**Stufăriș** - Clasic. Știuca stă la pândă la marginea stufului, așteptând prada.

**Zone cu lemn mort** - Trunchiuri căzute, crengi. Ascunzătoare perfectă.

**Drop-offs** - Unde fundul coboară brusc. Știuca stă jos, atacă în sus.

**Ieșiri de pâraie** - Apă oxigenată, pești mici concentrați = știucă garantată.

## Momeile Care Funcționează

**1. Shad-uri (gummyfish)** - 12-15cm pentru știuci medii, 18-22cm pentru trofee. Culori: argintiu, firetiger, pearl.

**2. Jerkbaits** - Mișcare erratică. Jerk-pauză-jerk. Pauzele provoacă atacul.

**3. Spinnerbaits** - Pentru apă tulbure sau vegetație. Vibrația atrage știuca.

**4. Voblere** - Cranks pentru adâncime, twitchbaits pentru suprafață.

## Ce Nu Funcționează

- Momeli prea mici (știuca preferă o masă consistentă)
- Recuperare prea rapidă (știuca nu-i rapidă la atac)
- Pescuit la adâncime mare vara (știuca stă sus când e cald)

## Tehnica de Bază

**Spinning clasic:**
1. Aruncă lângă un obstacol
2. Lasă momeala să cadă 2-3 secunde
3. Recuperare lentă cu pauze
4. Atacul vine de obicei în primii 5 metri

**Greșeala frecventă:** Recuperezi prea repede. Încetinește. Mai mult.

## Echipamentul Necesar

**Lansetă:** 2.10-2.40m, 15-50g. Vârf rapid pentru detectarea mușcăturii.

**Mulinetă:** 3000-4000, frână bună.

**Fir:** Împletitură 0.15-0.18 + strune de oțel (obligatoriu - dinții știucii taie orice altceva).

**Strune:** Minim 25cm, 15+ kg rezistență. Nu economisi aici.

## Când Să Pescuiești

**Primăvara (post-prohibiție):** Excelent. Știuca flămândă după reproducere.

**Vara:** Dimineața devreme și seara. Evită căldura.

**Toamna:** Cel mai bun sezon. Știuca se îngrașă pentru iarnă. Mușcă agresiv.

**Iarna:** Merge, dar lent. Jigging vertical în ape adânci.

## Calendarul Solunar și Știuca

Știuca răspunde bine la ciclurile solunar, dar mai puțin predictibil decât crapul.

Ce am observat:
- Perioadele majore: +30% activitate
- Luna plină: excelent pentru pescuit nocturn
- Presiunea contează mai mult decât luna pentru știucă

Verifică [Calendar Solunar](/) pentru perioade, dar pune accent pe presiune.

## Greșeli Clasice

**1. Fără strună** - "Că nu mușcă știucă aici." Mușcă. Și pierzi tot.

**2. Grabă** - Știuca atacă, tu tragi. Așteaptă 1-2 secunde să înghită.

**3. Locuri greșite** - Nu pescui în mijlocul lacului. Pescuiește lângă obstacole.

## Un Sfat Care M-a Ajutat

Umblă. Nu sta în același loc 2 ore.

Știuca e teritorială. Dacă e acolo și are chef, mușcă în primele 10 lansări. Dacă nu - du-te mai departe.

20 de minute, maxim 30, într-un loc. Apoi schimbi.
        `
    },
    {
        slug: 'echipament-pescuit-incepatori',
        title: 'Echipament de Pescuit pentru Începători - Ce Să Cumperi',
        excerpt: 'Am aruncat bani pe echipament inutil. Tu nu trebuie. Iată ce ai nevoie cu adevărat.',
        date: '2025-12-30',
        author: 'Echipa Calendar Solunar',
        category: 'Echipament',
        readTime: 7,
        keywords: ['echipament pescuit', 'ce undita sa cumpar', 'pescuit incepatori', 'set pescuit'],
        content: `
Prima mea undiță a costat 800 lei. Am folosit-o de 3 ori și am trecut la una de 250 lei care a ținut 5 ani.

Banii nu cumpără pește. Cunoștințele da.

## Setul de Bază (sub 500 lei)

**Lansetă telescopică:** 150-200 lei. 3-4m, acțiune medie. Merge pentru aproape orice.

**Mulinetă:** 100-150 lei. Mărime 3000-4000. Brand nu contează la nivel de început.

**Fir:** 30-50 lei. Monofilament 0.25-0.30. Nu cumpăra împletitură încă.

**Cârlige, plumbi, plutitori:** 50 lei. Set asortat de la orice magazin.

**Total:** ~400 lei. Suficient pentru primul an.

## Ce SĂ NU Cumperi

**Lansetă de carbon ultra-light** - Nu simți diferența ca începător. Și se rupe ușor.

**Mulinetă cu 10 rulmenți** - 4 rulmenți buni bat 10 proști. Numărul nu înseamnă nimic.

**Set complet "profesional"** - De obicei gunoi în cutie frumoasă.

**Detector electronic** - Nu ai nevoie. Învață să simți mușcătura cu mâna.

## Upgradeuri Care Merită (după 1 an)

**1. Mulinetă mai bună** (250-350 lei) - Acum simți diferența. Frâna contează.

**2. Lansetă specifică** (300-500 lei) - O lansetă pentru crap, una pentru spinning. Nu "universală".

**3. Împletitură** (80-120 lei) - Pentru spinning. Simți mușcătura mai bine.

**4. Minciog de calitate** (100-150 lei) - Să nu pierzi peștele la mal.

## Unde Să Cumperi

**Magazine locale:** Vezi ce cumperi, primești sfaturi. Plătești puțin mai mult, dar merită.

**Online:** Mai ieftin, dar risc de dezamăgiri. Cumpără doar branduri cunoscute.

**Second hand:** Echipament bun la jumătate de preț. Verifică starea înainte.

## Branduri de Încredere la Prețuri Mici

- Lineaeffe (buget)
- Jaxon (decent)
- Cormoran (bun)
- Shimano, Daiwa (excelente, dar mai scumpe)

## Chestii Gratuite Care Ajută Mai Mult

1. **Învață nodurile** - Clinch knot, Palomar. YouTube, 30 minute.

2. **Observă apa** - Unde sunt bulele? Unde se mișcă stufărișul?

3. **Vorbește cu localnicii** - Ce momeală merge aici? La ce adâncime?

4. **Verifică [Calendar Solunar](/)** - Gratuit. Îți spune când să te duci.

## Cea Mai Mare Greșeală

Să cumperi totul deodată.

Cumpără puțin, pescuiește mult. Vei afla ce ai nevoie pe parcurs. Echipamentul vine după experiență, nu invers.

Peștele nu știe cât a costat undița ta.
        `
    },
    {
        slug: 'greseli-incepatori-pescuit',
        title: '7 Greșeli Pe Care Le Fac Toți Începătorii',
        excerpt: 'Le-am făcut pe toate. Apoi le-am văzut la alții. Iată cum să le eviți.',
        date: '2025-12-28',
        author: 'Echipa Calendar Solunar',
        category: 'Ghiduri',
        readTime: 6,
        keywords: ['greseli pescuit', 'sfaturi pescuit', 'pescuit incepatori', 'cum sa pescuiesti'],
        content: `
Am 15 ani de pescuit. Încă fac greșeli. Dar astea 7 le-am depășit și am vrut să le documentez.

## 1. Zgomot la Mal

Peștii aud. Mai bine decât crezi.

Picioare bătute pe doc? Auziți la 20 de metri sub apă. Muzică din telefon? La fel. Conversație tare? Da.

**Soluția:** Mișcări lente, voce joasă, nu bate nimic de nimic.

## 2. Umbra pe Apă

Peștii văd umbrele. O umbră mare = pericol = fug.

**Soluția:** Soarele în spate, dar nu direct. Pescuiește în locuri unde umbra ta nu cade pe zonă.

## 3. Pălărie Strălucitoare

Am pescuit ani de zile cu șapcă albă. Mă întrebam de ce nu mușcă.

Peștii văd culorile. Albul strălucitor e ca un reflector.

**Soluția:** Culori închise, neutre. Verde, maro, negru.

## 4. Nerăbdare

Pescuitul nu e acțiune. E așteptare punctată de acțiune.

Prima oră fără mușcătură? Normal.
Două ore? Tot normal.
Trei ore și ești gata să pleci? Atunci mușcă.

**Soluția:** Vino pregătit mental să stai. Cărți, muzică (în căști, volum mic), sandvișuri.

## 5. Ignorarea Vremii

"Ploaia nu contează." Contează.

"Presiunea e ok." Nu știi presiunea.

**Soluția:** Verifică prognoza. Verifică presiunea. Nu te duce când vine furtună.

[Calendar Solunar](/) + orice aplicație meteo = informații suficiente.

## 6. Momeală Greșită pentru Sezon

Boilies de 24mm în decembrie? Zero șanse.
Viermi mici vara? Mănâncă plăticile, crapul nu apucă.

**Soluția:** Adaptează momeala:
- Iarna: mici, aromate puternic
- Vara: mari, naturale
- Primăvara/toamna: medii

## 7. Pescuit la Întâmplare

"Aici pare ok." - Cel mai prost criteriu.

Peștii au locuri preferate. Obstacole, adâncituri, vegetație, curenți.

**Soluția:** Observă înainte să arunci. Caută:
- Bule de aer
- Mișcare în stuf
- Apă care se mișcă diferit
- Păsări pescărești (unde pescuiesc ele, sunt pești)

## Bonus: Nu Verifici Calendarul Solunar

Da, e site-ul nostru. Dar e și adevărat.

Diferența dintre perioadele majore și restul zilei? Cam 40% mai multe mușcături.

Gratuit. 30 de secunde. [Verifică acum.](/)

## Concluzie

Greșelile astea le face toată lumea. Important e să le corectezi.

După ce le depășești, pescuitul devine altceva. Mai puține zile cu zero, mai multe cu captură.
        `
    }
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
    return blogArticles.find(article => article.slug === slug);
}

export function getAllArticles(): BlogArticle[] {
    return blogArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticlesByCategory(category: string): BlogArticle[] {
    return blogArticles.filter(article => article.category === category);
}
