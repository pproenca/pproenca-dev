import type { Metadata } from "next";
import type { Person, WithContext } from "schema-dts";
import { JsonLd } from "@/components/JsonLd";
import { Heading } from "@/components/elements";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pedro Proenca - Hands-on Engineering Manager, growth hacker, and hardware tinkerer based in the UK",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About",
    description:
      "Pedro Proenca - Hands-on Engineering Manager, growth hacker, and hardware tinkerer based in the UK",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
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
        About
      </Heading>

      <div className="prose mt-golden-4 max-w-none">
        <p>
          I&apos;ve been building products from scratch since 2012. An invoicing
          platform with one colleague. Marketplaces for exchanging goods across
          Europe. APIs serving millions of users.
        </p>

        <p>Then I started building the teams that build the products.</p>

        <p>
          At OLX, I built the personalization team &mdash; the ML models that
          powered hyper-local feeds globally. At Meta, I built the teams running
          CI/CD for the backend of nearly every product in the family of apps.
          Thousands of engineers shipping to billions of users.
        </p>

        <p>I never stopped coding. That part&apos;s non-negotiable.</p>

        <p>
          At{" "}
          <a
            href="https://www.trustedhousesitters.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            TrustedHousesitters
          </a>
          , I&apos;m building two things: the team shipping tools that help
          marketing convert at scale, and the team integrating gamification into
          our product to create a viral growth engine.
        </p>

        <p>
          Somewhere in there, I built an E2E testing framework for a legacy
          platform where unit tests weren&apos;t an option. Docker didn&apos;t
          exist yet. A thousand engineers ended up using it.
        </p>

        <p>
          I&apos;ve also grown engineers from junior to principal. IC7 at big
          tech. That might be the work I&apos;m proudest of.
        </p>

        <h2>Outside of Work</h2>

        <p>
          I&apos;m usually deep in something technically complex &mdash;
          Raspberry Pis, Bluetooth security, whatever AI thing I&apos;m learning
          that week. I open source as much as I can so others can learn too.
        </p>

        <p>
          This is where I write about growth engineering, hardware projects, and
          the rabbit holes.
        </p>

        <p>
          Find me on{" "}
          <a
            href="https://github.com/pproenca"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          ,{" "}
          <a
            href="https://www.linkedin.com/in/pedro-proenca/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          , or{" "}
          <a
            href="https://twitter.com/ThePedroProenca"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          .
        </p>
      </div>
    </div>
  );
}
