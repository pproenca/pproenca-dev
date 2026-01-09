import * as React from "react";
import { CopyButton } from "./CopyButton";

export interface CodeBlockProps {
  children: string;
  lightHtml: string;
  darkHtml: string;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  "aria-label"?: string;
}

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
