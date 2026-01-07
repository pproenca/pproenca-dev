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
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded border border-[var(--color-border-visible)] bg-[var(--color-bg-surface)] px-2 py-1 text-xs text-[var(--color-text-secondary)] opacity-0 transition-all duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <div
        className={`hidden dark:block ${className || ""}`}
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />
      <div
        className={`block dark:hidden ${className || ""}`}
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
    </div>
  );
}
