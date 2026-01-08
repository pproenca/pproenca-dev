# Design: Optimize Static Rendering

## Context

This document captures the architectural reasoning for the CodeBlock refactoring approach.

## Problem Statement

The CodeBlock component is marked as `"use client"` solely because it uses `useState` for a copy button's visual feedback. This causes the entire component (including the pre-rendered Shiki HTML) to require React hydration.

## Current Architecture

```
┌─────────────────────────────────────────────────┐
│ MDXContent (Server)                             │
│   └─> Code component (Server async)             │
│         └─> Shiki highlighting                  │
│               └─> CodeBlock (CLIENT)            │
│                     ├─ Terminal header          │
│                     ├─ Copy button + state      │
│                     └─ Pre-rendered HTML        │
└─────────────────────────────────────────────────┘
```

The client boundary at CodeBlock forces React to:
1. Ship the component code to the browser
2. Hydrate the entire component tree
3. Re-render after hydration

## Proposed Architecture

```
┌─────────────────────────────────────────────────┐
│ MDXContent (Server)                             │
│   └─> Code component (Server async)             │
│         └─> Shiki highlighting                  │
│               └─> CodeBlock (SERVER)            │
│                     ├─ Terminal header          │
│                     │    └─ CopyButton (CLIENT) │
│                     └─ Pre-rendered HTML        │
└─────────────────────────────────────────────────┘
```

Benefits:
- CodeBlock renders fully at build time
- Only CopyButton hydrates on client
- Syntax-highlighted HTML is static

## Component Design

### CopyButton (Client Component)

```tsx
"use client";
import { useState } from "react";

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="terminal-copy" aria-label="Copy code">
      {/* SVG icons */}
    </button>
  );
}
```

### CodeBlock (Server Component)

```tsx
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  children: string;
  className?: string;
  lightHtml: string;
  darkHtml: string;
}

export function CodeBlock({ children, className, lightHtml, darkHtml }: CodeBlockProps) {
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
```

## Trade-offs Considered

### Alternative: Inline Script

Could use a vanilla JS inline script instead of a React client component:

```html
<button onclick="navigator.clipboard.writeText('...')">Copy</button>
```

**Rejected because**:
- Loses React's clean state management for feedback UI
- Inline scripts complicate CSP policies
- Harder to maintain consistent behavior

### Alternative: No Refactor

Could accept the current architecture since:
- CodeBlock is small
- Only 3 client components total

**Rejected because**:
- Clear optimization opportunity
- Aligns with static-first principles stated in project.md
- Educational value in demonstrating Server/Client component boundaries

## Performance Impact

| Metric | Before | After |
|--------|--------|-------|
| Client components | 3 | 3 |
| Lines requiring hydration | ~90 (CodeBlock) | ~25 (CopyButton) |
| Static HTML | Partial | Full (except button) |

## Testing Strategy

1. Visual regression: Code blocks render identically
2. Functional: Copy button works with feedback animation
3. Build: Static export succeeds without errors
4. Theme: Both light/dark code variants display correctly
