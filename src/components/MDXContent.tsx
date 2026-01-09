import * as React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { TweetEmbed } from "./TweetEmbed";
import { CodeBlock } from "./CodeBlock";
import { getHighlighter } from "@/lib/shiki";

interface CodeProps {
  children?: string;
  className?: string;
}

interface PreProps {
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
  Tweet: TweetEmbed,
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
