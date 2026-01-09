# State Management Patterns

## 1. useControlled - Controlled/Uncontrolled Unified

The foundation for all value management:

```typescript
const [value, setValue] = useControlled({
  controlled: valueProp,
  default: defaultValueProp,
  name: 'MyComponent',
  state: 'value',
});
```

### Implementation Pattern
```typescript
export function useControlled<T>(params: {
  controlled: T | undefined;
  default: T | undefined;
  name: string;
  state: string;
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { controlled, default: defaultProp } = params;
  const isControlled = controlled !== undefined;

  const [valueState, setValueState] = React.useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  const setValueIfUncontrolled = React.useCallback((newValue) => {
    if (!isControlled) {
      setValueState(newValue);
    }
  }, [isControlled]);

  return [value, setValueIfUncontrolled];
}
```

### Usage Examples
```typescript
// Simple boolean
const [open, setOpen] = useControlled({
  controlled: openProp,
  default: defaultOpen ?? false,
  name: 'Dialog',
  state: 'open',
});

// Complex value
const [checkedValue, setCheckedValue] = useControlled({
  controlled: valueProp,
  default: defaultValueProp,
  name: 'RadioGroup',
  state: 'value',
});
```

---

## 2. Store Pattern - Complex Popup State

Used by Dialog, Popover, Tooltip, Menu, Select, Combobox:

```typescript
const store = useRefWithInit(() => {
  return new DialogStore({
    open: openProp ?? defaultOpen,
    modal: true,
    nested,
    // ... initial state
  });
}).current;

// Controlled prop sync
store.useControlledProp('open', openProp, defaultOpen);

// Value sync
store.useSyncedValue('nested', nested);

// Callback registration
store.useContextCallback('onOpenChange', onOpenChange);

// State subscription
const open = store.useState('open');
```

### Store Features
- Single source of truth for complex state
- Prop syncing for controlled mode
- Context callbacks for events
- Subscription-based state access

### When to Use Store vs useState
| useState | Store |
|----------|-------|
| Simple state | Many related values |
| 1-3 values | Open, mounted, trigger, nested, etc. |
| No external sync | Props + callbacks sync |
| Single component | Shared across parts |

---

## 3. Context Pattern - Undefined Default + Throwing Hook

```typescript
// Context creation
export const MyContext = React.createContext<MyContextValue | undefined>(undefined);

// Hook with optional flag
export function useMyContext(optional?: false): MyContextValue;
export function useMyContext(optional: true): MyContextValue | undefined;
export function useMyContext(optional?: boolean): MyContextValue | undefined {
  const context = React.useContext(MyContext);
  if (!optional && context === undefined) {
    throw new Error('useMyContext must be used within MyContextProvider');
  }
  return context;
}
```

### Usage
```typescript
// Required (throws if missing)
const context = useMyContext();

// Optional (returns undefined if missing)
const context = useMyContext(true);

// Check for context presence
const parentContext = useMyContext(true);
const nested = Boolean(parentContext);
```

---

## 4. Event Details with Cancellation

```typescript
interface ChangeEventDetails {
  reason: string;
  isCanceled: boolean;
  event?: Event;
  cancel(): void;
}

// Usage in handler
const setOpen = useStableCallback(
  (nextOpen: boolean, eventDetails: ChangeEventDetails) => {
    onOpenChange?.(nextOpen, eventDetails);

    if (eventDetails.isCanceled) {
      return;  // External handler cancelled
    }

    setOpenUnwrapped(nextOpen);
  },
);
```

### Creating Event Details
```typescript
const details = createChangeEventDetails(REASONS.triggerPress, event);

if (details.isCanceled) {
  return;
}
```

### Common Reasons
```typescript
const REASONS = {
  triggerPress: 'triggerPress',
  triggerHover: 'triggerHover',
  triggerFocus: 'triggerFocus',
  escapeKey: 'escapeKey',
  outsidePress: 'outsidePress',
  focusOut: 'focusOut',
  listNavigation: 'listNavigation',
  itemPress: 'itemPress',
  cancelOpen: 'cancelOpen',
  none: 'none',
};
```

---

## 5. Transition Status Pattern

```typescript
const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

// transitionStatus: 'starting' | 'ending' | undefined

// Usage in state
const state = {
  open,
  transitionStatus,
};
```

### State Attributes Mapping
```typescript
const transitionStatusMapping = {
  transitionStatus(value) {
    if (value === 'starting') {
      return { 'data-starting': '' };
    }
    if (value === 'ending') {
      return { 'data-ending': '' };
    }
    return null;
  },
};
```

---

## 6. Derived State Pattern

State derived from other state:

```typescript
// NavigationMenu: open derived from value
const open = value != null;

// Progress: status derived from value
const status = React.useMemo(() => {
  if (value === max) return 'complete';
  if (value > max) return 'progressing';
  return 'indeterminate';
}, [value, max]);

// Checkbox: checked can be indeterminate
const checkedState = indeterminate ? 'mixed' : checked;
```

---

## 7. Ref-Based State for Performance

When you need current value without re-renders:

```typescript
const delayRef = React.useRef(OPEN_DELAY);
const closeDelayRef = React.useRef(CLOSE_DELAY);

const writeDelayRefs = useStableCallback((config) => {
  delayRef.current = config.delay ?? OPEN_DELAY;
  closeDelayRef.current = config.closeDelay ?? CLOSE_DELAY;
});

// Used as getter functions
const getDelayValue = () => delayRef.current;
```

### When to Use Refs vs State
| useState | useRef |
|----------|--------|
| Needs re-render | No re-render needed |
| Display value | Internal tracking |
| User sees it | Calculation input |

---

## 8. Map-Based State for O(1) Lookups

```typescript
// Tabs: activation map
const [tabActivationMap] = React.useState(() => new Map<any, boolean>());

// Field registration
const formRef = React.useRef({
  fields: new Map<string, FieldData>(),
});

// Toolbar: item metadata
const [itemMap, setItemMap] = React.useState(
  () => new Map<Node, CompositeMetadata>(),
);
```

---

## 9. useStableCallback - Stable Function References

```typescript
const handleChange = useStableCallback((value, eventDetails) => {
  // Can use current props/state without stale closures
  onValueChange?.(value, eventDetails);
});
```

### Why Use It
- Avoids recreating callbacks
- Prevents unnecessary re-renders
- Always has current closure values
- Safe for event handlers and effects

---

## 10. Timeout-Based State

```typescript
const scrollTimeout = useTimeout();

const handleScroll = useStableCallback(() => {
  setScrolling(true);

  scrollTimeout.start(SCROLL_TIMEOUT, () => {
    setScrolling(false);
  });
});
```

### useTimeout Hook
```typescript
const timeout = useTimeout();

timeout.start(delay, callback);
timeout.clear();
timeout.isStarted();
```
