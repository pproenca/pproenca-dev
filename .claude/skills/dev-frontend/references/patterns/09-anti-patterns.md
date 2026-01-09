# Anti-Patterns

What NOT to do when building headless components.

---

## 1. Reading Full Files When Symbol Access Works

**Anti-pattern:**
```typescript
// Reading entire file to find one function
const fileContent = fs.readFileSync('DialogRoot.tsx', 'utf-8');
const match = fileContent.match(/function handleOpen/);
```

**Why it's wrong:**
- Wastes tokens/memory
- Misses semantic context
- Can't navigate to related code

**Correct approach:**
```typescript
// Use symbolic tools
find_symbol('handleOpen', 'DialogRoot.tsx')
find_referencing_symbols('handleOpen', 'DialogRoot.tsx')
```

---

## 2. Inline Styles Instead of CSS Variables

**Anti-pattern:**
```typescript
// Inline styles for dynamic values
<div style={{ height: `${height}px`, opacity: open ? 1 : 0 }}>
```

**Why it's wrong:**
- Can't be overridden by consumers
- No CSS transitions
- Tight coupling

**Correct approach (headless component):**
```typescript
// CSS custom properties
<div style={{ '--collapsible-height': `${height}px` } as React.CSSProperties}>

// CSS can use and override
.collapsible {
  height: var(--collapsible-height);
  transition: height 200ms;
}
```

---

## 3. Controlled-Only Components

**Anti-pattern:**
```typescript
// Only supports controlled mode
interface Props {
  open: boolean;  // Required!
  onOpenChange: (open: boolean) => void;
}
```

**Why it's wrong:**
- Forces state management on consumers
- Can't work as simple uncontrolled component
- More boilerplate for simple cases

**Correct approach (headless component):**
```typescript
interface Props {
  open?: boolean;           // Optional controlled
  defaultOpen?: boolean;    // Optional uncontrolled default
  onOpenChange?: (open: boolean) => void;  // Optional callback
}

// Implementation uses useControlled
const [open, setOpen] = useControlled({
  controlled: openProp,
  default: defaultOpen ?? false,
  name: 'Dialog',
  state: 'open',
});
```

---

## 4. Missing Event Cancellation

**Anti-pattern:**
```typescript
// No way to prevent state change
const handleOpen = () => {
  onOpenChange?.(true);
  setOpen(true);  // Always happens
};
```

**Why it's wrong:**
- Consumer can't prevent opening
- No control over behavior
- Can't implement conditional logic

**Correct approach (headless component):**
```typescript
const handleOpen = (reason: string, event?: Event) => {
  const details = createEventDetails(reason, event);
  onOpenChange?.(true, details);

  if (details.isCanceled) {
    return;  // Consumer cancelled
  }

  setOpen(true);
};
```

---

## 5. Hardcoded HTML Elements

**Anti-pattern:**
```typescript
// Always renders as button
return <button {...props}>{children}</button>;
```

**Why it's wrong:**
- Can't render as link, div, custom component
- Not flexible for polymorphism
- Semantic inflexibility

**Correct approach (headless component):**
```typescript
// render prop for element customization
return useRenderElement('button', componentProps, {
  state,
  ref,
  props: elementProps,
});

// Usage
<Button render={<a href="/link" />} />
<Button render={(props, state) => <MyCustomButton {...props} />} />
```

---

## 6. Context Without Throwing Hook

**Anti-pattern:**
```typescript
// Default value that's never valid
const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  setOpen: () => {},  // Noop that silently fails
});
```

**Why it's wrong:**
- Silent failures
- Hard to debug missing provider
- Invalid state is used

**Correct approach (headless component):**
```typescript
// Undefined default
const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

// Hook that throws
function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialogContext must be used within DialogRoot');
  }
  return context;
}
```

---

## 7. Using disabled Attribute for Focusability Control

**Anti-pattern:**
```typescript
// disabled prevents focus entirely
<button disabled={disabled}>{children}</button>
```

**Why it's wrong:**
- Disabled buttons can't receive focus
- Screen readers can't announce them
- Keyboard users can't discover them

**Correct approach (headless component):**
```typescript
// aria-disabled + manual prevention
<button
  aria-disabled={disabled || undefined}
  onClick={disabled ? undefined : onClick}
  onKeyDown={disabled ? undefined : onKeyDown}
>
  {children}
</button>

// Or with focusableWhenDisabled option
<CompositeItem disabled={disabled} focusableWhenDisabled={true} />
```

---

## 8. Direct State Mutation in Callbacks

**Anti-pattern:**
```typescript
// Callback directly mutates
const handleClick = () => {
  props.open = true;  // Direct mutation!
};
```

**Why it's wrong:**
- Violates React principles
- Unpredictable re-renders
- Props are read-only

**Correct approach:**
```typescript
const handleClick = () => {
  setOpen(true);  // State setter
  onOpenChange?.(true, details);  // Notify parent
};
```

---

## 9. Synchronous State Without flushSync

**Anti-pattern:**
```typescript
// State update may batch
const handleHover = () => {
  setInstantType('hover');  // May not update immediately
  setOpen(true);  // Animation may use stale instantType
};
```

**Why it's wrong:**
- React batches state updates
- Animation may start with wrong state
- Race conditions

**Correct approach (headless component for animation-critical):**
```typescript
import { flushSync } from 'react-dom';

const handleHover = () => {
  flushSync(() => {
    setInstantType('hover');  // Synchronous update
  });
  setOpen(true);  // Now instantType is correct
};
```

---

## 10. Missing Ref Forwarding

**Anti-pattern:**
```typescript
// No ref forwarding
function Button(props: ButtonProps) {
  return <button {...props}>{props.children}</button>;
}
```

**Why it's wrong:**
- Parent can't access DOM element
- Can't measure, focus, or position
- Breaks many use cases

**Correct approach:**
```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, forwardedRef) {
    return useRenderElement('button', props, {
      ref: forwardedRef,
      // ...
    });
  }
);
```

---

## 11. Props Spread Without Filtering

**Anti-pattern:**
```typescript
// Spreads everything, including invalid HTML attrs
return <div {...props} />;
```

**Why it's wrong:**
- Invalid HTML attributes on DOM elements
- Console warnings
- Unpredictable behavior

**Correct approach:**
```typescript
const { render, className, customProp, anotherCustom, ...elementProps } = props;

return useRenderElement('div', componentProps, {
  props: elementProps,  // Only valid HTML props
});
```

---

## 12. One-Way Data Flow Violations

**Anti-pattern:**
```typescript
// Child modifies parent state directly
const Child = () => {
  const { internalState } = useParentContext();
  internalState.value = 'modified';  // Direct mutation!
};
```

**Why it's wrong:**
- Violates React data flow
- Unpredictable updates
- Hard to debug

**Correct approach:**
```typescript
const Child = () => {
  const { setValue } = useParentContext();
  setValue('modified');  // Through setter
};
```

---

## 13. Missing Cleanup in Effects

**Anti-pattern:**
```typescript
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // No cleanup!
}, []);
```

**Why it's wrong:**
- Memory leaks
- Stale handlers
- Multiple listeners accumulate

**Correct approach:**
```typescript
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

---

## 14. Callback Dependencies in Effects

**Anti-pattern:**
```typescript
// Callback changes every render
const handleChange = (value) => {
  onChange?.(value);
};

useEffect(() => {
  doSomething(handleChange);  // Runs every render!
}, [handleChange]);
```

**Why it's wrong:**
- Effect runs every render
- Performance issues
- Unintended side effects

**Correct approach (headless component):**
```typescript
// useStableCallback maintains identity
const handleChange = useStableCallback((value) => {
  onChange?.(value);
});

// Or useCallback with proper deps
const handleChange = React.useCallback((value) => {
  onChange?.(value);
}, [onChange]);
```

---

## 15. Boolean Attributes as Strings

**Anti-pattern:**
```typescript
// String boolean
<div data-open="true" data-disabled="false" />
```

**Why it's wrong:**
- Inconsistent with HTML boolean attributes
- Harder to select in CSS
- "false" is truthy in attribute selectors

**Correct approach (headless component):**
```typescript
// Presence/absence for true/false
<div
  data-open={open ? '' : undefined}      // Present when true
  data-disabled={disabled ? '' : undefined}
/>

// CSS
[data-open] { /* open styles */ }
[data-disabled] { /* disabled styles */ }
```

---

## Summary: headless component Principles

1. **Always support both controlled and uncontrolled modes**
2. **Always provide event cancellation via details object**
3. **Use CSS custom properties for dynamic values**
4. **Throw on missing context, don't use invalid defaults**
5. **Forward refs to DOM elements**
6. **Use aria-disabled for accessibility, not disabled**
7. **Destructure and filter props before spreading**
8. **Clean up effects**
9. **Use stable callbacks for handlers**
10. **Use presence/absence for boolean data attributes**
