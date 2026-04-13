import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  categories: string[];
  draft?: boolean;
}

export interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTimeMinutes: number;
  headings: Heading[];
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export const getAllPosts = cache(function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      const frontmatter = data as PostFrontmatter;
      return {
        slug,
        frontmatter,
      };
    })
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );

  return posts;
});

export const getPostBySlug = cache((slug: string): Post | null => {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const frontmatter = data as PostFrontmatter;
  return {
    slug,
    frontmatter,
    content,
    readingTimeMinutes: calculateReadingTime(content),
    headings: extractHeadings(content),
  };
});

export const getAllCategories = cache(
  function getAllCategories(): CategoryCount[] {
    const posts = getAllPosts();
    const categoryMap = new Map<string, number>();

    for (const post of posts) {
      for (const category of post.frontmatter.categories) {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      }
    }

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },
);

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-");
}

// Build a slug-keyed index of categories once per request so that
// getPostsByCategory and slugToCategory are O(1) instead of O(n) scans.
const getCategoryIndex = cache(function getCategoryIndex(): {
  slugToName: Map<string, string>;
  slugToPosts: Map<string, PostMeta[]>;
} {
  const slugToName = new Map<string, string>();
  const slugToPosts = new Map<string, PostMeta[]>();

  for (const post of getAllPosts()) {
    for (const category of post.frontmatter.categories) {
      const slug = categoryToSlug(category);
      if (!slugToName.has(slug)) {
        slugToName.set(slug, category);
        slugToPosts.set(slug, []);
      }
      slugToPosts.get(slug)!.push(post);
    }
  }

  return { slugToName, slugToPosts };
});

export const getPostsByCategory = cache((category: string): PostMeta[] => {
  return getCategoryIndex().slugToPosts.get(categoryToSlug(category)) ?? [];
});

export const slugToCategory = cache(function slugToCategory(
  slug: string,
): string | undefined {
  return getCategoryIndex().slugToName.get(slug);
});

export const getAllSlugs = cache(function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
});

export const getAllCategorySlugs = cache(
  function getAllCategorySlugs(): string[] {
    return Array.from(getCategoryIndex().slugToName.keys());
  },
);

export function formatPostDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Shared between server (heading extraction) and client (MDX render) so that
// anchor ids and TOC hrefs always match.
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Average adult reading speed for online prose; Medium uses 265, Pocket 220.
const WORDS_PER_MINUTE = 225;

function calculateReadingTime(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/<[^>]+>/g, " ") // JSX/HTML tags
    .replace(/`[^`]+`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → keep label
    .replace(/[#*_~>|]/g, " "); // markdown markers

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function extractHeadings(content: string): Heading[] {
  // Strip fenced code blocks first so we don't capture `#` inside them
  const cleaned = content.replace(/```[\s\S]*?```/g, "");
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleaned)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_~`[\]]/g, "").trim();
    if (!text) continue;
    headings.push({ level, text, id: slugifyHeading(text) });
  }

  return headings;
}
