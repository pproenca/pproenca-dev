"use client";

import * as React from "react";

/** Props for the CopyButton component */
export interface CopyButtonProps {
  /** The code string to copy to clipboard */
  code: string;
  /** Ref to the underlying button element */
  ref?: React.Ref<HTMLButtonElement>;
  /** Additional class names */
  className?: string;
}

/**
 * A button that copies code to the clipboard.
 * Uses aria-pressed for accessibility and data-copied for CSS styling.
 * Includes an aria-live region to announce copy confirmation.
 */
export function CopyButton({ code, ref, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Reset after 2 seconds
    timerRef.current = setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 2000);
  }, [code]);

  return (
    <>
      <button
        ref={ref}
        onClick={handleCopy}
        className={className ?? "terminal-copy"}
        aria-label={copied ? "Copied!" : "Copy code"}
        aria-pressed={copied}
        data-copied={copied ? "" : undefined}
      >
        {copied ? (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
      {/* Live region for screen reader announcement */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </>
  );
}
