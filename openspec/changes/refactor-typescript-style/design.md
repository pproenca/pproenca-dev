# Design: TypeScript Style Guide Refactoring

## Context
This codebase is a Next.js 16 static blog using TypeScript in strict mode. While functional, the code does not fully follow Google's TypeScript Style Guide conventions. This refactoring brings the codebase into alignment without changing behavior.

## Goals / Non-Goals

**Goals:**
- Align all TypeScript with Google Style Guide (dev-ts)
- Maintain full backwards compatibility (no behavior changes)
- Keep changes minimal and focused on style

**Non-Goals:**
- Adding new features
- Refactoring architecture
- Adding tests (no test framework configured)

## Decisions

### Decision 1: Named Exports + Default Re-export for Pages

**What:** Define named exports and re-export as default for Next.js pages.

**Why:** Next.js App Router requires `export default` for pages and layouts. Google Style Guide prohibits default exports. The compromise pattern satisfies both:

```typescript
// Named export is primary, default is for Next.js compatibility
export function HomePage() { ... }
export default HomePage;
```

**Alternatives considered:**
- Pure default exports: Violates Google Style Guide
- Pure named exports: Breaks Next.js routing
- Wrapper function: Unnecessary indirection

### Decision 2: Singleton Highlighter Pattern

**What:** Keep the lazy-initialization pattern for Shiki highlighter but make it clearer.

**Why:** The current `let highlighter: Highlighter | null = null` pattern is standard for lazy singletons. While `let` is discouraged, this is the idiomatic pattern for module-level caching. Adding a comment explaining the pattern is sufficient.

**Implementation:**
```typescript
// Module-level cache for Shiki highlighter (lazy initialization)
let highlighterInstance: Highlighter | null = null;
```

### Decision 3: Type Assertions vs Runtime Validation

**What:** Keep `as` assertions for gray-matter frontmatter with explanatory comments.

**Why:** The gray-matter library returns `unknown` data. Full runtime validation would require a validation library (Zod, io-ts) which is over-engineering for this use case. Type assertions with comments explaining the trust boundary are acceptable per Google Style Guide ("Comment required if `any`/assertion used").

**Implementation:**
```typescript
// Frontmatter structure is validated by MDX file conventions
const frontmatter = data as PostFrontmatter;
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Breaking Next.js routing | Use dual export pattern (named + default) |
| Introducing type errors | Run `tsc --noEmit` before each commit |
| Build failures | Run full `npm run build` after all changes |

## Migration Plan

1. Refactor library files first (no Next.js constraints)
2. Update page files with dual export pattern
3. Verify with lint, build, and manual testing
4. Single commit per logical change group

## Open Questions

None - this is a straightforward style refactoring.
