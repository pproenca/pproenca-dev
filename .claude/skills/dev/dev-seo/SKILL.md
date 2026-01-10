---
name: dev-seo
description: Expert SEO implementation for Next.js 15-16 websites and blog content based on Google's official guidance. Use when implementing metadata, sitemaps, robots.txt, structured data (JSON-LD), Core Web Vitals optimization, or any SEO task in Next.js. Also use for content optimization, AI/LLM search visibility (AI Overviews, AI Mode), canonical URLs, Open Graph tags, or analyzing SEO issues.
---

# Next.js SEO Expert Skill

Make Claude an expert in SEO for Next.js 15-16 applications based on Google's official Search documentation and modern AI search considerations.

## Quick Reference

### Key Principles (Google Search Essentials)

1. **Create helpful, reliable, people-first content** - Focus on E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
2. **Meet technical requirements** - Ensure pages are crawlable, indexable, and render correctly
3. **Follow spam policies** - Avoid manipulative tactics

### Next.js SEO Implementation Checklist

- [ ] Root layout metadata with `metadataBase`
- [ ] Per-page/dynamic `generateMetadata`
- [ ] `app/sitemap.ts` for dynamic sitemap
- [ ] `app/robots.ts` for crawler control
- [ ] JSON-LD structured data
- [ ] Canonical URLs via `alternates.canonical`
- [ ] Open Graph and Twitter cards
- [ ] Core Web Vitals optimization (LCP < 2.5s, INP < 200ms, CLS < 0.1)

## Workflow

### 1. Audit Existing SEO

```bash
# Check if site is indexed
site:example.com  # in Google Search

# Validate structured data
https://search.google.com/test/rich-results

# Check Core Web Vitals
https://pagespeed.web.dev/
```

### 2. Implement Metadata Foundation

**Root Layout (`app/layout.tsx`):**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Site Name",
    template: "%s | Site Name",
  },
  description: "Your site description for search engines",
  openGraph: {
    type: "website",
    siteName: "Site Name",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

**Dynamic Pages (`app/blog/[slug]/page.tsx`):**

```tsx
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
  };
}
```

### 3. Implement Sitemap and Robots

**`app/sitemap.ts`:**

```tsx
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const blogUrls = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...blogUrls,
  ];
}
```

**`app/robots.ts`:**

```tsx
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
      },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

### 4. Add Structured Data (JSON-LD)

```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in page
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://example.com/about",
    },
    image: post.image,
    description: post.excerpt,
  }}
/>;
```

## Reference Files

For detailed implementation patterns, see:

- **[references/google-seo-fundamentals.md](references/google-seo-fundamentals.md)** - Core Google SEO principles, E-E-A-T, helpful content guidelines
- **[references/nextjs-seo-patterns.md](references/nextjs-seo-patterns.md)** - Complete Next.js 15-16 implementation patterns
- **[references/structured-data.md](references/structured-data.md)** - JSON-LD schema types and examples
- **[references/core-web-vitals.md](references/core-web-vitals.md)** - LCP, INP, CLS optimization strategies
- **[references/ai-search-optimization.md](references/ai-search-optimization.md)** - AI Overviews, AI Mode, and LLM search visibility

## Common Issues & Solutions

| Issue                 | Solution                                                                |
| --------------------- | ----------------------------------------------------------------------- |
| Pages not indexed     | Check robots.txt, ensure no `noindex`, submit sitemap to Search Console |
| Duplicate content     | Set canonical URLs via `alternates.canonical`                           |
| Missing rich results  | Add valid JSON-LD structured data                                       |
| Poor Core Web Vitals  | Optimize images with `next/image`, use `next/font`, minimize JS         |
| Soft 404 errors       | Return proper HTTP status codes, use `notFound()` in Next.js            |
| JavaScript SEO issues | Use Server Components, ensure SSR/SSG for critical content              |

## Testing Tools

1. **Google Rich Results Test** - https://search.google.com/test/rich-results
2. **PageSpeed Insights** - https://pagespeed.web.dev/
3. **Google Search Console** - https://search.google.com/search-console
4. **Schema Markup Validator** - https://validator.schema.org/
