# Project Context

## Purpose
Personal developer blog for sharing thoughts on web development, programming, and technology. Features MDX-based blog posts with syntax highlighting, dark/light theme support, and category organization.

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router with Turbopack)
- **Language**: TypeScript 5.9 (strict mode)
- **UI**: React 19.2.3
- **Styling**: Tailwind CSS 4 with @tailwindcss/typography
- **Content**: MDX via next-mdx-remote, gray-matter for frontmatter
- **Code Highlighting**: Shiki with dual themes (github-light / literary-nightfall)
- **Theming**: next-themes for dark/light mode
- **SEO**: JSON-LD via schema-dts, dynamic OG images, sitemap.ts, robots.ts
- **Fonts**: Libre Baskerville (serif), Source Sans 3 (sans), JetBrains Mono (mono)

## Project Conventions

### Code Style
- **Components**: Functional components with named exports (e.g., `export function Header()`)
- **Imports**: Use `@/*` path alias for src directory imports
- **Types**: Inline types preferred; export types when shared across files
- **CSS**: Use CSS variables for theming (e.g., `var(--color-text-primary)`)
- **Tailwind**: Utility classes with CSS variable references for dynamic theming
- **ESLint**: Next.js core-web-vitals and TypeScript configs

### Architecture Patterns
- **Directory Structure**:
  - `src/app/` - Next.js App Router pages and layouts
  - `src/components/` - Reusable React components
  - `src/lib/` - Utility functions and helpers
  - `content/posts/` - MDX blog post files
  - `openspec/` - Project documentation and proposals
- **Theming**: CSS variables in globals.css with `.dark` class toggle via next-themes
- **Content Pipeline**: MDX files → gray-matter parsing → next-mdx-remote rendering → Shiki highlighting
- **Caching**: React `cache()` for server-side request deduplication (see `src/lib/posts.ts`)
- **Spacing System**: Golden ratio (Fibonacci-based) spacing scale in CSS (`--spacing-golden-*`)

### Testing Strategy
No testing framework configured yet. When adding tests, consider:
- Jest or Vitest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

### Git Workflow
- **Commit Convention**: Conventional Commits format
  - `feat(scope): description` - New features
  - `fix(scope): description` - Bug fixes
  - `docs(scope): description` - Documentation
  - `refactor(scope): description` - Code refactoring
- **Branch**: Single `master` branch (early stage project)

## Domain Context
- Blog posts are MDX files in `content/posts/` with frontmatter:
  - `title`: Post title (string)
  - `date`: Publication date (YYYY-MM-DD format)
  - `description`: Post summary for SEO and previews (string)
  - `categories`: Array of category names (e.g., `["Next.js", "Web Development"]`)
  - `draft`: Optional boolean to hide post from listings
- Categories are extracted from post frontmatter, slugified for URLs
- Design theme: "Kindle Reading Theme" - e-ink inspired light mode, OLED-optimized dark mode
- Color palette: Warm cream text, soft gold accents, aged paper aesthetic
- Content focused on web development and technology topics

## Important Constraints
- Static generation preferred for blog posts (SSG)
- Accessibility: Focus states, reduced motion support, semantic HTML
- Performance: Turbopack in dev, optimized fonts with `display: swap`
- Security: XSS protection in JSON-LD output (HTML entity escaping)
- SEO: All pages require metadata, canonical URLs, and structured data
- No external CMS - all content in repository
- Modern browsers only (last 2 versions of Chrome, Firefox, Safari, Edge)

## External Dependencies
- Google Fonts (Libre Baskerville, Source Sans 3, JetBrains Mono)
- No external APIs or services currently
