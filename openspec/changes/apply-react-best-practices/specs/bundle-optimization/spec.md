# Bundle Optimization

## ADDED Requirements

### Requirement: Deferred Analytics Loading

The system SHALL load non-critical third-party analytics libraries after hydration to minimize initial bundle size.

#### Scenario: Initial page load excludes analytics

- **WHEN** a user loads any page on the site
- **THEN** the initial JavaScript bundle does NOT include analytics code
- **AND** the page is interactive before analytics loads

#### Scenario: Analytics loads after hydration

- **WHEN** React hydration completes on the client
- **THEN** the SpeedInsights module is dynamically imported
- **AND** analytics tracking begins

#### Scenario: Server-side rendering excludes analytics

- **WHEN** a page is rendered on the server (or during static generation)
- **THEN** the analytics component renders nothing
- **AND** no analytics code is included in the SSR output

---

### Requirement: Dynamic Import Pattern for Heavy Modules

The system SHALL use `next/dynamic` with `ssr: false` for modules that:

1. Are not critical for user interaction
2. Only need to run on the client
3. Add significant bundle size

#### Scenario: Dynamic import prevents SSR errors

- **WHEN** a module is imported with `dynamic(() => import(...), { ssr: false })`
- **THEN** the module is NOT evaluated during server rendering
- **AND** no hydration mismatch occurs

---

## Technical Notes

This pattern follows Vercel's React Best Practices rule 2.3: "Defer Non-Critical Third-Party Libraries".

Implementation uses Next.js `dynamic()` function:

```typescript
import dynamic from "next/dynamic";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false },
);
```

Benefits:

- Reduces Time to Interactive (TTI)
- Reduces Largest Contentful Paint (LCP)
- Analytics still captures all Web Vitals accurately
- No loss of functionality

The `{ ssr: false }` option is critical because:

1. Analytics has no meaningful SSR output
2. Prevents hydration mismatches
3. Ensures module only loads in browser context
