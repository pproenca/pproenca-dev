# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev             # Start dev server with Turbopack (http://localhost:3000)
pnpm build           # Generate sitemap + build static site to out/
pnpm lint            # Run ESLint
pnpm format          # Auto-format code with Prettier
pnpm clean           # Remove build artifacts (.next, out, .turbo, caches)
pnpm test:e2e        # Run Playwright E2E tests (builds site first)
pnpm test:e2e:ui     # Run E2E tests with interactive UI debugger
pnpm test:e2e:update # Update visual regression snapshots
```

## Testing

E2E tests use Playwright and run against the static build. Tests cover:
- Critical path (homepage, posts, categories, theme toggle)
- Visual regression (CI-only, Linux baselines)
- SEO metadata and feeds
- Accessibility

### Visual Snapshots

Visual tests only run on CI (Linux) to ensure consistent baselines. To update snapshots:
1. Push changes to a PR
2. CI will fail if visual differences are detected
3. Review the diff in the uploaded artifacts
4. If changes are intentional, run `pnpm test:e2e:update` in CI or a Linux environment

## Architecture

This is a static MDX blog built with Next.js 16, Tailwind CSS 4, and the App Router.

### Content Flow

1. MDX posts live in `content/posts/` with YAML frontmatter
2. `src/lib/posts.ts` reads and parses posts using gray-matter
3. `src/components/MDXContent.tsx` renders posts using next-mdx-remote/rsc
4. Code blocks go through `src/lib/shiki.ts` for syntax highlighting with dual themes (github-light / literary-nightfall)

### Key Patterns

- **Static export**: Site builds to `out/` directory for static hosting
- **Dual theme code blocks**: MDXContent renders both light and dark HTML, CodeBlock component shows the appropriate one based on theme
- **CSS variables for theming**: Colors defined in `globals.css` as CSS custom properties, switched via `.dark` class
- **Server components by default**: MDX rendering happens server-side; only interactive components (ThemeToggle, CodeBlock copy) are client components

### Route Structure

- `/` - Post listing (src/app/page.tsx)
- `/posts/[slug]` - Individual posts (src/app/posts/[slug]/page.tsx)
- `/categories` - Category listing (src/app/categories/page.tsx)
- `/categories/[slug]` - Posts by category (src/app/categories/[slug]/page.tsx)
- `/about` - About page (src/app/about/page.tsx)

### Adding New Syntax Highlighting Languages

Add to the `langs` array in `src/lib/shiki.ts`.

<!-- OPENSPEC:START -->

## OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->
