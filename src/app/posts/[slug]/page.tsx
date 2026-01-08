import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPostBySlug, categoryToSlug } from "@/lib/posts";
import { MDXContent } from "@/components/MDXContent";
import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";
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
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.date,
      authors: [SITE_CONFIG.author.url],
      tags: post.frontmatter.categories,
      url: `/posts/${slug}`,
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
    },
    publisher: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/posts/${slug}`,
    },
    keywords: frontmatter.categories?.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Posts",
        item: `${SITE_CONFIG.url}/posts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-[680px]">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <header className="mb-golden-5 text-center">
        <h1 className="font-serif text-4xl font-bold leading-tight text-text-primary">
          {frontmatter.title}
        </h1>
        <time className="mt-golden-2 block text-text-tertiary">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <MDXContent source={content} />

      {frontmatter.categories && frontmatter.categories.length > 0 && (
        <footer className="mt-golden-6 border-t border-border pt-golden-4">
          <p className="font-serif text-sm text-text-tertiary">
            Filed under{" "}
            {frontmatter.categories.map((category, index) => (
              <span key={category}>
                <Link
                  href={`/categories/${categoryToSlug(category)}`}
                  className="text-text-secondary transition-colors hover:text-accent"
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
