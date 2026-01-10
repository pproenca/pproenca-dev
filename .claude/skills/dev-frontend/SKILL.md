---
name: dev-frontend
description: Advanced React component architecture patterns for building headless, accessible, type-safe UI components. Use when implementing compound components, controlled/uncontrolled state patterns, render props, data attributes for CSS styling, or accessible form controls. NOT for basic React components - use dev-react instead.
---

# Headless Component Patterns

Advanced patterns for building production-grade, accessible React components. These patterns are useful when building component libraries or complex reusable UI.

## Core Principles

1. **Headless First**: Components provide behavior and accessibility, not styling
2. **Controlled + Uncontrolled**: Always support both modes
3. **Render Prop Flexibility**: Users can customize rendering completely
4. **State as Data Attributes**: Expose state via `data-*` for CSS styling
5. **Event Cancellation**: Allow consumers to prevent state changes
6. **Type Safety**: Rich TypeScript with generics

---

## Controlled + Uncontrolled Pattern

Support both controlled (external state) and uncontrolled (internal state) modes:

```typescript
// Generic useControlled hook
function useControlled<T>({
  controlled,
  default: defaultValue,
}: {
  controlled: T | undefined;
  default: T;
}): [T, (value: T) => void] {
  const isControlled = controlled !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = isControlled ? controlled : internalValue;

  const setValue = React.useCallback((newValue: T) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
  }, [isControlled]);

  return [value, setValue];
}

// Usage in component
interface DialogProps {
  open?: boolean;           // Controlled
  defaultOpen?: boolean;    // Uncontrolled
  onOpenChange?: (open: boolean) => void;
}

function Dialog({ open: openProp, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [open, setOpen] = useControlled({
    controlled: openProp,
    default: defaultOpen,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  // ...
}
```

---

## State as Data Attributes

Expose component state via `data-*` attributes for CSS styling:

```typescript
interface State {
  open: boolean;
  disabled: boolean;
  side: 'top' | 'bottom';
}

function getStateAttributes(state: State) {
  return {
    // Boolean: presence/absence (no value)
    ...(state.open && { 'data-open': '' }),
    ...(state.disabled && { 'data-disabled': '' }),
    // Enum: use value
    'data-side': state.side,
  };
}

// In component
return (
  <div {...getStateAttributes(state)} {...props}>
    {children}
  </div>
);
```

**CSS Usage:**

```css
[data-open] {
  opacity: 1;
}
[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}
[data-side="top"] {
  bottom: 100%;
}
```

---

## Render Prop Pattern

Allow complete rendering customization:

```typescript
interface ButtonProps {
  render?: (props: React.ButtonHTMLAttributes<HTMLButtonElement>, state: ButtonState) => React.ReactElement;
  className?: string | ((state: ButtonState) => string);
  children?: React.ReactNode;
}

interface ButtonState {
  pressed: boolean;
  disabled: boolean;
}

function Button({ render, className, children, ...props }: ButtonProps) {
  const state: ButtonState = { pressed: false, disabled: false };

  const elementProps = {
    ...props,
    className: typeof className === 'function' ? className(state) : className,
    ...getStateAttributes(state),
  };

  // Custom render function
  if (typeof render === 'function') {
    return render(elementProps, state);
  }

  // Default rendering
  return <button {...elementProps}>{children}</button>;
}

// Usage
<Button render={(props, state) => (
  <a {...props} href="/action" className={state.pressed ? 'active' : ''}>
    Click me
  </a>
)} />
```

---

## Compound Components with Context

Create related components that share state:

```typescript
// 1. Create context with undefined default
interface TabsContextValue {
  value: number;
  onValueChange: (value: number) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

// 2. Create throwing hook with optional overload
function useTabsContext(): TabsContextValue;
function useTabsContext(optional: true): TabsContextValue | undefined;
function useTabsContext(optional?: boolean) {
  const context = React.useContext(TabsContext);
  if (!optional && context === undefined) {
    throw new Error('Tabs components must be used within Tabs.Root');
  }
  return context;
}

// 3. Root component provides context
function TabsRoot({ value, defaultValue = 0, onValueChange, children }: TabsRootProps) {
  const [internalValue, setInternalValue] = useControlled({
    controlled: value,
    default: defaultValue,
  });

  const contextValue = React.useMemo(() => ({
    value: internalValue,
    onValueChange: (newValue: number) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    },
  }), [internalValue, onValueChange, setInternalValue]);

  return (
    <TabsContext value={contextValue}>
      {children}
    </TabsContext>
  );
}

// 4. Child components consume context
function Tab({ value, children }: { value: number; children: React.ReactNode }) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const selected = value === selectedValue;

  return (
    <button
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => onValueChange(value)}
      data-selected={selected ? '' : undefined}
    >
      {children}
    </button>
  );
}

// Export as namespace
const Tabs = {
  Root: TabsRoot,
  Tab,
  Panel: TabsPanel,
};
```

---

## Event Cancellation Pattern

Allow consumers to prevent state changes:

```typescript
interface OpenChangeDetails {
  reason: 'click' | 'escape' | 'outside-click';
  event?: Event;
}

interface DialogProps {
  onOpenChange?: (open: boolean, details: OpenChangeDetails) => void | boolean;
}

function Dialog({ onOpenChange, ...props }: DialogProps) {
  const handleClose = (reason: OpenChangeDetails['reason'], event?: Event) => {
    const details = { reason, event };

    // Allow consumer to cancel by returning false
    const shouldClose = onOpenChange?.(false, details);
    if (shouldClose === false) {
      return; // Consumer cancelled the close
    }

    setOpen(false);
  };
}

// Usage - prevent closing on escape
<Dialog onOpenChange={(open, { reason }) => {
  if (!open && reason === 'escape') {
    return false; // Prevent close
  }
}} />
```

---

## Accessibility Essentials

### ARIA Roles and States

```typescript
// Checkbox
<span
  role="checkbox"
  aria-checked={checked}
  aria-disabled={disabled || undefined}
  tabIndex={disabled ? -1 : 0}
  onKeyDown={handleKeyDown}
/>

// Dialog
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  aria-describedby={descriptionId}
/>

// Menu
<ul role="menu" aria-orientation="vertical">
  <li role="menuitem" tabIndex={-1}>Item</li>
</ul>
```

### Keyboard Navigation

```typescript
function handleKeyDown(event: React.KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      focusNext();
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      focusPrevious();
      break;
    case 'Home':
      event.preventDefault();
      focusFirst();
      break;
    case 'End':
      event.preventDefault();
      focusLast();
      break;
    case 'Escape':
      close();
      break;
  }
}
```

### Focus Management

- **Focus trap** for modal dialogs (focus stays within)
- **Return focus** to trigger element on close
- **Roving tabindex** for composite widgets (only one item has tabIndex=0)

---

## Hidden Input for Forms

For custom form controls to work with native form submission:

```typescript
function Checkbox({ name, checked, onChange, children }: CheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <span
        role="checkbox"
        aria-checked={checked}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === ' ' && inputRef.current?.click()}
        tabIndex={0}
      >
        {children}
      </span>
      <input
        ref={inputRef}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        tabIndex={-1}
        aria-hidden
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
    </>
  );
}
```

---

## Anti-Patterns to Avoid

1. **Don't hardcode elements** - Use render prop for flexibility
2. **Don't use `disabled` attribute** - Use `aria-disabled` for accessibility
3. **Don't create controlled-only components** - Always support uncontrolled mode
4. **Don't use empty object as context default** - Use undefined + throwing hook
5. **Don't spread all props blindly** - Filter component-specific props first
6. **Don't skip event prevention** - Always allow consumers to cancel actions
7. **Don't use inline styles for state** - Use CSS variables or data attributes
8. **Don't forget cleanup** - Clean up event listeners and effects

---

## Quick Checklist

When creating a headless component:

- [ ] Support controlled and uncontrolled modes
- [ ] Forward ref with `React.forwardRef`
- [ ] Expose state via `data-*` attributes
- [ ] Use render prop for customization
- [ ] Create context with undefined default + throwing hook
- [ ] Handle disabled via `aria-disabled`
- [ ] Support event cancellation
- [ ] Add keyboard navigation for interactive elements
- [ ] Include hidden input for form components
- [ ] Implement focus management for popups/modals
