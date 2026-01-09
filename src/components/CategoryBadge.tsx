import * as React from "react";
import Link from "next/link";
import { categoryToSlug } from "@/lib/posts";

/** Props for the CategoryBadge component */
export interface CategoryBadgeProps {
  /** The category name to display */
  category: string;
  /** Size variant for the badge */
  size?: "sm" | "md";
  /** Ref to the underlying Link element */
  ref?: React.Ref<HTMLAnchorElement>;
  /** Additional class names */
  className?: string;
}

/**
 * A badge that links to a category page.
 * Uses data-size for CSS styling hooks.
 */
export function CategoryBadge({
  category,
  size = "sm",
  ref,
  className,
}: CategoryBadgeProps) {
  const sizeClasses = size === "sm" ? "py-1 text-xs" : "py-1.5 text-sm";

  return (
    <Link
      ref={ref}
      href={`/categories/${categoryToSlug(category)}`}
      className={
        className ??
        `px-golden-2 ${sizeClasses} rounded-full border border-border-visible bg-transparent text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent`
      }
      data-size={size}
    >
      {category}
    </Link>
  );
}
