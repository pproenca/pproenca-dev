import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, categoryToSlug } from "@/lib/posts";
import { Heading } from "@/components/elements/Heading";
import { Text } from "@/components/elements/Text";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all blog post categories",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "Categories",
    description: "Browse all blog post categories",
    url: "/categories",
  },
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div>
      <Heading level={1} className="text-3xl">
        Categories
      </Heading>
      <Text className="mt-golden-2">Browse posts by category</Text>

      <div className="mt-golden-4 flex flex-wrap gap-golden-2">
        {categories.map(({ name, count }) => (
          <Link
            key={name}
            href={`/categories/${categoryToSlug(name)}`}
            className="group flex items-center gap-golden-2 rounded-lg border border-border-visible bg-bg-surface px-golden-2 py-golden-1 text-sm font-medium text-text-primary transition-colors duration-200 hover:border-accent hover:bg-bg-elevated hover:text-accent"
          >
            <span>{name}</span>
            <span className="tabular-nums rounded-full bg-bg-deep px-2 py-0.5 text-text-secondary ring-1 ring-border-subtle group-hover:text-accent group-hover:ring-accent/40">
              {count}
            </span>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="mt-golden-4 text-text-tertiary">No categories found.</p>
      )}
    </div>
  );
}
