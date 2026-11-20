import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact | Calendar Solunar Pescuit',
    description: 'Contactează echipa Calendar Solunar pentru întrebări, sugestii sau parteneriate. Suntem aici să te ajutăm!',
    alternates: { canonical: 'https://calendarsolunar.ro/contact' },
    openGraph: {
        type: 'website',
        title: 'Contactează Calendar Solunar',
        description: 'Ai întrebări sau sugestii? Contactează echipa Calendar Solunar.',
        url: 'https://calendarsolunar.ro/contact',
    },
};

const CONTACT_EMAIL = 'contact@calendarsolunar.ro';

const CONTACT_TOPICS = [
    { label: 'Am găsit o eroare', subject: 'Eroare pe calendarsolunar.ro', hint: 'Scrie pagina, localitatea și ziua, ca să o putem verifica.' },
    { label: 'Întrebare sau sugestie', subject: 'Întrebare despre Calendar Solunar', hint: 'Ce ți-ar fi util în calendar sau ce nu e clar.' },
    { label: 'Parteneriat', subject: 'Parteneriat Calendar Solunar', hint: 'Magazine de pescuit, bălți și baze pescărești.' },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen pb-12 pt-4 md:pt-6">
            <div className="container-custom">
                {/* Hero */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-editorial text-white mb-4 tracking-tight">
                        Contactează-ne
                    </h1>
                    <p className="text-night-300 text-lg max-w-2xl mx-auto">
                        Ai întrebări sau sugestii? Ne-ar plăcea să auzim de la tine!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="card-panel p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-moon/10 text-moon shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Email</h3>
                                    <a href="mailto:contact@calendarsolunar.ro" className="text-moon hover:underline">
                                        contact@calendarsolunar.ro
                                    </a>
                                    <p className="text-night-400 text-sm mt-1">
                                        De obicei răspundem în 1–2 zile lucrătoare.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-panel p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Sugestii & Feedback</h3>
                                    <p className="text-night-300">
                                        Apreciem orice sugestie pentru îmbunătățirea platformei.
                                    </p>
                                    <p className="text-night-400 text-sm mt-1">
                                        Spune-ne ce funcționalități ți-ar fi utile!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-panel p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Parteneriate</h3>
                                    <p className="text-night-300">
                                        Ești proprietar de magazin de pescuit sau bază pescărească?
                                    </p>
                                    <p className="text-night-400 text-sm mt-1">
                                        Contactează-ne pentru colaborări.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The page had a form with no handler; mail links actually reach us. */}
                    <div className="card-panel p-6 md:p-8">
                        <h2 className="text-xl font-display font-bold text-white mb-2">Scrie-ne un e-mail</h2>
                        <p className="text-night-300 text-sm mb-6">
                            Alege subiectul și se deschide aplicația ta de e-mail cu mesajul pregătit.
                        </p>
                        <div className="space-y-3">
                            {CONTACT_TOPICS.map((topic) => (
                                <a
                                    key={topic.subject}
                                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(topic.subject)}`}
                                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 hover:bg-white/[0.08] transition-colors"
                                >
                                    <span>
                                        <span className="block font-semibold text-white">{topic.label}</span>
                                        <span className="block text-night-400 text-sm">{topic.hint}</span>
                                    </span>
                                    <span className="text-moon text-sm font-semibold whitespace-nowrap">Scrie →</span>
                                </a>
                            ))}
                        </div>
                        <p className="text-night-500 text-xs mt-6">
                            Folosim adresa ta doar ca să-ți răspundem. Detalii în <a href="/confidentialitate" className="text-moon hover:underline">Politica de Confidențialitate</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
