# Design: Apply React Best Practices

## Context

This is a static MDX blog built with Next.js 16 using App Router and static export (`output: 'export'`). The site generates at build time with no runtime server. Current codebase has excellent patterns for:

- Accessibility (ARIA, keyboard navigation)
- Theming (CSS variables, hydration-safe theme toggle)
- Component architecture (minimal client components)

However, data fetching patterns don't fully leverage React Server Component caching capabilities, causing redundant filesystem operations during build.

### Stakeholders

- **Developer**: Faster builds, cleaner mental model
- **Users**: Slightly smaller initial bundle, same functionality

### Constraints

- Static export only (no runtime server caching)
- Must maintain backwards compatibility
- Must pass existing E2E tests
- No new dependencies (use existing `react` cache)

## Goals / Non-Goals

### Goals

1. Eliminate redundant filesystem reads during build via `React.cache()`
2. Reduce initial JavaScript bundle by deferring non-critical analytics
3. Apply Vercel's React Best Practices (CRITICAL and HIGH priority patterns)
4. Maintain zero hydration warnings

### Non-Goals

1. Adding SWR or client-side data fetching (static site, no runtime API)
2. Adding LRU caching (no server runtime)
3. Restructuring component architecture (already optimal)
4. Adding memoization hooks (not needed for static content)

## Decisions

### Decision 1: Use `React.cache()` for All Post-Related Functions

**What**: Wrap `getAllPosts`, `getAllCategories`, `getAllSlugs`, `getAllCategorySlugs`, and `slugToCategory` with `React.cache()`.

**Why**:

- `React.cache()` provides per-request memoization during static generation
- Already used successfully for `getPostBySlug`, `getPostsByCategory`, `getPageBySlug`
- No code changes required to call sites

**Alternatives Considered**:

| Option                   | Pros                                       | Cons                              |
| ------------------------ | ------------------------------------------ | --------------------------------- |
| `React.cache()` (chosen) | Zero deps, consistent pattern, per-request | Only works in RSC context         |
| Module-level Map cache   | Works everywhere                           | Manual invalidation, memory leaks |
| LRU cache                | Cross-request caching                      | Overkill for static build         |

**Decision**: Use `React.cache()` for consistency with existing patterns.

### Decision 2: Defer SpeedInsights with `next/dynamic`

**What**: Replace synchronous import with dynamic import:

```typescript
// Before
import { SpeedInsights } from "@vercel/speed-insights/next";

// After
import dynamic from "next/dynamic";
const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false },
);
```

**Why**:

- SpeedInsights is non-critical for user interaction
- Analytics should never block initial render
- Follows Vercel's own "Defer Non-Critical Third-Party Libraries" rule

**Alternatives Considered**:

| Option                  | Pros                       | Cons                  |
| ----------------------- | -------------------------- | --------------------- |
| `next/dynamic` (chosen) | Built-in, simple, SSR-safe | None significant      |
| `React.lazy()`          | Standard React             | No SSR control        |
| Script tag with `defer` | Browser-native             | Different API surface |

### Decision 3: Keep Functions Exportable (No Inline Cache)

**What**: Apply cache at export level, not inline:

```typescript
// Chosen pattern (matches existing code)
export const getAllPosts = cache(function getAllPosts(): PostMeta[] {
  // ...
});

// Alternative (not chosen)
export function getAllPosts(): PostMeta[] {
  return cache(() => {
    /* ... */
  })();
}
```

**Why**: Matches existing `getPostBySlug` pattern, cleaner TypeScript inference, easier to test.

## Architecture

### Data Flow (Before)

```
Homepage → getAllPosts() → filesystem
Sitemap  → getAllPosts() → filesystem (again)
         → getAllCategorySlugs() → getAllCategories() → getAllPosts() → filesystem (3rd time)
Feed     → getAllPosts() → filesystem (4th time)
Category → slugToCategory() → getAllCategories() → getAllPosts() → filesystem (5th time)
         → slugToCategory() → getAllCategories() → getAllPosts() → filesystem (6th time)
         → getPostsByCategory() → getAllPosts() → filesystem (7th time)
```

**Total**: 7 full directory scans + 7 × N file reads for N posts

### Data Flow (After)

```
Homepage → getAllPosts() → filesystem → CACHED
Sitemap  → getAllPosts() → CACHE HIT
         → getAllCategorySlugs() → getAllCategories() → getAllPosts() → CACHE HIT
Feed     → getAllPosts() → CACHE HIT
Category → slugToCategory() → getAllCategories() → getAllPosts() → CACHE HIT
         → slugToCategory() → CACHE HIT
         → getPostsByCategory() → getAllPosts() → CACHE HIT
```

**Total**: 1 directory scan + N file reads (first call only)

### Component Tree (Before)

```
RootLayout
├── <SpeedInsights /> ← In initial bundle
└── {children}
```

### Component Tree (After)

```
RootLayout
├── <SpeedInsights /> ← Lazy loaded after hydration
└── {children}
```

## Risks / Trade-offs

### Risk 1: Cache Invalidation During Development

**Risk**: In dev mode, cached data might become stale during HMR.

**Mitigation**: `React.cache()` is per-request; dev server creates new request context on refresh. No action needed.

### Risk 2: SpeedInsights Delayed Initialization

**Risk**: Analytics may miss some early page interactions.

**Mitigation**: SpeedInsights is designed for this; it captures metrics from the moment it loads. Web Vitals are still captured accurately.

### Trade-off: Memory During Build

**Trade-off**: Caching all posts in memory during build increases memory usage.

**Acceptable because**: Blog has <100 posts; memory increase is negligible (~few MB).

## Migration Plan

### Phase 1: Add Cache Wrappers (Low Risk)

1. Wrap `getAllPosts` in `cache()`
2. Wrap `getAllCategories` in `cache()`
3. Wrap helper functions in `cache()`
4. Verify build succeeds

### Phase 2: Defer SpeedInsights (Low Risk)

1. Replace sync import with dynamic import
2. Verify analytics still works in Vercel dashboard

### Rollback

If issues arise:

1. Remove `cache()` wrappers (git revert)
2. Restore synchronous SpeedInsights import (git revert)

No database migrations or external service changes.

## Open Questions

None. All decisions are straightforward applications of documented best practices.

## References

1. [Vercel React Best Practices - Per-Request Deduplication](react-performance-guidelines.md#34)
2. [Vercel React Best Practices - Defer Non-Critical Libraries](react-performance-guidelines.md#23)
3. [Next.js Documentation - Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
4. [React Documentation - cache()](https://react.dev/reference/react/cache)
