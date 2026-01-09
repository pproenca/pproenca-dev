import Link from "next/link";
import { categoryToSlug } from "@/lib/posts";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const sizeClasses = size === "sm" ? "py-1 text-xs" : "py-1.5 text-sm";

  return (
    <Link
      href={`/categories/${categoryToSlug(category)}`}
      className={`px-golden-2 ${sizeClasses} rounded-full border border-border-visible bg-transparent text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent`}
    >
      {category}
    </Link>
  );
}
