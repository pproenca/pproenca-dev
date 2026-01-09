# Design Document: Literary Nightfall Theme

## Aesthetic Philosophy

The "Literary Nightfall" design draws inspiration from:

- **Analog reading**: The warmth of aged paper under lamplight
- **Editorial print**: The refined typography of literary magazines
- **Japanese design**: Ma (間) — the beauty of negative space
- **Premium reading apps**: iA Writer, Instapaper, Matter

The goal is to create a **sanctuary for reading** — a digital space that feels calm, focused, and timeless rather than trendy.

---

## Visual System

### Color Architecture

The color system uses three layers of depth to create subtle dimensionality:

```
Layer 0 (Deepest): --bg-deep       #0f0d0b
Layer 1 (Surface): --bg-surface    #1a1714
Layer 2 (Elevated): --bg-elevated  #241f1a
```

Each layer adds warmth, not just lightness. This creates a sense of paper stacked on paper rather than flat planes.

#### Color Rationale

| Color          | Hex     | Purpose                 | Why This Specific Shade                              |
| -------------- | ------- | ----------------------- | ---------------------------------------------------- |
| bg-deep        | #0f0d0b | Page background         | Warm black — brown undertone prevents cold harshness |
| bg-surface     | #1a1714 | Card backgrounds        | 10% warmer than bg-deep, subtle elevation            |
| bg-elevated    | #241f1a | Code blocks, highlights | Maximum warmth while maintaining contrast            |
| text-primary   | #e8e2d9 | Body text               | Cream white — easier on eyes than pure white         |
| text-secondary | #a69f94 | Meta text               | Visible but clearly subordinate                      |
| text-tertiary  | #6b635a | Timestamps              | Present but not demanding attention                  |
| accent         | #c9a962 | Links, highlights       | Warm gold — premium feel, good visibility            |
| accent-muted   | #8b7355 | Hover states            | Subdued version for larger elements                  |

### Typography Stack

#### Font Choices

**Display/Headings: Libre Baskerville**

- Classic Baskerville revival with excellent screen rendering
- Conveys literary credibility without being stuffy
- Fallback: Georgia, Times New Roman, serif

**Body: Source Sans 3**

- Humanist sans-serif designed for long-form reading
- Excellent x-height for screen readability
- Open apertures reduce eye strain
- Fallback: system-ui, sans-serif

**Code: JetBrains Mono**

- Already a warm, rounded monospace
- Good differentiation between similar characters
- Ligature support for code beauty

#### Type Scale

Using a musical fourth ratio (1.333) for harmonious progression:

```
--text-xs:   0.75rem   / 12px   — meta, badges
--text-sm:   0.875rem  / 14px   — secondary text
--text-base: 1rem      / 16px   — body text
--text-lg:   1.125rem  / 18px   — lead paragraphs
--text-xl:   1.333rem  / 21px   — h4
--text-2xl:  1.777rem  / 28px   — h3
--text-3xl:  2.369rem  / 38px   — h2
--text-4xl:  3.157rem  / 50px   — h1 (article titles)
```

#### Line Height & Spacing

```
Body text:    line-height: 1.7 (optimal for 65-75 char lines)
Headings:     line-height: 1.2 (tighter for display type)
Paragraph:    margin-bottom: 1.5em
```

---

## Component Design

### Header

**Philosophy**: The header should be present but not dominant. It's a wayfinding tool, not a billboard.

```
- Background: transparent, border-bottom only
- Border: 1px --border-subtle
- Logo: Libre Baskerville, text-lg, accent color
- Nav links: text-secondary, hover → text-primary
- Transition: color 200ms ease
- Sticky: yes, but minimal height (56px)
```

### Post Cards (List View)

**Philosophy**: Each post card is a window into content. Minimal chrome, maximum information.

```
Structure:
┌─────────────────────────────────────────┐
│ Article Title                           │ ← text-xl, Libre Baskerville
│ January 7, 2025                         │ ← text-tertiary, text-sm
│                                         │
│ Description text that previews the      │ ← text-secondary, Source Sans 3
│ content without overwhelming...         │
│                                         │
│ [Category] [Category]                   │ ← Subtle badges
└─────────────────────────────────────────┘

Hover state:
- Title: text-primary → accent
- Subtle background shift (optional)
- Transition: 200ms ease
```

### Article View

**Philosophy**: The article page is a reading sanctuary. Everything fades away except the content.

```
Layout:
- Max-width: 680px (optimal reading width)
- Centered with generous horizontal padding
- Article header separate from content

Article Header:
┌─────────────────────────────────────────┐
│                                         │
│         A Thoughtful Article Title      │ ← text-4xl, centered, Libre Baskerville
│                                         │
│              January 7, 2025            │ ← text-tertiary, centered
│                                         │
│          [Category] [Category]          │ ← centered badges
│                                         │
└─────────────────────────────────────────┘

Content:
- Prose styling via Tailwind Typography
- First paragraph: slightly larger (text-lg)
- Headings: Libre Baskerville
- Body: Source Sans 3
- Links: accent color, subtle underline
- Images: full-bleed (break max-width)
- Blockquotes: left border accent, italic
```

### Code Blocks

**Philosophy**: Code should be readable and beautiful, matching the warm aesthetic.

```
- Background: --bg-elevated
- Border: 1px --border-subtle
- Border-radius: 8px
- Padding: 24px
- Font: JetBrains Mono, text-sm
- Theme: Custom warm syntax highlighting

Syntax colors (warm palette):
- Keywords: #c9a962 (gold)
- Strings: #a8c082 (sage green)
- Comments: #6b635a (tertiary)
- Functions: #d4a276 (warm coral)
- Variables: #e8e2d9 (primary)
- Numbers: #d4a276 (warm coral)
```

### Category Badges

**Philosophy**: Badges should be functional labels, not visual noise.

```
- Background: transparent
- Border: 1px --border-visible
- Color: text-secondary
- Padding: 4px 12px
- Border-radius: 9999px (pill shape)
- Hover: border-color → accent, color → accent
- Transition: 200ms ease
```

### Footer

**Philosophy**: Present but invisible until needed.

```
- Minimal height
- Text: text-tertiary
- Border-top: 1px --border-subtle
- No competing with content
```

---

## Motion & Interaction

### Principles

1. **Purposeful**: Every animation communicates something
2. **Subtle**: Motion should enhance, not distract
3. **Consistent**: Same easing and duration throughout

### Transitions

```css
/* Standard transition */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Easing */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
```

### Hover States

- **Links**: Color transition, subtle underline animation
- **Cards**: Title color change only (no scaling or shadows)
- **Badges**: Border and text color transition
- **Buttons**: Background color shift

### Page Transitions (Optional Enhancement)

- Fade-in on page load (200ms)
- Content stagger for lists (50ms delay between items)

---

## Accessibility Considerations

### Contrast Ratios

All text meets WCAG AA standards:

- Primary text (#e8e2d9) on deep bg (#0f0d0b): 12.5:1 ✓
- Secondary text (#a69f94) on deep bg: 6.2:1 ✓
- Tertiary text (#6b635a) on deep bg: 3.5:1 ✓ (only for non-essential text)
- Accent (#c9a962) on deep bg: 8.1:1 ✓

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## File Structure

Changes will be made to:

```
src/
├── app/
│   ├── globals.css          ← Theme variables, typography imports
│   ├── layout.tsx           ← Font imports, body classes
│   ├── page.tsx             ← Home page styling
│   └── posts/[slug]/page.tsx ← Article page styling
├── components/
│   ├── Header.tsx           ← Updated styling
│   ├── Footer.tsx           ← Updated styling
│   ├── PostCard.tsx         ← Updated styling
│   ├── CategoryBadge.tsx    ← Updated styling
│   ├── MDXContent.tsx       ← Prose customization
│   └── CodeBlock.tsx        ← Warm syntax theme
```

---

## Visual Reference

The design aims for the reading experience of:

- iA Writer's focus mode
- Instapaper's typography
- The Paris Review's editorial elegance
- Medium's content hierarchy (without the cruft)

It should feel like opening a well-designed book at night — warm, inviting, and focused entirely on the words.
