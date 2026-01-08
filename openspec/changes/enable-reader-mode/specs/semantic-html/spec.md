## ADDED Requirements

### Requirement: Single Article Element per Page

Blog post pages SHALL have exactly one `<article>` element wrapping the post content to ensure proper reader mode detection.

#### Scenario: MDX content rendered within page article

- **WHEN** a blog post is rendered
- **THEN** the MDXContent component renders within a `<div>` wrapper (not `<article>`)
- **AND** the outer page template provides the single `<article>` element

### Requirement: Machine-Readable Publication Date

Blog post publication dates SHALL include ISO 8601 `datetime` attributes for machine parsing.

#### Scenario: Time element with datetime attribute

- **WHEN** a blog post is rendered
- **THEN** the `<time>` element includes a `dateTime` attribute with the ISO 8601 date string
- **AND** the human-readable date remains visible

### Requirement: Semantic Author Byline

Blog posts SHALL display a visible author byline with semantic markup that reader mode parsers recognize.

#### Scenario: Author link with rel attribute

- **WHEN** a blog post is rendered
- **THEN** the author name is displayed as a link with `rel="author"`
- **AND** the link has class `author-name` for Safari reader mode detection
- **AND** the byline is positioned near the title for optimal detection
