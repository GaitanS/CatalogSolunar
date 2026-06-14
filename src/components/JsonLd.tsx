// Renders a JSON-LD <script> for structured data — XSS-safe by construction.
//
// The payload is always built from our own data/computed values (never user
// input). We serialize to JSON and escape "<", ">" and "&" to their JSON
// \uXXXX forms. After that the string contains none of those characters, so
// rendering it as a plain text child of <script> is exact (React's text
// escaping becomes a no-op) and can never break out of the element. This avoids
// dangerouslySetInnerHTML entirely while producing valid JSON-LD.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
    const json = JSON.stringify(data)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');
    return <script type="application/ld+json">{json}</script>;
}
