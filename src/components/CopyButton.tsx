"use client";

import * as React from "react";

export interface CopyButtonProps {
  code: string;
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
}

export function CopyButton({ code, ref, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 2000);
  };

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
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </>
  );
}
