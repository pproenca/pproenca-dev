import { CopyButton } from "./CopyButton";

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
        <CopyButton code={children} />
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
