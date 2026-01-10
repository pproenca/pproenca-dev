# Headless Component Component Quality Checklist

Use this checklist when creating or reviewing React components.

## Structure & Setup

- [ ] File starts with `'use client'` directive
- [ ] Component uses `React.forwardRef` for ref forwarding
- [ ] Component has a proper display name (named function, not arrow)
- [ ] Props are destructured with `render`, `className`, `...elementProps` pattern

## State Management

- [ ] Uses `useControlled` for controlled/uncontrolled support
- [ ] Props interface includes both `value` and `defaultValue` variants
- [ ] Includes `onChange` callback with event details
- [ ] State is memoized with `React.useMemo`

## Rendering

- [ ] Uses `useRenderElement` for element rendering
- [ ] Defines `stateAttributesMapping` for data attributes
- [ ] Boolean states use presence/absence (`data-open` not `data-open="true"`)
- [ ] Enum states use value (`data-side="top"`)
- [ ] Supports render prop (function and element)
- [ ] Supports function className

## TypeScript

- [ ] Exports State interface
- [ ] Exports Props interface extending `HeadlessComponentProps`
- [ ] Exports namespace with `State` and `Props` type aliases
- [ ] Props have JSDoc comments with `@default` values
- [ ] Uses proper generics for value types

## Context (for compound components)

- [ ] Context created with `undefined` default
- [ ] Context hook has overloads for optional usage
- [ ] Context hook throws helpful error when used outside provider
- [ ] Context value is memoized

## Accessibility

- [ ] Correct ARIA role assigned
- [ ] `aria-disabled` used instead of `disabled` attribute
- [ ] `aria-checked`/`aria-expanded`/`aria-selected` as appropriate
- [ ] `aria-labelledby` and `aria-describedby` support
- [ ] Keyboard navigation implemented
- [ ] Focus management for popups/dialogs

## Form Components

- [ ] Hidden `<input>` for form submission
- [ ] Input has `tabIndex={-1}` and `aria-hidden`
- [ ] Input uses `visuallyHidden` styles
- [ ] Supports `name`, `required`, `disabled` props
- [ ] Integrates with Field context if applicable

## Event Handling

- [ ] Event callbacks include cancellation support
- [ ] Details object has `reason`, `event`, `isCanceled`, `cancel()`
- [ ] State changes check `isCanceled` before applying
- [ ] Uses `useStableCallback` for stable function references

## Compound Components

- [ ] Root provides context
- [ ] Children consume context via hook
- [ ] Each part has its own State and Props types
- [ ] Index file exports all parts
- [ ] Parts share state via context, not props drilling

## Animation Support

- [ ] Uses `useTransitionStatus` for mount/unmount animations
- [ ] `transitionStatus` included in state
- [ ] `data-starting` and `data-ending` attributes mapped
- [ ] Supports CSS transition classes

## Performance

- [ ] Context values are memoized
- [ ] Callbacks use `useStableCallback` or `useCallback`
- [ ] Expensive computations use `useMemo`
- [ ] Refs used for values that don't need re-renders

## Anti-Patterns Avoided

- [ ] No hardcoded HTML elements (uses render prop)
- [ ] No `disabled` attribute (uses `aria-disabled`)
- [ ] No controlled-only implementation
- [ ] No noop context defaults
- [ ] No unfiltered prop spreading
- [ ] No missing event cancellation
- [ ] No inline styles for dynamic values (uses CSS variables)
- [ ] No missing effect cleanup
- [ ] No recreating callbacks on every render
- [ ] No string booleans in data attributes
