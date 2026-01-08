import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { MDXContent } from "@/components/MDXContent";
import { CategoryBadge } from "@/components/CategoryBadge";
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
        <div className="mt-golden-2 flex flex-wrap justify-center gap-golden-1">
          {frontmatter.categories.map((category) => (
            <CategoryBadge key={category} category={category} size="md" />
          ))}
        </div>
      </header>

      <MDXContent source={content} />
    </article>
  );
}
