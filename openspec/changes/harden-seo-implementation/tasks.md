## 1. Security: JSON-LD XSS Sanitization

- [x] 1.1 Update `JsonLd.tsx` to sanitize output with `.replace(/</g, '\\u003c')`
- [x] 1.2 Verify sanitization works by inspecting HTML output in browser

## 2. Performance: Memoize Data Fetching

- [x] 2.1 Wrap `getPostBySlug` with React `cache()` in `src/lib/posts.ts`
- [x] 2.2 Wrap `getPostsByCategory` with React `cache()`
- [x] 2.3 Verify single fetch per request in Next.js dev server logs

## 3. Generated OG Images

- [x] 3.1 Create `src/app/posts/[slug]/opengraph-image.tsx` using `ImageResponse`
- [x] 3.2 Style image with post title and site branding
- [x] 3.3 Test OG image generation at `/posts/[slug]/opengraph-image`
- [x] 3.4 Verify OpenGraph metadata correctly references generated image

## 4. Type Safety

- [x] 4.1 Install `schema-dts` package
- [x] 4.2 Type JSON-LD objects in page components using `WithContext<Article>` etc.
- [x] 4.3 Update `JsonLd.tsx` to accept typed data

## 5. Validation

- [x] 5.1 Run `npm run build` to verify static generation works
- [x] 5.2 Test JSON-LD output in HTML (verified Article and BreadcrumbList schemas)
- [x] 5.3 Test OG images endpoint returns PNG with correct content-type
