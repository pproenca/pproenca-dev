# Change: Add MDX Blog with Static Export

## Why

Create a personal blog using MDX for content authoring with Next.js 16 static export for easy, free deployment to Vercel or GitHub Pages.

## What Changes

- Initialize Next.js 16 project with App Router, Turbopack, and static export
- Add MDX support with content stored in `content/posts/`
- Implement category-based organization for posts
- Add code syntax highlighting with Shiki
- Implement dark/light mode toggle with system preference detection
- Add SEO optimization (meta tags, Open Graph, sitemap, robots.txt)
- Create responsive, minimal design

## Impact

- Affected specs: `blog` (new capability)
- Affected code: New Next.js project structure
- Deployment: Static HTML/CSS/JS exportable to any static host
