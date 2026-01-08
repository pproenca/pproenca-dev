# Next.js 15-16 SEO Implementation Patterns

Complete implementation patterns for SEO in Next.js App Router.

## Table of Contents
1. [Metadata API](#metadata-api)
2. [Dynamic Metadata](#dynamic-metadata)
3. [Sitemap Generation](#sitemap-generation)
4. [Robots.txt Configuration](#robotstxt-configuration)
5. [Structured Data (JSON-LD)](#structured-data-json-ld)
6. [Open Graph & Twitter Cards](#open-graph--twitter-cards)
7. [Canonical URLs](#canonical-urls)
8. [Image SEO](#image-seo)
9. [Performance Patterns](#performance-patterns)

---

## Metadata API

### Root Layout Configuration

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  // CRITICAL: Set metadataBase for OG images to work
  metadataBase: new URL('https://example.com'),
  
  title: {
    default: 'Site Name - Tagline',
    template: '%s | Site Name',  // Child pages inherit this
  },
  
  description: 'Comprehensive site description (150-160 chars ideal)',
  
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  
  authors: [{ name: 'Author Name', url: 'https://example.com/about' }],
  
  creator: 'Company Name',
  publisher: 'Company Name',
  
  // Default robots settings
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification tokens
  verification: {
    google: 'google-site-verification-token',
    yandex: 'yandex-verification-token',
  },
  
  // App manifest for PWA
  manifest: '/manifest.json',
  
  // Default Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Site Name',
    title: 'Site Name',
    description: 'Site description',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Site Name',
      },
    ],
  },
  
  // Default Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@twitterhandle',
    creator: '@twitterhandle',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Alternates for internationalization
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
}

// Viewport is separate in Next.js 15+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}
```

### Page-Level Static Metadata

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',  // Becomes "About Us | Site Name"
  description: 'Learn about our company, mission, and team.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us',
    description: 'Learn about our company',
    url: '/about',
  },
}

export default function AboutPage() {
  return <main>...</main>
}
```

---

## Dynamic Metadata

### Blog Post with generateMetadata

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false },
    }
  }
  
  // Optionally access parent metadata
  const previousImages = (await parent).openGraph?.images || []
  
  return {
    title: post.title,
    description: post.excerpt,
    
    alternates: {
      canonical: `/blog/${slug}`,
    },
    
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: post.image 
        ? [{ url: post.image, width: 1200, height: 630 }]
        : previousImages,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) notFound()
  
  return <article>...</article>
}
```

### generateStaticParams for Pre-rendering

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

---

## Sitemap Generation

### Basic Dynamic Sitemap

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://example.com'
  
  // Fetch dynamic content
  const posts = await getAllPosts()
  const products = await getAllProducts()
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
  
  // Blog posts
  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
  
  // Products
  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily',
    priority: 0.9,
    images: product.images,  // Image sitemap extension
  }))
  
  return [...staticPages, ...blogUrls, ...productUrls]
}
```

### Large Site Sitemap Index

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com/sitemaps/pages.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://example.com/sitemaps/blog.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://example.com/sitemaps/products.xml',
      lastModified: new Date(),
    },
  ]
}

// app/sitemaps/blog.xml/route.ts
export async function GET() {
  const posts = await getAllPosts()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>https://example.com/blog/${post.slug}</loc>
          <lastmod>${post.updatedAt}</lastmod>
        </url>
      `).join('')}
    </urlset>`
  
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
```

---

## Robots.txt Configuration

### Standard Configuration

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/',
          '/404',
          '/500',
        ],
      },
      // Block specific bots if needed
      {
        userAgent: 'GPTBot',
        disallow: ['/'],  // Block OpenAI crawler
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
```

### Environment-Based Configuration

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  
  if (!isProduction) {
    // Block all crawlers in non-production
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

---

## Structured Data (JSON-LD)

### Reusable JSON-LD Component

```tsx
// components/JsonLd.tsx
type JsonLdProps = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  )
}
```

### Article Schema

```tsx
// app/blog/[slug]/page.tsx
import { JsonLd } from '@/components/JsonLd'

export default async function BlogPost({ params }: Props) {
  const post = await getPost((await params).slug)
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Site Name',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://example.com/blog/${post.slug}`,
    },
  }
  
  return (
    <>
      <JsonLd data={articleSchema} />
      <article>...</article>
    </>
  )
}
```

### Organization Schema (Homepage)

```tsx
// app/page.tsx
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Company Name',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://twitter.com/company',
    'https://linkedin.com/company/company',
    'https://github.com/company',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-555-5555',
    contactType: 'customer service',
  },
}
```

### Breadcrumb Schema

```tsx
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://example.com/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `https://example.com/blog/${post.slug}`,
    },
  ],
}
```

---

## Open Graph & Twitter Cards

### Complete Open Graph for Articles

```tsx
openGraph: {
  type: 'article',
  locale: 'en_US',
  url: `https://example.com/blog/${slug}`,
  siteName: 'Site Name',
  title: post.title,
  description: post.excerpt,
  images: [
    {
      url: post.image,
      width: 1200,
      height: 630,
      alt: post.title,
      type: 'image/jpeg',
    },
  ],
  publishedTime: post.publishedAt,
  modifiedTime: post.updatedAt,
  authors: ['https://example.com/about/author'],
  section: post.category,
  tags: post.tags,
}
```

### Dynamic OG Images

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Blog Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
        }}
      >
        <h1 style={{ color: 'white', fontSize: 64 }}>{post.title}</h1>
        <p style={{ color: '#888', fontSize: 32 }}>{post.excerpt}</p>
      </div>
    ),
    { ...size }
  )
}
```

---

## Canonical URLs

### Setting Canonical URLs

```tsx
// Always set canonical to prevent duplicate content
export const metadata: Metadata = {
  alternates: {
    canonical: '/blog/my-post',  // Relative to metadataBase
    // or absolute
    canonical: 'https://example.com/blog/my-post',
  },
}

// For paginated content
export async function generateMetadata({ searchParams }) {
  const page = searchParams.page || 1
  
  return {
    alternates: {
      // Canonical always points to page 1
      canonical: '/blog',
    },
  }
}
```

### Handling Trailing Slashes

```ts
// next.config.ts
const config: NextConfig = {
  trailingSlash: false,  // Consistent URL format
}
```

---

## Image SEO

### Optimized Images with next/image

```tsx
import Image from 'next/image'

export default function BlogPost({ post }) {
  return (
    <article>
      <Image
        src={post.image}
        alt={post.imageAlt}  // Descriptive alt text
        width={1200}
        height={630}
        priority  // For above-fold images
        sizes="(max-width: 768px) 100vw, 1200px"
      />
    </article>
  )
}
```

### Image Sitemap

```tsx
// In sitemap.ts
{
  url: `${baseUrl}/products/${product.slug}`,
  images: product.images.map(img => img.url),
}
```

---

## Performance Patterns

### Font Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Prevents layout shift
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Script Optimization

```tsx
import Script from 'next/script'

// Load analytics after page is interactive
<Script
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive"
/>

// Load non-critical scripts when idle
<Script
  src="https://widget.example.com/embed.js"
  strategy="lazyOnload"
/>
```

### Prefetching and Preloading

```tsx
export const metadata: Metadata = {
  other: {
    // Preconnect to external domains
    'link': [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://analytics.example.com' },
    ],
  },
}
```
