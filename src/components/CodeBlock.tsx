import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  children: string;
  lightHtml: string;
  darkHtml: string;
}

export function CodeBlock({ children, lightHtml, darkHtml }: CodeBlockProps) {
  return (
    <div className="terminal-window group">
      <div className="terminal-header">
        <div className="terminal-dots">
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
