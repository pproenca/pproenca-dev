import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { SITE_CONFIG } from "@/lib/constants";

export async function GET() {
  const posts = getAllPosts();

  const feed = new Feed({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    id: SITE_CONFIG.url,
    link: SITE_CONFIG.url,
    language: "en",
    favicon: `${SITE_CONFIG.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${SITE_CONFIG.author.name}`,
    author: {
      name: SITE_CONFIG.author.name,
      link: SITE_CONFIG.author.url,
    },
    feedLinks: {
      rss2: `${SITE_CONFIG.url}/feed.xml`,
      atom: `${SITE_CONFIG.url}/atom.xml`,
    },
  });

  for (const post of posts) {
    const url = `${SITE_CONFIG.url}/posts/${post.slug}`;
    feed.addItem({
      title: post.frontmatter.title,
      id: url,
      link: url,
      description: post.frontmatter.description,
      date: new Date(post.frontmatter.date),
      category: post.frontmatter.categories.map((name) => ({ name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
