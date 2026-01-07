import Link from "next/link";
import { categoryToSlug } from "@/lib/posts";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const sizeClasses =
    size === "sm" ? "px-3 py-0.5 text-xs" : "px-4 py-1 text-sm";

  return (
    <Link
      href={`/categories/${categoryToSlug(category)}`}
      className={`${sizeClasses} rounded-full border border-[var(--color-border-visible)] bg-transparent text-[var(--color-text-secondary)] transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]`}
    >
      {category}
    </Link>
  );
}
