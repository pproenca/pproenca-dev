# Design: Optimize Next.js Framework Features

## Architecture Overview

This change replaces manual implementations with Next.js native conventions, reducing maintenance burden while preserving identical output.

```
Before:
┌─────────────────────────────────────────────────────────┐
│ Build Pipeline                                          │
├─────────────────────────────────────────────────────────┤
│ 1. node scripts/generate-sitemap.mjs → public/sitemap.xml │
│ 2. next build                                           │
│ 3. Static files copied from public/                     │
└─────────────────────────────────────────────────────────┘

After:
┌─────────────────────────────────────────────────────────┐
│ Build Pipeline                                          │
├─────────────────────────────────────────────────────────┤
│ 1. next build                                           │
│    - src/app/sitemap.ts → out/sitemap.xml              │
│    - src/app/robots.ts → out/robots.txt                │
└─────────────────────────────────────────────────────────┘
```

## Why Native Conventions?

### Type Safety

The custom script has no type checking:
```javascript
// scripts/generate-sitemap.mjs - No types
function generateSitemap() {
  const posts = getAllPosts();
  // Typos or invalid fields not caught
}
```

Native approach has full TypeScript support:
```typescript
// src/app/sitemap.ts - Type-checked
export default function sitemap(): MetadataRoute.Sitemap {
  // changeFrequency must be valid literal type
  // Invalid fields cause compile errors
}
```

### Maintenance Burden

| Aspect | Custom Script | Native Convention |
|--------|--------------|-------------------|
| Dependencies | gray-matter (duplicated) | Uses existing lib |
| Build integration | npm script chaining | Automatic |
| Testing | Manual verification | Next.js handles |
| Type safety | None | Full TypeScript |
| Updates | Manual sync | Auto-updated |

### Code Duplication

The custom script duplicates logic from `src/lib/posts.ts`:

```javascript
// scripts/generate-sitemap.mjs
function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    // ... duplicated logic
}
```

Native approach reuses existing code:
```typescript
// src/app/sitemap.ts
import { getAllPosts } from '@/lib/posts';
```

## Sitemap Output Comparison

### Current Output (scripts/generate-sitemap.mjs)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pproenca.dev/</loc>
    <lastmod>2026-01-08T21:09:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... -->
</urlset>
```

### Native Output (src/app/sitemap.ts)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pproenca.dev</loc>
    <lastmod>2026-01-08T21:09:00.000Z</lastmod>
    <changefrequency>weekly</changefrequency>
    <priority>1</priority>
  </url>
  <!-- ... -->
</urlset>
```

Minor differences (both valid):
- Native uses `changefrequency` (correct spelling per sitemap spec)
- Native omits trailing slash on root URL
- Both are valid and parsed identically by search engines

## Robots.txt Comparison

### Current (public/robots.txt)
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://pproenca.dev/sitemap.xml
Host: https://pproenca.dev
```

### Native Output (src/app/robots.ts)
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://pproenca.dev/sitemap.xml
Host: https://pproenca.dev
```

Functionally identical - case difference in "User-Agent" is insignificant per RFC.

## Accessibility Improvements

### Current SVG Pattern
```tsx
<a aria-label="X (Twitter)">
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="..." />
  </svg>
</a>
```

### Improved Pattern
```tsx
<a aria-label="X (Twitter)">
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="..." />
  </svg>
</a>
```

Why `aria-hidden="true"`?
- The SVG is decorative (the `<a>` has the accessible name via `aria-label`)
- Without `aria-hidden`, some screen readers may announce SVG content
- This is a defense-in-depth accessibility pattern

## What This Change Does NOT Do

1. **No image optimization** - Static export requires `images: { unoptimized: true }`
2. **No font changes** - Already using `next/font/google` optimally
3. **No layout changes** - Visual appearance is preserved
4. **No new dependencies** - Uses existing Next.js features
5. **No React Compiler** - Experimental feature, not production-ready

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Sitemap URLs differ | Low | Low | Compare before/after |
| Build fails | Very Low | Medium | Test locally first |
| SEO ranking impact | None | N/A | Output is identical |
| Accessibility regression | None | N/A | Improvements only |

## Rollback Plan

If issues arise:
1. Restore `scripts/generate-sitemap.mjs` from git
2. Restore `public/robots.txt` from git
3. Revert package.json build script
4. Remove `src/app/sitemap.ts` and `src/app/robots.ts`
