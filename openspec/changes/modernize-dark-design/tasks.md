# Tasks: Modernize Dark Design

## Overview

Implementation tasks for the "Literary Nightfall" dark mode redesign. Tasks are ordered for logical progression — foundation first, then components.

---

## Task 1: Set Up Typography

- [x] Complete

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Work:**

1. Import Libre Baskerville (400, 700) and Source Sans 3 (400, 600) from Google Fonts using Next.js font optimization
2. Keep JetBrains Mono or add it if not present for code
3. Define CSS custom properties for font families
4. Set up font-feature-settings for optimal rendering

**Validation:**

- Fonts load without FOUT (flash of unstyled text)
- No CLS (cumulative layout shift) from font loading
- DevTools Network tab shows fonts loading from optimized Google Fonts CDN

---

## Task 2: Define Color System

- [x] Complete

**Files:**

- Modify: `src/app/globals.css`

**Work:**

1. Add CSS custom properties for the warm dark color palette under a `[data-theme="dark"]` or `.dark` selector
2. Define all colors from design.md:
   - Background layers (deep, surface, elevated)
   - Text hierarchy (primary, secondary, tertiary)
   - Accent colors (accent, accent-muted)
   - Border colors (subtle, visible)
3. Add transition variables

**Validation:**

- All custom properties accessible via `var(--property-name)`
- Colors match design specification hex values exactly
- Inspector shows correct computed values

---

## Task 3: Update Layout Shell

- [x] Complete

**Files:**

- Modify: `src/app/layout.tsx`

**Work:**

1. Update body classes to use new color variables
2. Apply Source Sans 3 as default body font
3. Set base text color and background using CSS variables
4. Ensure proper dark mode class application

**Validation:**

- Page background is warm dark (#0f0d0b)
- Default text is cream (#e8e2d9)
- No flash of light mode on page load

---

## Task 4: Restyle Header Component

- [x] Complete

**Files:**

- Modify: `src/components/Header.tsx`

**Work:**

1. Update background to transparent
2. Apply subtle border using new border-subtle variable
3. Style logo with Libre Baskerville and accent color
4. Update nav links: text-secondary default, text-primary on hover
5. Add smooth color transitions (200ms ease)
6. Make header sticky with minimal height (56px)

**Validation:**

- Header blends with page background
- Logo uses accent gold color
- Hover transitions are smooth
- Header is sticky on scroll

---

## Task 5: Restyle Footer Component

- [x] Complete

**Files:**

- Modify: `src/components/Footer.tsx`

**Work:**

1. Apply border-subtle for top border
2. Use text-tertiary for footer text
3. Reduce visual prominence
4. Maintain centered layout

**Validation:**

- Footer is visually minimal
- Text is subtle but readable
- Border matches design system

---

## Task 6: Restyle CategoryBadge Component

- [x] Complete

**Files:**

- Modify: `src/components/CategoryBadge.tsx`

**Work:**

1. Change from filled background to bordered style
2. Apply transparent background with border-visible border
3. Use text-secondary for text color
4. Add hover state: border and text transition to accent color
5. Apply 200ms transition

**Validation:**

- Badges appear as outlined pills
- Hover shows gold accent color
- Transitions are smooth

---

## Task 7: Restyle PostCard Component

- [x] Complete

**Files:**

- Modify: `src/components/PostCard.tsx`

**Work:**

1. Apply Libre Baskerville to post titles
2. Style title with text-primary, hover with accent
3. Apply text-tertiary to date
4. Apply text-secondary to description
5. Add subtle hover transition on title
6. Increase spacing between elements

**Validation:**

- Title uses serif font
- Color hierarchy is visible (primary → secondary → tertiary)
- Hover shows warm gold accent
- Spacing feels generous

---

## Task 8: Update Home Page

- [x] Complete

**Files:**

- Modify: `src/app/page.tsx`

**Work:**

1. Apply Libre Baskerville to page heading
2. Update text colors using design system
3. Increase spacing between post cards
4. Add subtle stagger animation for post list (optional)

**Validation:**

- Heading uses serif font
- Colors match design system
- Posts have comfortable spacing

---

## Task 9: Restyle Article Page

- [x] Complete

**Files:**

- Modify: `src/app/posts/[slug]/page.tsx`

**Work:**

1. Center article header content
2. Apply larger title size (text-4xl) with Libre Baskerville
3. Center date and category badges
4. Add generous spacing above article content
5. Apply optimal max-width for reading

**Validation:**

- Article header is centered and prominent
- Title is large and uses serif font
- Good visual separation between header and content

---

## Task 10: Customize Prose Typography

- [x] Complete

**Files:**

- Modify: `src/app/globals.css`
- Modify: `src/components/MDXContent.tsx`

**Work:**

1. Override Tailwind Typography prose colors for dark mode
2. Apply Libre Baskerville to prose headings
3. Set optimal line-height (1.7) for body text
4. Style links with accent color and subtle underline
5. Style blockquotes with left border in accent color
6. Style inline code with bg-elevated
7. Increase paragraph spacing

**Validation:**

- Prose headings use serif font
- Body text has comfortable line height
- Links are gold with underline
- Blockquotes have accent left border

---

## Task 11: Create Warm Code Theme

- [x] Complete

**Files:**

- Modify: `src/lib/shiki.ts`
- Modify: `src/components/CodeBlock.tsx`
- Modify: `src/app/globals.css`

**Work:**

1. Configure Shiki with a warm custom theme or modify existing
2. Apply bg-elevated as code block background
3. Style code blocks with proper padding, border-radius, and border
4. Adjust syntax colors to match warm palette:
   - Keywords: gold (#c9a962)
   - Strings: sage (#a8c082)
   - Comments: tertiary (#6b635a)
   - Functions: coral (#d4a276)

**Validation:**

- Code blocks have warm background
- Syntax colors match warm palette
- Code is readable and beautiful

---

## Task 12: Add Focus States & Accessibility

- [x] Complete

**Files:**

- Modify: `src/app/globals.css`

**Work:**

1. Add global `:focus-visible` styling with accent outline
2. Add reduced-motion media query
3. Verify all interactive elements have visible focus states

**Validation:**

- Tab through page shows clear focus indicators
- Focus ring uses accent color
- With `prefers-reduced-motion`, transitions are disabled

---

## Task 13: Final Polish & Testing

- [x] Complete

**Files:**

- All modified files

**Work:**

1. Verify all colors match design spec
2. Check contrast ratios meet WCAG AA
3. Test on different screen sizes
4. Check for any remaining gray-\* classes that need updating
5. Verify smooth transitions throughout
6. Test light mode still works (though not focus of this change)

**Validation:**

- Visual consistency throughout site
- No jarring color mismatches
- All transitions smooth
- Accessibility requirements met

---

## Dependencies

```
Task 1 (Typography) → Task 4, 7, 8, 9, 10 (components that use fonts)
Task 2 (Colors) → Task 3, 4, 5, 6, 7, 8, 9, 10, 11 (all styling tasks)
Task 3 (Layout) → Task 4, 5 (Header, Footer)
Tasks 4-11 can be parallelized after Tasks 1-3
Task 12, 13 should be done last
```

## Parallelizable Groups

**Group 1 (Sequential - Foundation):**

- Task 1: Typography
- Task 2: Colors
- Task 3: Layout

**Group 2 (Parallel - Components):**

- Task 4: Header
- Task 5: Footer
- Task 6: CategoryBadge
- Task 7: PostCard

**Group 3 (Parallel - Pages):**

- Task 8: Home Page
- Task 9: Article Page

**Group 4 (Sequential - Content):**

- Task 10: Prose Typography
- Task 11: Code Theme

**Group 5 (Final):**

- Task 12: Accessibility
- Task 13: Polish
