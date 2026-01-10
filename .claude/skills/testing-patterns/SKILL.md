---
name: testing-patterns
description: This skill should be used when writing **Vitest unit tests** for React components (NOT E2E/Playwright tests - use e2e-testing-patterns instead). Covers React Testing Library, user-event, and vitest assertions. Use for component unit testing, accessibility testing, keyboard navigation tests, or ARIA attribute testing.
---

# React Component Testing Patterns

Patterns for unit testing React components with Vitest and React Testing Library.

## Testing Stack

| Package | Purpose |
|---------|---------|
| vitest | Test runner |
| @testing-library/react | React component testing |
| @testing-library/user-event | User interaction simulation |
| vitest assertions | expect().toBe(), toHaveAttribute(), etc. |

## Test File Setup

```typescript
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('<MyComponent />', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Tests organized by: Props -> Behaviors -> Integration
});
```

## Core Patterns

### Basic Rendering

```typescript
it('renders correctly', () => {
  render(<MyComponent value={0} />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### User Event Interactions

```typescript
it('handles click', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();

  render(<Button onClick={handleClick} />);
  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('handles keyboard', async () => {
  const user = userEvent.setup();
  render(<Menu />);

  await user.keyboard('[ArrowDown]');
  await user.keyboard('{Enter}');
});
```

### Callback Testing with vi.fn()

```typescript
it('calls onChange when value changes', async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();

  render(<Select onChange={handleChange} options={['A', 'B']} />);
  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByRole('option', { name: 'B' }));

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith('B');
});
```

### ARIA Attribute Testing

```typescript
it('sets ARIA attributes', () => {
  render(<Tabs value={0} />);

  const tab = screen.getByRole('tab');
  expect(tab).toHaveAttribute('aria-selected', 'true');
  expect(tab).toHaveAttribute('tabindex', '0');

  const panel = screen.getByRole('tabpanel');
  expect(panel).toHaveAttribute('aria-labelledby', tab.id);
});
```

### Async/Wait Patterns

```typescript
it('shows loading then content', async () => {
  render(<AsyncComponent />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Content loaded')).toBeInTheDocument();
  });
});
```

## Test Organization

### Standard Structure

```typescript
describe('<MyComponent />', () => {
  // 1. Basic rendering
  it('renders correctly', () => {});

  // 2. Value props
  describe('prop: value', () => {});
  describe('prop: defaultValue', () => {});

  // 3. Callback props
  describe('prop: onChange', () => {});

  // 4. Boolean props
  describe('prop: disabled', () => {});

  // 5. Behaviors
  describe('ARIA attributes', () => {});
  describe('keyboard navigation', () => {});

  // 6. Integration
  describe('Form', () => {});
});
```

## Query Methods

Prefer accessibility-first queries:

1. **getByRole** - Primary choice for accessibility
2. **getByLabelText** - For form elements
3. **getByText** - Content verification
4. **getByTestId** - Last resort for non-semantic elements
5. **queryBy*** - When element might not exist
6. **findBy*** - For async elements

```typescript
screen.getByRole('button');
screen.getByRole('tab', { selected: true });
screen.getByRole('combobox', { name: 'Choose option' });
screen.queryByRole('dialog'); // null if not present
await screen.findByRole('alert'); // waits for element
```

## Controlled vs Uncontrolled

```typescript
// Controlled - component uses external state
it('controlled mode', () => {
  const { rerender } = render(<Input value="initial" onChange={() => {}} />);
  expect(screen.getByRole('textbox')).toHaveValue('initial');

  rerender(<Input value="updated" onChange={() => {}} />);
  expect(screen.getByRole('textbox')).toHaveValue('updated');
});

// Uncontrolled - component manages own state
it('uncontrolled mode', async () => {
  const user = userEvent.setup();
  render(<Input defaultValue="initial" />);

  await user.clear(screen.getByRole('textbox'));
  await user.type(screen.getByRole('textbox'), 'new value');

  expect(screen.getByRole('textbox')).toHaveValue('new value');
});
```

## Accessibility Checklist

### Keyboard Navigation
- Tab moves focus to/from component
- Arrow keys navigate within component
- Enter/Space activate items
- Escape closes popups
- Home/End jump to first/last

### ARIA Attributes
- Correct role assigned
- aria-selected for tabs/options
- aria-expanded for triggers
- aria-controls links trigger to popup
- aria-labelledby for relationships
- aria-disabled (not disabled attribute) for accessible disabled states

### Focus Management
- Focus moves appropriately on open/close
- Focus trapping in modals
- Tab order follows visual order

## Quick Reference

| Pattern | Example |
|---------|---------|
| Render | `render(<Component />)` |
| User setup | `const user = userEvent.setup()` |
| Click | `await user.click(element)` |
| Type | `await user.type(input, 'text')` |
| Keyboard | `await user.keyboard('[ArrowDown]')` |
| Mock function | `const fn = vi.fn()` |
| Call count | `expect(fn).toHaveBeenCalledTimes(1)` |
| Call args | `expect(fn).toHaveBeenCalledWith(arg)` |
| Attribute | `expect(el).toHaveAttribute('aria-x', 'y')` |
| In document | `expect(el).toBeInTheDocument()` |
| Null check | `expect(screen.queryByRole('x')).not.toBeInTheDocument()` |
| Async wait | `await waitFor(() => expect(...))` |
| Rerender | `const { rerender } = render(<C />)` |
