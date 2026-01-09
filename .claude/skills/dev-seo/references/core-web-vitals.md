# Core Web Vitals Optimization

Performance metrics that impact SEO and user experience.

## Table of Contents

1. [Metrics Overview](#metrics-overview)
2. [LCP Optimization](#lcp-optimization)
3. [INP Optimization](#inp-optimization)
4. [CLS Optimization](#cls-optimization)
5. [Next.js Performance Patterns](#nextjs-performance-patterns)
6. [Measurement Tools](#measurement-tools)

---

## Metrics Overview

### Core Web Vitals (2024+)

| Metric                              | Good    | Needs Improvement | Poor    |
| ----------------------------------- | ------- | ----------------- | ------- |
| **LCP** (Largest Contentful Paint)  | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms     | > 500ms |
| **CLS** (Cumulative Layout Shift)   | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |

### Why They Matter

- Part of Google's page experience signals
- Impact search rankings (especially for competitive queries)
- Directly correlate with user engagement and conversions
- Google reports these in Search Console

---

## LCP Optimization

**Largest Contentful Paint** measures loading performance - when the largest content element becomes visible.

### Common LCP Elements

- `<img>` elements
- `<video>` elements with poster
- Elements with background images via `url()`
- Block-level text elements

### Optimization Strategies

#### 1. Optimize Images

```tsx
// ✅ Use next/image with priority for LCP images
import Image from "next/image";

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Preloads the image
      sizes="100vw"
      quality={85}
    />
  );
}
```

```tsx
// next.config.ts - Configure image optimization
const config = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

#### 2. Preload Critical Resources

```tsx
// app/layout.tsx
export const metadata = {
  other: {
    link: [
      // Preload LCP image
      {
        rel: "preload",
        href: "/hero.jpg",
        as: "image",
        type: "image/jpeg",
      },
      // Preconnect to external domains
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://analytics.example.com" },
    ],
  },
};
```

#### 3. Optimize Server Response Time

```tsx
// Use static generation when possible
export const dynamic = "force-static";
export const revalidate = 3600; // ISR every hour

// Or use caching headers
export async function GET() {
  return new Response(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
```

#### 4. Eliminate Render-Blocking Resources

```tsx
// Defer non-critical scripts
import Script from 'next/script'

<Script
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive"  // Load after page is interactive
/>

<Script
  src="https://chat-widget.example.com/embed.js"
  strategy="lazyOnload"  // Load when browser is idle
/>
```

---

## INP Optimization

**Interaction to Next Paint** measures responsiveness - the delay between user interaction and visual feedback.

### What Triggers INP

- Click/tap events
- Key presses
- Does NOT include scrolling or hovering

### Optimization Strategies

#### 1. Break Up Long Tasks

```tsx
// ❌ Bad: Long synchronous task
function processData() {
  for (let i = 0; i < 1000000; i++) {
    // Heavy computation blocks main thread
  }
}

// ✅ Good: Yield to main thread
async function processDataYielding() {
  for (let i = 0; i < 1000000; i++) {
    if (i % 1000 === 0) {
      // Yield every 1000 iterations
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    // Process item
  }
}

// ✅ Better: Use Web Workers for heavy computation
// worker.ts
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
```

#### 2. Optimize Event Handlers

```tsx
// ❌ Bad: Heavy work in click handler
<button onClick={() => {
  processAllData()  // Blocks for 500ms
  updateUI()
}}>

// ✅ Good: Defer heavy work
<button onClick={() => {
  updateUI()  // Immediate visual feedback
  requestAnimationFrame(() => {
    processAllData()  // Deferred processing
  })
}}>

// ✅ Better: Use transitions for state updates
import { useTransition } from 'react'

function Search() {
  const [isPending, startTransition] = useTransition()

  const handleSearch = (query) => {
    // Immediate, high-priority update
    setInputValue(query)

    // Deferred, lower-priority update
    startTransition(() => {
      setSearchResults(filterResults(query))
    })
  }
}
```

#### 3. Reduce JavaScript Bundle Size

```tsx
// Dynamic imports for code splitting
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false, // Client-only if not needed for SEO
});

// Route-level code splitting (automatic in App Router)
// Each page is its own bundle
```

#### 4. Optimize Third-Party Scripts

```tsx
// Load analytics lazily
<Script src="https://www.googletagmanager.com/gtag/js" strategy="lazyOnload" />;

// Use Partytown for heavy third-party scripts
import { Partytown } from "@builder.io/partytown/react";

<Partytown forward={["dataLayer.push"]} />;
```

---

## CLS Optimization

**Cumulative Layout Shift** measures visual stability - unexpected movement of page content.

### Common CLS Causes

- Images without dimensions
- Ads, embeds, iframes without reserved space
- Dynamically injected content
- Web fonts causing FOIT/FOUT

### Optimization Strategies

#### 1. Always Specify Image Dimensions

```tsx
// ✅ next/image handles this automatically
<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Photo"
/>

// For background images, use aspect-ratio
<div style={{ aspectRatio: '16/9', backgroundImage: 'url(...)' }} />
```

#### 2. Reserve Space for Dynamic Content

```tsx
// ✅ Reserve space for ads
<div style={{ minHeight: "250px" }}>
  <AdComponent />
</div>;

// ✅ Use skeleton loaders with fixed dimensions
function ProductCard() {
  if (loading) {
    return <div className="w-full h-64 bg-gray-200 animate-pulse rounded" />;
  }
  return <Product />;
}
```

#### 3. Optimize Font Loading

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevents invisible text
  variable: "--font-inter",
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

```css
/* Fallback font matching to reduce shift */
@font-face {
  font-family: "Inter";
  src:
    local("Inter"),
    url("/fonts/inter.woff2") format("woff2");
  font-display: swap;
  /* Size-adjust helps match fallback font metrics */
  size-adjust: 100%;
}
```

#### 4. Handle Dynamic Content Properly

```tsx
// ❌ Bad: Content pushes other elements down
{showNotification && <Banner />}
<MainContent />

// ✅ Good: Use transforms or fixed positioning
{showNotification && (
  <Banner className="fixed top-0 left-0 right-0 z-50" />
)}
<MainContent className="mt-12" /> {/* Account for banner height */}

// ✅ Better: Animate height instead of sudden appearance
<motion.div
  initial={{ height: 0 }}
  animate={{ height: 'auto' }}
  transition={{ duration: 0.2 }}
>
  <Banner />
</motion.div>
```

---

## Next.js Performance Patterns

### Static Generation

```tsx
// Force static generation
export const dynamic = "force-static";

// ISR with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

### Streaming and Suspense

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <main>
      {/* Critical content loads immediately */}
      <Hero />

      {/* Non-critical content streams in */}
      <Suspense fallback={<ProductsSkeleton />}>
        <Products />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </main>
  );
}
```

### Partial Prerendering (Next.js 15+)

```tsx
// next.config.ts
const config = {
  experimental: {
    ppr: true,
  },
};

// Page automatically splits static shell from dynamic content
export default function Page() {
  return (
    <main>
      <StaticHeader /> {/* Pre-rendered */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent /> {/* Streams in */}
      </Suspense>
    </main>
  );
}
```

---

## Measurement Tools

### Lab Data (Testing)

1. **Chrome DevTools Lighthouse** - `F12` → Lighthouse tab
2. **PageSpeed Insights** - https://pagespeed.web.dev/
3. **WebPageTest** - https://www.webpagetest.org/

### Field Data (Real Users)

1. **Google Search Console** - Core Web Vitals report
2. **Chrome UX Report (CrUX)** - Real-world data
3. **web-vitals library** - Measure in production

### Implementing web-vitals

```tsx
// app/components/WebVitals.tsx
"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP } from "web-vitals";

export function WebVitals() {
  useEffect(() => {
    onCLS(console.log);
    onINP(console.log);
    onLCP(console.log);

    // Or send to analytics
    onCLS((metric) => {
      gtag("event", "web_vitals", {
        event_category: "Web Vitals",
        event_label: metric.name,
        value: Math.round(metric.value * 1000),
        non_interaction: true,
      });
    });
  }, []);

  return null;
}

// Include in layout
<WebVitals />;
```

### Performance Budget Example

```json
// budget.json (for Lighthouse CI)
{
  "performance": 90,
  "firstContentfulPaint": 1500,
  "largestContentfulPaint": 2500,
  "cumulativeLayoutShift": 0.1,
  "totalBlockingTime": 200
}
```
