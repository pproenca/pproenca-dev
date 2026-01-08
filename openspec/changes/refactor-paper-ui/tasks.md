# Tasks: Refactor Paper UI

## Implementation Checklist

### Phase 1: Foundation (globals.css)

- [x] **Task 1: Add golden ratio spacing variables**
  - Add `--spacing-golden-{1-6}` CSS custom properties in `@theme inline`
  - Values: 8px, 13px, 21px, 34px, 55px, 89px (Fibonacci/golden)
  - Enables Tailwind classes: `p-golden-3`, `mt-golden-5`, etc.

- [x] **Task 2: Update paper color palette (light mode)**
  - Change `--color-bg-deep` from `#ffffff` to `#FDFBF7` (warm cream)
  - Change `--color-bg-surface` from `#f9fafb` to `#FAF8F3`
  - Change `--color-bg-elevated` from `#f3f4f6` to `#F5F3EE`
  - Keep dark mode colors unchanged (already warm)

- [x] **Task 3: Refine prose typography**
  - Set `.prose p` line-height to 1.618 (golden ratio)
  - Ensure heading margins use golden spacing rhythm
  - Verify blockquote and list styling

### Phase 2: Layout Structure

- [x] **Task 4: Refactor layout.tsx**
  - Update main container: `py-8 px-4` → golden equivalents
  - Consider `py-golden-5` (55px) and `px-golden-3` (21px)
  - Ensure content width remains optimal (~680px)

- [x] **Task 5: Refactor Header.tsx**
  - Update height: `h-14` (56px) → `h-[55px]` (golden-4)
  - Update horizontal padding and nav gaps to golden scale
  - Maintain sticky positioning and blur effect

- [x] **Task 6: Refactor Footer.tsx**
  - Update vertical padding: `py-8` → `py-golden-4` (34px)
  - Maintain center alignment and text sizing

### Phase 3: Page Components

- [x] **Task 7: Refactor page.tsx (home)**
  - Update `mt-3` → `mt-golden-2` (13px) for subtitle
  - Update `mt-12 space-y-12` → `mt-golden-5 space-y-golden-5` (55px)
  - Maintain semantic structure

- [x] **Task 8: Refactor posts/[slug]/page.tsx**
  - Update header margin: `mb-12` → `mb-golden-5` (55px)
  - Update title margins, category badge gaps
  - Ensure article max-width is optimal (~680px)

- [x] **Task 9: Refactor about/page.tsx**
  - Update `mt-8` → `mt-golden-4` (34px) for prose section
  - Apply golden spacing to heading margins within prose

- [x] **Task 10: Refactor categories/page.tsx**
  - Update `mt-10` → golden equivalent
  - Update `gap-4` → `gap-golden-2` (13px)
  - Update category card padding

- [x] **Task 11: Refactor categories/[slug]/page.tsx**
  - Match spacing updates from page.tsx pattern
  - Update section margins and card spacing

### Phase 4: Shared Components

- [x] **Task 12: Refactor PostCard.tsx**
  - Update `mt-2`, `mt-3`, `mt-4` → golden equivalents
  - Update `gap-2` → `gap-golden-1` (8px)
  - Ensure hover states maintain proper visual feedback

- [x] **Task 13: Refactor CategoryBadge.tsx**
  - Update padding: `px-3 py-0.5` → harmonized golden values
  - Keep border-radius as-is (aesthetic choice)
  - Update larger size variant similarly

### Phase 5: Final Polish

- [x] **Task 14: Review and adjust prose spacing in globals.css**
  - Fine-tune heading margins for vertical rhythm
  - Ensure code blocks follow spacing pattern
  - Check blockquote and list item spacing

- [x] **Task 15: Visual verification**
  - Test light mode paper feel
  - Test dark mode consistency
  - Check mobile responsiveness
  - Verify no inline style attributes remain

## Dependencies

```
Phase 1 (Foundation) → Phase 2, 3, 4 depend on golden spacing vars
Phase 2, 3, 4 can run in parallel after Phase 1
Phase 5 depends on all prior phases
```

## Validation Commands

```bash
# Build check
npm run build

# Lint check
npm run lint

# Visual inspection
npm run dev
```

## File Change Summary

| File | Type |
|------|------|
| `src/app/globals.css` | Modify |
| `src/app/layout.tsx` | Modify |
| `src/app/page.tsx` | Modify |
| `src/app/posts/[slug]/page.tsx` | Modify |
| `src/app/about/page.tsx` | Modify |
| `src/app/categories/page.tsx` | Modify |
| `src/app/categories/[slug]/page.tsx` | Modify |
| `src/components/Header.tsx` | Modify |
| `src/components/Footer.tsx` | Modify |
| `src/components/PostCard.tsx` | Modify |
| `src/components/CategoryBadge.tsx` | Modify |

**Total: 11 files modified, 0 files created, 0 files deleted**
