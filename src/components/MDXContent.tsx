import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "./CodeBlock";
import { getHighlighter } from "@/lib/shiki";

interface PreProps {
  children?: React.ReactNode;
}

interface CodeProps {
  children?: string;
  className?: string;
}

async function Pre({ children }: PreProps) {
  return <>{children}</>;
}

async function Code({ children, className }: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "text";
  const code = children?.trim() || "";

  if (!className) {
    return (
      <code className="rounded border border-(--color-border-subtle) bg-(--color-bg-elevated) px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    );
  }

  const hl = await getHighlighter();
  const lightHtml = hl.codeToHtml(code, { lang, theme: "github-light" });
  const darkHtml = hl.codeToHtml(code, { lang, theme: "literary-nightfall" });

  return (
    <CodeBlock lightHtml={lightHtml} darkHtml={darkHtml}>
      {code}
    </CodeBlock>
  );
}

const components = {
  pre: Pre,
  code: Code,
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <article className="prose max-w-none">
      <MDXRemote source={source} components={components} />
    </article>
  );
}
