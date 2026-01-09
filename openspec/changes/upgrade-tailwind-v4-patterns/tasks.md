# Tasks: Upgrade Tailwind CSS v4 Patterns

## Overview

Migrate from Tailwind v3 arbitrary value syntax `[var(--*)]` to v4 native syntax `(--*)`.

## Task List

### Task 1: Update Component Files

- [x] `src/components/Header.tsx`
- [x] `src/components/CategoryBadge.tsx`
- [x] `src/components/PostCard.tsx`
- [x] `src/components/ThemeToggle.tsx`
- [x] `src/components/MDXContent.tsx`
- [x] `src/components/Footer.tsx`

**Action:** Replace `[var(--color-*)]` with `(--color-*)` pattern

**Examples:**

```diff
- border-[var(--color-border-subtle)]
+ border-(--color-border-subtle)

- bg-[var(--color-bg-deep)]/95
+ bg-(--color-bg-deep)/95

- text-[var(--color-text-secondary)]
+ text-(--color-text-secondary)
```

**Validation:** `npm run lint` passes ✓

---

### Task 2: Update Page Files

- [x] `src/app/page.tsx`
- [x] `src/app/about/page.tsx`
- [x] `src/app/categories/page.tsx`
- [x] `src/app/categories/[slug]/page.tsx`
- [x] `src/app/posts/[slug]/page.tsx`

**Action:** Same pattern replacement as Task 1

**Validation:** `npm run lint` passes ✓

---

### Task 3: Build Verification

- [x] Run full build to verify styles compile correctly

**Commands:**

```bash
npm run build
```

**Validation:**

- [x] Build completes without errors
- [x] Check `out/` directory has generated CSS
- [x] Verify no missing style warnings

---

### Task 4: Visual Verification

- [x] Start dev server and visually check pages

**Commands:**

```bash
npm run dev
```

**Validation:**

- [x] Homepage renders correctly
- [x] Theme toggle works (light/dark)
- [x] Category pages render correctly
- [x] Post pages render correctly

## Dependencies

```
Task 1 ──┐
         ├──> Task 3 ──> Task 4
Task 2 ──┘
```

Tasks 1 and 2 can run in parallel. Task 3 depends on both completing. Task 4 depends on Task 3.

## Rollback Plan

If issues arise:

```bash
git checkout -- src/
```

All changes are confined to TSX files in `src/` directory.

## Completion

All tasks completed successfully on 2026-01-08.
