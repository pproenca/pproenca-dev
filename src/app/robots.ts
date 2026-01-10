import type { MetadataRoute } from "next";
import { SITE_CONFIG, ROBOTS_CONFIG, siteUrl } from "@/lib/constants";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ROBOTS_CONFIG.disallow,
    },
    sitemap: siteUrl("/sitemap.xml"),
    host: SITE_CONFIG.url,
  };
}
