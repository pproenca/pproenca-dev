import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pedro Proenca - Hands-on Engineering Manager, growth hacker, and hardware tinkerer based in the UK",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[680px]">
      <h1 className="font-serif text-3xl font-bold text-(--color-text-primary)">
        About
      </h1>

      <div className="prose mt-golden-4 max-w-none">
        <p>
          Hey there! I&apos;m Pedro, an Engineering Manager based in the UK who
          still loves writing code. This is my corner of the internet where I
          write about web development, growth engineering, and whatever else
          I&apos;m tinkering with.
        </p>

        <h2>What I Do</h2>
        <p>
          I&apos;m currently building a viral growth engine at{" "}
          <a
            href="https://www.trustedhousesitters.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            TrustedHousesitters
          </a>
          . Before that, I spent time at Facebook as an Engineering Manager
          working on WWW release engineering &mdash; helping ship code to
          billions of users. I&apos;ve also worked across London, Berlin, and
          Lisbon over the years.
        </p>
        <p>
          I even hold a patent for something called &ldquo;Dynamic determination
          of smart meetup&rdquo; &mdash; basically figuring out the best place
          for two people to meet without either revealing their exact location.
        </p>

        <h2>What I&apos;m Into</h2>
        <p>
          Beyond growth engineering, I love getting my hands dirty with hardware
          projects. You&apos;ll often find me messing with Raspberry Pis,
          Pimoroni boards, or diving into Bluetooth security research. I mostly
          code in Python and TypeScript, though I&apos;ll reach for whatever
          gets the job done.
        </p>

        <h2>About This Blog</h2>
        <p>
          This blog is built with Next.js, MDX, and Tailwind CSS. It&apos;s
          statically generated and posts are written in MDX so I can include
          interactive components when needed.
        </p>

        <h2>Get in Touch</h2>
        <p>
          Feel free to reach out! You can find me on{" "}
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
