# Design: SEO Enhancement Architecture

## Context

pproenca.dev is a statically exported Next.js 16 personal blog with MDX content. The site uses `output: "export"` mode, which affects how sitemap and robots.txt can be generated. The current approach uses a pre-build script for sitemap generation; this pattern should be preserved but enhanced.

### Constraints
- Static export (`output: "export"`) - No server-side routes
- Images unoptimized (for static hosting compatibility)
- Content in `content/posts/` as MDX files
- Tailwind CSS 4 with custom theming

### Stakeholders
- Site owner (Pedro Proenca) - wants better search visibility
- Search engines (Google, Bing) - need structured data and metadata
- Social platforms (Twitter, LinkedIn) - need Open Graph data
- AI search features - need quality content signals

## Goals / Non-Goals

### Goals
- Implement comprehensive JSON-LD structured data for rich results
- Provide complete, accurate metadata on all pages
- Enable proper crawling and indexing configuration
- Support social sharing with rich previews
- Follow Google's official SEO guidance and E-E-A-T principles

### Non-Goals
- Dynamic OG image generation (requires server runtime)
- Analytics/tracking integration
- Search Console integration (manual setup)
- Internationalization/multi-language support
- RSS feed generation

## Decisions

### 1. JSON-LD Implementation Pattern

**Decision**: Create a reusable `JsonLd` component that accepts typed schema objects.

**Rationale**:
- Type-safe schema construction prevents errors
- Reusable component keeps pages clean
- Server component compatible (no client-side JS)

**Implementation**:
```tsx
// src/components/JsonLd.tsx
type JsonLdProps = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}
```

### 2. Sitemap Generation Strategy

**Decision**: Keep pre-build script approach; enhance with `lastmod` accuracy.

**Alternatives considered**:
- `app/sitemap.ts` route handler - Doesn't work with static export
- Third-party sitemap generators - Unnecessary dependency

**Rationale**: The current script-based approach is the correct pattern for static exports. Enhance it with proper `lastmod` values from file modification times.

### 3. Robots.txt Approach

**Decision**: Keep static `public/robots.txt`; enhance configuration.

**Rationale**: For static export, robots.txt must be a static file. Add proper crawler directives while maintaining simplicity.

### 4. Favicon Set Strategy

**Decision**: Use standard favicon set with apple-touch-icon and web manifest.

**Files to add**:
- `/public/favicon.ico` (existing, verify 32x32 and 16x16 sizes)
- `/public/apple-touch-icon.png` (180x180)
- `/public/favicon-32x32.png`
- `/public/favicon-16x16.png`
- `/public/site.webmanifest`

**Note**: Icon generation is out of scope for this proposal. Placeholder icons should be created and replaced with proper branded icons later.

### 5. Author Information Architecture

**Decision**: Centralize author info in a constants file for consistency.

```tsx
// src/lib/constants.ts
export const SITE_CONFIG = {
  name: 'pproenca.dev',
  url: 'https://pproenca.dev',
  author: {
    name: 'Pedro Proenca',
    url: 'https://pproenca.dev/about',
    twitter: '@ThePedroProenca',
    github: 'https://github.com/pproenca',
    linkedin: 'https://www.linkedin.com/in/pedro-proenca/',
    jobTitle: 'Engineering Manager',
  },
  description: 'A personal blog about web development and technology.',
}
```

### 6. Canonical URL Strategy

**Decision**: Use relative canonicals with `metadataBase` resolution.

**Rationale**: Next.js automatically resolves relative URLs against `metadataBase`, keeping configuration DRY.

```tsx
alternates: {
  canonical: '/posts/my-post',  // Resolves to https://pproenca.dev/posts/my-post
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Schema validation errors | Use Google Rich Results Test before deployment |
| Breaking existing indexed pages | Ensure canonical URLs match existing structure |
| Static export limitations | Accept that dynamic OG images aren't possible |
| Icon placeholder quality | Document need for proper branded icons |

## Migration Plan

1. **Phase 1**: Infrastructure
   - Create `JsonLd` component
   - Create `constants.ts` with site config
   - Update root layout with complete metadata

2. **Phase 2**: Structured Data
   - Add WebSite schema to homepage
   - Add Person schema to about page
   - Add Article schema to post pages

3. **Phase 3**: Page-Level SEO
   - Add canonical URLs to all pages
   - Complete OpenGraph metadata
   - Add breadcrumb schema where appropriate

4. **Phase 4**: Technical Files
   - Enhance robots.txt
   - Enhance sitemap generation script
   - Add favicon set (placeholder)

5. **Phase 5**: Validation
   - Test all pages with Rich Results Test
   - Verify sitemap accessibility
   - Check OpenGraph previews

## Open Questions

1. **Branded Icons**: Should icon generation be included in this proposal, or handled separately?
   - **Resolution**: Handled separately. This proposal adds placeholder icons.

2. **OG Images**: Static OG images or skip for now?
   - **Resolution**: Skip dynamic generation; use default site OG image until static images can be designed.
