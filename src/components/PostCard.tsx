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
        "transition-colors duration-base hover:border-accent hover:text-accent",
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
            "font-serif text-lg font-semibold text-text-primary sm:text-xl",
            "transition-colors duration-base group-hover:text-accent",
          )}
        >
          {frontmatter.title}
        </h2>
      </Link>
      <time className="mt-1 block text-sm text-text-tertiary sm:mt-golden-1">
        {formatPostDate(frontmatter.date)}
      </time>
      <p className="mt-2 leading-relaxed text-text-secondary sm:mt-golden-2">
        {frontmatter.description}
      </p>
      <div className="mt-2 flex flex-wrap gap-1 sm:mt-golden-2 sm:gap-golden-1">
        {frontmatter.categories.map((category) => (
          <CategoryBadge key={category} category={category} />
        ))}
      </div>
    </article>
  );
}
