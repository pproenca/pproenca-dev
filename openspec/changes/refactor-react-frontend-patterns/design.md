## Context

This refactor applies patterns from two skill sets:

- **dev-react**: React 19 best practices (ref as prop, purity, hooks patterns)
- **dev-frontend**: Headless component accessibility patterns (ARIA states, keyboard nav, data attributes)

The codebase already follows many good patterns:

- `useSyncExternalStore` for hydration-safe theme detection
- `useTransition` for async operations
- Proper useEffect cleanup

This refactor addresses remaining gaps without over-engineering.

## Goals / Non-Goals

### Goals

- Improve accessibility compliance (WCAG 2.1 AA)
- Apply React 19 ref-as-prop pattern
- Add data attributes for CSS styling hooks
- Better keyboard navigation

### Non-Goals

- Full headless component architecture (overkill for this simple blog)
- Creating reusable component library
- Adding controlled/uncontrolled patterns (not needed here)
- Event cancellation patterns (not applicable to these simple components)

## Decisions

### Decision 1: Use `aria-disabled` instead of `disabled`

**Why**: Native `disabled` prevents focus, making elements invisible to keyboard users and screen readers.

**Pattern**:

```tsx
// Before
<button disabled={isPending}>...</button>

// After
<button
  aria-disabled={isPending || undefined}
  onClick={isPending ? undefined : handleClick}
>...</button>
```

### Decision 2: Add `aria-pressed` to toggle buttons

**Why**: Screen readers announce toggle state when `aria-pressed` is present.

**Pattern**:

```tsx
<button
  aria-pressed={isDark}
  aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
>
```

### Decision 3: Use ref-as-prop (React 19)

**Why**: React 19 supports passing ref as a prop directly, eliminating need for `forwardRef`.

**Pattern**:

```tsx
// Before (React 18)
export const Button = forwardRef<HTMLButtonElement, Props>(
  function Button(props, ref) { ... }
);

// After (React 19)
export function Button({ ref, ...props }: Props) { ... }
```

### Decision 4: Add state data attributes

**Why**: Enables CSS styling based on component state without JS.

**Pattern**:

```tsx
<button
  data-copied={copied ? '' : undefined}
  data-pending={isPending ? '' : undefined}
>
```

CSS usage:

```css
[data-copied] {
  color: green;
}
[data-pending] {
  opacity: 0.5;
}
```

### Decision 5: Skip full headless architecture

**Why**: This is a simple blog with 5 interactive components. Full headless patterns (useRenderElement, state stores, event cancellation) would be over-engineering.

We apply only the relevant patterns:

- Accessibility (ARIA, keyboard)
- Ref forwarding
- Data attributes

## Risks / Trade-offs

| Risk                                             | Mitigation                                      |
| ------------------------------------------------ | ----------------------------------------------- |
| `aria-disabled` requires manual click prevention | Simple pattern, already used in SubscribeButton |
| React 19 ref-as-prop is newer                    | Well-documented, stable in React 19             |
| Data attributes add slight bundle size           | Negligible, enables CSS-only styling            |

## Open Questions

None - all decisions are straightforward applications of documented patterns.
