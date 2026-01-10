import type { WebSite, WithContext } from "schema-dts";
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
  } as const satisfies WithContext<WebSite>;

  return (
    <div>
      <JsonLd data={websiteSchema} />
      <div className="space-y-golden-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-text-tertiary">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
