# Build Tooling Specification

## ADDED Requirements

### Requirement: Native Sitemap Generation

The build system SHALL use Next.js native `sitemap.ts` convention for sitemap generation instead of custom scripts.

#### Scenario: Sitemap generated at build time

- **WHEN** `npm run build` is executed
- **THEN** `out/sitemap.xml` SHALL be generated automatically
- **AND** the sitemap SHALL include all published posts, categories, and static pages

#### Scenario: Sitemap uses consistent URL format

- **WHEN** sitemap is generated
- **THEN** all URLs SHALL use the `SITE_CONFIG.url` as the base
- **AND** URLs SHALL match the canonical URLs defined in page metadata

### Requirement: Native Robots.txt Generation

The build system SHALL use Next.js native `robots.ts` convention for robots.txt generation instead of static files.

#### Scenario: Robots.txt generated at build time

- **WHEN** `npm run build` is executed
- **THEN** `out/robots.txt` SHALL be generated automatically
- **AND** the file SHALL reference the sitemap URL

#### Scenario: Robots.txt blocks appropriate paths

- **WHEN** robots.txt is generated
- **THEN** it SHALL allow crawling of `/`
- **AND** it SHALL disallow `/api/` and `/_next/` paths

## MODIFIED Requirements

### Requirement: Decorative Icon Accessibility

Inline SVG icons that are decorative (where the parent element provides accessible name) SHALL include `aria-hidden="true"` attribute.

#### Scenario: Social media icon accessibility

- **WHEN** a social media link contains an inline SVG icon
- **AND** the link has an `aria-label` attribute
- **THEN** the SVG element SHALL have `aria-hidden="true"`

#### Scenario: Theme toggle icon accessibility

- **WHEN** the theme toggle button contains SVG icons
- **AND** the button has an accessible name
- **THEN** the SVG elements SHALL have `aria-hidden="true"`
