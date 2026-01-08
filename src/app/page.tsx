import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-(--color-text-primary)">
        Latest Posts
      </h1>
      <p className="mt-golden-2 text-(--color-text-secondary)">
        Thoughts on web development, programming, and technology.
      </p>

      <div className="mt-golden-5 space-y-golden-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-golden-5 text-(--color-text-tertiary)">
          No posts yet. Check back soon!
        </p>
      )}
    </div>
  );
}
