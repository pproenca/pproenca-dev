---
name: dev-frontend
description: This skill should be used when the user asks to "write a React component", "create a headless component", "build a form control", "add accessibility to a component", "implement controlled/uncontrolled pattern", "create compound component", "write TypeScript React code", or when writing any production-grade React/TypeScript component code. Provides Headless Component patterns for headless, accessible, type-safe components.
---

# dev-frontend

Write production-grade TypeScript + React headless components following Headless Component patterns - the same patterns powering enterprise React applications.

## Core Principles

1. **Headless First**: Components provide behavior and accessibility, not styling
2. **Controlled + Uncontrolled**: Always support both modes via `useControlled`
3. **Render Prop Flexibility**: Users can customize rendering completely
4. **State as Data Attributes**: Expose state via `data-*` for CSS styling
5. **Event Cancellation**: Allow consumers to prevent state changes
6. **Type Safety**: Rich TypeScript with generics and conditional types

---

## The useRenderElement Pattern

Every component renders through this hook:

```typescript
const element = useRenderElement("div", componentProps, {
  state,
  ref: forwardedRef,
  props: [defaultProps, elementProps],
  stateAttributesMapping,
});

return element;
```

### Key Capabilities

- **Render prop (function)**: `render={(props, state) => <Custom {...props} />}`
- **Render prop (element)**: `render={<Custom />}`
- **State className**: `className={(state) => state.open ? 'open' : ''}`
- **Conditional**: `enabled: false` returns `null`

---

## State Attributes Mapping

Convert state to `data-*` attributes for CSS styling:

```typescript
const stateAttributesMapping: StateAttributesMapping<State> = {
  // Boolean: presence/absence
  open(value) {
    return value ? { "data-open": "" } : null;
  },
  disabled(value) {
    return value ? { "data-disabled": "" } : null;
  },
  // Enum: value
  side(value) {
    return { "data-side": value };
  },
};
```

**CSS Usage:**

```css
[data-open] {
  opacity: 1;
}
[data-disabled] {
  pointer-events: none;
}
[data-side="top"] {
  bottom: 100%;
}
```

---

## Controlled + Uncontrolled Pattern

Always use `useControlled`:

```typescript
const [open, setOpen] = useControlled({
  controlled: openProp,
  default: defaultOpen ?? false,
  name: "Dialog",
  state: "open",
});
```

**Props interface:**

```typescript
interface DialogRootProps {
  open?: boolean; // Controlled
  defaultOpen?: boolean; // Uncontrolled
  onOpenChange?: (open: boolean, details: OpenChangeDetails) => void;
}
```

---

## Event Details with Cancellation

Allow consumers to prevent state changes:

```typescript
interface OpenChangeDetails {
  reason: string;
  event?: Event;
  isCanceled: boolean;
  cancel(): void;
}

const handleOpen = (reason: string, event?: Event) => {
  const details = {
    reason,
    event,
    isCanceled: false,
    cancel() {
      this.isCanceled = true;
    },
  };

  onOpenChange?.(true, details);

  if (!details.isCanceled) {
    setOpen(true);
  }
};
```

---

## Context Pattern

Undefined default + throwing hook:

```typescript
const DialogContext = React.createContext<DialogContext | undefined>(undefined);

export function useDialogContext(): DialogContext;
export function useDialogContext(optional: false): DialogContext;
export function useDialogContext(optional: true): DialogContext | undefined;
export function useDialogContext(optional?: boolean) {
  const context = React.useContext(DialogContext);
  if (!optional && context === undefined) {
    throw new Error("useDialogContext must be used within DialogRoot");
  }
  return context;
}
```

---

## Component Structure Template

```typescript
"use client";
import * as React from "react";

const stateAttributesMapping = {
  /* ... */
};

export const MyComponent = React.forwardRef(function MyComponent(
  componentProps: MyComponent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...elementProps } = componentProps;

  const state: MyComponent.State = React.useMemo(
    () => ({
      // state fields
    }),
    [
      /* deps */
    ],
  );

  const element = useRenderElement("div", componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping,
  });

  return element;
});

// Interfaces
export interface MyComponentState {
  /* ... */
}
export interface MyComponentProps extends HeadlessComponentProps<
  "div",
  MyComponentState
> {
  /* ... */
}

// Namespace
export namespace MyComponent {
  export type State = MyComponentState;
  export type Props = MyComponentProps;
}
```

---

## TypeScript Patterns

### HeadlessComponentProps

```typescript
export type HeadlessComponentProps<
  ElementType extends React.ElementType,
  State,
> = Omit<React.ComponentPropsWithRef<ElementType>, "className"> & {
  className?: string | ((state: State) => string);
  render?: ComponentRenderFn<Props, State> | React.ReactElement;
};
```

### Multi-Generic Components

```typescript
interface SelectProps<Value, Multiple extends boolean = false> {
  value?: Multiple extends true ? Value[] : Value;
  multiple?: Multiple;
}
```

---

## Accessibility Essentials

### ARIA Roles

```typescript
role="checkbox" | role="radio" | role="switch" | role="dialog" | role="menu" | role="listbox"
```

### ARIA States

```typescript
'aria-checked': checked,
'aria-expanded': expanded,
'aria-selected': selected,
'aria-disabled': disabled || undefined,
'aria-invalid': invalid || undefined,
```

### Keyboard Navigation

```typescript
const handleKeyDown = (event) => {
  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      focusNext();
      break;
    case "ArrowUp":
    case "ArrowLeft":
      focusPrevious();
      break;
    case "Home":
      focusFirst();
      break;
    case "End":
      focusLast();
      break;
    case "Escape":
      close();
      break;
  }
};
```

### Focus Management

- **Focus trap** for modal dialogs
- **Return focus** to trigger on close
- **Roving tabindex** for composite widgets

---

## Hidden Input Pattern

For form components:

```typescript
return (
  <>
    <span role="checkbox" aria-checked={checked} onClick={() => inputRef.current?.click()}>
      {children}
    </span>
    <input
      ref={inputRef}
      type="checkbox"
      tabIndex={-1}
      aria-hidden
      style={visuallyHidden}
      checked={checked}
      name={name}
      onChange={(e) => setChecked(e.target.checked)}
    />
  </>
);
```

---

## Anti-Patterns to Avoid

1. **Don't hardcode elements** - Use render prop
2. **Don't use `disabled` attribute** - Use `aria-disabled`
3. **Don't create controlled-only components** - Support both modes
4. **Don't use noop context defaults** - Use undefined + throwing hook
5. **Don't spread all props** - Filter component-specific props
6. **Don't skip event cancellation** - Always allow prevention
7. **Don't use inline styles for dynamic values** - Use CSS variables
8. **Don't forget cleanup** - Clean up effects properly
9. **Don't recreate callbacks** - Use useStableCallback
10. **Don't use string booleans** - Use presence/absence for data attributes

---

## Quick Checklist

When creating a component:

- [ ] Use `'use client'` directive
- [ ] Forward ref with `React.forwardRef`
- [ ] Support controlled and uncontrolled with `useControlled`
- [ ] Use `useRenderElement` for rendering
- [ ] Define `stateAttributesMapping`
- [ ] Create context with undefined default
- [ ] Create throwing context hook with optional overload
- [ ] Export namespace with State and Props types
- [ ] Handle disabled via `aria-disabled`
- [ ] Support event cancellation via details object
- [ ] Add keyboard navigation for interactive elements
- [ ] Include hidden input for form components

---

## Additional Resources

### Reference Files

For detailed patterns and techniques, consult:

- **`references/patterns/01-rendering-patterns.md`** - useRenderElement, state attributes, props merging
- **`references/patterns/02-state-management-patterns.md`** - useControlled, stores, context, transitions
- **`references/patterns/03-composition-patterns.md`** - Compound components, slots, polymorphism
- **`references/patterns/04-form-patterns.md`** - Hidden inputs, validation, field integration
- **`references/patterns/05-accessibility-patterns.md`** - ARIA, keyboard nav, focus management
- **`references/patterns/06-animation-patterns.md`** - Transitions, CSS variables
- **`references/patterns/07-positioning-patterns.md`** - Floating UI, anchoring
- **`references/patterns/08-typescript-patterns.md`** - Generics, overloads, conditional types
- **`references/patterns/09-anti-patterns.md`** - Common mistakes to avoid
- **`references/patterns/10-component-template.md`** - Complete templates

### TypeScript References

- **`references/typescript/01-core-types.md`** - HeadlessComponentProps, StateAttributesMapping
- **`references/typescript/02-hook-signatures.md`** - Hook type patterns
- **`references/typescript/03-advanced-patterns.md`** - Generics, conditional types

### Component Examples

Working component examples in `examples/components/`:

- Dialog, Switch, Checkbox, Progress - compound components
- Button, Toggle - simple components
- Select, Combobox - complex with stores

### Quality Checklist

See **`references/checklist.md`** for the complete validation checklist.
