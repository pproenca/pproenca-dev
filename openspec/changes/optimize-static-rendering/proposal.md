# Proposal: Optimize Static Rendering

## Change ID

`optimize-static-rendering`

## Status

Complete

## Summary

Audit client-side rendering usage and migrate components to static/server-side rendering where possible. This static blog site currently has three client components; two are necessary for theme functionality, but CodeBlock can be optimized.

## Motivation

The site is deployed as a static export (`output: 'export'`). Minimizing client-side JavaScript improves:

- Initial page load performance (less JS to parse/execute)
- Core Web Vitals (LCP, FID)
- SEO and accessibility
- User experience on slow connections

## Audit Results

### Current Client Components

| Component     | Location                           | `"use client"` | Reason                                                   | Can be SSR?                   |
| ------------- | ---------------------------------- | -------------- | -------------------------------------------------------- | ----------------------------- |
| ThemeProvider | `src/components/ThemeProvider.tsx` | Yes            | Wraps `next-themes` which requires client-side hydration | **No** - inherent requirement |
| ThemeToggle   | `src/components/ThemeToggle.tsx`   | Yes            | Uses `useTheme()` hook and click handlers                | **No** - inherent requirement |
| CodeBlock     | `src/components/CodeBlock.tsx`     | Yes            | Uses `useState` for copy button feedback                 | **Yes** - can be refactored   |

### Server Components (Already Optimized)

| Component          | Location                           | Status              |
| ------------------ | ---------------------------------- | ------------------- |
| Header             | `src/components/Header.tsx`        | ✓ Server component  |
| Footer             | `src/components/Footer.tsx`        | ✓ Server component  |
| PostCard           | `src/components/PostCard.tsx`      | ✓ Server component  |
| CategoryBadge      | `src/components/CategoryBadge.tsx` | ✓ Server component  |
| MDXContent         | `src/components/MDXContent.tsx`    | ✓ Server component  |
| All page.tsx files | `src/app/*/page.tsx`               | ✓ Server components |

## Analysis

### ThemeProvider & ThemeToggle (Cannot Migrate)

These components are fundamentally client-side because:

- `next-themes` requires browser APIs to detect/persist theme preference
- Theme toggling requires click event handlers
- `useTheme()` hook manages reactive theme state

**Verdict**: Keep as client components. This is the correct architecture for theme switching.

### CodeBlock (Can Optimize)

Current implementation:

```tsx
"use client";
import { useState } from "react";

export function CodeBlock({ children, lightHtml, darkHtml }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  // ...
}
```

The only client-side state is for the copy button's "copied" feedback animation. Two approaches:

#### Option A: Inline Script Pattern

Move the copy functionality to a small inline script that doesn't require React hydration. The code block remains a server component.

#### Option B: Separate CopyButton Client Component

Extract only the copy button into a tiny client component, keeping the bulk of CodeBlock as a server component.

**Recommendation**: Option B - cleaner separation of concerns, maintains React patterns, minimal client JS.

## Proposed Changes

### Spec Deltas

1. **`optimize-code-block`**: Refactor CodeBlock to minimize client-side JavaScript

## Impact Assessment

### Bundle Size Reduction

- CodeBlock currently ships React hydration for the entire component
- After refactor: Only tiny CopyButton (~20 lines) needs hydration
- Estimated reduction: ~90% of CodeBlock's client bundle

### No Breaking Changes

- All existing functionality preserved
- Same visual appearance
- Same copy-to-clipboard behavior

## Decision Required

Before proceeding, please confirm the approach:

1. **Minimal refactor** (Option B): Extract CopyButton as separate client component
2. **No changes**: The current architecture is acceptable (3 small client components)

## Dependencies

None - self-contained refactor

## Related Changes

None
