'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "Ce este calendarul solunar?",
        answer: "Calendarul solunar este un instrument bazat pe teoria lui John Alden Knight din 1926, care demonstrează că activitatea peștilor este influențată de poziția lunii. Calculăm perioadele majore și minore când peștii sunt cei mai activi."
    },
    {
        question: "Când trage peștele cel mai bine?",
        answer: "Peștii sunt cei mai activi în perioadele majore (aproximativ 2 ore) și minore (aproximativ 1 oră) calculate pe baza poziției lunii. Cele mai bune momente sunt la răsăritul și apusul lunii, precum și când luna este direct deasupra sau sub orizont."
    },
    {
        question: "Cum funcționează perioadele majore și minore?",
        answer: "Perioadele majore durează aproximativ 2 ore și coincid cu momentele când luna este direct deasupra capului sau sub picioare. Perioadele minore durează aproximativ 1 oră și apar la răsăritul și apusul lunii. În aceste intervale, activitatea peștilor crește semnificativ."
    },
    {
        question: "Este calendarul solunar precis pentru România?",
        answer: "Da, calendarul nostru calculează perioadele solunar specific pentru locația ta din România. Folosim algoritmi astronomici preciși și coordonatele GPS pentru a determina exact când luna influențează cel mai mult activitatea peștilor în zona ta."
    },
    {
        question: "Care este legătura dintre fazele lunii și pescuit?",
        answer: "Fazele lunii influențează direct activitatea peștilor. Luna nouă și luna plină sunt considerate cele mai bune perioade pentru pescuit, când peștii sunt cei mai activi. Primul și ultimul pătrar oferă activitate moderată."
    },
    {
        question: "Cât de precis este calendarul solunar?",
        answer: "Pe baza studiilor și a experienței pescarilor, solunarul este corect în aproximativ 60-70% din cazuri. Precizia crește atunci când o perioadă majoră solunar coincide cu răsăritul sau apusul soarelui. Alți factori precum presiunea atmosferică, temperatura apei, vântul și nivelul apei pot influența rezultatele."
    },
    {
        question: "Există un solunar pe specii de pești?",
        answer: "Solunarul este universal pentru toate speciile — se bazează pe influența lunii asupra tuturor organismelor acvatice. Totuși, când temperatura apei scade sub 14-15°C (toamna-iarna), solunarul este mai precis pentru peștii răpitori (șalău, știucă, somn), iar când temperatura depășește 16-17°C (primăvara-vara), acuratețea crește pentru speciile pașnice (crap, caras, plătică)."
    },
    {
        question: "Cum se citește tabelul solunar?",
        answer: "Tabelul solunar afișează pentru fiecare zi: perioadele majore (2 ore, cele mai intense) și minore (1 oră, activitate bună), rating-ul general de la 1 la 5 stele, faza lunii cu procentul de iluminare, și orele de răsărit/apus pentru soare și lună. Alege zilele cu rating de 4-5 stele și pescuiește în perioadele majore pentru cele mai bune rezultate."
    },
    {
        question: "Ce efect are presiunea atmosferică asupra pescuitului?",
        answer: "Presiunea atmosferică stabilă sau în ușoară creștere (1013-1025 hPa) oferă cele mai bune condiții de pescuit. Scăderile bruște de presiune fac peștii inactivi, iar creșterile brusce îi activează temporar. Combinând presiunea favorabilă cu perioadele majore solunar, șansele de captură cresc semnificativ."
    },
    {
        question: "Când este cel mai bun moment pentru pescuit în 2026?",
        answer: "Cele mai bune momente de pescuit în 2026 sunt zilele cu rating solunar de 4-5 stele, când o perioadă majoră solunar coincide cu răsăritul sau apusul soarelui, în condiții de presiune atmosferică stabilă. Verifică calendarul solunar lunar pentru a vedea exact care sunt zilele optime în fiecare lună."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Static FAQ schema - no user input, safe to use dangerouslySetInnerHTML
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <section className="mb-12">
            {/* FAQ Schema - static content, no XSS risk */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-moon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Întrebări Frecvente despre Solunar
            </h2>

            <div className="space-y-3">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className="card-glass rounded-xl overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="font-semibold text-white pr-4">{item.question}</span>
                            <svg
                                className={`w-5 h-5 text-moon shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openIndex === index && (
                            <div className="px-5 pb-4 text-night-300 text-sm leading-relaxed border-t border-white/5 pt-3">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
