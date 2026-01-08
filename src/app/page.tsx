import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";

export default function HomePage() {
  const posts = getAllPosts();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
    },
  };

  return (
    <div>
      <JsonLd data={websiteSchema} />
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
