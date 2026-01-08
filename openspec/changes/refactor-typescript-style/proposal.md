# Change: Refactor TypeScript to Follow Google Style Guide

## Why
The codebase uses TypeScript but does not fully adhere to Google's TypeScript Style Guide (dev-ts). Aligning with these conventions improves maintainability, catches bugs at compile time, and establishes consistent patterns for future development.

## What Changes
- **Named exports only**: Convert all `export default function` to named exports
- **Type annotations**: Replace type assertions (`as`) with properly typed functions and explicit interface annotations
- **Module-level singleton**: Refactor mutable `let highlighter` to encapsulated getter pattern
- **Function declarations**: Ensure named functions use function declarations, not expressions
- **Iteration patterns**: Use `for...of` instead of `.forEach()` where appropriate
- **Readonly modifiers**: Add `readonly` to non-reassigned properties

## Impact
- Affected specs: None (no functional behavior changes)
- Affected code:
  - `src/lib/posts.ts` - Type assertions, exports
  - `src/lib/shiki.ts` - Mutable module state
  - `src/app/layout.tsx` - Default export
  - `src/app/page.tsx` - Default export
  - `src/app/posts/[slug]/page.tsx` - Default export
  - `src/app/categories/page.tsx` - Default export
  - `src/app/categories/[slug]/page.tsx` - Default export
  - `src/app/about/page.tsx` - Default export
  - All component files - Already use named exports (compliant)
