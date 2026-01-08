# Tasks: Convert Custom CSS to Tailwind CSS v4 Equivalents

## Pre-Implementation

- [ ] **T0: Capture baseline screenshots**
  - Take screenshots of: home page, post page, about page (both light/dark modes)
  - Save to `docs/visual-regression/before/`
  - These will be compared after implementation

## Phase 1: Theme Token Migration

- [ ] **T1: Extend @theme with color tokens**
  - Add color references to existing `@theme inline` block in globals.css
  - Define: `--color-bg-deep`, `--color-bg-surface`, `--color-bg-elevated`
  - Define: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
  - Define: `--color-accent`, `--color-accent-muted`
  - Define: `--color-border-subtle`, `--color-border-visible`
  - Verify: `npm run build` passes

- [ ] **T2: Define terminal dot colors in @theme**
  - Add to `@theme inline`:
    - `--color-terminal-red`, `--color-terminal-yellow`, `--color-terminal-green`
    - Dark variants (reuse existing hex values)
    - Hover/active variants
  - No visual change expected

## Phase 2: Body Styles Migration

- [ ] **T3: Move body styles to layout.tsx**
  - Add to `<body>` element:
    - `bg-(--color-bg-deep)`
    - `text-(--color-text-primary)`
    - `transition-colors`
    - `duration-200`
  - Remove from globals.css:
    - `background-color: var(--color-bg-deep)`
    - `color: var(--color-text-primary)`
    - `transition: background-color...`
  - Keep `font-size: 18px` (handled by prose)
  - Verify: Theme toggle still works

## Phase 3: Terminal Component Refactor

- [ ] **T4: Convert terminal dark mode to @variant**
  - Replace `.dark .terminal-window` with `@variant dark` inside `.terminal-window`
  - Replace `.dark .terminal-header` with `@variant dark` inside `.terminal-header`
  - Replace `.dark .terminal-dot-*` with `@variant dark` inside each dot class
  - Replace `.dark .terminal-window:hover .terminal-dot-*` patterns
  - Verify: Dark mode code blocks render correctly

- [ ] **T5: Use @theme colors for traffic dots**
  - Replace hardcoded hex in `.terminal-dot-red/yellow/green`
  - Reference `var(--color-terminal-*)` from @theme
  - Verify: Dots display correctly in both themes

## Phase 4: Prose Spacing Optimization

- [ ] **T6: Convert prose spacing where possible**
  - Evaluate `.prose > * + *` → Can use `space-y-golden-3`? (may conflict with prose)
  - Keep prose variable overrides as-is
  - Document decision in code comments

## Phase 5: Component File Migration

- [ ] **T7: Update Header.tsx**
  - Convert 8 utility refs: `text-(--color-*)` → `text-*`, `bg-(--color-*)` → `bg-*`, `border-(--color-*)` → `border-*`

- [ ] **T8: Update ThemeToggle.tsx**
  - Convert 2 utility refs

- [ ] **T9: Update PostCard.tsx**
  - Convert 3 utility refs

- [ ] **T10: Update CategoryBadge.tsx**
  - Convert 4 utility refs

- [ ] **T11: Update MDXContent.tsx**
  - Convert 1 utility ref

- [ ] **T12: Update Footer.tsx**
  - Convert 2 utility refs

- [ ] **T13: Update page.tsx**
  - Convert 3 utility refs

- [ ] **T14: Update about/page.tsx**
  - Convert 1 utility ref

- [ ] **T15: Update posts/[slug]/page.tsx**
  - Convert 4 utility refs

- [ ] **T16: Update categories/page.tsx**
  - Convert 6 utility refs

- [ ] **T17: Update categories/[slug]/page.tsx**
  - Convert 3 utility refs

## Phase 6: Cleanup

- [ ] **T18: Remove redundant selectors**
  - Identify duplicate `.dark` selectors now handled by `@variant`
  - Remove empty or unnecessary rules
  - Verify build passes

- [ ] **T19: Add code comments**
  - Document sections that must remain as CSS (pseudo-elements, media queries)
  - Add `/* Required: ... */` comments explaining rationale

## Verification

- [ ] **T20: Visual regression testing**
  - Take after screenshots: home, post, about (light/dark)
  - Compare with `docs/visual-regression/before/`
  - Ensure pixel-perfect match or document acceptable differences

- [ ] **T21: Cross-browser testing**
  - Test in Chrome, Firefox, Safari
  - Verify dark mode toggle
  - Verify code block rendering

- [ ] **T22: Build verification**
  - `npm run build` succeeds
  - `npm run lint` passes
  - No console warnings

## Rollback Plan

If visual regression detected:
1. Revert globals.css changes
2. Revert layout.tsx changes
3. Investigate specific failing rule
4. Fix and re-test incrementally
