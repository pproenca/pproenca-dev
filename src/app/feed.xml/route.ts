import { createFeedResponse } from "@/lib/feed";

export const dynamic = "force-static";

export const GET = () => createFeedResponse("rss");
