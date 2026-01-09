# MDX Blog

A static blog built with Next.js 16, MDX, and Tailwind CSS.

## Features

- **MDX Content**: Write posts in MDX with React components
- **Static Export**: Deploys to any static host (Vercel, GitHub Pages, etc.)
- **Dark Mode**: System preference detection with manual toggle
- **Code Syntax Highlighting**: Shiki with theme-aware colors and copy button
- **Categories**: Organize posts by category
- **SEO**: Meta tags, Open Graph, sitemap, robots.txt
- **Responsive**: Mobile-first design

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

The static site is generated in the `out/` directory.

## Writing Posts

Create MDX files in `content/posts/`:

```mdx
---
title: "My Post Title"
date: "2025-01-07"
description: "A brief description of the post"
categories: ["Category1", "Category2"]
---

Your content here...
```

### Frontmatter Fields

| Field         | Required | Description                        |
| ------------- | -------- | ---------------------------------- |
| `title`       | Yes      | Post title                         |
| `date`        | Yes      | Publication date (YYYY-MM-DD)      |
| `description` | Yes      | Brief description for SEO          |
| `categories`  | Yes      | Array of category names            |
| `draft`       | No       | Set to `true` to hide from listing |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Deploy - Vercel auto-detects Next.js

### GitHub Pages

1. Add to `next.config.ts`:

   ```ts
   const nextConfig: NextConfig = {
     output: "export",
     basePath: "/your-repo-name",
     images: { unoptimized: true },
   };
   ```

2. Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

3. Enable GitHub Pages in repository settings (use `gh-pages` branch)

## Configuration

### Site URL

Set `NEXT_PUBLIC_SITE_URL` environment variable for sitemap generation:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

### Customization

- **Site title**: Edit `src/app/layout.tsx` metadata
- **Header links**: Edit `src/components/Header.tsx`
- **Footer**: Edit `src/components/Footer.tsx`
- **Colors**: Edit Tailwind classes or `src/app/globals.css`

## Tech Stack

- [Next.js 16](https://nextjs.org/) with App Router and Turbopack
- [MDX](https://mdxjs.com/) via next-mdx-remote
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Shiki](https://shiki.style/) for syntax highlighting
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode

## License

MIT
