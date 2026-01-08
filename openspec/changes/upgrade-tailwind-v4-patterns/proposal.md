# Proposal: Upgrade Tailwind CSS v4 Patterns

## Summary

The project uses Tailwind CSS v4 (`^4`) but retains v3 arbitrary value syntax `[var(--*)]` across 11 component files. Tailwind v4 introduced a cleaner parentheses syntax `(--*)` for CSS variable references. This proposal migrates to the v4-native syntax for consistency and future compatibility.

## Current State

- **Tailwind version**: ^4 (already v4)
- **PostCSS config**: Already uses `@tailwindcss/postcss` (correct for v4)
- **CSS config**: Already uses `@import "tailwindcss"` and `@theme inline` (correct for v4)
- **Issue**: 30+ instances of `[var(--color-*)]` syntax across 11 files

## Motivation

1. **Consistency**: v4 documentation uses `(--var)` syntax exclusively
2. **Future-proofing**: v3 syntax may be deprecated in future releases
3. **Cleaner code**: `text-(--color-accent)` is shorter than `text-[var(--color-accent)]`
4. **Build optimization**: Native syntax may enable better tree-shaking

## Scope

### In Scope
- Migrate `[var(--*)]` to `(--*)` syntax in all TSX files
- Verify build passes after migration
- No functional changes

### Out of Scope
- Upgrading Tailwind package version (already v4)
- Changing theme values or color definitions
- Restructuring CSS architecture

## Affected Files

| File | Occurrences |
|------|-------------|
| `src/components/Header.tsx` | 5 |
| `src/components/CategoryBadge.tsx` | 1 |
| `src/components/PostCard.tsx` | 3 |
| `src/components/ThemeToggle.tsx` | 2 |
| `src/components/MDXContent.tsx` | 1 |
| `src/components/Footer.tsx` | 2 |
| `src/app/categories/[slug]/page.tsx` | 3 |
| `src/app/categories/page.tsx` | 6 |
| `src/app/page.tsx` | 3 |
| `src/app/about/page.tsx` | 1 |
| `src/app/posts/[slug]/page.tsx` | 2 |

## Risk Assessment

**Risk Level**: Low

- Syntax change is mechanical (find/replace)
- No logic changes
- Build verification catches any issues
- Easy to revert if needed

## References

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- Relevant section: "Variable syntax in arbitrary values"
