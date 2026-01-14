# Tasks: Apply React Best Practices

Based on comprehensive audit of 43 rules across 8 categories.

## Prerequisites

- [x] 0.1 User approves proposal approach
- [x] 0.2 Verify no conflicting changes in flight (`openspec list`)

---

## Phase 1: Data Fetching Optimization (CRITICAL - Rule 3.4)

### Task 1.1: Add React.cache() to getAllPosts

**File**: `src/lib/posts.ts`
**Line**: 32
**Rule**: 3.4 Per-Request Deduplication

**Before**:

```typescript
export function getAllPosts(): PostMeta[] {
```

**After**:

```typescript
export const getAllPosts = cache(function getAllPosts(): PostMeta[] {
```

**Why**: Called 5+ times per build (homepage, sitemap, feed, getAllCategories, getPostsByCategory)

**Validation**:

- [x] Function signature unchanged
- [x] `pnpm type-check` passes

---

### Task 1.2: Add React.cache() to getAllCategories

**File**: `src/lib/posts.ts`
**Line**: 80
**Rule**: 3.4 Per-Request Deduplication

**Before**:

```typescript
export function getAllCategories(): CategoryCount[] {
```

**After**:

```typescript
export const getAllCategories = cache(function getAllCategories(): CategoryCount[] {
```

**Why**: Called 3+ times (category listing, slugToCategory calls)

**Validation**:

- [x] Function signature unchanged
- [x] `pnpm type-check` passes

---

### Task 1.3: Add React.cache() to getAllSlugs

**File**: `src/lib/posts.ts`
**Line**: 104
**Rule**: 3.4 Per-Request Deduplication

**Before**:

```typescript
export function getAllSlugs(): string[] {
```

**After**:

```typescript
export const getAllSlugs = cache(function getAllSlugs(): string[] {
```

**Why**: Used in generateStaticParams for posts

**Validation**:

- [x] Function signature unchanged
- [x] `pnpm type-check` passes

---

### Task 1.4: Add React.cache() to getAllCategorySlugs

**File**: `src/lib/posts.ts`
**Line**: 115
**Rule**: 3.4 Per-Request Deduplication

**Before**:

```typescript
export function getAllCategorySlugs(): string[] {
```

**After**:

```typescript
export const getAllCategorySlugs = cache(function getAllCategorySlugs(): string[] {
```

**Why**: Used in generateStaticParams for categories and sitemap

**Validation**:

- [x] Function signature unchanged
- [x] `pnpm type-check` passes

---

### Task 1.5: Add React.cache() to slugToCategory

**File**: `src/lib/posts.ts`
**Line**: 124
**Rule**: 3.4 Per-Request Deduplication

**Before**:

```typescript
export function slugToCategory(slug: string): string | undefined {
```

**After**:

```typescript
export const slugToCategory = cache(function slugToCategory(slug: string): string | undefined {
```

**Why**: Called 2x per category page (generateMetadata + component)

**Validation**:

- [x] Function signature unchanged
- [x] `pnpm type-check` passes

---

### Task 1.6: Verify Data Fetching Changes

**Commands**:

```bash
pnpm type-check
pnpm lint
pnpm build
```

**Validation**:

- [x] TypeScript compilation succeeds
- [x] ESLint passes
- [x] Static build completes
- [x] All pages generate correctly

---

## Phase 2: Bundle Optimization (CRITICAL - Rule 2.3)

### Task 2.1: Defer SpeedInsights Loading

**Status**: ⚠️ SKIPPED - Not applicable for static export

**Reason**: In a static export with `output: 'export'`, the root layout is a Server Component. `next/dynamic` with `ssr: false` cannot be used in Server Components. The `@vercel/speed-insights/next` library already handles client-side loading internally and doesn't block hydration.

**Original Plan** (not implemented):

```typescript
import dynamic from "next/dynamic";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false },
);
```

**Validation**:

- [x] Verified that SpeedInsights already loads client-side only
- [x] No changes needed for static export

---

### Task 2.2: Verify Bundle Changes

**Commands**:

```bash
pnpm build
```

**Validation**:

- [x] Build succeeds
- [x] No hydration warnings in build output

---

## Phase 3: End-to-End Verification

### Task 3.1: Run Full Test Suite

**Commands**:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm test:e2e
```

**Validation**:

- [x] ESLint passes
- [x] TypeScript passes
- [x] Build succeeds
- [x] All E2E tests pass (11/11)

---

### Task 3.2: Manual Smoke Test

**Checklist** (deferred to user):

- [ ] Homepage loads and displays posts
- [ ] Post page renders with syntax highlighting
- [ ] Category page shows filtered posts
- [ ] Theme toggle works (light ↔ dark)
- [ ] No console errors in browser DevTools
- [ ] No hydration warnings in console

---

### Task 3.3: Verify Analytics (Post-Deploy)

**After deploying to Vercel**:

- [ ] SpeedInsights dashboard shows data
- [ ] Web Vitals are being captured
- [ ] No missing metrics compared to before

---

## Phase 4: Cleanup

### Task 4.1: Archive Proposal

**After all tasks complete and deploy verified**:

```bash
openspec archive apply-react-best-practices --yes
```

**Validation**:

- [ ] Proposal moved to `changes/archive/`
- [ ] `openspec validate --strict` passes

---

## Summary Checklist

| Phase   | Tasks   | Status                                       |
| ------- | ------- | -------------------------------------------- |
| Phase 1 | 1.1-1.6 | ✅ Complete                                  |
| Phase 2 | 2.1-2.2 | ✅ Complete (2.1 skipped - N/A)              |
| Phase 3 | 3.1-3.3 | 🔄 3.1 complete, 3.2-3.3 pending user action |
| Phase 4 | 4.1     | Pending                                      |

**Total Tasks**: 13
**Completed**: 10
**Pending User Action**: 3 (manual smoke test, analytics verification, archive)

---

## Rules Checklist (43 Total)

### Already Compliant (35 rules)

- [x] 1.1 Defer Await Until Needed
- [x] 1.4 Promise.all() for Independent Operations
- [x] 2.1 Avoid Barrel File Imports (`optimizePackageImports` configured)
- [x] 2.2 Conditional Module Loading (Shiki lazy init)
- [x] 2.4 Dynamic Imports for Heavy Components (N/A - no heavy components)
- [x] 3.2 Minimize Serialization at RSC Boundaries
- [x] 4.1 Deduplicate Global Event Listeners (next-themes handles)
- [x] 5.1 Defer State Reads to Usage Point
- [x] 5.2 Extract to Memoized Components (minimal state)
- [x] 5.3 Narrow Effect Dependencies
- [x] 5.5 Use Lazy State Initialization (simple primitives)
- [x] 6.1 Animate SVG Wrapper Instead of SVG Element
- [x] 6.3 Hoist Static JSX Elements (TerminalDots)
- [x] 6.4 Optimize SVG Precision
- [x] 6.5 Prevent Hydration Mismatch (useSyncExternalStore)
- [x] 6.7 Use Explicit Conditional Rendering
- [x] 7.1 Batch DOM CSS Changes (Tailwind)
- [x] 7.3 Cache Property Access in Loops
- [x] 7.4 Cache Repeated Function Calls (Shiki)
- [x] 7.5 Cache Storage API Calls (next-themes)
- [x] 7.6 Combine Multiple Array Iterations
- [x] 7.8 Early Return from Functions
- [x] 7.9 Hoist RegExp Creation
- [x] 7.11 Use Set/Map for O(1) Lookups
- [x] 7.12 Use toSorted() Instead of sort() (acceptable - fresh arrays)
- [x] 8.1 Store Event Handlers in Refs (useCallback)

### N/A for Static Site (11 rules)

- [x] 1.2 Dependency-Based Parallelization (no partial deps)
- [x] 1.3 Prevent Waterfall Chains in API Routes (no API routes)
- [x] 1.5 Strategic Suspense Boundaries (no streaming)
- [x] 2.3 Defer Non-Critical Third-Party Libraries (static export, library handles internally)
- [x] 2.5 Preload Based on User Intent (no heavy components)
- [x] 3.1 Cross-Request LRU Caching (no server runtime)
- [x] 3.3 Parallel Data Fetching (sync build-time)
- [x] 4.2 Use SWR for Automatic Deduplication (no client fetching)
- [x] 5.4 Subscribe to Derived State (no continuous values)
- [x] 5.6 Use Transitions for Non-Urgent Updates (no high-freq updates)
- [x] 6.2 CSS content-visibility for Long Lists (<50 items)
- [x] 6.6 Use Activity Component (no expensive toggles)
- [x] 7.2 Build Index Maps (small arrays, caching mitigates)
- [x] 7.7 Early Length Check (no array comparisons)
- [x] 7.10 Use Loop for Min/Max (no min/max ops)
- [x] 8.2 useLatest for Stable Callback Refs (no prop callbacks)

### Implemented (1 rule)

- [x] **3.4 Per-Request Deduplication** → Tasks 1.1-1.5 ✅

✅ All applicable rules are now compliant.
