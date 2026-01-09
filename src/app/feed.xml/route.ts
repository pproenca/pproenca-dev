import { createFeed } from "@/lib/feed";

export async function GET() {
  const feed = createFeed();
  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
