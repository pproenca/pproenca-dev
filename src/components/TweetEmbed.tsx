import { Tweet, TweetNotFound } from "react-tweet";

export interface TweetEmbedProps {
  id: string;
  className?: string;
}

/**
 * Wrapper for react-tweet with error handling.
 * Loading state is handled internally by react-tweet's Suspense.
 * Styled via globals.css .react-tweet-theme selectors.
 */
export function TweetEmbed({ id, className }: TweetEmbedProps) {
  if (!id) return null;

  return (
    <div className={className}>
      <Tweet id={id} fallback={<TweetNotFound />} />
    </div>
  );
}

