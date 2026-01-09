# Change: Refactor React Components with React 19 and Headless Patterns

## Why

The codebase follows many React 19 best practices but has opportunities to improve:

1. **Accessibility gaps** - Missing ARIA states (`aria-pressed`, `aria-disabled`), using native `disabled` attribute which prevents focus
2. **Ref forwarding** - Client components don't forward refs, limiting parent control
3. **React 19 patterns** - Some components could use newer patterns (ref as prop vs forwardRef)
4. **State as data attributes** - Components could expose state via `data-*` for CSS styling
5. **Keyboard navigation** - Interactive components lack explicit keyboard handling

## What Changes

### 1. Accessibility Improvements

- Replace `disabled` attribute with `aria-disabled` pattern (SubscribeButton)
- Add `aria-pressed` to toggle-style buttons (ThemeToggle, CopyButton)
- Add `aria-live` region for copy confirmation feedback
- Add keyboard event handlers for explicit Enter/Space handling

### 2. React 19 Modernization

- Convert `React.forwardRef` to ref-as-prop pattern (React 19)
- Add state data attributes (`data-copied`, `data-theme`, `data-subscribed`)
- Ensure all interactive components forward refs

### 3. Component Structure

- Add TypeScript namespace exports for State/Props types
- Improve prop interfaces with optional ref parameter
- Add JSDoc documentation to public components

### 4. Minor React 19 Pattern Improvements

- CopyButton: Remove useEffect for timer (use ref-based approach)
- SubscribeButton: Use aria-disabled instead of disabled attribute

## Impact

- Affected code:
  - `src/components/ThemeToggle.tsx`
  - `src/components/CopyButton.tsx`
  - `src/components/SubscribeButton.tsx`
  - `src/components/CategoryBadge.tsx`
  - `src/components/CodeBlock.tsx`

- No breaking changes - all refactoring maintains existing API
- Improved accessibility for screen readers and keyboard users
- Better CSS styling hooks via data attributes
