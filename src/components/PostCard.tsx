import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { CategoryBadge } from "./CategoryBadge";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;

  return (
    <article className="group">
      <Link href={`/posts/${slug}`} className="block">
        <h2 className="font-serif text-xl font-semibold text-[var(--color-text-primary)] transition-colors duration-200 group-hover:text-[var(--color-accent)]">
          {frontmatter.title}
        </h2>
      </Link>
      <time className="mt-golden-1 block text-sm text-[var(--color-text-tertiary)]">
        {new Date(frontmatter.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <p className="mt-golden-2 leading-relaxed text-[var(--color-text-secondary)]">
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
