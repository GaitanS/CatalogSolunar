import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    // JSON-LD schema - all values are hardcoded strings from server components, no user input
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href ? { item: `https://calendarsolunar.ro${item.href}` } : {}),
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <nav aria-label="Breadcrumb" className="container-custom px-4 pt-2 pb-4">
                <ol className="flex flex-wrap items-center gap-1.5 text-xs text-night-400">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-1.5">
                            {index > 0 && <span className="text-night-600">/</span>}
                            {item.href && index < items.length - 1 ? (
                                <Link href={item.href} className="hover:text-amber-400 transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-night-300">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
