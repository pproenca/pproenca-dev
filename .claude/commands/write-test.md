---
name: write-test
description: Generate component tests following React component patterns with Vitest, Chai, and Sinon
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Edit
argument-hint: "<component-path>"
---

# Write Component Test

Generate a comprehensive test file for a React component following these testing conventions.

## Workflow

### 1. Detect Project Test Utilities

First, search for existing test utilities in the project:

```
Glob: **/test/createRenderer.{ts,tsx}
Glob: **/test-utils/index.{ts,tsx}
Glob: **/describeConformance.{ts,tsx}
Grep: "createRenderer" in test files
```

If found, use the project's utilities. If not, use standard @testing-library/react patterns.

### 2. Analyze the Component

Read the component file and identify:

- Component name and export pattern (named export like `* as Component` or default)
- Props interface (especially value, defaultValue, onChange, disabled, etc.)
- ARIA attributes used (role, aria-* attributes)
- Event handlers (onClick, onValueChange, onOpenChange, etc.)
- Whether it's a compound component (Component.Root, Component.Trigger, etc.)
- Whether it's a popup component (Dialog, Menu, Popover, etc.)

### 3. Examine Existing Test Patterns

Search for similar component tests in the project:

```
Glob: **/*.test.tsx
```

Read 1-2 test files to understand the project's specific patterns.

### 4. Generate Test File

Create the test file following this structure:

```typescript
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, waitFor, flushMicrotasks } from '@mui/internal-test-utils';
import { createRenderer, isJSDOM, describeConformance } from '#test-utils';
import * as Component from '@base-ui/react/Component';

describe('<Component.Root />', () => {
  const { render } = createRenderer();

  // 1. Conformance tests
  describeConformance(<Component.Root />, () => ({
    render,
    refInstanceof: window.HTMLDivElement, // Adjust based on component
  }));

  // 2. Value/state props
  describe('prop: value', () => {
    it('controls the component', async () => {
      const { setProps } = await render(<Component.Root value={0} />);
      // Assertions...
      await setProps({ value: 1 });
      // Assertions...
    });
  });

  describe('prop: defaultValue', () => {
    it('sets initial value', async () => {
      await render(<Component.Root defaultValue={0} />);
      // Assertions...
    });
  });

  // 3. Callback props
  describe('prop: onValueChange', () => {
    it('calls when value changes', async () => {
      const handleChange = spy();
      const { user } = await render(<Component.Root onValueChange={handleChange} />);
      // Interaction...
      expect(handleChange.callCount).to.equal(1);
    });
  });

  // 4. Boolean props
  describe('prop: disabled', () => {
    it('prevents interaction', async () => {
      const handleClick = spy();
      const { user } = await render(<Component.Root disabled onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      expect(handleClick.called).to.equal(false);
    });

    it('sets aria-disabled', async () => {
      await render(<Component.Root disabled />);
      expect(screen.getByRole('button')).to.have.attribute('aria-disabled', 'true');
    });
  });

  // 5. ARIA attributes
  describe('ARIA attributes', () => {
    it('has correct role', async () => {
      await render(<Component.Root />);
      expect(screen.getByRole('expectedRole')).not.to.equal(null);
    });
  });

  // 6. Keyboard navigation (skip in JSDOM if needed)
  describe.skipIf(isJSDOM)('keyboard navigation', () => {
    it('navigates with arrow keys', async () => {
      const { user } = await render(<Component.Root />);
      await user.keyboard('[Tab]');
      await user.keyboard('[ArrowDown]');
      // Assertions...
    });
  });

  // 7. Form integration (if applicable)
  describe('Form', () => {
    it('submits value', async () => {
      // Form submission test...
    });
  });
});
```

### 5. File Location

Place the test file adjacent to the component:

```
packages/react/src/<component>/<subcomponent>/<SubComponent>.test.tsx
```

## Key Patterns to Apply

### Query Methods (in priority order)

1. `screen.getByRole()` - Primary for accessibility
2. `screen.getByText()` - For content verification
3. `screen.getByTestId()` - Last resort

### Assertion Patterns

- Attributes: `expect(el).to.have.attribute('aria-x', 'y')`
- Null checks: `expect(screen.queryByRole('x')).to.equal(null)`
- Spy calls: `expect(spy.callCount).to.equal(1)`
- Focus: `expect(el).toHaveFocus()`

### User Interactions

- Click: `await user.click(element)`
- Keyboard: `await user.keyboard('[ArrowDown]')`
- Pointer: `await user.pointer({ keys: '[MouseLeft]', target: el })`

### Prop Updates

- `await setProps({ value: newValue })`
- `await rerender(<Component newProp={value} />)`

## Output

Write the complete test file with:

- Proper imports
- describeConformance (if project uses it)
- All relevant prop tests
- ARIA attribute tests
- Interaction tests
- Browser-specific tests marked with skipIf(isJSDOM)
