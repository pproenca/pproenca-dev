# Assertion Patterns

Comprehensive assertion patterns for Chai, chai-dom, and jest-dom matchers.

## Chai Assertions (Primary)

```typescript
import { expect } from "chai";

// Equality
expect(value).to.equal(expected);
expect(array).to.have.length(3);
expect(object).to.deep.equal({ a: 1 });

// Truthiness
expect(callback.called).to.equal(true);
expect(element).not.to.equal(null);

// Property assertions
expect(element).to.have.property("tabIndex", 0);
expect(event).to.have.property("defaultPrevented", true);
```

## Chai-DOM Assertions

### Attribute Assertions

```typescript
// Basic attribute check
expect(element).to.have.attribute("role", "button");
expect(element).to.have.attribute("aria-expanded", "true");
expect(element).to.have.attribute("tabindex", "0");

// Negative checks
expect(element).not.to.have.attribute("disabled");
expect(element).to.not.have.attribute("aria-readonly");

// Data attributes
expect(element).to.have.attribute("data-checked", "");
expect(element).to.have.attribute("data-disabled", "");
expect(element).not.to.have.attribute("data-checked");

// Attribute existence (any value)
expect(element).to.have.attribute("data-open");
```

### Text Content

```typescript
expect(element).to.have.text("Panel 1");
expect(error).to.have.text("required");
```

### Class Assertions

```typescript
expect(element).to.have.class("active");
expect(component.classList.contains("component-classname")).to.equal(true);
```

## Sinon Spy Assertions

```typescript
import { spy } from "sinon";

const handleChange = spy();

// Call count
expect(handleChange.callCount).to.equal(1);
expect(handleChange.calledOnce).to.equal(true);
expect(handleChange.called).to.equal(true);
expect(handleChange.called).to.equal(false);

// First call arguments
expect(handleChange.firstCall.args[0]).to.equal(true);
expect(handleChange.firstCall.args[1]).to.deep.equal({ reason: "click" });

// Second/last call
expect(handleChange.secondCall.args[0]).to.equal(false);
expect(handleChange.lastCall.args[0]).to.equal("final");
expect(handleChange.lastCall.returnValue).to.equal("on");

// All arguments
expect(handleChange.args[0][0]).to.equal(firstCallFirstArg);
```

## jest-dom Matchers (via @testing-library/jest-dom/vitest)

```typescript
import "@testing-library/jest-dom/vitest";

// Visibility
expect(element).toBeVisible();

// Focus
expect(element).toHaveFocus();

// Accessibility
expect(popup).toBeInaccessible();

// Text
expect(element).toHaveText("Hello");

// Attribute (alternative to chai-dom)
expect(element).toHaveAttribute("aria-disabled", "true");
expect(element).not.toHaveAttribute("inert");
```

## Null/Existence Checks

```typescript
// Element doesn't exist
expect(screen.queryByRole("dialog")).to.equal(null);

// Element exists
expect(screen.queryByRole("dialog")).not.to.equal(null);

// Query returns null (not getBy which throws)
expect(screen.queryByTestId("error")).to.equal(null);

// Alternative with queryBy
const dialog = screen.queryByRole("dialog");
expect(dialog).to.equal(null);
```

## Array/Length Assertions

```typescript
// Length
expect(screen.getAllByRole("tab")).to.have.lengthOf(1);
expect(items).to.have.length(3);

// Ordered members
expect(tabs.map((tab) => tab.tabIndex)).to.have.ordered.members([-1, 0]);

// Deep equal for arrays
expect(result.getAll).to.deep.equal([]);
expect(values).to.deep.equal([1, 2, 3]);
```

## ID Relationship Verification

```typescript
// Label-control relationship
expect(label.getAttribute("for")).to.equal(input?.getAttribute("id"));
expect(checkbox.getAttribute("aria-labelledby")).to.equal(
  label.getAttribute("id"),
);

// aria-labelledby relationship
expect(screen.getByText("title text").getAttribute("id")).to.equal(
  popup?.getAttribute("aria-labelledby"),
);

// aria-describedby relationship
expect(screen.getByText("description text").getAttribute("id")).to.equal(
  popup?.getAttribute("aria-describedby"),
);

// aria-controls relationship
const trigger = screen.getByRole("button");
const triggerControls = trigger.getAttribute("aria-controls");
expect(triggerControls).not.to.equal(null);
expect(dialog.getAttribute("id")).to.equal(triggerControls);

// Dynamic ID generation
expect(label.getAttribute("id")).not.to.equal(null);
```

## Focus Assertions

```typescript
// jest-dom matcher (preferred)
expect(element).toHaveFocus();

// Direct activeElement comparison
expect(document.activeElement).to.equal(element);

// Multiple focus checks
const [firstItem, ...otherItems] = screen.getAllByRole("menuitem");
expect(firstItem).toHaveFocus();
otherItems.forEach((item) => {
  expect(item).not.toHaveFocus();
});
```

## tabIndex Assertions

```typescript
// Roving tabindex pattern
expect(firstItem.tabIndex).to.equal(0);
expect(otherItem.tabIndex).to.equal(-1);

// Property assertion
expect(element).to.have.property("tabIndex", 0);
```

## Style Assertions

```typescript
// Inline style
expect(customRoot.getAttribute("style")).to.contain("color: green");

// Computed style (requires browser)
const styles = window.getComputedStyle(element);
expect(styles.display).to.equal("none");
```

## Best Practices

### Prefer Semantic Assertions

```typescript
// Good - tests semantic role
expect(screen.getByRole("checkbox")).to.have.attribute("aria-checked", "true");

// Avoid - tests implementation
expect(element).to.have.class("checked");
```

### Test State Changes

```typescript
// Before interaction
expect(element).to.have.attribute("aria-expanded", "false");

// Interact
await user.click(trigger);

// After interaction
expect(element).to.have.attribute("aria-expanded", "true");
```

### Use queryBy for Non-Existence

```typescript
// Correct - queryBy returns null
expect(screen.queryByRole("dialog")).to.equal(null);

// Wrong - getBy throws when element doesn't exist
expect(screen.getByRole("dialog")).to.equal(null); // Will throw!
```

### Verify Spy Arguments Completely

```typescript
// Good - checks call count AND arguments
expect(handleChange.callCount).to.equal(1);
expect(handleChange.firstCall.args[0]).to.equal(expectedValue);

// Incomplete - only checks if called
expect(handleChange.called).to.equal(true);
```
