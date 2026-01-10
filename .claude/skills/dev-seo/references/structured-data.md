# Structured Data Reference (JSON-LD)

Complete reference for implementing structured data in Next.js applications.

## Table of Contents

1. [Overview](#overview)
2. [Article Schema](#article-schema)
3. [Organization Schema](#organization-schema)
4. [Breadcrumb Schema](#breadcrumb-schema)
5. [FAQ Schema](#faq-schema)
6. [Product Schema](#product-schema)
7. [Local Business Schema](#local-business-schema)
8. [Person Schema](#person-schema)
9. [WebSite Schema](#website-schema)
10. [Validation & Testing](#validation--testing)

---

## Overview

### Why Structured Data?

- Helps Google understand page content
- Enables rich results (stars, images, FAQs in search)
- Can increase click-through rates by 20-30%
- Required for some search features

### Formats

Google supports three formats (JSON-LD recommended):

1. **JSON-LD** (Recommended) - Script tag in head or body
2. **Microdata** - HTML attributes
3. **RDFa** - HTML attributes

### Implementation in Next.js

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
```

---

## Article Schema

For blog posts, news articles, and editorial content.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize Next.js for SEO",
  "description": "A comprehensive guide to SEO optimization in Next.js 15",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg",
    "https://example.com/photos/16x9/photo.jpg"
  ],
  "datePublished": "2024-01-15T08:00:00+00:00",
  "dateModified": "2024-02-20T09:00:00+00:00",
  "author": [
    {
      "@type": "Person",
      "name": "John Doe",
      "url": "https://example.com/authors/john-doe",
      "jobTitle": "Senior Developer",
      "image": "https://example.com/authors/john-doe.jpg"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Example Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/nextjs-seo"
  },
  "wordCount": 2500,
  "articleSection": "Technology",
  "keywords": ["Next.js", "SEO", "React"]
}
```

### News Article Variant

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Breaking: Major Tech Company Announces New Product",
  "dateline": "San Francisco, CA"
}
```

---

## Organization Schema

Place on homepage to define company identity.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Company",
  "alternateName": "Example",
  "url": "https://example.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://example.com/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "We build software solutions for modern businesses.",
  "foundingDate": "2020-01-01",
  "founders": [
    {
      "@type": "Person",
      "name": "Jane Smith"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94105",
    "addressCountry": "US"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+1-555-555-5555",
      "contactType": "customer service",
      "email": "support@example.com",
      "availableLanguage": ["English", "Spanish"]
    }
  ],
  "sameAs": [
    "https://twitter.com/example",
    "https://www.linkedin.com/company/example",
    "https://github.com/example",
    "https://www.youtube.com/@example"
  ]
}
```

---

## Breadcrumb Schema

Helps search engines understand site structure.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://example.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Category",
      "item": "https://example.com/blog/category"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Article Title"
    }
  ]
}
```

---

## FAQ Schema

Can display expandable Q&A in search results.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Next.js?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Next.js is a React framework that enables server-side rendering, static site generation, and other features for building modern web applications."
      }
    },
    {
      "@type": "Question",
      "name": "Is Next.js good for SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Next.js is excellent for SEO because it supports server-side rendering, static generation, automatic code splitting, and has a built-in Metadata API for managing meta tags."
      }
    },
    {
      "@type": "Question",
      "name": "How do I add structured data in Next.js?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can add structured data using JSON-LD in a script tag. Create a component that renders the JSON-LD and include it in your page."
      }
    }
  ]
}
```

---

## Product Schema

For e-commerce and product pages.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Premium Widget Pro",
  "image": [
    "https://example.com/photos/widget-1.jpg",
    "https://example.com/photos/widget-2.jpg"
  ],
  "description": "The best widget for professional use.",
  "sku": "WIDGET-PRO-001",
  "mpn": "925872",
  "brand": {
    "@type": "Brand",
    "name": "WidgetCorp"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/premium-widget",
    "priceCurrency": "USD",
    "price": 99.99,
    "priceValidUntil": "2024-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Example Store"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": 9.99,
        "currency": "USD"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "businessDays": {
          "@type": "QuantitativeValue",
          "minValue": 3,
          "maxValue": 5
        }
      }
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "reviewCount": 127
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5
      },
      "author": {
        "@type": "Person",
        "name": "Sarah Johnson"
      },
      "reviewBody": "Excellent product! Exceeded my expectations."
    }
  ]
}
```

---

## Local Business Schema

For businesses with physical locations.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Example Coffee Shop",
  "image": "https://example.com/photos/storefront.jpg",
  "@id": "https://example.com",
  "url": "https://example.com",
  "telephone": "+1-555-555-5555",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Coffee Lane",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94102",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 89
  }
}
```

---

## Person Schema

For author pages and profiles.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "John Developer",
  "url": "https://example.com/about/john",
  "image": "https://example.com/authors/john.jpg",
  "jobTitle": "Senior Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Example Company"
  },
  "description": "Full-stack developer specializing in React and Next.js",
  "sameAs": [
    "https://twitter.com/johndev",
    "https://github.com/johndev",
    "https://linkedin.com/in/johndev"
  ],
  "knowsAbout": ["JavaScript", "React", "Next.js", "SEO"],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "MIT"
  }
}
```

---

## WebSite Schema

For site-wide search functionality.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Example Site",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## Validation & Testing

### Testing Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Markup Validator**: https://validator.schema.org/
3. **Google Search Console**: Check structured data errors

### Common Errors to Avoid

| Error                  | Solution                                          |
| ---------------------- | ------------------------------------------------- |
| Missing required field | Add all required properties for the schema type   |
| Invalid URL            | Use absolute URLs with https                      |
| Invalid date format    | Use ISO 8601 format: `2024-01-15T08:00:00+00:00`  |
| Missing @context       | Always include `"@context": "https://schema.org"` |
| Mismatched content     | Structured data must match visible page content   |

### Combining Multiple Schemas

```tsx
// Use @graph for multiple schemas on one page
const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Example Site",
      "url": "https://example.com"
    },
    {
      "@type": "Organization",
      "name": "Example Company",
      "url": "https://example.com"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [...]
    }
  ]
}
```
