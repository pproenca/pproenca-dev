# Select Component Analysis

**Files**: `packages/react/src/select/`
**Pattern**: Very Complex Compound with Items
**Sub-parts**: Root, Positioner, Popup, Trigger, Value, Item, ItemText, ItemIndicator, Group, GroupLabel, ScrollUpArrow, ScrollDownArrow, Arrow, Backdrop, Portal, Icon, List

## Directory Structure (18+ parts)

```
select/
├── index.ts
├── index.parts.ts
├── store.ts
├── root/
│   ├── SelectRoot.tsx (~560 lines)
│   └── SelectRootContext.ts
├── positioner/
│   └── SelectPositioner.tsx
├── popup/
│   └── SelectPopup.tsx
├── trigger/
│   └── SelectTrigger.tsx
├── value/
│   └── SelectValue.tsx
├── item/
│   ├── SelectItem.tsx
│   └── SelectItemContext.ts
├── item-text/
│   └── SelectItemText.tsx
├── item-indicator/
│   └── SelectItemIndicator.tsx
├── group/
│   ├── SelectGroup.tsx
│   └── SelectGroupContext.ts
├── group-label/
│   └── SelectGroupLabel.tsx
├── scroll-up-arrow/
│   └── SelectScrollUpArrow.tsx
├── scroll-down-arrow/
│   └── SelectScrollDownArrow.tsx
├── scroll-arrow/
│   └── SelectScrollArrow.tsx
├── arrow/
│   └── SelectArrow.tsx
├── backdrop/
│   └── SelectBackdrop.tsx
├── portal/
│   └── SelectPortal.tsx
├── icon/
│   └── SelectIcon.tsx
└── list/
    └── SelectList.tsx
```

## Key Architectural Pattern: Multi-Generic Type

Select uses two type parameters for value and multiple selection:

```typescript
export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectRoot.Props<Value, Multiple>,
): React.JSX.Element { ... }

type SelectValueType<Value, Multiple extends boolean | undefined> = Multiple extends true
  ? Value[]
  : Value;
```

**Pattern**: Conditional type based on `Multiple` boolean to determine single vs array value.

## Store Pattern with External Selectors

```typescript
import { useStore, Store } from '../utils/store';
import { selectors, type State as StoreState } from '../store';

const store = useRefWithInit(
  () =>
    new Store<StoreState>({
      id: generatedId,
      modal,
      multiple,
      value,
      open,
      mounted,
      transitionStatus,
      items,
      forceMount: false,
      openMethod: null,
      activeIndex: null,
      selectedIndex: null,
      popupProps: {},
      triggerProps: {},
      triggerElement: null,
      positionerElement: null,
      listElement: null,
      scrollUpArrowVisible: false,
      scrollDownArrowVisible: false,
      hasScrollArrows: false,
    }),
).current;

const activeIndex = useStore(store, selectors.activeIndex);
const selectedIndex = useStore(store, selectors.selectedIndex);
```

**Pattern**: Selectors in separate file for reusable store subscriptions.

## Floating-UI Integration

```typescript
const click = useClick(floatingContext, {
  enabled: !readOnly && !disabled,
  event: 'mousedown',
});

const dismiss = useDismiss(floatingContext, {
  bubbles: false,
});

const listNavigation = useListNavigation(floatingContext, {
  enabled: !readOnly && !disabled,
  listRef,
  activeIndex,
  selectedIndex,
  disabledIndices: EMPTY_ARRAY as number[],
  onNavigate(nextActiveIndex) {
    if (nextActiveIndex === null && !open) {
      return;  // Retain highlight while transitioning out
    }
    store.set('activeIndex', nextActiveIndex);
  },
  focusItemOnHover: false,  // Custom implementation
});

const typeahead = useTypeahead(floatingContext, {
  enabled: !readOnly && !disabled && (open || !multiple),
  listRef: labelsRef,
  activeIndex,
  selectedIndex,
  onMatch(index) {
    if (open) {
      store.set('activeIndex', index);
    } else {
      // Typeahead while closed changes value directly!
      setValue(valuesRef.current[index], createChangeEventDetails('none'));
    }
  },
});
```

**Pattern**: Four floating-ui hooks composed with custom focusItemOnHover logic.

## Item Value Serialization

```typescript
/**
 * When the item values are objects (`<Select.Item value={object}>`),
 * this function converts the object value to a string representation
 * for display in the trigger.
 */
itemToStringLabel?: (itemValue: Value) => string;

/**
 * When the item values are objects, this function converts the object
 * value to a string representation for form submission.
 */
itemToStringValue?: (itemValue: Value) => string;

/**
 * Custom comparison logic used to determine if a select item value
 * matches the current selected value.
 */
isItemEqualToValue?: (itemValue: Value, value: Value) => boolean;
```

**Pattern**: Separate label/value serialization + custom equality for object values.

## Hidden Input for Form Submission

```typescript
<input
  {...validation.getInputValidationProps({
    onFocus() {
      // Move focus to the trigger element when hidden input is focused.
      store.state.triggerElement?.focus();
    },
    onChange(event) {
      // Handle browser autofill
      const nextValue = event.target.value;
      // ... match against registered values
    },
  })}
  name={multiple ? undefined : name}
  value={serializedValue}
  disabled={disabled}
  required={required && !hasMultipleSelection}
  style={visuallyHidden}
  tabIndex={-1}
  aria-hidden
/>

{/* Multiple selection needs separate inputs */}
{hiddenInputs}
```

**Pattern**: Single hidden input for single select, multiple hidden inputs for multi-select.

## SelectItem with React.memo

```typescript
export const SelectItem = React.memo(
  React.forwardRef(function SelectItem(
    componentProps: SelectItem.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const highlighted = useStore(store, selectors.isActive, listItem.index);
    const selected = useStore(store, selectors.isSelected, listItem.index, value);

    // ... complex selection logic
  }),
);
```

**Pattern**: `React.memo` for items that render many times in list.

## Item Value Registration

```typescript
useIsoLayoutEffect(() => {
  if (!hasRegistered) {
    return undefined;
  }

  const values = valuesRef.current;
  values[index] = value;

  return () => {
    delete values[index];
  };
}, [hasRegistered, index, value, valuesRef]);
```

**Pattern**: Items register their values in parent's ref array on mount.

## Complex Mouse/Touch Handling

```typescript
const selectionRef = React.useRef({
  allowSelectedMouseUp: false,
  allowUnselectedMouseUp: false,
});

// In SelectItem:
onTouchStart() {
  selectionRef.current = {
    allowSelectedMouseUp: false,
    allowUnselectedMouseUp: false,
  };
},
onMouseUp(event) {
  const disallowSelectedMouseUp = !selectionRef.current.allowSelectedMouseUp && selected;
  const disallowUnselectedMouseUp = !selectionRef.current.allowUnselectedMouseUp && !selected;

  if (disallowSelectedMouseUp || disallowUnselectedMouseUp) {
    return;
  }
  commitSelection(event.nativeEvent);
},
```

**Pattern**: Complex touch/mouse guards to prevent accidental selection.

## Change Event Reasons

```typescript
export type SelectRootChangeEventReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.escapeKey
  | typeof REASONS.windowResize
  | typeof REASONS.itemPress
  | typeof REASONS.focusOut
  | typeof REASONS.listNavigation
  | typeof REASONS.cancelOpen
  | typeof REASONS.none;
```

**Note**: `windowResize` is unique to Select - popup closes on resize.

## Scroll Arrows

```typescript
scrollUpArrowVisible: false,
scrollDownArrowVisible: false,
hasScrollArrows: false,

const handleScrollArrowVisibility = useStableCallback(() => {
  const scroller = store.state.listElement || popupRef.current;
  const viewportTop = scroller.scrollTop;
  const viewportBottom = scroller.scrollTop + scroller.clientHeight;
  const shouldShowUp = viewportTop > 1;
  const shouldShowDown = viewportBottom < scroller.scrollHeight - 1;

  store.set('scrollUpArrowVisible', shouldShowUp);
  store.set('scrollDownArrowVisible', shouldShowDown);
});
```

**Pattern**: Scroll arrows show/hide based on scroll position - unique to Select.

## Field Integration

```typescript
const { clearErrors } = useFormContext();
const {
  setDirty,
  shouldValidateOnChange,
  validityData,
  setFilled,
  name: fieldName,
  disabled: fieldDisabled,
  validation,
} = useFieldRootContext();

useValueChanged(value, () => {
  clearErrors(name);
  setDirty(value !== validityData.initialValue);

  if (shouldValidateOnChange()) {
    validation.commit(value);
  } else {
    validation.commit(value, true);
  }
});
```

**Pattern**: Deep form integration with Field and Form contexts.

## What Makes This API Good

1. **Type-safe multi-select**: Conditional types for single vs array values
2. **Object value support**: Serialization and equality customization
3. **Full keyboard support**: Typeahead even when closed
4. **Scroll indicators**: Built-in scroll arrows
5. **Browser autofill**: Hidden input handles autofill correctly
6. **Form integration**: Works with Field validation
7. **React.memo items**: Performance optimized for large lists

## Complexity Warning

Select is the second most complex component due to:
- Generic type parameters with conditional types
- Multiple value serialization strategies
- Browser autofill handling
- Scroll arrow visibility management
- Complex touch/mouse interaction guards
- Typeahead while closed
- Multi-select with separate hidden inputs
