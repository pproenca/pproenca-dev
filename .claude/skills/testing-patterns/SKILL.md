---
name: MUI/Base UI Testing Patterns
description: This skill should be used when the user asks to "write tests", "add tests", "test component", "create test file", "add test coverage", "test accessibility", "test keyboard navigation", "test ARIA attributes", or mentions testing React components with Vitest, React Testing Library, Chai, or Sinon. Provides comprehensive MUI/Base UI testing methodology.
---

# MUI/Base UI Testing Patterns

Comprehensive testing patterns for React component testing following MUI/Base UI conventions. These patterns ensure consistent, accessible, and well-structured tests.

## Testing Stack

| Package | Purpose |
|---------|---------|
| vitest | Test runner |
| @testing-library/react | React component testing |
| @testing-library/user-event | User interaction simulation |
| chai + chai-dom | Assertions |
| sinon | Spies, stubs, mocks |
| @vitest/browser-playwright | Browser testing |

## Test File Setup

```typescript
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, waitFor, flushMicrotasks } from '@mui/internal-test-utils';
import { createRenderer, isJSDOM, describeConformance } from '#test-utils';
import * as Component from '@base-ui/react/Component';

describe('<Component.Root />', () => {
  const { render } = createRenderer();

  describeConformance(<Component.Root />, () => ({
    render,
    refInstanceof: window.HTMLDivElement,
  }));

  // Tests organized by: Props -> Behaviors -> Integration
});
```

## Core Patterns

### Async Rendering

All renders are async - always use `await render()`:

```typescript
it('renders correctly', async () => {
  const { setProps, user } = await render(<Component value={0} />);

  expect(screen.getByRole('tab')).to.have.attribute('aria-selected', 'true');

  await setProps({ value: 1 });
  expect(screen.getAllByRole('tab')[1]).to.have.attribute('aria-selected', 'true');
});
```

### User Event Interactions

```typescript
it('handles click', async () => {
  const handleClick = spy();
  const { user } = await render(<Button onClick={handleClick} />);

  await user.click(screen.getByRole('button'));
  expect(handleClick.callCount).to.equal(1);
});

it('handles keyboard', async () => {
  const { user } = await render(<Menu.Root />);
  await user.keyboard('[ArrowDown]');
  await user.keyboard('{Enter}');
});
```

### Callback Testing with spy

```typescript
it('calls onValueChange', async () => {
  const handleChange = spy();
  const { user } = await render(
    <Tabs.Root onValueChange={handleChange}>
      <Tabs.List>
        <Tabs.Tab value={0} />
        <Tabs.Tab value={1} />
      </Tabs.List>
    </Tabs.Root>
  );

  await user.click(screen.getAllByRole('tab')[1]);

  expect(handleChange.callCount).to.equal(1);
  expect(handleChange.firstCall.args[0]).to.equal(1);
});
```

### ARIA Attribute Testing

```typescript
it('sets ARIA attributes', async () => {
  await render(<Tabs.Root value={0} />);

  const tab = screen.getByRole('tab');
  expect(tab).to.have.attribute('aria-selected', 'true');
  expect(tab).to.have.attribute('tabindex', '0');

  const panel = screen.getByRole('tabpanel');
  expect(panel).to.have.attribute('aria-labelledby', tab.id);
});
```

### Browser-Specific Tests

```typescript
describe.skipIf(isJSDOM)('keyboard navigation', () => {
  it('navigates with arrow keys', async () => {
    const { user } = await render(<Menu.Root />);
    await user.keyboard('[ArrowDown]');
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });
});
```

## Test Organization

### Standard Structure

```typescript
describe('<Component.Root />', () => {
  const { render } = createRenderer();

  // 1. Conformance tests first
  describeConformance(<Component.Root />, () => ({
    render,
    refInstanceof: window.HTMLDivElement,
  }));

  // 2. Value props
  describe('prop: value', () => {});
  describe('prop: defaultValue', () => {});

  // 3. Callback props
  describe('prop: onValueChange', () => {});

  // 4. Boolean props
  describe('prop: disabled', () => {});

  // 5. Behaviors
  describe('ARIA attributes', () => {});
  describe('keyboard navigation', () => {});

  // 6. Integration
  describe('Form', () => {});
  describe('Field', () => {});
});
```

## Query Methods

Prefer accessibility-first queries:

1. **getByRole** - Primary choice for accessibility
2. **getByText** - Content verification
3. **getByTestId** - Last resort for non-semantic elements
4. **queryBy*** - When element might not exist
5. **findBy*** - For async elements

```typescript
screen.getByRole('button');
screen.getByRole('tab', { selected: true });
screen.getByRole('tabpanel', { hidden: true }); // Include hidden
screen.getAllByRole<HTMLInputElement>('checkbox', { hidden: true });
```

## Decision Trees

### When to Skip in JSDOM

Skip for: `innerText`, `inert` attribute, RTL keyboard, focus trapping, scroll events, complex pointer interactions, CSS animations.

```typescript
describe.skipIf(isJSDOM)('feature requiring browser', () => {});
it.skipIf(isJSDOM)('specific browser test', async () => {});
```

### Controlled vs Uncontrolled

```typescript
// Controlled - use value + setProps
const { setProps } = await render(<Component value={0} />);
await setProps({ value: 1 });

// Uncontrolled - use defaultValue + user interaction
await render(<Component defaultValue={0} />);
await user.click(nextButton);
```

## Conformance Testing

### Component API Conformance

```typescript
describeConformance(<Button.Root />, () => ({
  render,
  refInstanceof: window.HTMLButtonElement,
  testRenderPropWith: 'button',
  button: true,
}));
```

Tests: className, refForwarding, propsSpread, renderProp

### Popup Conformance

```typescript
popupConformanceTests({
  createComponent: (props) => (
    <Dialog.Root {...props.root}>
      <Dialog.Trigger {...props.trigger}>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup {...props.popup} />
      </Dialog.Portal>
    </Dialog.Root>
  ),
  triggerMouseAction: 'click',
  render,
  expectedPopupRole: 'dialog',
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

### Focus Management
- initialFocus sets focus on open
- finalFocus restores on close
- Focus trapping in modals
- Tab order follows visual order

## Additional Resources

### Reference Files

For detailed patterns and techniques, consult:
- **`references/patterns.md`** - Comprehensive testing patterns with examples
- **`references/assertions.md`** - Assertion patterns for Chai + chai-dom
- **`references/utilities.md`** - createRenderer, conformance tests, helper utilities

### File Naming

```
packages/react/src/<component>/<subcomponent>/<SubComponent>.test.tsx
```

## Quick Reference

| Pattern | Example |
|---------|---------|
| Async render | `const { user } = await render(<C />)` |
| Click | `await user.click(element)` |
| Keyboard | `await user.keyboard('[ArrowDown]')` |
| Prop update | `await setProps({ value: 1 })` |
| Spy assertion | `expect(spy.callCount).to.equal(1)` |
| Attribute | `expect(el).to.have.attribute('aria-x', 'y')` |
| Focus | `expect(el).toHaveFocus()` |
| Null check | `expect(screen.queryByRole('x')).to.equal(null)` |
| Skip JSDOM | `describe.skipIf(isJSDOM)('...', () => {})` |
