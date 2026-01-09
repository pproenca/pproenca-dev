import * as React from "react";
import Link from "next/link";
import { categoryToSlug } from "@/lib/posts";

export interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
  ref?: React.Ref<HTMLAnchorElement>;
  className?: string;
}

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
