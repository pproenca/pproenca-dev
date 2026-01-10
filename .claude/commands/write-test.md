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

Generate a comprehensive test file for a React component following testing conventions.

## Workflow

### 1. Analyze the Component

Read the component file and identify:

- Component name and export pattern
- Props interface (especially value, defaultValue, onChange, disabled, etc.)
- ARIA attributes used (role, aria-\* attributes)
- Event handlers (onClick, onValueChange, onOpenChange, etc.)
- Whether it's a compound component (Component.Root, Component.Trigger, etc.)

### 2. Examine Existing Test Patterns

Search for similar component tests in the project:

```
Glob: **/*.test.tsx
```

Read 1-2 test files to understand the project's specific patterns.

### 3. Generate Test File

Create the test file following this structure:

```typescript
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MyComponent } from './MyComponent';

describe('<MyComponent />', () => {
  // 1. Basic rendering
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // 2. Value/state props
  describe('prop: value', () => {
    it('controls the component', () => {
      const { rerender } = render(<MyComponent value={0} onChange={() => {}} />);
      expect(screen.getByRole('spinbutton')).toHaveValue('0');

      rerender(<MyComponent value={1} onChange={() => {}} />);
      expect(screen.getByRole('spinbutton')).toHaveValue('1');
    });
  });

  describe('prop: defaultValue', () => {
    it('sets initial value', () => {
      render(<MyComponent defaultValue={5} />);
      expect(screen.getByRole('spinbutton')).toHaveValue('5');
    });
  });

  // 3. Callback props
  describe('prop: onChange', () => {
    it('calls when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<MyComponent onChange={handleChange} />);
      await user.click(screen.getByRole('button'));

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  // 4. Boolean props
  describe('prop: disabled', () => {
    it('prevents interaction', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<MyComponent disabled onClick={handleClick} />);
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('sets aria-disabled', () => {
      render(<MyComponent disabled />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // 5. ARIA attributes
  describe('ARIA attributes', () => {
    it('has correct role', () => {
      render(<MyComponent />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // 6. Keyboard navigation
  describe('keyboard navigation', () => {
    it('responds to keyboard events', async () => {
      const user = userEvent.setup();
      render(<MyComponent />);

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();

      await user.keyboard('{Enter}');
      // Assert expected behavior
    });
  });
});
```

### 4. File Location

Place the test file adjacent to the component:

```
src/components/MyComponent/MyComponent.test.tsx
```

Or follow the project's existing pattern.

## Key Patterns to Apply

### Query Methods (in priority order)

1. `screen.getByRole()` - Primary for accessibility
2. `screen.getByLabelText()` - For form elements
3. `screen.getByText()` - For content verification
4. `screen.getByTestId()` - Last resort

### Assertion Patterns

- Presence: `expect(el).toBeInTheDocument()`
- Attributes: `expect(el).toHaveAttribute('aria-x', 'y')`
- Null checks: `expect(screen.queryByRole('x')).not.toBeInTheDocument()`
- Mock calls: `expect(fn).toHaveBeenCalledTimes(1)`
- Focus: `expect(el).toHaveFocus()`

### User Interactions

- Click: `await user.click(element)`
- Keyboard: `await user.keyboard('[ArrowDown]')` or `await user.keyboard('{Enter}')`
- Type: `await user.type(input, 'text')`
- Tab: `await user.tab()`

### Prop Updates

- `const { rerender } = render(<Component prop={value} />)`
- `rerender(<Component prop={newValue} />)`

## Output

Write the complete test file with:

- Proper imports
- All relevant prop tests
- ARIA attribute tests
- Interaction tests
- Keyboard navigation tests where applicable
