# Design: Convert Custom CSS to Tailwind CSS v4 Equivalents

## Architecture Decision Records

### ADR-1: Keep CSS Variables in :root/.dark, Reference via @theme

**Context**: The project defines theme colors as CSS variables in `:root` and `.dark` selectors. Tailwind v4 introduces `@theme` for defining design tokens.

**Decision**: Keep CSS variable definitions in `:root/.dark` for dark mode toggling, but ALSO reference them in `@theme` for utility generation.

**Rationale**:
- `next-themes` toggles the `.dark` class on `<html>`
- CSS variables automatically update when `.dark` is added/removed
- `@theme` generates utility classes like `text-bg-deep` alongside `text-(--color-bg-deep)`
- This gives us both: automatic dark mode AND cleaner utility syntax

**Pattern**:
```css
/* Define variables (existing) */
:root {
  --color-bg-deep: #f4f1e8;
}
.dark {
  --color-bg-deep: #0a0908;
}

/* Reference in @theme (new) */
@theme inline {
  --color-bg-deep: var(--color-bg-deep);
  --color-text-primary: var(--color-text-primary);
  /* ... */
}
```

### ADR-2: Move Body Styles to layout.tsx

**Context**: `body` selector in CSS defines base colors and transitions.

**Decision**: Move body styling to the `<body>` element in `layout.tsx` using Tailwind utilities.

**Rationale**:
- Tailwind utilities are co-located with markup
- Easier to trace styling origin
- Eliminates a CSS selector entirely

**Before** (globals.css):
```css
body {
  background-color: var(--color-bg-deep);
  color: var(--color-text-primary);
  transition: background-color var(--transition-base), color var(--transition-base);
  font-size: 18px;
}
```

**After** (layout.tsx):
```tsx
<body className="bg-(--color-bg-deep) text-(--color-text-primary) transition-colors duration-200 text-lg">
```

### ADR-3: Use @variant for Dark Mode Component Styles

**Context**: Terminal window has `.dark .terminal-*` selectors for dark mode specific styles.

**Decision**: Use `@variant dark { }` blocks instead of duplicate selectors.

**Rationale**:
- Cleaner grouping of variant-specific styles
- Matches v4 idioms
- Easier to maintain (styles grouped together)

**Before**:
```css
.terminal-window {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.dark .terminal-window {
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
}
```

**After**:
```css
.terminal-window {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  @variant dark {
    box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  }
}
```

### ADR-4: Define Traffic Light Colors in @theme

**Context**: Terminal window has hardcoded hex colors for traffic light dots.

**Decision**: Define these colors in `@theme` as semantic tokens.

**Rationale**:
- Enables utility class usage: `bg-terminal-dot-red`
- Centralizes color definitions
- Makes theming more systematic

**Pattern**:
```css
@theme inline {
  /* Traffic light dots - light mode */
  --color-terminal-red: #c4a08a;
  --color-terminal-yellow: #c9b896;
  --color-terminal-green: #a8b89a;

  /* Traffic light dots - hover */
  --color-terminal-red-active: #e8655a;
  /* ... */
}
```

### ADR-5: Preserve Prose Plugin Variable Overrides

**Context**: `.prose` class has extensive CSS variable overrides for `@tailwindcss/typography`.

**Decision**: Keep these as CSS (do NOT convert to utilities).

**Rationale**:
- This is the official way to customize the typography plugin
- Variables like `--tw-prose-body` are internal to the plugin
- Converting would require forking/patching the plugin

### ADR-6: Keep Complex Pseudo-Elements as CSS

**Context**: `body::before` creates paper texture overlay, `::selection` styles text selection.

**Decision**: Keep as CSS (cannot be converted to utilities).

**Rationale**:
- Tailwind utilities cannot target `::before`, `::selection`
- These require CSS pseudo-element selectors
- `@apply` can be used inside these if needed

## File Impact Summary

| File | Change Type | Impact |
|------|-------------|--------|
| `globals.css` | Modify | Remove body styles, add @theme colors, use @variant |
| `layout.tsx` | Modify | Add body Tailwind classes |
| No other files | - | Component files already use correct v4 syntax |

## Estimated CSS Reduction

| Metric | Before | After |
|--------|--------|-------|
| globals.css lines | 446 | ~380 |
| CSS selectors | ~45 | ~35 |
| `!important` usage | 6 | 3 |

## Non-Goals

- Changing any visual appearance
- Refactoring component architecture
- Adding new features
- Changing the color palette
- Modifying spacing values
