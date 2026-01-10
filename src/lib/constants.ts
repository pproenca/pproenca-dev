export const SITE_CONFIG = {
  name: "pproenca.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.pproenca.dev",
  title: "pproenca.dev",
  description: "A personal blog about web development and technology.",
  locale: "en_US",
  language: "en",
  author: {
    name: "Pedro Proenca",
    url: "https://www.pproenca.dev/about",
    twitter: "@ThePedroProenca",
    github: "https://github.com/pproenca",
    linkedin: "https://www.linkedin.com/in/pedro-proenca/",
    jobTitle: "Engineering Manager",
    employer: "TrustedHousesitters",
  },
  social: {
    twitter: "https://x.com/ThePedroProenca",
    github: "https://github.com/pproenca",
    linkedin: "https://www.linkedin.com/in/pedro-proenca/",
  },
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  categories: "/categories",
  posts: "/posts",
  feed: {
    rss: "/feed.xml",
    atom: "/atom.xml",
    json: "/feed.json",
  },
} as const;

export const CONTENT_TYPES = {
  rss: "application/rss+xml; charset=utf-8",
  atom: "application/atom+xml; charset=utf-8",
  json: "application/feed+json; charset=utf-8",
} as const;

export const SITEMAP_CONFIG = {
  home: { priority: 1.0, changeFrequency: "weekly" as const },
  post: { priority: 0.8, changeFrequency: "monthly" as const },
  categories: { priority: 0.6, changeFrequency: "weekly" as const },
  category: { priority: 0.5, changeFrequency: "weekly" as const },
  about: { priority: 0.5, changeFrequency: "monthly" as const },
} as const;

export const ROBOTS_CONFIG = {
  disallow: ["/api/", "/_next/"] as string[],
};

export function siteUrl(path: string = "/"): string {
  return `${SITE_CONFIG.url}${path}`;
}

export function postUrl(slug: string): string {
  return `${ROUTES.posts}/${slug}`;
}

export function categoryUrl(slug: string): string {
  return `${ROUTES.categories}/${slug}`;
}

export interface BreadcrumbItem {
  name: string;
  item?: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((breadcrumb, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: breadcrumb.name,
      ...(breadcrumb.item && { item: breadcrumb.item }),
    })),
  };
}
