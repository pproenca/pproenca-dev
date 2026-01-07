import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getPostsByCategory,
  slugToCategory,
} from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category} Posts`,
    description: `All blog posts in the ${category} category`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = slugToCategory(slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)]">
        {category}
      </h1>
      <p className="mt-3 text-[var(--color-text-secondary)]">
        {posts.length} {posts.length === 1 ? "post" : "posts"} in this category
      </p>

      <div className="mt-12 space-y-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-12 text-[var(--color-text-tertiary)]">
          No posts found in this category.
        </p>
      )}
    </div>
  );
}
