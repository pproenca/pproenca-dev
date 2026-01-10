import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

const contentDirectory = path.join(process.cwd(), "content");

export interface PageFrontmatter {
  title: string;
  description: string;
}

export interface Page {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
}

export const getPageBySlug = cache((slug: string): Page | null => {
  const fullPath = path.join(contentDirectory, slug, "index.mdx");

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PageFrontmatter,
    content,
  };
});
