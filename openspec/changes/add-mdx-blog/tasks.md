# Tasks: Add MDX Blog

## 1. Project Setup
- [x] 1.1 Initialize Next.js 16 project with TypeScript, App Router, and Turbopack
- [x] 1.2 Configure `next.config.ts` for static export (`output: 'export'`)
- [x] 1.3 Set up project structure (`content/posts/`, `src/components/`, `src/lib/`)

## 2. MDX Content System
- [x] 2.1 Install MDX dependencies (`gray-matter`, `next-mdx-remote`)
- [x] 2.2 Create post content loader utility (read frontmatter, parse MDX)
- [x] 2.3 Define frontmatter schema (title, date, description, categories, slug)
- [x] 2.4 Create sample posts for testing

## 3. Code Syntax Highlighting
- [x] 3.1 Install and configure Shiki for syntax highlighting
- [x] 3.2 Create custom code block component with copy button
- [x] 3.3 Support light/dark themes for code blocks

## 4. Dark Mode
- [x] 4.1 Install and configure `next-themes`
- [x] 4.2 Create theme toggle component
- [x] 4.3 Add CSS variables for light/dark color schemes
- [x] 4.4 Persist theme preference in localStorage

## 5. Categories
- [x] 5.1 Create category listing page (`/categories`)
- [x] 5.2 Create individual category page (`/categories/[slug]`)
- [x] 5.3 Add category badges to post cards and post pages

## 6. Pages & Layout
- [x] 6.1 Create root layout with header, footer, theme provider
- [x] 6.2 Create home page with post listing
- [x] 6.3 Create individual post page (`/posts/[slug]`)
- [x] 6.4 Create about page (optional placeholder)

## 7. SEO
- [x] 7.1 Configure Next.js Metadata API for default meta tags
- [x] 7.2 Add Open Graph and Twitter card meta tags per post
- [x] 7.3 Generate `sitemap.xml` using build script
- [x] 7.4 Add `robots.txt`

## 8. Styling
- [x] 8.1 Set up Tailwind CSS with typography plugin
- [x] 8.2 Create minimal, responsive design system
- [x] 8.3 Style MDX prose content (headings, links, lists, blockquotes)

## 9. Deployment
- [x] 9.1 Add build scripts and verify static export works
- [x] 9.2 Document deployment to Vercel (recommended) or GitHub Pages
