# Proposal: Optimize Next.js Framework Features

## Summary

Leverage Next.js 16 built-in features to improve accessibility, performance, SEO, and reduce code without changing the website's visual appearance or user experience.

## Problem Statement

The current implementation uses some manual approaches where Next.js provides optimized built-in alternatives:

1. **Sitemap generation** uses a custom Node.js script (`scripts/generate-sitemap.mjs`) when Next.js provides a built-in `sitemap.ts` convention
2. **robots.txt** is a static file when it could use the dynamic `robots.ts` convention for type safety
3. **External links** use plain `<a>` tags instead of `next/link` for external URLs (though internal links are correct)
4. **SVG icons** are inline without `aria-hidden` attributes (decorative icons already have `aria-label` on parent)
5. **No favicon.ico** - only SVG favicons exist, but ICO is still widely expected

## Proposed Changes

### Priority 1: Native Sitemap Generation (Code Reduction + SEO)

**Current:** Custom `scripts/generate-sitemap.mjs` (96 lines) + npm script integration
**Proposed:** Native `src/app/sitemap.ts` using Next.js conventions

Benefits:

- Removes 96 lines of custom code
- Type-safe with `MetadataRoute.Sitemap`
- Auto-generated at build time
- No npm script modification needed

### Priority 2: Dynamic robots.ts (Code Reduction + SEO)

**Current:** Static `public/robots.txt` (11 lines)
**Proposed:** Native `src/app/robots.ts` using Next.js conventions

Benefits:

- Type-safe with `MetadataRoute.Robots`
- Can reference `SITE_CONFIG.url` for consistency
- Auto-generated at build time

### Priority 3: Accessibility Improvements (A11y)

**Current state (already good):**

- Skip link present with proper focus styling
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`)
- `lang="en"` on html element
- `aria-label` on social icon links
- Focus-visible styles in globals.css
- Reduced motion media query support

**Proposed improvements:**

- Add `aria-hidden="true"` to decorative SVG icons (redundant with aria-label but best practice)
- Add `role="img"` to inline SVGs with aria-label for better screen reader support

### Priority 4: Generate favicon.ico (SEO/Compatibility)

**Current:** Only SVG favicons exist
**Proposed:** Add `favicon.ico` for legacy browser support

Benefits:

- Better browser compatibility
- Some crawlers specifically look for favicon.ico

## Out of Scope

The following were evaluated but are not recommended:

1. **next/image optimization** - Not applicable for static export with `output: "export"` (images are unoptimized by design)
2. **Font optimization** - Already using `next/font/google` with proper `display: "swap"` and subset loading
3. **Link prefetching for external URLs** - No benefit; external links should use `<a>` tags
4. **React Compiler** - Experimental; not recommended for production blogs
5. **inlineCss config** - Only relevant for server-rendered apps, not static export

## Impact Assessment

| Area           | Change Impact               | Code Change                 |
| -------------- | --------------------------- | --------------------------- |
| Performance    | Minimal (already optimized) | None                        |
| SEO            | Improved maintainability    | sitemap.ts, robots.ts       |
| Accessibility  | Minor improvements          | SVG attributes              |
| Code Reduction | -96 lines custom code       | Remove generate-sitemap.mjs |
| Visual         | None                        | None                        |

## Risks

- **Low risk:** All changes are additive or replace equivalent functionality
- **Testing:** Verify sitemap.xml and robots.txt output matches current behavior
- **Rollback:** Can revert to previous implementation if issues arise

## Success Criteria

1. `npm run build` succeeds without sitemap script
2. `/sitemap.xml` contains same URLs as before
3. `/robots.txt` contains same directives
4. Lighthouse accessibility score maintained at 100
5. No visual changes to the website
