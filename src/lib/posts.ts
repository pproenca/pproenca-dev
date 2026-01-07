import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

      return {
        slug,
        frontmatter: data as PostFrontmatter,
      };
    })
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    post.frontmatter.categories.forEach((category) => {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.frontmatter.categories
      .map((c) => c.toLowerCase())
      .includes(category.toLowerCase())
  );
}

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
  return categories.map((c) => c.name.toLowerCase().replace(/\s+/g, "-"));
}

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategory(slug: string): string | undefined {
  const categories = getAllCategories();
  return categories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug
  )?.name;
}
