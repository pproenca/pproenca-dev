# UI Design Specification

## ADDED Requirements

### Requirement: Golden Ratio Spacing System

The UI MUST use a golden ratio-based spacing scale for all margins, padding, and gaps.

**Spacing Scale:**

- `golden-1`: 8px (0.5rem)
- `golden-2`: 13px (0.8125rem)
- `golden-3`: 21px (1.3125rem)
- `golden-4`: 34px (2.125rem)
- `golden-5`: 55px (3.4375rem)
- `golden-6`: 89px (5.5625rem)

#### Scenario: Spacing variables are defined

**Given** the globals.css file is loaded
**When** the @theme inline block is parsed
**Then** CSS custom properties `--spacing-golden-1` through `--spacing-golden-6` are available
**And** Tailwind utility classes `p-golden-*`, `m-golden-*`, `gap-golden-*` function correctly

#### Scenario: Component spacing uses golden scale

**Given** a page component is rendered
**When** inspecting the computed styles
**Then** vertical margins between sections use golden scale values (55px, 34px, 21px)
**And** horizontal padding uses golden scale values (21px, 13px)
**And** no arbitrary pixel values outside the golden scale are used for layout spacing

---

### Requirement: Paper Color Palette (Light Mode)

Light mode MUST use warm, paper-like background colors instead of pure white.

**Color Values:**

- Background deep: #FDFBF7 (warm cream)
- Background surface: #FAF8F3 (slightly darker cream)
- Background elevated: #F5F3EE (card backgrounds)

#### Scenario: Light mode displays paper colors

**Given** the user has light mode active
**When** viewing any page
**Then** the page background color is #FDFBF7
**And** elevated elements (cards, code blocks) use #F5F3EE background
**And** the visual impression is warm paper, not cold white

#### Scenario: Dark mode colors are preserved

**Given** the user has dark mode active
**When** viewing any page
**Then** the Literary Nightfall color palette is unchanged
**And** only spacing values are updated to golden scale

---

### Requirement: Golden Typography Line Height

Body text MUST use the golden ratio (1.618) for line height to create optimal reading rhythm.

#### Scenario: Prose paragraphs have golden line height

**Given** a blog post is rendered
**When** inspecting prose paragraph styles
**Then** the line-height is 1.618
**And** the text feels spacious and easy to read

---

## MODIFIED Requirements

### Requirement: Content Width Optimization

The main content area MUST be optimized for comfortable reading (65-75 characters per line).

**Previous:** max-w-3xl (768px)
**Updated:** max-w-[680px] (~70 characters at 16px base)

#### Scenario: Post content has optimal width

**Given** a blog post page is rendered
**When** measuring the article content width
**Then** the maximum width is approximately 680px
**And** line length averages 65-75 characters

---

### Requirement: Header Proportions

The header height and spacing MUST align with the golden ratio scale.

**Previous:** h-14 (56px)
**Updated:** h-[55px] (golden-4)

#### Scenario: Header uses golden height

**Given** the header component is rendered
**When** inspecting the header height
**Then** the height is 55px (golden-4)
**And** internal padding and gaps use golden scale values

---

### Requirement: Tailwind-First Styling

All styling MUST use Tailwind CSS utility classes. Inline styles are prohibited.

#### Scenario: No inline style attributes

**Given** the application is built
**When** scanning component JSX files
**Then** no `style={}` attributes are present
**And** all spacing values are expressed as Tailwind classes

#### Scenario: CSS variables are used via Tailwind

**Given** a component needs theme-aware colors
**When** applying the color
**Then** it uses `text-[var(--color-*)]` or similar Tailwind arbitrary value syntax
**And** no raw hex colors are hardcoded in components
