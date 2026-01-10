import { createFeedResponse } from "@/lib/feed";

export const GET = () => createFeedResponse("atom");
