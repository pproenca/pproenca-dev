# Visual Theme Specification

## ADDED Requirements

### Requirement: Kindle-Inspired Light Mode Palette

The light mode theme SHALL use a warm sepia/cream palette that mimics e-ink paper to reduce eye strain during extended reading.

#### Scenario: User visits blog in light mode

- **WHEN** the user has light mode enabled (or system preference is light)
- **AND** they view any page on the blog
- **THEN** the background appears as warm antique paper (#f4f1e8)
- **AND** body text appears as soft warm black (#3d3731)
- **AND** accent colors are desaturated amber (#9a7b4f)
- **AND** the overall feel resembles reading on a Kindle Paperwhite

### Requirement: Night Reading Dark Mode Palette

The dark mode theme SHALL use true black backgrounds with warm cream text optimized for OLED screens and nighttime reading.

#### Scenario: User visits blog in dark mode

- **WHEN** the user has dark mode enabled (or system preference is dark)
- **AND** they view any page on the blog
- **THEN** the background appears as true deep black (#0a0908)
- **AND** body text appears as warm cream (#d4cfc4), not pure white
- **AND** accent colors are soft gold (#a89060)
- **AND** the overall feel resembles Kindle night mode

### Requirement: Paper Texture in Light Mode

The light mode SHALL include a subtle paper grain texture overlay to enhance the physical paper aesthetic.

#### Scenario: Paper texture appears in light mode only

- **WHEN** the user has light mode enabled
- **AND** they view any page
- **THEN** a subtle noise texture is visible overlaying the background
- **AND** the texture opacity is low (3-5%) to avoid distraction
- **AND** the texture uses mix-blend-mode multiply for natural integration

#### Scenario: No paper texture in dark mode

- **WHEN** the user has dark mode enabled
- **AND** they view any page
- **THEN** no paper texture is visible
- **AND** backgrounds are clean for OLED optimization

### Requirement: Reading-Optimized Typography

Body text SHALL be optimized for comfortable long-form reading with generous line height and appropriate sizing.

#### Scenario: User reads a blog post

- **WHEN** the user is on a blog post page
- **AND** they read the body content
- **THEN** the base font size is 18px (or equivalent rem)
- **AND** line height for body paragraphs is 1.75
- **AND** the reading measure is approximately 65-75 characters per line
- **AND** paragraph spacing provides clear visual breaks

### Requirement: Muted Code Block Chrome

Code blocks SHALL integrate visually with the paper aesthetic, with minimal terminal styling distractions.

#### Scenario: Code block appears in blog post

- **WHEN** a blog post contains code blocks
- **AND** the user views the code
- **THEN** the terminal traffic light dots are muted or single-colored
- **AND** the code block background matches the elevated surface color
- **AND** code feels like printed code on paper, not a jarring terminal

### Requirement: Minimal Header and Footer Presence

Header and footer SHALL be visually lightweight to maximize focus on content.

#### Scenario: User reads content with header visible

- **WHEN** the user is scrolling through a blog post
- **AND** the sticky header is visible
- **THEN** the header has high background transparency
- **AND** navigation text is understated
- **AND** the header does not compete with content for attention

#### Scenario: User reaches footer

- **WHEN** the user scrolls to the bottom of a page
- **AND** the footer is visible
- **THEN** the footer border is very subtle or invisible
- **AND** footer text is small and unobtrusive

### Requirement: Book-Style Blockquotes

Blockquotes SHALL use traditional book styling rather than prominent web-style borders.

#### Scenario: Blockquote appears in content

- **WHEN** a blog post contains a blockquote
- **AND** the user views the blockquote
- **THEN** the text is italicized
- **AND** the left border is subtle or absent (not a thick accent bar)
- **AND** the styling feels like a quotation in a printed book
