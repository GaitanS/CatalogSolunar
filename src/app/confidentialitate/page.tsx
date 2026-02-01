import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politica de Confidențialitate | Calendar Solunar',
    description: 'Politica de confidențialitate și protecția datelor personale pentru Calendar Solunar.',
    alternates: { canonical: 'https://calendarsolunar.ro/confidentialitate' },
};

export default function ConfidentialitatePage() {
    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="container-custom px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
                        Politica de Confidențialitate
                    </h1>

                    <div className="prose prose-invert prose-night max-w-none">
                        <div className="card-panel p-6 md:p-8 space-y-6 text-night-300 leading-relaxed">

                            <p className="text-night-400 text-sm">
                                Ultima actualizare: 7 ianuarie 2026
                            </p>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">1. Introducere</h2>
                                <p>
                                    Calendar Solunar ("noi", "site-ul") respectă confidențialitatea vizitatorilor săi. Această politică explică modul în care colectăm, utilizăm și protejăm informațiile dumneavoastră.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">2. Date Colectate</h2>
                                <p>Putem colecta următoarele tipuri de date:</p>
                                <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                    <li><strong className="text-white">Date de localizare:</strong> Doar cu acordul dumneavoastră explicit, pentru a oferi calcule solunar personalizate.</li>
                                    <li><strong className="text-white">Date de utilizare:</strong> Pagini vizitate, timp petrecut pe site, dispozitiv utilizat (prin Google Analytics).</li>
                                    <li><strong className="text-white">Date de contact:</strong> Nume și email, doar dacă ne contactați prin formularul de contact.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">3. Utilizarea Datelor</h2>
                                <p>Utilizăm datele colectate pentru:</p>
                                <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                    <li>Furnizarea și îmbunătățirea serviciilor noastre</li>
                                    <li>Personalizarea experienței utilizatorului</li>
                                    <li>Analiză statistică agregată</li>
                                    <li>Răspunsuri la solicitările dumneavoastră</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">4. Cookie-uri</h2>
                                <p>
                                    Site-ul utilizează cookie-uri pentru funcționalitate de bază și analiză. Cookie-urile sunt fișiere text mici stocate în browserul dumneavoastră.
                                </p>
                                <p className="mt-3">
                                    Tipuri de cookie-uri utilizate:
                                </p>
                                <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                    <li><strong className="text-white">Esențiale:</strong> Necesare pentru funcționarea site-ului</li>
                                    <li><strong className="text-white">Analitice:</strong> Google Analytics pentru înțelegerea utilizării</li>
                                    <li><strong className="text-white">Publicitate:</strong> Google AdSense pentru afișarea de reclame relevante</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">5. Google AdSense</h2>
                                <p>
                                    Utilizăm Google AdSense pentru afișarea de reclame. Google poate utiliza cookie-uri pentru a afișa reclame bazate pe vizitele anterioare pe acest site sau pe alte site-uri.
                                </p>
                                <p className="mt-3">
                                    Puteți renunța la publicitatea personalizată vizitând <a href="https://www.google.com/settings/ads" className="text-moon hover:underline" target="_blank" rel="noopener noreferrer">Setări reclame Google</a>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">6. Drepturile Dumneavoastră (GDPR)</h2>
                                <p>În conformitate cu GDPR, aveți dreptul să:</p>
                                <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                    <li>Accesați datele personale pe care le deținem despre dumneavoastră</li>
                                    <li>Solicitați rectificarea datelor incorecte</li>
                                    <li>Solicitați ștergerea datelor ("dreptul de a fi uitat")</li>
                                    <li>Vă opuneți prelucrării datelor</li>
                                    <li>Solicitați portabilitatea datelor</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">7. Securitatea Datelor</h2>
                                <p>
                                    Implementăm măsuri de securitate tehnice și organizatorice pentru a proteja datele dumneavoastră împotriva accesului neautorizat, pierderii sau distrugerii.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">8. Modificări</h2>
                                <p>
                                    Ne rezervăm dreptul de a actualiza această politică. Orice modificări vor fi publicate pe această pagină cu data ultimei actualizări.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-display font-bold text-white mb-3">9. Contact</h2>
                                <p>
                                    Pentru întrebări sau solicitări referitoare la această politică, ne puteți contacta la:
                                </p>
                                <p className="mt-2">
                                    <strong className="text-white">Email:</strong>{' '}
                                    <a href="mailto:privacy@calendarsolunar.ro" className="text-moon hover:underline">
                                        privacy@calendarsolunar.ro
                                    </a>
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
