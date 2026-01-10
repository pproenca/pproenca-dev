import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategorySlugs } from "@/lib/posts";
import {
  ROUTES,
  SITEMAP_CONFIG,
  siteUrl,
  postUrl,
  categoryUrl,
} from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categorySlugs = getAllCategorySlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl(ROUTES.home),
      lastModified: new Date(),
      changeFrequency: SITEMAP_CONFIG.home.changeFrequency,
      priority: SITEMAP_CONFIG.home.priority,
    },
    {
      url: siteUrl(ROUTES.categories),
      lastModified: new Date(),
      changeFrequency: SITEMAP_CONFIG.categories.changeFrequency,
      priority: SITEMAP_CONFIG.categories.priority,
    },
    {
      url: siteUrl(ROUTES.about),
      lastModified: new Date(),
      changeFrequency: SITEMAP_CONFIG.about.changeFrequency,
      priority: SITEMAP_CONFIG.about.priority,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: siteUrl(postUrl(post.slug)),
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: SITEMAP_CONFIG.post.changeFrequency,
    priority: SITEMAP_CONFIG.post.priority,
  }));

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: siteUrl(categoryUrl(slug)),
    lastModified: new Date(),
    changeFrequency: SITEMAP_CONFIG.category.changeFrequency,
    priority: SITEMAP_CONFIG.category.priority,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
