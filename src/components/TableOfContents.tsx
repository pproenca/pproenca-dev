"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx/lite";
import type { Heading } from "@/lib/posts";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      // Trigger when heading is in the top third of the viewport
      { rootMargin: "-15% 0% -70% 0%" },
    );

    const elements: Element[] = [];
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <>
      {/* Sticky left-side TOC on xl+ (≥1280px) — where there's enough
          viewport margin beside the 680px reading column. */}
      <nav
        aria-label="Table of contents"
        className="pointer-events-none fixed top-32 left-[max(1rem,calc(50%-600px))] hidden w-56 xl:block"
      >
        <div className="pointer-events-auto max-h-[calc(100dvh-10rem)] overflow-y-auto pr-2">
          <p className="mb-3 font-sans text-xs font-medium tracking-wide text-text-tertiary uppercase">
            Contents
          </p>
          <ol className="border-l border-border-subtle">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={clsx(
                    "-ml-px block border-l-2 py-1.5 font-sans text-sm leading-snug",
                    h.level === 3 ? "pl-7" : "pl-4",
                    activeId === h.id
                      ? "border-accent text-accent"
                      : "border-transparent text-text-tertiary hover:text-text-secondary",
                  )}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Collapsible summary above the article on smaller viewports */}
      <details className="mb-golden-4 rounded-lg border border-border-subtle bg-bg-surface font-sans xl:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-text-secondary [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Table of contents
            <span className="text-xs text-text-tertiary">
              {headings.length} section{headings.length === 1 ? "" : "s"}
            </span>
          </span>
        </summary>
        <ol className="border-t border-border-subtle px-4 py-3 text-sm">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={clsx(
                  "block py-1 text-text-tertiary hover:text-accent",
                  h.level === 3 && "pl-4",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </>
  );
}
