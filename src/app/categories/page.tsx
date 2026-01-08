import Link from "next/link";
import { getAllCategories, categoryToSlug } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all blog post categories",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)]">
        Categories
      </h1>
      <p className="mt-golden-2 text-[var(--color-text-secondary)]">
        Browse posts by category
      </p>

      <div className="mt-golden-4 flex flex-wrap gap-golden-2">
        {categories.map(({ name, count }) => (
          <Link
            key={name}
            href={`/categories/${categoryToSlug(name)}`}
            className="flex items-center gap-golden-1 rounded-lg border border-[var(--color-border-visible)] px-golden-2 py-golden-1 transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <span className="font-medium text-[var(--color-text-primary)]">
              {name}
            </span>
            <span className="rounded-full border border-[var(--color-border-subtle)] px-2 py-0.5 text-sm text-[var(--color-text-tertiary)]">
              {count}
            </span>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="mt-golden-4 text-[var(--color-text-tertiary)]">
          No categories found.
        </p>
      )}
    </div>
  );
}
