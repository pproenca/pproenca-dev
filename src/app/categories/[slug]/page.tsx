import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategorySlugs,
  getPostsByCategory,
  slugToCategory,
} from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { Heading, Text } from "@/components/elements";
import { SITE_CONFIG, buildBreadcrumbSchema } from "@/lib/constants";

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
    alternates: {
      canonical: `/categories/${slug}`,
    },
    openGraph: {
      title: `${category} Posts`,
      description: `All blog posts in the ${category} category`,
      url: `/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = slugToCategory(slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: SITE_CONFIG.url },
    { name: "Categories", item: `${SITE_CONFIG.url}/categories` },
    { name: category },
  ]);

  return (
    <div>
      <JsonLd data={breadcrumbSchema} />
      <Heading level={1} className="text-3xl">
        {category}
      </Heading>
      <Text className="mt-golden-2">
        {posts.length} {posts.length === 1 ? "post" : "posts"} in this category
      </Text>

      <div className="mt-golden-5 space-y-golden-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-golden-5 text-text-tertiary">
          No posts found in this category.
        </p>
      )}
    </div>
  );
}
