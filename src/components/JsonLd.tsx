import type { Thing, WithContext } from "schema-dts";

/** Union type for JSON-LD data - either schema.org typed or generic object */
type JsonLdData = WithContext<Thing> | Record<string, unknown>;

/** Props for the JsonLd component */
interface JsonLdProps {
  /** The structured data to inject as JSON-LD */
  data: JsonLdData;
}

/**
 * Injects JSON-LD structured data into the page for SEO.
 * Escapes < characters to prevent XSS attacks.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
