## ADDED Requirements

### Requirement: Toggle Button Accessibility

Interactive toggle buttons SHALL use `aria-pressed` to communicate toggle state to assistive technologies.

#### Scenario: Theme toggle announces state

- **WHEN** the ThemeToggle is rendered in dark mode
- **THEN** it SHALL have `aria-pressed="true"`
- **AND** the label SHALL indicate the action ("Switch to light theme")

#### Scenario: Copy button announces copied state

- **WHEN** the user clicks CopyButton and copy succeeds
- **THEN** it SHALL have `aria-pressed="true"`
- **AND** an `aria-live="polite"` region SHALL announce the copy confirmation

### Requirement: Focusable When Disabled

Interactive elements that are temporarily non-interactive (loading, pending) SHALL remain focusable for screen reader users.

#### Scenario: Subscribe button during pending state

- **WHEN** the SubscribeButton is in pending state
- **THEN** it SHALL use `aria-disabled="true"` instead of the `disabled` attribute
- **AND** click handlers SHALL be conditionally disabled
- **AND** the button SHALL remain keyboard focusable

### Requirement: State Data Attributes

Interactive components SHALL expose their state via `data-*` attributes for CSS styling.

#### Scenario: CSS can style based on component state

- **WHEN** a component has boolean state (copied, pending, subscribed)
- **THEN** it SHALL render `data-{state}=""` when true
- **AND** omit the attribute when false
- **AND** CSS selectors like `[data-copied]` SHALL match the state

### Requirement: Ref Forwarding

Client components that render DOM elements SHALL accept and forward refs to the underlying DOM node.

#### Scenario: Parent can access DOM element

- **WHEN** a parent passes a ref to ThemeToggle, CopyButton, SubscribeButton, or CategoryBadge
- **THEN** the ref SHALL point to the root interactive DOM element
- **AND** the parent can call DOM methods like `focus()` on it

## MODIFIED Requirements

### Requirement: React 19 Ref Pattern

Components SHALL use the React 19 ref-as-prop pattern instead of `React.forwardRef`.

#### Scenario: Ref passed as regular prop

- **WHEN** a component accepts a ref
- **THEN** it SHALL accept `ref` as a regular prop parameter
- **AND** it SHALL NOT use `React.forwardRef` wrapper

```tsx
// Correct pattern
function Button({ ref, ...props }: ButtonProps) {
  return <button ref={ref} {...props} />;
}

interface ButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
  // other props
}
```
