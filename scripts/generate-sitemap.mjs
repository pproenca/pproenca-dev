import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Load .env.local if it exists
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pproenca.dev";
const postsDirectory = path.join(process.cwd(), "content/posts");

function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return { slug, frontmatter: data };
    })
    .filter((post) => !post.frontmatter.draft);
}

function getAllCategories() {
  const posts = getAllPosts();
  const categorySet = new Set();
  posts.forEach((post) => {
    post.frontmatter.categories?.forEach((cat) => categorySet.add(cat));
  });
  return Array.from(categorySet);
}

function categoryToSlug(category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

function generateSitemap() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const now = new Date().toISOString();

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/categories", priority: "0.6", changefreq: "weekly" },
    { url: "/about", priority: "0.5", changefreq: "monthly" },
  ];

  const postPages = posts.map((post) => ({
    url: `/posts/${post.slug}`,
    priority: "0.8",
    changefreq: "monthly",
    lastmod: post.frontmatter.date,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `/categories/${categoryToSlug(cat)}`,
    priority: "0.5",
    changefreq: "weekly",
  }));

  const allPages = [...staticPages, ...postPages, ...categoryPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod || now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), sitemap);
  console.log("Sitemap generated successfully!");
}

generateSitemap();
