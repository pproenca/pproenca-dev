# SEO Capability Specification

## ADDED Requirements

### Requirement: JSON-LD Structured Data Component

The system SHALL provide a reusable React component for rendering JSON-LD structured data that outputs valid schema.org markup.

#### Scenario: Render JSON-LD script tag

- **WHEN** a page includes the JsonLd component with schema data
- **THEN** a `<script type="application/ld+json">` tag is rendered with the JSON-stringified data

#### Scenario: Valid schema.org context

- **WHEN** JSON-LD data is provided to the component
- **THEN** the output MUST include `"@context": "https://schema.org"`

---

### Requirement: WebSite Schema on Homepage

The homepage SHALL include WebSite JSON-LD structured data to help search engines understand the site identity.

#### Scenario: WebSite schema present on homepage

- **WHEN** a user or crawler visits the homepage
- **THEN** the page contains JSON-LD with `@type: "WebSite"`, `name`, and `url` properties

#### Scenario: SearchAction not included

- **WHEN** the site does not have search functionality
- **THEN** the WebSite schema MUST NOT include a SearchAction potentialAction

---

### Requirement: Person Schema on About Page

The about page SHALL include Person JSON-LD structured data to establish author identity for E-E-A-T signals.

#### Scenario: Person schema present on about page

- **WHEN** a user or crawler visits the about page
- **THEN** the page contains JSON-LD with `@type: "Person"`, `name`, `url`, `jobTitle`, and `sameAs` properties

#### Scenario: Social profile links in sameAs

- **WHEN** the Person schema is rendered
- **THEN** the `sameAs` array MUST include links to GitHub, LinkedIn, and Twitter profiles

---

### Requirement: Article Schema on Blog Posts

Each blog post SHALL include Article JSON-LD structured data with complete publication metadata.

#### Scenario: Article schema present on blog posts

- **WHEN** a user or crawler visits a blog post page
- **THEN** the page contains JSON-LD with `@type: "Article"`, `headline`, `datePublished`, `author`, and `description` properties

#### Scenario: Author reference in Article schema

- **WHEN** the Article schema is rendered
- **THEN** the `author` property MUST reference a Person with `name` and `url`

#### Scenario: MainEntityOfPage reference

- **WHEN** the Article schema is rendered
- **THEN** it MUST include `mainEntityOfPage` with the canonical URL

---

### Requirement: BreadcrumbList Schema

Blog post pages SHALL include BreadcrumbList JSON-LD structured data to indicate navigation hierarchy.

#### Scenario: Breadcrumb schema on blog posts

- **WHEN** a user or crawler visits a blog post
- **THEN** the page contains JSON-LD with `@type: "BreadcrumbList"` and `itemListElement` array

#### Scenario: Breadcrumb hierarchy structure

- **WHEN** the BreadcrumbList is rendered for a blog post
- **THEN** the items MUST include: Home (position 1), Posts (position 2), Post Title (position 3)

---

### Requirement: Canonical URLs

All pages SHALL specify canonical URLs to prevent duplicate content issues and consolidate ranking signals.

#### Scenario: Canonical URL in metadata

- **WHEN** any page is rendered
- **THEN** the page metadata MUST include `alternates.canonical` pointing to the definitive URL

#### Scenario: Canonical matches page URL

- **WHEN** a canonical URL is specified
- **THEN** it MUST match the expected URL path for that page

---

### Requirement: Complete Robots Configuration

The root layout SHALL specify robots directives that enable proper indexing while controlling snippet behavior.

#### Scenario: Default indexing enabled

- **WHEN** the root layout metadata is rendered
- **THEN** `robots.index` and `robots.follow` MUST be `true`

#### Scenario: GoogleBot enhanced directives

- **WHEN** the root layout metadata is rendered
- **THEN** `robots.googleBot` MUST include `max-image-preview: large` and `max-snippet: -1`

---

### Requirement: Viewport Configuration

The site SHALL export viewport configuration separate from metadata (Next.js 15+ pattern).

#### Scenario: Viewport export present

- **WHEN** the root layout is loaded
- **THEN** a `viewport` export MUST be present with `width: 'device-width'` and `initialScale: 1`

#### Scenario: Theme color specified

- **WHEN** the viewport is configured
- **THEN** `themeColor` MUST be specified for both light and dark color schemes

---

### Requirement: Author Attribution

The root layout metadata SHALL include author information for attribution across the site.

#### Scenario: Authors array present

- **WHEN** the root layout metadata is rendered
- **THEN** an `authors` array MUST be present with at least one author containing `name` and `url`

---

### Requirement: Complete OpenGraph Metadata

Pages SHALL include complete OpenGraph metadata for optimal social sharing.

#### Scenario: Default OpenGraph image

- **WHEN** a page does not specify a custom OG image
- **THEN** a default site OG image MUST be used

#### Scenario: Article-type OpenGraph for posts

- **WHEN** a blog post is shared
- **THEN** the OpenGraph type MUST be `article` with `publishedTime` and `authors` properties

---

### Requirement: Robots.txt Configuration

The site SHALL serve a robots.txt file with appropriate crawler directives.

#### Scenario: Allow all crawlers

- **WHEN** a crawler requests /robots.txt
- **THEN** the response MUST include `User-agent: *` with `Allow: /`

#### Scenario: Sitemap reference

- **WHEN** robots.txt is served
- **THEN** it MUST include a `Sitemap:` directive pointing to the sitemap URL

---

### Requirement: Dynamic Sitemap Generation

The build process SHALL generate a sitemap.xml containing all indexable pages.

#### Scenario: All pages in sitemap

- **WHEN** the sitemap is generated
- **THEN** it MUST include homepage, about, categories, all published posts, and all category pages

#### Scenario: Correct lastmod dates

- **WHEN** a blog post entry is in the sitemap
- **THEN** the `lastmod` MUST reflect the post's publication date

#### Scenario: Priority assignment

- **WHEN** the sitemap is generated
- **THEN** homepage MUST have priority 1.0, posts MUST have priority 0.8, other pages lower

---

### Requirement: Web App Manifest

The site SHALL include a web app manifest for PWA support and mobile installation.

#### Scenario: Manifest accessible

- **WHEN** a browser requests /site.webmanifest
- **THEN** a valid JSON manifest MUST be returned

#### Scenario: Manifest content

- **WHEN** the manifest is parsed
- **THEN** it MUST include `name`, `short_name`, `icons`, `theme_color`, and `background_color`

---

### Requirement: Complete Favicon Set

The site SHALL provide favicons in multiple sizes for cross-platform compatibility.

#### Scenario: Apple touch icon present

- **WHEN** iOS device saves the site to home screen
- **THEN** an apple-touch-icon (180x180) MUST be available

#### Scenario: Standard favicon sizes

- **WHEN** a browser requests favicons
- **THEN** favicon-32x32.png and favicon-16x16.png MUST be available

---

### Requirement: Site Configuration Constants

The system SHALL centralize site configuration in a constants file for consistency across SEO implementations.

#### Scenario: Author info accessible

- **WHEN** any page needs author information for metadata or JSON-LD
- **THEN** it MUST import from a centralized SITE_CONFIG constant

#### Scenario: URL configuration

- **WHEN** the site URL is needed
- **THEN** it MUST be retrieved from SITE_CONFIG.url or environment variable
