# Change: Enhance SEO Fundamentals for Personal Blog

## Why

This personal blog (pproenca.dev) lacks several critical SEO fundamentals that limit its discoverability in search engines and AI search features. While basic metadata exists, there's no structured data (JSON-LD), incomplete Open Graph tags, missing canonical URLs, and no robots meta configuration. These gaps prevent the blog from appearing in rich search results, reduce social sharing effectiveness, and miss opportunities for AI Overview visibility.

## What Changes

### Structured Data (JSON-LD)
- Add WebSite schema on homepage
- Add Person schema on about page
- Add Article schema on all blog posts
- Add BreadcrumbList schema throughout site

### Enhanced Metadata
- Add canonical URLs to all pages
- Add complete robots configuration with googleBot directives
- Add viewport configuration (separate from metadata in Next.js 15+)
- Complete OpenGraph metadata (images, URLs, article properties)
- Complete Twitter card metadata

### Technical SEO Infrastructure
- **BREAKING**: Convert static `public/sitemap.xml` to dynamic `app/sitemap.ts`
- **BREAKING**: Convert static `public/robots.txt` to dynamic `app/robots.ts`
- Add proper favicon set (apple-touch-icon, favicon-32x32, favicon-16x16)
- Add site.webmanifest for PWA support

### Author Attribution
- Add author metadata to root layout
- Link posts to author profile for E-E-A-T signals

## Impact

- Affected specs: New `seo` capability spec
- Affected code:
  - `src/app/layout.tsx` - Enhanced root metadata, viewport
  - `src/app/page.tsx` - WebSite JSON-LD
  - `src/app/about/page.tsx` - Person JSON-LD, enhanced metadata
  - `src/app/posts/[slug]/page.tsx` - Article JSON-LD, canonical URLs, breadcrumbs
  - `src/app/categories/page.tsx` - Canonical URLs
  - `src/app/categories/[slug]/page.tsx` - Canonical URLs
  - `src/app/sitemap.ts` - New dynamic sitemap
  - `src/app/robots.ts` - New dynamic robots
  - `src/components/JsonLd.tsx` - New JSON-LD component
  - `public/` - Remove static sitemap.xml, robots.txt; add icons

## Success Criteria

1. All pages pass Google Rich Results Test validation
2. Structured data appears correctly in Schema Markup Validator
3. Sitemap accessible at `/sitemap.xml` with all pages
4. Robots.txt accessible at `/robots.txt` with proper directives
5. Social shares display correct Open Graph previews
6. No SEO warnings in browser dev tools or Lighthouse
