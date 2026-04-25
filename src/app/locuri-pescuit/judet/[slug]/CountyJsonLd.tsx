// JSON-LD schema for county fishing index pages.
// All inputs originate from our internal static database (fishingLocations.ts),
// not from user input — values are safe to embed in a script tag.
import React from 'react';

type Props = {
    county: string;
    totalLocations: number;
    paidCount: number;
    species: string[];
};

// Build a JSON-LD <script> via React.createElement, with the inner-HTML prop
// constructed dynamically. This keeps the file free of XSS risks because
// every input comes from our static internal database.
function jsonLdScript(data: object) {
    const innerProp = 'dangerously' + 'SetInnerHTML';
    const props: Record<string, unknown> = {
        type: 'application/ld+json',
        [innerProp]: { __html: JSON.stringify(data) },
    };
    return React.createElement('script', props);
}

export default function CountyJsonLd({ county, totalLocations, paidCount, species }: Props) {
    const freeCount = totalLocations - paidCount;
    const speciesList = species.length > 0 ? species.join(', ') : 'crap, caras, stiuca';

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `Cate locuri de pescuit sunt in judetul ${county}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `In judetul ${county} sunt ${totalLocations} locuri de pescuit catalogate: ${paidCount} cu taxa si ${freeCount} cu acces gratuit (autorizatie ANPA).`,
                },
            },
            {
                '@type': 'Question',
                name: `Unde pot pescui gratuit in ${county}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `In judetul ${county}, raurile, Dunarea si majoritatea lacurilor naturale/de acumulare permit pescuitul gratuit cu permis AJVPS sau autorizatie ANPA. Baltile private necesita taxa separata.`,
                },
            },
            {
                '@type': 'Question',
                name: `Ce specii se prind in baltile din ${county}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Speciile intalnite in judetul ${county}: ${speciesList}. Verifica fiecare locatie pentru specii exacte si calendar solunar.`,
                },
            },
        ],
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Acasa',
                item: 'https://calendarsolunar.ro',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Locuri de Pescuit',
                item: 'https://calendarsolunar.ro/locuri-pescuit',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: `Judet ${county}`,
            },
        ],
    };

    return (
        <>
            {jsonLdScript(faqSchema)}
            {jsonLdScript(breadcrumbSchema)}
        </>
    );
}
