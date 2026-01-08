# Proposal: Convert Custom CSS to Tailwind CSS v4 Equivalents

## Summary

Comprehensive audit and migration of custom CSS in `globals.css` to Tailwind CSS v4 native patterns. This preserves visual identity while improving maintainability, reducing CSS specificity conflicts, and leveraging v4's new `@theme`, `@utility`, and `@variant` directives.

## Current State Analysis

### globals.css Breakdown (446 lines)

| Section | Lines | Can Convert | Strategy |
|---------|-------|-------------|----------|
| Tailwind v4 setup | 1-21 | N/A | Already v4 compliant |
| CSS variables (:root/.dark) | 23-71 | Partial | Define in `@theme` |
| Body styles | 73-91 | Yes | Move to layout.tsx |
| Prose overrides | 93-193 | Partial | Keep prose vars, refactor selectors |
| Code blocks | 195-221 | Minimal | Keep (Shiki integration) |
| Terminal window | 223-412 | Partial | Use `@variant dark`, define colors in `@theme` |
| Focus/Accessibility | 414-446 | Minimal | Keep (pseudo-selectors) |

### What CAN Be Converted

1. **Body base styles** (lines 74-78)
   - `background-color` → `bg-(--color-bg-deep)` on `<body>`
   - `color` → `text-(--color-text-primary)` on `<body>`
   - `transition` → `transition-colors duration-200`

2. **Theme colors** → Define in `@theme` block
   - Currently: CSS variables in `:root` and `.dark`
   - After: `@theme` tokens with automatic utility generation

3. **Terminal dark mode styles** (lines 238-257)
   - Currently: `.dark .terminal-*` selectors
   - After: Use `@variant dark { }` blocks

4. **Traffic dot colors** (lines 289-344)
   - Currently: Hardcoded hex in CSS
   - After: Define in `@theme` for utility class generation

5. **Prose element spacing** (lines 131-143)
   - Currently: CSS selectors with `var(--spacing-golden-*)`
   - After: Tailwind `space-y-golden-*` utilities

### What MUST Remain as Custom CSS

1. **`body::before` paper texture** - Complex pseudo-element with SVG background
2. **Prose plugin variable overrides** - This is how `@tailwindcss/typography` is customized
3. **`::selection` styling** - Pseudo-element requires CSS
4. **`:focus-visible`** - Browser pseudo-class
5. **`@media (prefers-reduced-motion)`** - Media query for accessibility
6. **Complex box-shadows** - Multi-layer shadows with hover states
7. **Shiki integration overrides** - Required for syntax highlighting

## Motivation

1. **DX improvement**: Tailwind utilities are scannable in component code
2. **Reduced specificity wars**: Moving styles to utilities avoids `!important`
3. **Better tree-shaking**: Unused utilities are purged automatically
4. **v4 feature adoption**: `@theme`, `@variant`, `@utility` are purpose-built for this
5. **Consistency**: Fewer paradigms (CSS + utilities → mostly utilities)

## Risk Assessment

**Risk Level**: Low-Medium

- **Low risk**: Body styles, spacing utilities, color definitions
- **Medium risk**: Terminal component (complex hover/dark states)
- **Mitigation**: Visual regression testing via screenshots before/after

## Visual Parity Guarantee

This proposal explicitly maintains visual identity:
- No color value changes
- No spacing changes
- No typography changes
- Before/after screenshot comparison required

## References

- [Tailwind v4 @theme directive](https://tailwindcss.com/docs/functions-and-directives#theme)
- [Tailwind v4 @variant directive](https://tailwindcss.com/docs/functions-and-directives#variant)
- [Tailwind v4 @utility directive](https://tailwindcss.com/docs/functions-and-directives#utility)
