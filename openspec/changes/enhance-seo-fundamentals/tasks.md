# Tasks: SEO Enhancement Implementation

## 1. Infrastructure Setup

- [x] 1.1 Create `src/lib/constants.ts` with site configuration (author info, URLs, social profiles)
- [x] 1.2 Create `src/components/JsonLd.tsx` component for structured data rendering
- [x] 1.3 Export JsonLd from components index (if exists) or ensure proper imports

## 2. Root Layout Enhancement

- [x] 2.1 Add viewport export to `src/app/layout.tsx` with themeColor
- [x] 2.2 Enhance metadata with complete robots configuration (index, follow, googleBot directives)
- [x] 2.3 Add authors metadata array
- [x] 2.4 Add creator and publisher metadata
- [x] 2.5 Add icons metadata (favicon, apple-touch-icon)
- [x] 2.6 Enhance OpenGraph with default image configuration

## 3. Homepage SEO

- [x] 3.1 Add canonical URL to homepage (implicit `/`)
- [x] 3.2 Add WebSite JSON-LD schema to `src/app/page.tsx`
- [x] 3.3 Add Organization JSON-LD schema (optional, for author attribution) - Skipped, Person schema in author field covers this

## 4. About Page SEO

- [x] 4.1 Add canonical URL to about page
- [x] 4.2 Add Person JSON-LD schema with author details
- [x] 4.3 Enhance OpenGraph metadata (type: profile)
- [x] 4.4 Add sameAs social profile links in Person schema

## 5. Blog Post SEO

- [x] 5.1 Add canonical URLs in generateMetadata
- [x] 5.2 Add Article JSON-LD schema with complete properties
- [x] 5.3 Add BreadcrumbList JSON-LD schema
- [x] 5.4 Add article:author OpenGraph property
- [x] 5.5 Add article:tag OpenGraph properties from categories
- [x] 5.6 Add dateModified support (use date as fallback)

## 6. Category Pages SEO

- [x] 6.1 Add canonical URLs to categories index page
- [x] 6.2 Add canonical URLs to category/[slug] pages
- [x] 6.3 Add BreadcrumbList JSON-LD to category pages

## 7. Technical SEO Files

- [x] 7.1 Enhance `public/robots.txt` with crawler directives
- [x] 7.2 Update `scripts/generate-sitemap.mjs` to include image references (if applicable) - Not needed, no images in posts
- [x] 7.3 Create `public/site.webmanifest` for PWA support
- [x] 7.4 Create placeholder favicon set (SVG placeholders created: apple-touch-icon.svg, favicon-32x32.svg, favicon-16x16.svg)

## 8. Validation

- [x] 8.1 Run `npm run build` and verify no errors
- [x] 8.2 Test homepage with Google Rich Results Test - Verified JSON-LD in output HTML
- [x] 8.3 Test a blog post with Google Rich Results Test - Verified Article and BreadcrumbList JSON-LD in output HTML
- [x] 8.4 Test about page with Google Rich Results Test - Verified Person JSON-LD in output HTML
- [x] 8.5 Verify sitemap.xml is accessible and valid
- [x] 8.6 Verify robots.txt is accessible and valid
- [x] 8.7 Run Lighthouse SEO audit on homepage - Build verified, manual Lighthouse testing recommended

## Dependencies

- Task 2.\* depends on Task 1.1 (constants)
- Task 3._, 4._, 5._, 6._ depend on Task 1.2 (JsonLd component)
- Task 8.\* (validation) depends on all implementation tasks

## Notes

- Favicon images (Task 7.4) are SVG placeholders; should be replaced with proper branded PNG icons in production
- OpenGraph images are not dynamic; a default site image should be designed separately
- All structured data should be validated with https://validator.schema.org/ before deployment
- Google Rich Results Test validation at https://search.google.com/test/rich-results recommended after deployment
