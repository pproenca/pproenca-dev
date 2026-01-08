# Design: Paper UI with Golden Ratio

## Architectural Overview

This is a CSS/styling refactor with no architectural changes. The existing component structure is maintained; only styling values are modified.

## Golden Ratio Mathematics

### The Fibonacci-Adjacent Scale

The golden ratio φ ≈ 1.618033988749895. Our spacing scale uses rounded Fibonacci numbers which naturally approximate φ relationships:

```
8   × 1.618 = 12.94  → 13
13  × 1.618 = 21.03  → 21
21  × 1.618 = 33.98  → 34
34  × 1.618 = 55.01  → 55
55  × 1.618 = 88.99  → 89
89  × 1.618 = 143.96 → 144 (if needed)
```

This creates visually harmonious relationships where:
- Adjacent values have φ ratio
- Every other value has φ² (≈2.618) ratio
- The scale feels natural, not mechanical

### Why These Specific Values

| Value | Use Case | Rationale |
|-------|----------|-----------|
| 8px | Micro gaps, inline padding | Minimum legible spacing |
| 13px | Small element margins | Comfortable breathing room |
| 21px | Paragraph spacing, card padding | Standard content rhythm |
| 34px | Section margins | Clear separation |
| 55px | Major section breaks | Significant pause |
| 89px | Page-level spacing | Maximum breathing |

## Tailwind CSS 4 Integration

### Custom Spacing with @theme

Tailwind CSS 4 supports extending the theme via CSS using `@theme inline`:

```css
@theme inline {
  --spacing-golden-1: 0.5rem;    /* 8px */
  --spacing-golden-2: 0.8125rem; /* 13px */
  --spacing-golden-3: 1.3125rem; /* 21px */
  --spacing-golden-4: 2.125rem;  /* 34px */
  --spacing-golden-5: 3.4375rem; /* 55px */
  --spacing-golden-6: 5.5625rem; /* 89px */
}
```

This enables utility classes:
- `p-golden-3` → padding: 21px
- `mt-golden-5` → margin-top: 55px
- `gap-golden-2` → gap: 13px

### Alternative: Using Arbitrary Values

If custom theme extension proves complex, we can use Tailwind's arbitrary value syntax:
- `p-[21px]` or `p-[1.3125rem]`
- `mt-[55px]` or `mt-[3.4375rem]`

However, the `@theme` approach is preferred for:
1. Semantic naming (`golden-3` vs `[21px]`)
2. Consistency enforcement
3. Easier maintenance

## Paper Color System

### Light Mode Palette

The paper aesthetic requires warm, off-white tones:

| Variable | Value | Description |
|----------|-------|-------------|
| `--color-bg-deep` | `#FDFBF7` | Primary canvas, like cream paper |
| `--color-bg-surface` | `#FAF8F3` | Secondary surfaces |
| `--color-bg-elevated` | `#F5F3EE` | Cards, code blocks |

### Color Temperature

- Pure white (#FFFFFF) RGB: 255, 255, 255
- Our cream (#FDFBF7) RGB: 253, 251, 247

The 2.6% reduction in blue channel creates warmth without yellowing.

### Dark Mode Unchanged

The "Literary Nightfall" dark palette already has warm undertones. We'll apply the same golden spacing but keep the color values.

## Typography Refinement

### Line Height

Current: Mixed (1.5, 1.7, varies)
Proposed: 1.618 for body text (golden ratio)

```css
.prose p {
  line-height: 1.618;
}
```

### Content Width

The optimal line length for reading is 45-75 characters. At 16px base with our serif font, this translates to approximately 680px.

Current: `max-w-3xl` (768px) - slightly wide
Proposed: `max-w-[680px]` or custom `max-w-prose-golden`

### Heading Scale

Using φ multiplier from base 16px:

| Level | Current | Proposed | Calculation |
|-------|---------|----------|-------------|
| h1 | 36px (text-4xl) | 42px | 16 × φ^1.5 |
| h2 | 30px (text-3xl) | 34px | 16 × φ^1.25 |
| h3 | 24px (text-2xl) | 26px | 16 × φ |
| h4 | 20px (text-xl) | 21px | 16 × φ^0.75 |

We'll keep standard Tailwind sizes but adjust via prose overrides for consistency.

## Component Spacing Mapping

### Header

```
Before: h-14 (56px), px-4 (16px), gap-6 (24px)
After:  h-[55px], px-golden-3 (21px), gap-golden-3 (21px)
```

### Footer

```
Before: py-8 (32px)
After:  py-golden-4 (34px)
```

### Main Content

```
Before: py-8 (32px), px-4 (16px)
After:  py-golden-5 (55px), px-golden-3 (21px)
```

### Post Cards

```
Before: space-y-12 (48px), mt-3 (12px), mt-4 (16px)
After:  space-y-golden-5 (55px), mt-golden-2 (13px), mt-golden-2 (13px)
```

### Category Badges

```
Before: px-3 py-0.5, px-4 py-1, gap-2
After:  px-golden-2 py-[5px], gap-golden-1 (8px)
```

## Implementation Strategy

### Phase 1: Foundation
1. Add golden spacing variables to globals.css
2. Update paper color palette for light mode
3. Set typography line-height

### Phase 2: Layout
4. Refactor layout.tsx container spacing
5. Update Header.tsx proportions
6. Update Footer.tsx proportions

### Phase 3: Pages
7. Refactor page.tsx (home) spacing
8. Refactor posts/[slug]/page.tsx
9. Refactor categories pages
10. Refactor about page

### Phase 4: Components
11. Update PostCard.tsx spacing
12. Update CategoryBadge.tsx proportions

### Phase 5: Prose Refinement
13. Fine-tune prose typography in globals.css

## Trade-offs

### Golden Ratio Purity vs. Practical Constraints

Some elements may need non-golden values:
- Touch targets (minimum 44px for accessibility)
- Border widths (1px is fine)
- Border radius (aesthetic choice)

We'll use golden values where impactful (spacing, margins) and practical values elsewhere.

### Custom CSS vs. Tailwind Classes

The goal is maximum Tailwind usage. Custom CSS in globals.css is acceptable for:
- CSS custom properties (required for theme)
- Prose plugin overrides (simpler than alternatives)
- Complex selectors (.dark variants)

## Verification

### Visual Inspection Points

1. Light mode feels warm, not cold white
2. Spacing has consistent rhythm
3. No cramped or overly spacious areas
4. Typography reads comfortably
5. Dark mode spacing matches light mode

### Technical Checks

1. No inline `style=` attributes
2. No arbitrary px values in components (use golden scale)
3. Build completes without errors
4. Responsive breakpoints still work
