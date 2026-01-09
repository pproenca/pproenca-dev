import { Suspense } from "react";
import { Tweet, TweetNotFound, TweetSkeleton } from "react-tweet";

interface TweetEmbedProps {
  /** Twitter/X post ID (required) */
  id: string;
}

/**
 * Wrapper for react-tweet with error handling and loading state.
 * Styled via globals.css .react-tweet-theme selectors.
 */
export function TweetEmbed({ id }: TweetEmbedProps) {
  if (!id) return null;

  return (
    <Suspense fallback={<TweetSkeleton />}>
      <Tweet id={id} fallback={<TweetNotFound />} />
    </Suspense>
  );
}
