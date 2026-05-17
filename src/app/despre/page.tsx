import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Despre Noi - Calendar Solunar Pescuit România',
    description: 'Află cum sunt calculate datele Calendar Solunar: perioade majore și minore, faze lunare, limitele prognozei și modul de folosire în pescuit.',
    alternates: { canonical: 'https://calendarsolunar.ro/despre' },
    openGraph: {
        title: 'Despre Calendar Solunar - Metodologie și Date Solunare',
        description: 'Cum sunt calculate perioadele solunare, fazele lunii și recomandările de pescuit pentru România.',
        url: 'https://calendarsolunar.ro/despre',
    },
};

export default function DesprePage() {
    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="container-custom px-4">
                {/* Hero */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                        Despre <span className="text-moon">Calendar Solunar</span>
                    </h1>
                    <p className="text-night-300 text-lg max-w-2xl mx-auto">
                        Date solunare, faze lunare și explicații practice pentru pescuit planificat în România.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
                    {/* Story */}
                    <div className="card-panel p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-moon/10 text-moon">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-display font-bold text-white">Povestea Noastră</h2>
                        </div>
                        <div className="space-y-4 text-night-300 leading-relaxed">
                            <p>
                                Calendar Solunar a fost creat din pasiunea pentru pescuit și dorința de a oferi pescarilor români un instrument modern și precis pentru planificarea ieșirilor la apă.
                            </p>
                            <p>
                                Am observat că mulți pescari se bazează pe intuiție sau pe sfaturi vagi despre "luna plină" sau "luna nouă". Am vrut să oferim ceva mai mult - un calendar bazat pe <strong className="text-white">știință și algoritmi preciși</strong>.
                            </p>
                            <p>
                                Teoria solunar, dezvoltată de John Alden Knight în anii 1920, demonstrează că activitatea peștilor este direct influențată de poziția lunii. Noi am transpus aceste calcule astronomice într-o interfață modernă și ușor de utilizat.
                            </p>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="card-panel p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-display font-bold text-white">Misiunea Noastră</h2>
                        </div>
                        <div className="space-y-4 text-night-300 leading-relaxed">
                            <p>
                                Să ajutăm fiecare pescar din România să își maximizeze șansele de succes, folosind date astronomice precise și o interfață intuitivă.
                            </p>
                            <p>
                                Oferim <strong className="text-white">gratuit</strong>:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Perioade majore și minore de activitate zilnice</li>
                                <li>Fazele lunii și procentul de iluminare</li>
                                <li>Ore de răsărit/apus pentru soare și lună</li>
                                <li>Prognoză pe 7 zile</li>
                                <li>Calcule personalizate pe baza locației tale</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="card-glass p-6 md:p-10 mb-16">
                    <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">
                        Cum Funcționează Calendarul Solunar?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-moon/10 flex items-center justify-center text-moon text-2xl font-bold">
                                1
                            </div>
                            <h3 className="font-bold text-white mb-2">Poziția Lunii</h3>
                            <p className="text-night-400 text-sm">
                                Calculăm exact când luna este direct deasupra sau sub orizontul tău.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-2xl font-bold">
                                2
                            </div>
                            <h3 className="font-bold text-white mb-2">Perioade de Activitate</h3>
                            <p className="text-night-400 text-sm">
                                Identificăm perioadele majore (~2 ore) și minore (~1 oră) când peștii sunt cei mai activi.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 text-2xl font-bold">
                                3
                            </div>
                            <h3 className="font-bold text-white mb-2">Rating Zilnic</h3>
                            <p className="text-night-400 text-sm">
                                Combinăm datele pentru a oferi un rating de 1-5 stele pentru fiecare zi.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
                    <div className="card-panel p-6 md:p-8">
                        <h2 className="text-xl font-display font-bold text-white mb-4">Metodologie</h2>
                        <div className="space-y-4 text-night-300 leading-relaxed">
                            <p>
                                Datele solunare sunt calculate pe baza poziției Lunii și a Soarelui pentru coordonatele alese. Pentru fiecare zi afișăm perioade majore, perioade minore, faza lunii, iluminarea și un rating orientativ.
                            </p>
                            <p>
                                Paginile anuale și lunare sunt actualizate pentru 2026 și oferă o versiune statică, ușor de citit, a datelor importante pentru pescari.
                            </p>
                        </div>
                    </div>

                    <div className="card-panel p-6 md:p-8">
                        <h2 className="text-xl font-display font-bold text-white mb-4">Limite și verificări</h2>
                        <div className="space-y-4 text-night-300 leading-relaxed">
                            <p>
                                Solunarul este un instrument de planificare, nu o garanție a capturii. Presiunea atmosferică, temperatura apei, vântul, nivelul apei, sezonul și experiența locală pot schimba rezultatul unei partide.
                            </p>
                            <p>
                                Dacă observi o eroare de locație, text sau date, trimite detaliile prin pagina de contact. Corecturile utile ajută la îmbunătățirea calendarului pentru toți pescarii.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-moon text-night-950 font-bold rounded-xl hover:bg-moon/90 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Vezi Calendarul de Azi
                    </a>
                </div>
            </div>
        </div>
    );
}
