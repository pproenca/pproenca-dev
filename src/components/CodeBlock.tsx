import * as React from "react";
import { CopyButton } from "./CopyButton";

/** Props for the CodeBlock component */
export interface CodeBlockProps {
  /** The raw code string (used for copying) */
  children: string;
  /** Pre-rendered HTML for light theme */
  lightHtml: string;
  /** Pre-rendered HTML for dark theme */
  darkHtml: string;
  /** Ref to the container div element */
  ref?: React.Ref<HTMLDivElement>;
  /** Additional class names */
  className?: string;
  /** Accessible label for the code block */
  "aria-label"?: string;
}

/**
 * A code block with syntax highlighting and copy functionality.
 * Uses role="figure" for accessibility with an optional aria-label.
 */
export function CodeBlock({
  children,
  lightHtml,
  darkHtml,
  ref,
  className,
  "aria-label": ariaLabel,
}: CodeBlockProps) {
  return (
    <div
      ref={ref}
      className={className ?? "terminal-window group"}
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
}
