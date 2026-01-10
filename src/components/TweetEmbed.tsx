import { Tweet } from "react-tweet";

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
    <div className={`min-h-[200px] ${className ?? ""}`}>
      <Tweet
        id={id}
        fallback={
          <div className="min-h-[200px] animate-pulse rounded border border-border-subtle bg-bg-surface" />
        }
      />
    </div>
  );
}
