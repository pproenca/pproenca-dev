import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import {
  SITE_CONFIG,
  ROUTES,
  CONTENT_TYPES,
  siteUrl,
  postUrl,
} from "@/lib/constants";

export type FeedFormat = "rss" | "atom" | "json";

export function createFeed(): Feed {
  const posts = getAllPosts();

  const feed = new Feed({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    id: siteUrl("/"),
    link: SITE_CONFIG.url,
    language: SITE_CONFIG.language,
    favicon: siteUrl("/favicon.ico"),
    copyright: `© ${new Date().getFullYear()} ${SITE_CONFIG.author.name}`,
    author: {
      name: SITE_CONFIG.author.name,
      link: SITE_CONFIG.author.url,
    },
    feedLinks: {
      rss2: siteUrl(ROUTES.feed.rss),
      atom: siteUrl(ROUTES.feed.atom),
      json: siteUrl(ROUTES.feed.json),
    },
  });

  for (const post of posts) {
    const url = siteUrl(postUrl(post.slug));
    feed.addItem({
      title: post.frontmatter.title,
      id: url,
      link: url,
      description: post.frontmatter.description,
      date: new Date(post.frontmatter.date),
      category: post.frontmatter.categories.map((name) => ({ name, term: name })),
    });
  }

  return feed;
}

export function createFeedResponse(format: FeedFormat): Response {
  const feed = createFeed();
  const content = {
    rss: () => feed.rss2(),
    atom: () => feed.atom1(),
    json: () => feed.json1(),
  };
  return new Response(content[format](), {
    headers: { "Content-Type": CONTENT_TYPES[format] },
  });
}
