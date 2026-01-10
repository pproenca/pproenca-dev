import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Person, WithContext } from "schema-dts";
import { JsonLd } from "@/components/JsonLd";
import { MDXContent } from "@/components/MDXContent";
import { Heading } from "@/components/elements";
import { getPageBySlug } from "@/lib/pages";
import { SITE_CONFIG } from "@/lib/constants";

const page = getPageBySlug("about");

export const metadata: Metadata = {
  title: page?.frontmatter.title ?? "About",
  description:
    page?.frontmatter.description ??
    "Pedro Proenca - Hands-on Engineering Manager, growth hacker, and hardware tinkerer based in the UK",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: page?.frontmatter.title ?? "About",
    description:
      page?.frontmatter.description ??
      "Pedro Proenca - Hands-on Engineering Manager, growth hacker, and hardware tinkerer based in the UK",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  if (!page) {
    notFound();
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    url: SITE_CONFIG.author.url,
    jobTitle: SITE_CONFIG.author.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: SITE_CONFIG.author.employer,
    },
    description:
      "Hands-on Engineering Manager, growth hacker, and hardware tinkerer based in the UK",
    sameAs: [
      SITE_CONFIG.social.github,
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.twitter,
    ],
    knowsAbout: [
      "Web Development",
      "TypeScript",
      "Python",
      "Growth Engineering",
      "React",
      "Next.js",
    ],
  } as const satisfies WithContext<Person>;

  return (
    <div>
      <JsonLd data={personSchema} />
      <Heading level={1} className="text-3xl">
        {page.frontmatter.title}
      </Heading>

      <div className="mt-golden-4">
        <MDXContent source={page.content} />
      </div>
    </div>
  );
}
