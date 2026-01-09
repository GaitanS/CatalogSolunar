import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact | Calendar Solunar Pescuit',
    description: 'Contactează echipa Calendar Solunar pentru întrebări, sugestii sau parteneriate. Suntem aici să te ajutăm!',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="container-custom px-4">
                {/* Hero */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
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
                                        Răspundem în maxim 24 de ore.
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

                    {/* Contact Form */}
                    <div className="card-panel p-6 md:p-8">
                        <h2 className="text-xl font-display font-bold text-white mb-6">Trimite-ne un mesaj</h2>
                        <form className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-night-300 mb-2">
                                    Numele tău
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-4 py-3 bg-night-900 border border-night-700 rounded-xl text-white placeholder-night-500 focus:outline-none focus:border-moon transition-colors"
                                    placeholder="Ion Pescaru"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-night-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-4 py-3 bg-night-900 border border-night-700 rounded-xl text-white placeholder-night-500 focus:outline-none focus:border-moon transition-colors"
                                    placeholder="ion@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-night-300 mb-2">
                                    Subiect
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    className="w-full px-4 py-3 bg-night-900 border border-night-700 rounded-xl text-white focus:outline-none focus:border-moon transition-colors"
                                >
                                    <option value="general">Întrebare generală</option>
                                    <option value="bug">Raportare problemă</option>
                                    <option value="feature">Sugestie funcționalitate</option>
                                    <option value="partnership">Parteneriat</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-night-300 mb-2">
                                    Mesaj
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="w-full px-4 py-3 bg-night-900 border border-night-700 rounded-xl text-white placeholder-night-500 focus:outline-none focus:border-moon transition-colors resize-none"
                                    placeholder="Scrie mesajul tău aici..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-moon text-night-950 font-bold rounded-xl hover:bg-moon/90 transition-colors"
                            >
                                Trimite Mesajul
                            </button>
                        </form>
                        <p className="text-night-500 text-xs text-center mt-4">
                            Prin trimiterea acestui formular, ești de acord cu <a href="/confidentialitate" className="text-moon hover:underline">Politica de Confidențialitate</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
