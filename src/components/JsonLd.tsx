import type { Thing, WithContext } from "schema-dts";

type JsonLdData = WithContext<Thing> | Record<string, unknown>;

interface JsonLdProps {
  data: JsonLdData;
}

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
