import { clsx } from "clsx/lite";
import Link from "next/link";
import type { ComponentProps } from "react";
import { PostMeta, formatPostDate, categoryToSlug } from "@/lib/posts";

type PostCardProps = {
  post: PostMeta;
} & ComponentProps<"article">;

function CategoryBadge({ category }: { category: string }) {
  return (
    <Link
      href={`/categories/${categoryToSlug(category)}`}
      className={clsx(
        "rounded-full border border-border-visible bg-transparent px-golden-2 py-1 text-xs text-text-secondary",
        "transition-colors duration-base hover:border-accent hover:text-accent"
      )}
    >
      {category}
    </Link>
  );
}

export function PostCard({ post, className, ...props }: PostCardProps) {
  const { slug, frontmatter } = post;

  return (
    <article className={clsx("group", className)} {...props}>
      <Link href={`/posts/${slug}`} className="block">
        <h2
          className={clsx(
            "font-serif text-xl font-semibold text-text-primary",
            "transition-colors duration-base group-hover:text-accent"
          )}
        >
          {frontmatter.title}
        </h2>
      </Link>
      <time className="mt-golden-1 block text-sm text-text-tertiary">
        {formatPostDate(frontmatter.date)}
      </time>
      <p className="mt-golden-2 leading-relaxed text-text-secondary">
        {frontmatter.description}
      </p>
      <div className="mt-golden-2 flex flex-wrap gap-golden-1">
        {frontmatter.categories.map((category) => (
          <CategoryBadge key={category} category={category} />
        ))}
      </div>
    </article>
  );
}
