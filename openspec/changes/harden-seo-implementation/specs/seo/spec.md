## ADDED Requirements

### Requirement: JSON-LD XSS Protection

The system SHALL sanitize all JSON-LD structured data output by replacing HTML-sensitive characters to prevent XSS injection attacks.

#### Scenario: HTML characters in content are escaped

- **WHEN** a blog post title contains `<script>` or other HTML characters
- **THEN** the JSON-LD output contains `\u003c` instead of raw `<` characters

#### Scenario: Safe content passes through unchanged

- **WHEN** a blog post title contains only alphanumeric and standard punctuation
- **THEN** the JSON-LD output is identical to the input (no unnecessary escaping)

### Requirement: Memoized Data Fetching

The system SHALL memoize data fetching functions using React's `cache()` to prevent duplicate requests within a single render pass.

#### Scenario: generateMetadata and page component share data

- **WHEN** a post page renders with both `generateMetadata` and page component fetching the same post
- **THEN** only one file system read occurs (verified via React cache behavior)

#### Scenario: Different posts are fetched independently

- **WHEN** two different post pages are rendered
- **THEN** each fetches its own post data (cache is per-request, not global)

### Requirement: Dynamic Open Graph Images

The system SHALL generate unique Open Graph images for blog posts using Next.js `ImageResponse` API.

#### Scenario: Post OG image contains title

- **WHEN** a social platform requests the OG image for a blog post
- **THEN** the generated image displays the post title with site branding

#### Scenario: OG image dimensions meet platform requirements

- **WHEN** the OG image is generated
- **THEN** the image is 1200x630 pixels (standard OG image size)

#### Scenario: OG image is referenced in metadata

- **WHEN** a blog post page is rendered
- **THEN** the OpenGraph metadata `og:image` points to the generated image URL
