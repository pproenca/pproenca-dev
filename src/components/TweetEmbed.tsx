import * as React from "react";
import { Suspense } from "react";
import { Tweet, TweetNotFound, TweetSkeleton } from "react-tweet";

export interface TweetEmbedProps {
  /** Twitter/X post ID (required) */
  id: string;
  className?: string;
}

/**
 * Wrapper for react-tweet with error handling and loading state.
 * Styled via globals.css .react-tweet-theme selectors.
 */
export const TweetEmbed = React.forwardRef<HTMLDivElement, TweetEmbedProps>(
  function TweetEmbed({ id, className }, ref) {
    if (!id) return null;

    return (
      <div ref={ref} className={className}>
        <Suspense fallback={<TweetSkeleton />}>
          <Tweet id={id} fallback={<TweetNotFound />} />
        </Suspense>
      </div>
    );
  },
);

export namespace TweetEmbed {
  export type Props = TweetEmbedProps;
}
