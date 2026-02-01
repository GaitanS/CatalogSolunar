import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termeni și Condiții | Calendar Solunar',
    description: 'Termenii și condițiile de utilizare pentru Calendar Solunar - calendar de pescuit bazat pe teoria solunar.',
    alternates: { canonical: 'https://calendarsolunar.ro/termeni' },
};

export default function TermeniPage() {
    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="container-custom px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
                        Termeni și Condiții
                    </h1>

                    <div className="card-panel p-6 md:p-8 space-y-6 text-night-300 leading-relaxed">

                        <p className="text-night-400 text-sm">
                            Ultima actualizare: 7 ianuarie 2026
                        </p>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">1. Acceptarea Termenilor</h2>
                            <p>
                                Prin accesarea și utilizarea site-ului Calendar Solunar (calendarsolunar.ro), acceptați să fiți obligat de acești termeni și condiții. Dacă nu sunteți de acord cu oricare dintre termeni, vă rugăm să nu utilizați site-ul.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">2. Descrierea Serviciului</h2>
                            <p>
                                Calendar Solunar oferă informații despre perioadele optime de pescuit bazate pe teoria solunar și fazele lunii. Serviciul include:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>Calcule pentru perioade majore și minore de activitate</li>
                                <li>Informații despre fazele lunii</li>
                                <li>Ore de răsărit și apus pentru soare și lună</li>
                                <li>Prognoze pe 7 zile</li>
                                <li>Articole educative despre pescuit</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">3. Limitarea Răspunderii</h2>
                            <p>
                                <strong className="text-amber-400">Important:</strong> Informațiile furnizate de Calendar Solunar sunt orientative și nu garantează succesul la pescuit.
                            </p>
                            <p className="mt-3">
                                Activitatea peștilor depinde de mulți factori pe care nu îi putem controla: vremea, temperatura apei, presiunea atmosferică, biotopul zonei etc. Calculele noastre se bazează pe algoritmi astronomici și teoria solunar, dar rezultatele pot varia.
                            </p>
                            <p className="mt-3">
                                Nu ne asumăm răspunderea pentru:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>Decizii luate pe baza informațiilor de pe site</li>
                                <li>Lipsa capturilor sau rezultate sub așteptări</li>
                                <li>Erori în calcule sau date afișate</li>
                                <li>Întreruperi ale serviciului</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">4. Proprietate Intelectuală</h2>
                            <p>
                                Conținutul site-ului, inclusiv texte, grafică, logo-uri, imagini și cod sursă, este proprietatea Calendar Solunar și este protejat de legile drepturilor de autor.
                            </p>
                            <p className="mt-3">
                                Aveți dreptul să:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>Vizualizați conținutul pentru uz personal</li>
                                <li>Distribuiți link-uri către site</li>
                            </ul>
                            <p className="mt-3">
                                Nu aveți dreptul să:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>Copiați sau reproduceți conținutul fără permisiune</li>
                                <li>Utilizați conținutul în scopuri comerciale</li>
                                <li>Modificați sau creați lucrări derivate</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">5. Utilizare Acceptabilă</h2>
                            <p>Vă angajați să nu:</p>
                            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                                <li>Utilizați site-ul pentru activități ilegale</li>
                                <li>Încercați să accesați sisteme sau date fără autorizare</li>
                                <li>Transmiteți viruși sau cod malițios</li>
                                <li>Supraîncărcați serverele cu cereri automate</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">6. Publicitate</h2>
                            <p>
                                Site-ul poate afișa reclame prin Google AdSense. Aceste reclame ne ajută să menținem serviciul gratuit. Reclamele afișate sunt gestionate de terți și pot fi personalizate pe baza intereselor dumneavoastră.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">7. Link-uri Externe</h2>
                            <p>
                                Site-ul poate conține link-uri către site-uri terțe. Nu avem control asupra conținutului acestor site-uri și nu ne asumăm răspunderea pentru ele.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">8. Modificări</h2>
                            <p>
                                Ne rezervăm dreptul de a modifica acești termeni în orice moment. Continuarea utilizării site-ului după modificări constituie acceptarea noilor termeni.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">9. Legislație Aplicabilă</h2>
                            <p>
                                Acești termeni sunt guvernați de legislația României. Orice dispută va fi soluționată de instanțele competente din România.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-display font-bold text-white mb-3">10. Contact</h2>
                            <p>
                                Pentru întrebări referitoare la acești termeni:
                            </p>
                            <p className="mt-2">
                                <strong className="text-white">Email:</strong>{' '}
                                <a href="mailto:legal@calendarsolunar.ro" className="text-moon hover:underline">
                                    legal@calendarsolunar.ro
                                </a>
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
