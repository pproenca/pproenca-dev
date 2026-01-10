"use client";

import { clsx } from "clsx/lite";
import * as React from "react";

interface CopyButtonProps {
  code: string;
}

function CopyButton({ code }: CopyButtonProps) {
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
        onClick={handleCopy}
        className="terminal-copy"
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

export interface CodeBlockProps {
  children: string;
  lightHtml: string;
  darkHtml: string;
  className?: string;
  "aria-label"?: string;
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock(
    { children, lightHtml, darkHtml, className, "aria-label": ariaLabel },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={clsx("terminal-window group", className)}
        role="figure"
        aria-label={ariaLabel ?? "Code example"}
      >
        <div className="terminal-header">
          <div className="terminal-dots" aria-hidden="true">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
          </div>
          <CopyButton code={children} />
        </div>
        <div className="terminal-body">
          <div
            className="hidden dark:block"
            dangerouslySetInnerHTML={{ __html: darkHtml }}
          />
          <div
            className="block dark:hidden"
            dangerouslySetInnerHTML={{ __html: lightHtml }}
          />
        </div>
      </div>
    );
  },
);
