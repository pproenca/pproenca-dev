# Dark Theme Design

## ADDED Requirements

### Requirement: Warm Dark Color Palette

The blog MUST use a warm, sepia-tinted dark color palette instead of cold grays to reduce eye strain and create a literary reading atmosphere.

#### Scenario: Page background uses warm dark tone

**Given** the user is viewing the blog in dark mode
**When** the page loads
**Then** the background color should be a warm dark tone (#0f0d0b)
**And** text should be cream/off-white (#e8e2d9) not pure white

#### Scenario: Elevated surfaces are warmer, not just lighter

**Given** a code block or card element on the page
**When** viewed in dark mode
**Then** the background should be warmer (#1a1714 or #241f1a)
**And** should have visible but subtle differentiation from the page background

---

### Requirement: Editorial Typography

The blog MUST use distinctive serif typography for headings to create an editorial, literary magazine aesthetic.

#### Scenario: Article titles use serif font

**Given** a blog post article page
**When** the page renders
**Then** the article title should use Libre Baskerville or similar serif font
**And** the font should be visually distinct from body text

#### Scenario: Body text uses readable humanist sans-serif

**Given** article content on the page
**When** reading body paragraphs
**Then** the text should use Source Sans 3 or similar humanist sans-serif
**And** line-height should be approximately 1.7 for comfortable reading

---

### Requirement: Warm Accent Color

The blog MUST use warm gold/amber accent colors instead of generic blue for links and interactive elements.

#### Scenario: Links display with gold accent

**Given** a link within article content
**When** viewing the link
**Then** the link color should be warm gold (#c9a962)
**And** the link should have a subtle underline

#### Scenario: Hover states use accent color

**Given** a post title in the post list
**When** hovering over the title
**Then** the title should transition to the accent color
**And** the transition should be smooth (approximately 200ms)

---

### Requirement: Bordered Category Badges

Category badges MUST use a bordered/outlined style rather than filled backgrounds for a cleaner, less cluttered appearance.

#### Scenario: Category badges appear as outlined pills

**Given** category badges on a post
**When** viewing the badges
**Then** badges should have a transparent background
**And** should have a visible border
**And** should use text-secondary color

#### Scenario: Badge hover shows accent styling

**Given** a category badge
**When** hovering over the badge
**Then** the border and text should transition to the accent gold color

---

### Requirement: Generous Reading Spacing

The layout MUST provide generous whitespace and optimal reading width to reduce cognitive load.

#### Scenario: Article content has optimal width

**Given** an article page
**When** viewing on desktop
**Then** the content should be constrained to approximately 680px max-width
**And** should be centered on the page

#### Scenario: Elements have comfortable spacing

**Given** multiple posts in the home page list
**When** viewing the list
**Then** there should be generous spacing between post cards
**And** spacing should feel relaxed, not cramped

---

## MODIFIED Requirements

### Requirement: Dark Mode Code Blocks

Code blocks in dark mode MUST use warm syntax highlighting colors that match the overall warm aesthetic.

#### Scenario: Code block background matches warm palette

**Given** a code block in an article
**When** viewing in dark mode
**Then** the background should use the elevated surface color (#241f1a)
**And** should have subtle border and rounded corners

#### Scenario: Syntax colors use warm tones

**Given** syntax-highlighted code
**When** viewing in dark mode
**Then** keywords should use gold tones
**And** strings should use sage green
**And** comments should use muted tertiary color
**And** overall palette should feel warm, not cold

---

### Requirement: Accessible Focus States

All interactive elements MUST have visible focus states using the accent color for keyboard navigation accessibility.

#### Scenario: Focus ring uses accent color

**Given** any interactive element (link, button, input)
**When** the element receives keyboard focus
**Then** a visible focus ring should appear
**And** the ring should use the accent gold color
**And** should have adequate offset from the element

#### Scenario: Reduced motion is respected

**Given** the user has `prefers-reduced-motion` enabled
**When** interacting with the page
**Then** all animations and transitions should be disabled or minimal
