# Change: Harden SEO Implementation

## Why

The existing SEO implementation has three gaps identified from Next.js 16 documentation best practices:

1. **Security vulnerability**: The `JsonLd` component uses `JSON.stringify()` without sanitizing HTML characters, exposing the site to potential XSS injection attacks
2. **Performance inefficiency**: Post data is fetched twice per page (once in `generateMetadata`, once in page component) without React's `cache()` memoization
3. **Missing rich results**: No dynamic Open Graph images are generated, reducing visual impact in social shares and search results

## What Changes

### Security Hardening
- Sanitize JSON-LD output by replacing `<` with `\u003c` per Next.js docs
- Add optional `schema-dts` types for compile-time JSON-LD validation

### Performance Optimization
- Wrap `getPostBySlug` with React `cache()` to deduplicate requests
- Apply same pattern to category fetching functions

### Generated OG Images
- Add `opengraph-image.tsx` to post routes for dynamic article images
- Use `ImageResponse` from `next/og` to generate branded images with post title

## Impact

- Affected specs: `seo` (new capability)
- Affected code:
  - `src/components/JsonLd.tsx` - Add XSS sanitization
  - `src/lib/posts.ts` - Add React `cache()` wrapper
  - `src/app/posts/[slug]/opengraph-image.tsx` - New file for dynamic OG images
  - `package.json` - Add `schema-dts` dependency (optional)

## Success Criteria

1. JSON-LD output contains `\u003c` instead of raw `<` characters
2. Network panel shows single data fetch per page load (not duplicate)
3. Post pages generate unique OG images visible via `/_next/image` inspection
4. No TypeScript errors when using `schema-dts` types (if adopted)
