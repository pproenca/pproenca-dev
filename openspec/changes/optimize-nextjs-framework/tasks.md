# Tasks: Optimize Next.js Framework Features

## Task 1: Create native sitemap.ts

**Files:**

- Create: `src/app/sitemap.ts`
- Remove: `scripts/generate-sitemap.mjs`
- Modify: `package.json` (remove sitemap script from build)
- Remove: `public/sitemap.xml` (will be auto-generated)

**Implementation:**

```typescript
import type { MetadataRoute } from "next";
import {
  getAllPosts,
  getAllCategorySlugs,
  slugToCategory,
  categoryToSlug,
} from "@/lib/posts";
import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categorySlugs = getAllCategorySlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_CONFIG.url}/posts/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_CONFIG.url}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
```

**Validation:**

- Run `npm run build`
- Check `out/sitemap.xml` contains same URLs as current version
- Compare URL structure and count

---

## Task 2: Create native robots.ts

**Files:**

- Create: `src/app/robots.ts`
- Remove: `public/robots.txt`

**Implementation:**

```typescript
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
```

**Validation:**

- Run `npm run build`
- Check `out/robots.txt` contains same directives
- Verify sitemap URL is correct

---

## Task 3: Add aria-hidden to decorative SVG icons

**Files:**

- Modify: `src/components/Header.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/components/CopyButton.tsx`

**Implementation:**
Add `aria-hidden="true"` to all inline SVG elements that are decorative (where parent has aria-label).

Example in Header.tsx:

```tsx
<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
```

**Validation:**

- Run lint
- Test with screen reader or accessibility tools
- No visual changes

---

## Task 4: Update package.json build script

**Files:**

- Modify: `package.json`

**Implementation:**
Change build script from:

```json
"build": "node scripts/generate-sitemap.mjs && next build"
```

To:

```json
"build": "next build"
```

**Validation:**

- Run `npm run build`
- Verify sitemap.xml is generated in `out/` directory

---

## Task 5: Clean up removed files

**Files:**

- Remove: `scripts/generate-sitemap.mjs`
- Remove: `public/sitemap.xml`
- Remove: `public/robots.txt`
- Remove: `scripts/` directory if empty

**Validation:**

- Verify files are removed
- Run `npm run build` succeeds
- Verify `out/sitemap.xml` and `out/robots.txt` exist

---

## Task Order

1. Task 1 (sitemap.ts) - Create before removing script
2. Task 4 (package.json) - Update after sitemap.ts works
3. Task 5 (cleanup) - Remove old files after verification
4. Task 2 (robots.ts) - Create before removing static file
5. Task 3 (aria-hidden) - Independent, can be done anytime

Tasks 1-5 can be done in a single commit as they're all framework optimizations.

---

## Verification Checklist

- [x] `npm run build` completes successfully
- [x] `out/sitemap.xml` contains all expected URLs
- [x] `out/robots.txt` contains correct directives
- [x] No visual changes to the website
- [x] Lighthouse accessibility score unchanged
- [x] All lint checks pass
