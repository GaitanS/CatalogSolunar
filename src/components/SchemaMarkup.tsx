export default function SchemaMarkup() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Calendar Solunar",
        "url": "https://calendarsolunar.ro",
        "logo": "https://calendarsolunar.ro/logo.webp",
        "description": "Calendarul solunar nr. 1 din România pentru pescuit planificat inteligent",
        "foundingDate": "2024",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "url": "https://calendarsolunar.ro/contact",
            "availableLanguage": "Romanian"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Calendar Solunar",
        "url": "https://calendarsolunar.ro",
        "description": "Calendar solunar precis cu timpuri de pescuit pentru România",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://calendarsolunar.ro?loc={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    const webApplicationSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Calendar Solunar Pescuit",
        "description": "Aplicație web pentru calcularea perioadelor solunar optime pentru pescuit",
        "url": "https://calendarsolunar.ro",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "RON"
        }
    };

    // Using dangerouslySetInnerHTML is safe here because we control the static JSON content
    // No user input is involved - this is the standard pattern for JSON-LD in React
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
            />
        </>
    );
}
