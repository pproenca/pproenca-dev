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

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export function getAllPosts(): PostMeta[] {
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
}

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
  };
});

export function getAllCategories(): CategoryCount[] {
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
}

export const getPostsByCategory = cache((category: string): PostMeta[] => {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.frontmatter.categories
      .map((c) => c.toLowerCase())
      .includes(category.toLowerCase()),
  );
});

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

export function getAllCategorySlugs(): string[] {
  const categories = getAllCategories();
  return categories.map((c) => categoryToSlug(c.name));
}

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-");
}

export function slugToCategory(slug: string): string | undefined {
  const categories = getAllCategories();
  return categories.find((c) => categoryToSlug(c.name) === slug)?.name;
}
