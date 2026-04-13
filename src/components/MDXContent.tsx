import * as React from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { TweetEmbed } from "./TweetEmbed";
import { CodeBlock } from "./CodeBlock";
import { Resources } from "./Resources";
import { getHighlighter } from "@/lib/shiki";
import { slugifyHeading } from "@/lib/posts";

interface CodeProps {
  children?: string;
  className?: string;
}

interface PreProps {
  children?: React.ReactNode;
}

interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

function Anchor({ href, children, ...props }: AnchorProps) {
  if (!href) {
    return <span {...props}>{children}</span>;
  }

  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <Link
      href={href}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
    </Link>
  );
}

// Extract plain text from a React node tree so we can slugify the heading.
function renderToText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(renderToText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return renderToText(node.props.children);
  }
  return "";
}

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

function H2({ children, ...props }: HeadingProps) {
  const id = slugifyHeading(renderToText(children));
  return (
    <h2 id={id} {...props}>
      {children}
    </h2>
  );
}

function H3({ children, ...props }: HeadingProps) {
  const id = slugifyHeading(renderToText(children));
  return (
    <h3 id={id} {...props}>
      {children}
    </h3>
  );
}

async function Code({ children, className }: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "text";
  const code = children?.trim() || "";

  if (!className) {
    return <code className="font-mono">{children}</code>;
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
  a: Anchor,
  h2: H2,
  h3: H3,
  Tweet: TweetEmbed,
  Resources,
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
