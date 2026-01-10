import { createFeed } from "@/lib/feed";

export async function GET() {
  const feed = createFeed();
  return new Response(feed.json1(), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
