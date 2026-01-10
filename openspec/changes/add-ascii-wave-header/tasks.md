# Tasks: Add ASCII Wave Animation Header

> **Direction Change**: After design review, decided to remove the "Latest Posts" heading entirely. Apple-style restraint - let the content speak for itself.

## Final Implementation

- [x] 1.1 Remove "Latest Posts" heading from homepage
- [x] 1.2 Remove subtitle "Thoughts on web development..."
- [x] 1.3 Homepage now shows posts directly with clean spacing
- [x] 1.4 Build passes (`pnpm build`)
- [x] 1.5 Lint passes (`pnpm lint`)
- [x] 1.6 Verified in both light and dark modes

## Original Tasks (Not Implemented)

The original proposal called for an animated ASCII wave header. After exploring options including:
- Character-by-character wave animation
- Subtle ASCII wave decoration (`· ~ · ~ · ~ ·`)
- Various Knowlton/Veilleux-inspired patterns

The final decision was maximum restraint: no title, no decoration, just the posts.

## Files Changed

- `src/app/page.tsx` - Removed h1 heading and subtitle, posts render directly
