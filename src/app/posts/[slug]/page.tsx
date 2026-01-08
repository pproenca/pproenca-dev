import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPostBySlug, categoryToSlug } from "@/lib/posts";
import { MDXContent } from "@/components/MDXContent";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <article className="mx-auto max-w-[680px]">
      <header className="mb-golden-5 text-center">
        <h1 className="font-serif text-4xl font-bold leading-tight text-(--color-text-primary)">
          {frontmatter.title}
        </h1>
        <time className="mt-golden-2 block text-(--color-text-tertiary)">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <MDXContent source={content} />

      {frontmatter.categories && frontmatter.categories.length > 0 && (
        <footer className="mt-golden-6 border-t border-(--color-border) pt-golden-4">
          <p className="font-serif text-sm text-(--color-text-tertiary)">
            Filed under{" "}
            {frontmatter.categories.map((category, index) => (
              <span key={category}>
                <Link
                  href={`/categories/${categoryToSlug(category)}`}
                  className="text-(--color-text-secondary) transition-colors hover:text-(--color-accent)"
                >
                  {category}
                </Link>
                {index < frontmatter.categories.length - 1 && ", "}
              </span>
            ))}
          </p>
        </footer>
      )}
    </article>
  );
}
