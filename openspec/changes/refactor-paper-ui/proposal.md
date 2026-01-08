# Proposal: Refactor Paper UI

**Change ID:** `refactor-paper-ui`
**Status:** Draft
**Author:** Claude
**Date:** 2026-01-08

## Summary

Refactor the blog UI to embody a paper-like, elegant aesthetic with intentional spacing based on the golden ratio (φ ≈ 1.618). Every pixel should feel deliberate. The design will rely heavily on Tailwind CSS classes rather than custom inline CSS.

## Motivation

The current UI is functional but lacks the refined, paper-like quality that evokes reading a beautifully typeset book or magazine. By applying golden ratio principles to spacing, margins, and proportions, we can create a more harmonious visual rhythm that feels both elegant and intentional.

### Golden Ratio Principles

The golden ratio (1.618:1) creates naturally pleasing proportions found in classical typography, architecture, and art. We'll apply it to:

- **Vertical rhythm**: Spacing between elements follows φ-based progression
- **Content width**: Optimal reading width balanced with whitespace
- **Component proportions**: Header, cards, badges sized harmoniously
- **Typography**: Line heights and font scaling

### Tailwind CSS 4 Custom Spacing

We'll extend Tailwind's theme with golden ratio spacing values using CSS variables in `globals.css` and the `@theme` directive, keeping all styling in Tailwind classes.

## Goals

1. **Paper aesthetic**: Clean, cream-toned surfaces with subtle texture hints
2. **Golden ratio spacing**: φ-based spacing scale (8, 13, 21, 34, 55, 89px)
3. **Intentional whitespace**: Generous margins that breathe
4. **Typography refinement**: Optimal line lengths and vertical rhythm
5. **Tailwind-first**: Minimize custom CSS, maximize utility classes

## Non-Goals

- Adding new features or functionality
- Changing the content structure or routing
- Modifying the dark theme palette (only adjusting spacing/proportions)
- Adding animations or complex interactions

## Design Philosophy

### Paper Metaphor

- **Light mode**: Warm cream (#FDFBF7) like aged paper, soft shadows
- **Dark mode**: Maintain "Literary Nightfall" warmth with paper-like depth
- **Borders**: Subtle, like the edge of a page
- **Shadows**: Soft and diffuse, suggesting depth without harshness

### Golden Ratio Spacing Scale

```
φ⁰ = 8px   (base)
φ¹ = 13px  (8 × 1.618 ≈ 13)
φ² = 21px  (13 × 1.618 ≈ 21)
φ³ = 34px  (21 × 1.618 ≈ 34)
φ⁴ = 55px  (34 × 1.618 ≈ 55)
φ⁵ = 89px  (55 × 1.618 ≈ 89)
```

Mapped to Tailwind custom values: `golden-1` through `golden-6`

### Typography Refinement

- **Prose width**: 65-75 characters (optimal reading)
- **Line height**: 1.618 (golden ratio) for body text
- **Heading scale**: Based on φ multiplier
- **Paragraph spacing**: φ² (21px) between paragraphs

## Scope

### Files Modified

| File | Changes |
|------|---------|
| `src/app/globals.css` | Golden ratio spacing vars, paper colors, typography refinement |
| `src/app/layout.tsx` | Adjust container and main spacing with golden classes |
| `src/app/page.tsx` | Apply golden spacing to post list |
| `src/app/posts/[slug]/page.tsx` | Refine article typography and spacing |
| `src/app/about/page.tsx` | Apply consistent golden spacing |
| `src/app/categories/page.tsx` | Apply golden spacing to category grid |
| `src/app/categories/[slug]/page.tsx` | Match category page styling |
| `src/components/Header.tsx` | Refine header proportions |
| `src/components/Footer.tsx` | Balance footer with header |
| `src/components/PostCard.tsx` | Apply golden spacing within cards |
| `src/components/CategoryBadge.tsx` | Harmonize badge proportions |

### No New Files

All changes will be to existing files. No new components or utilities needed.

## Technical Approach

### 1. CSS Custom Properties for Golden Scale

Add to `globals.css` within `@theme inline`:
```css
@theme inline {
  /* Golden ratio spacing scale */
  --spacing-golden-1: 8px;
  --spacing-golden-2: 13px;
  --spacing-golden-3: 21px;
  --spacing-golden-4: 34px;
  --spacing-golden-5: 55px;
  --spacing-golden-6: 89px;
}
```

This enables Tailwind classes like `p-golden-3`, `mt-golden-4`, etc.

### 2. Paper Color Palette

Warm the light mode background:
```css
:root {
  --color-bg-deep: #FDFBF7;      /* Warm paper cream */
  --color-bg-surface: #FAF8F3;   /* Slightly darker cream */
  --color-bg-elevated: #F5F3EE;  /* Card backgrounds */
}
```

### 3. Component Refactoring

Replace arbitrary spacing values with golden scale:
- `mt-3` → `mt-golden-2` (13px)
- `mt-12` → `mt-golden-5` (55px)
- `py-8` → `py-golden-4` (34px)
- `gap-6` → `gap-golden-3` (21px)

### 4. Typography Tuning

- Set prose line-height to 1.618
- Adjust heading margins to follow vertical rhythm
- Ensure optimal character width (65ch max)

## Visual Changes Summary

| Element | Before | After |
|---------|--------|-------|
| Background (light) | Pure white #fff | Warm cream #FDFBF7 |
| Content width | max-w-3xl (48rem) | max-w-[680px] (optimal 65-75ch) |
| Header height | h-14 (56px) | h-[55px] (φ⁴) |
| Section spacing | mt-12 (48px) | mt-golden-5 (55px) |
| Paragraph gap | mt-3 (12px) | mt-golden-2 (13px) |
| Card gap | space-y-12 | space-y-golden-5 |

## Success Criteria

1. All spacing values use golden ratio scale (no arbitrary pixel values)
2. Light mode feels like reading on quality paper
3. Dark mode maintains warmth with improved spacing
4. No custom inline styles—all Tailwind utility classes
5. Visual rhythm feels harmonious and intentional

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Golden spacing too rigid | Allow mixing with standard Tailwind for fine-tuning |
| Paper colors too warm | Test across multiple monitors, keep subtle |
| Breaking mobile responsiveness | Test at all breakpoints, adjust as needed |

## Open Questions

None currently. The scope is well-defined as a visual refinement pass.

## Related Changes

- `modernize-dark-design` - Established Literary Nightfall theme (completed)
- This change builds on that foundation with refined spacing

## Timeline

Single implementation pass with incremental commits per component area.
