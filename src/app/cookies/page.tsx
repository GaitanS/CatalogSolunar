import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politica Cookies | Calendar Solunar',
    description: 'Informații despre utilizarea cookie-urilor pe Calendar Solunar.',
};

export default function CookiesPage() {
    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="container-custom px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
                        Politica de Cookies
                    </h1>

                    <div className="card-panel p-6 md:p-8 space-y-6 text-night-300 leading-relaxed">

                        <p className="text-night-400 text-sm">
                            Ultima actualizare: 7 ianuarie 2026
                        </p>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">Ce sunt cookie-urile?</h2>
                            <p>
                                Cookie-urile sunt fișiere text mici care sunt plasate pe computerul sau dispozitivul dumneavoastră mobil atunci când vizitați un site web. Sunt utilizate pe scară largă pentru a face site-urile web să funcționeze sau să funcționeze mai eficient, precum și pentru a furniza informații proprietarilor site-ului.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">Cum utilizăm cookie-urile</h2>
                            <p>Calendar Solunar utilizează cookie-uri pentru:</p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>A reține preferințele dumneavoastră (ex: locația selectată)</li>
                                <li>A înțelege cum utilizați site-ul nostru</li>
                                <li>A îmbunătăți experiența utilizatorului</li>
                                <li>A afișa reclame relevante</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">Tipuri de Cookie-uri Utilizate</h2>

                            <div className="mt-4 space-y-4">
                                <div className="p-4 bg-night-900/50 rounded-xl border border-night-700">
                                    <h3 className="font-bold text-white mb-2">🔧 Cookie-uri Esențiale</h3>
                                    <p className="text-sm">
                                        Necesare pentru funcționarea de bază a site-ului. Nu pot fi dezactivate.
                                    </p>
                                    <p className="text-xs text-night-400 mt-2">Exemplu: preferințe de locație, stare sesiune</p>
                                </div>

                                <div className="p-4 bg-night-900/50 rounded-xl border border-night-700">
                                    <h3 className="font-bold text-white mb-2">📊 Cookie-uri Analitice (Google Analytics)</h3>
                                    <p className="text-sm">
                                        Ne ajută să înțelegem cum interacționați cu site-ul, permițându-ne să îmbunătățim experiența.
                                    </p>
                                    <p className="text-xs text-night-400 mt-2">Furnizor: Google | Durată: până la 2 ani</p>
                                </div>

                                <div className="p-4 bg-night-900/50 rounded-xl border border-night-700">
                                    <h3 className="font-bold text-white mb-2">📢 Cookie-uri de Publicitate (Google AdSense)</h3>
                                    <p className="text-sm">
                                        Utilizate pentru a afișa reclame relevante pe baza intereselor dumneavoastră.
                                    </p>
                                    <p className="text-xs text-night-400 mt-2">Furnizor: Google | Pot fi personalizate sau non-personalizate</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">Cum să controlați cookie-urile</h2>
                            <p>
                                Puteți controla și/sau șterge cookie-urile după cum doriți. Puteți șterge toate cookie-urile care sunt deja pe computerul dumneavoastră și puteți seta majoritatea browserelor să împiedice plasarea lor.
                            </p>
                            <p className="mt-3">
                                Instrucțiuni pentru browsere populare:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>
                                    <a href="https://support.google.com/chrome/answer/95647" className="text-moon hover:underline" target="_blank" rel="noopener noreferrer">
                                        Google Chrome
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.mozilla.org/ro/kb/activarea-si-dezactivarea-cookie-urilor" className="text-moon hover:underline" target="_blank" rel="noopener noreferrer">
                                        Mozilla Firefox
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac" className="text-moon hover:underline" target="_blank" rel="noopener noreferrer">
                                        Safari
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.microsoft.com/ro-ro/microsoft-edge/ștergerea-cookie-urilor-în-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-moon hover:underline" target="_blank" rel="noopener noreferrer">
                                        Microsoft Edge
                                    </a>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">Renunțarea la publicitate personalizată</h2>
                            <p>
                                Puteți renunța la publicitatea personalizată de la Google vizitând:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>
                                    <a href="https://www.google.com/settings/ads" className="text-moon hover:underline" target="_blank" rel="noopener noreferrer">
                                        Setări reclame Google
                                    </a>
                                </li>
                                <li>
                                    <a href="https://optout.aboutads.info" className="text-moon hover:underline" target="_blank" rel="noopener noreferrer">
                                        DAA Opt-Out Platform
                                    </a>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">Actualizări</h2>
                            <p>
                                Putem actualiza această politică din când în când. Vă încurajăm să revizuiți periodic această pagină pentru cele mai recente informații.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">Contact</h2>
                            <p>
                                Pentru întrebări despre cookie-uri, contactați-ne la:{' '}
                                <a href="mailto:privacy@calendarsolunar.ro" className="text-moon hover:underline">
                                    privacy@calendarsolunar.ro
                                </a>
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
