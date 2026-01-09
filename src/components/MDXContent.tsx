import * as React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "./CodeBlock";
import { getHighlighter } from "@/lib/shiki";

/** Props for the Code component */
interface CodeProps {
  /** The code content to render */
  children?: string;
  /** Language class name (e.g., "language-typescript") */
  className?: string;
}

/** Props for the Pre component (pass-through wrapper) */
interface PreProps {
  /** Child elements to render */
  children?: React.ReactNode;
}

async function Code({ children, className }: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "text";
  const code = children?.trim() || "";

  if (!className) {
    return (
      <code className="rounded border border-border-subtle bg-bg-elevated px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    );
  }

  const hl = await getHighlighter();
  const lightHtml = hl.codeToHtml(code, { lang, theme: "light-plus" });
  const darkHtml = hl.codeToHtml(code, { lang, theme: "monokai" });

  return (
    <CodeBlock lightHtml={lightHtml} darkHtml={darkHtml}>
      {code}
    </CodeBlock>
  );
}

const components = {
  pre: ({ children }: PreProps) => <>{children}</>,
  code: Code,
};

/** Props for the MDXContent component */
interface MDXContentProps {
  /** The raw MDX source to render */
  source: string;
}

/**
 * Renders MDX content with syntax-highlighted code blocks.
 * Uses custom Code component for fenced code blocks.
 */
export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
