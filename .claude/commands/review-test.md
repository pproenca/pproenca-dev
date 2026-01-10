---
name: review-test
description: Review test files against React component testing patterns and provide detailed feedback with fixes
allowed-tools:
  - Read
  - Glob
  - Grep
argument-hint: "<test-file-path>"
---

# Review Test File

Analyze a test file for adherence to React component testing patterns and provide detailed feedback with corrected code.

## Review Checklist

### 1. File Structure

Check for proper organization:

- [ ] Imports in correct order: React -> Testing libs -> Utils -> Components
- [ ] `createRenderer` extracted at describe level
- [ ] `describeConformance` present (if applicable)
- [ ] Describe blocks follow pattern: Props -> Behaviors -> Integration
- [ ] `describe('prop: propName')` format for prop tests

**Expected import order:**

```typescript
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, waitFor, flushMicrotasks } from '@mui/internal-test-utils';
import { createRenderer, isJSDOM, describeConformance } from '#test-utils';
import * as Component from '@base-ui/react/Component';
```

### 2. Async Patterns

Verify all async operations are awaited:

- [ ] `await render()` - render is async
- [ ] `await setProps()` - prop updates are async
- [ ] `await user.click()` - user events are async
- [ ] `await user.keyboard()` - keyboard events are async
- [ ] `await rerender()` - rerender is async

**Issue example:**

```typescript
// BAD - missing await
const { user } = render(<Component />);
user.click(button);

// GOOD
const { user } = await render(<Component />);
await user.click(button);
```

### 3. Query Methods

Check query method usage:

- [ ] Prefer `getByRole` over other queries
- [ ] Use `queryBy*` for checking non-existence
- [ ] Use `getAllByRole` with `{ hidden: true }` for hidden elements
- [ ] Avoid `getByTestId` unless necessary

**Issue example:**

```typescript
// BAD - using getBy for non-existence check (throws)
expect(screen.getByRole('dialog')).to.equal(null);

// GOOD - use queryBy
expect(screen.queryByRole('dialog')).to.equal(null);
```

### 4. Assertion Patterns

Verify correct assertion usage:

- [ ] Use Chai `expect().to.have.attribute()` for attributes
- [ ] Use `expect(spy.callCount).to.equal(n)` for spy assertions
- [ ] Use `expect(el).toHaveFocus()` for focus checks
- [ ] Avoid testing implementation details (classes, internal state)

**Issue example:**

```typescript
// BAD - implementation detail
expect(element.classList.contains('active')).to.equal(true);

// GOOD - semantic assertion
expect(element).to.have.attribute('aria-selected', 'true');
```

### 5. Spy Usage

Check spy patterns:

- [ ] Spies created with `spy()` from sinon
- [ ] Verify call count before checking arguments
- [ ] Use `firstCall.args[0]` for argument access

**Issue example:**

```typescript
// BAD - incomplete verification
expect(handleChange.called).to.equal(true);

// GOOD - complete verification
expect(handleChange.callCount).to.equal(1);
expect(handleChange.firstCall.args[0]).to.equal(expectedValue);
```

### 6. Browser-Specific Tests

Check for proper JSDOM handling:

- [ ] `describe.skipIf(isJSDOM)` for browser-only features
- [ ] `it.skipIf(isJSDOM)` for individual browser tests
- [ ] Keyboard navigation tests skipped in JSDOM
- [ ] Focus trapping tests skipped in JSDOM
- [ ] `inert` attribute tests skipped in JSDOM

**Features requiring browser:**

- `innerText` property
- `inert` attribute
- RTL direction with keyboard
- Focus trapping in modals
- Scroll events
- Complex pointer interactions
- CSS animations

### 7. Accessibility Testing

Check ARIA coverage:

- [ ] Role tested: `screen.getByRole('expectedRole')`
- [ ] State attributes tested: `aria-checked`, `aria-expanded`, etc.
- [ ] Relationship attributes tested: `aria-labelledby`, `aria-describedby`
- [ ] Disabled state uses `aria-disabled`, not HTML `disabled`

### 8. Test Naming

Check naming conventions:

- [ ] Top-level describe uses JSX format: `describe('<Component.Root />')`
- [ ] Prop tests use format: `describe('prop: propName')`
- [ ] Test names use present tense: `'calls onValueChange when...'`

## Output Format

Provide feedback in this structure:

### Issues Found

For each issue:

**Issue:** [Description of the problem]
**Location:** [File:line or code snippet]
**Why it matters:** [Impact on test quality/reliability]
**Fix:**

```typescript
// Corrected code
```

### Summary

- Total issues: X
- Critical issues: X (blocking test reliability)
- Warnings: X (style/best practices)
- Suggestions: X (improvements)

### Corrected Code

If requested, provide the complete corrected test file with all issues fixed.
