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
- [ ] Describe blocks follow pattern: Props -> Behaviors -> Integration
- [ ] `describe('prop: propName')` format for prop tests

**Expected import order:**

```typescript
import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MyComponent } from "./MyComponent";
```

### 2. Async Patterns

Verify all async operations are handled correctly:

- [ ] User event setup: `const user = userEvent.setup()`
- [ ] `await user.click()` - user events are async
- [ ] `await user.keyboard()` - keyboard events are async
- [ ] `await waitFor()` for async assertions

**Issue example:**

```typescript
// BAD - missing await
const user = userEvent.setup();
user.click(button);

// GOOD
const user = userEvent.setup();
await user.click(button);
```

### 3. Query Methods

Check query method usage:

- [ ] Prefer `getByRole` over other queries
- [ ] Use `queryBy*` for checking non-existence
- [ ] Use `findBy*` for async elements
- [ ] Avoid `getByTestId` unless necessary

**Issue example:**

```typescript
// BAD - using getBy for non-existence check (throws)
expect(screen.getByRole("dialog")).toBeNull();

// GOOD - use queryBy
expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
```

### 4. Assertion Patterns

Verify correct assertion usage:

- [ ] Use `toHaveAttribute()` for attributes
- [ ] Use `toHaveBeenCalledTimes()` for mock assertions
- [ ] Use `toBeInTheDocument()` for presence checks
- [ ] Avoid testing implementation details (classes, internal state)

**Issue example:**

```typescript
// BAD - implementation detail
expect(element.classList.contains("active")).toBe(true);

// GOOD - semantic assertion
expect(element).toHaveAttribute("aria-selected", "true");
```

### 5. Mock Function Usage

Check mock patterns:

- [ ] Mocks created with `vi.fn()`
- [ ] Verify call count before checking arguments
- [ ] Clear mocks between tests if needed

**Issue example:**

```typescript
// BAD - incomplete verification
expect(handleChange).toHaveBeenCalled();

// GOOD - complete verification
expect(handleChange).toHaveBeenCalledTimes(1);
expect(handleChange).toHaveBeenCalledWith(expectedValue);
```

### 6. Accessibility Testing

Check ARIA coverage:

- [ ] Role tested: `screen.getByRole('expectedRole')`
- [ ] State attributes tested: `aria-checked`, `aria-expanded`, etc.
- [ ] Relationship attributes tested: `aria-labelledby`, `aria-describedby`
- [ ] Disabled state uses `aria-disabled`, not HTML `disabled`

### 7. Test Naming

Check naming conventions:

- [ ] Top-level describe uses component name: `describe('<MyComponent />')`
- [ ] Prop tests use format: `describe('prop: propName')`
- [ ] Test names describe behavior: `'calls onChange when clicked'`

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
