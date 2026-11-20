/**
 * Renders one JSON-LD block that references every supplied schema node.
 * `<` is escaped so CMS text can never close the script tag early.
 */
export function JsonLd({ nodes }: { nodes: Record<string, unknown>[] }) {
  const payload = { '@context': 'https://schema.org', '@graph': nodes };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, '\\u003c') }}
    />
  );
}
