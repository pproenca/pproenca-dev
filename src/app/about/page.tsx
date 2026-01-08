import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me and this blog",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[680px]">
      <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)]">
        About
      </h1>

      <div className="prose mt-golden-4 max-w-none">
        <p>
          Welcome to my blog! This is where I share my thoughts on web
          development, programming, and technology.
        </p>

        <h2>About Me</h2>
        <p>
          I&apos;m a software developer passionate about building great user
          experiences and writing clean, maintainable code.
        </p>

        <h2>About This Blog</h2>
        <p>
          This blog is built with Next.js 16, MDX, and Tailwind CSS. It&apos;s
          statically generated and hosted for free. All posts are written in
          MDX, which allows me to include interactive React components
          alongside Markdown content.
        </p>

        <h2>Get in Touch</h2>
        <p>
          Feel free to reach out! You can find me on GitHub or send me an
          email.
        </p>
      </div>
    </div>
  );
}
