# Blog Capability

## ADDED Requirements

### Requirement: MDX Content Authoring
Authors SHALL write blog posts in MDX format with YAML frontmatter stored in the `content/posts/` directory.

#### Scenario: Post with frontmatter
- **WHEN** an MDX file exists at `content/posts/my-post.mdx` with valid frontmatter
- **THEN** the post is available at `/posts/my-post`

#### Scenario: Frontmatter structure
- **WHEN** a post is created
- **THEN** it MUST include: `title`, `date`, `description`, `categories` (array)
- **AND** MAY include: `draft` (boolean, defaults to false)

---

### Requirement: Static Site Generation
The blog SHALL use Next.js 16 with Turbopack and be statically generated at build time with no server-side runtime required.

#### Scenario: Static export
- **WHEN** `npm run build` is executed
- **THEN** the `out/` directory contains static HTML, CSS, and JS files
- **AND** all post pages are pre-rendered

#### Scenario: Turbopack development
- **WHEN** `npm run dev` is executed
- **THEN** Turbopack is used as the bundler for fast refresh

#### Scenario: Deployable to static hosts
- **WHEN** the `out/` directory is deployed to Vercel, GitHub Pages, or any static host
- **THEN** the site functions correctly without a Node.js server

---

### Requirement: Category Organization
Posts SHALL be organized by categories allowing readers to browse related content.

#### Scenario: Category listing page
- **WHEN** a user visits `/categories`
- **THEN** all categories with post counts are displayed

#### Scenario: Category filter page
- **WHEN** a user visits `/categories/[slug]`
- **THEN** only posts in that category are listed

#### Scenario: Post category display
- **WHEN** a post has categories defined in frontmatter
- **THEN** category badges are displayed on the post card and post page

---

### Requirement: Code Syntax Highlighting
Code blocks in posts SHALL be syntax highlighted with language-appropriate coloring.

#### Scenario: Fenced code block rendering
- **WHEN** a post contains a fenced code block with a language identifier
- **THEN** the code is rendered with syntax highlighting using Shiki

#### Scenario: Theme-aware highlighting
- **WHEN** the user switches between light and dark mode
- **THEN** code block colors adapt to the current theme

#### Scenario: Copy code button
- **WHEN** a code block is rendered
- **THEN** a copy-to-clipboard button is available

---

### Requirement: Dark Mode
The blog SHALL support light and dark color schemes with user preference persistence.

#### Scenario: System preference detection
- **WHEN** a user visits for the first time
- **THEN** the theme matches their system preference (prefers-color-scheme)

#### Scenario: Manual toggle
- **WHEN** a user clicks the theme toggle
- **THEN** the theme switches between light and dark mode

#### Scenario: Preference persistence
- **WHEN** a user sets a theme preference
- **THEN** the preference is persisted in localStorage
- **AND** applied on subsequent visits

#### Scenario: No flash on load
- **WHEN** the page loads with a stored preference
- **THEN** the correct theme is applied before first paint (no flash)

---

### Requirement: SEO Optimization
The blog SHALL be optimized for search engines and social sharing.

#### Scenario: Meta tags
- **WHEN** any page is rendered
- **THEN** appropriate `<title>` and `<meta name="description">` tags are present

#### Scenario: Open Graph tags
- **WHEN** a post page is rendered
- **THEN** Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`) are present

#### Scenario: Twitter cards
- **WHEN** a post page is rendered
- **THEN** Twitter card meta tags are present

#### Scenario: Sitemap
- **WHEN** the site is built
- **THEN** a `sitemap.xml` is generated listing all public pages

#### Scenario: Robots.txt
- **WHEN** a crawler requests `/robots.txt`
- **THEN** a valid robots.txt file is served allowing indexing

---

### Requirement: Responsive Design
The blog SHALL be readable and functional on devices of all sizes.

#### Scenario: Mobile layout
- **WHEN** viewed on a mobile device (< 768px width)
- **THEN** content is single-column and readable without horizontal scrolling

#### Scenario: Desktop layout
- **WHEN** viewed on a desktop device (>= 768px width)
- **THEN** content uses appropriate max-width for comfortable reading
