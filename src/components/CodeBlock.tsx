"use client";

import { useState } from "react";

interface CodeBlockProps {
  children: string;
  className?: string;
  lightHtml: string;
  darkHtml: string;
}

export function CodeBlock({
  children,
  className,
  lightHtml,
  darkHtml,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-window group">
      {/* Terminal Header - Minimal */}
      <div className="terminal-header">
        {/* Traffic Lights */}
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="terminal-copy"
          aria-label="Copy code"
        >
          {copied ? (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
      </div>

      {/* Terminal Body */}
      <div className="terminal-body">
        <div
          className={`hidden dark:block ${className || ""}`}
          dangerouslySetInnerHTML={{ __html: darkHtml }}
        />
        <div
          className={`block dark:hidden ${className || ""}`}
          dangerouslySetInnerHTML={{ __html: lightHtml }}
        />
      </div>
    </div>
  );
}
