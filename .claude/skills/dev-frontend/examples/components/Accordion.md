# Accordion Component Analysis

**Files**: `packages/react/src/accordion/`
**Pattern**: Compound Component with Collapsible Reuse
**Sub-parts**: Root, Item, Header, Panel, Trigger

## Directory Structure

```
accordion/
├── index.ts
├── index.parts.ts
├── root/
│   ├── AccordionRoot.tsx
│   └── AccordionRootContext.ts
├── item/
│   ├── AccordionItem.tsx
│   ├── AccordionItemContext.ts
│   └── stateAttributesMapping.ts
├── header/
│   └── AccordionHeader.tsx
├── panel/
│   └── AccordionPanel.tsx
└── trigger/
    └── AccordionTrigger.tsx
```

## Key Architectural Pattern: Collapsible Reuse

AccordionItem reuses `useCollapsibleRoot` internally:

```typescript
import { useCollapsibleRoot } from '../../collapsible/root/useCollapsibleRoot';
import { CollapsibleRootContext } from '../../collapsible/root/CollapsibleRootContext';

const collapsible = useCollapsibleRoot({
  open: isOpen,
  onOpenChange,
  disabled,
});

return (
  <CollapsibleRootContext.Provider value={collapsibleContext}>
    <AccordionItemContext.Provider value={accordionItemContext}>
      {element}
    </AccordionItemContext.Provider>
  </CollapsibleRootContext.Provider>
);
```

**Why**: Accordion is essentially "multiple coordinated collapsibles". Reusing Collapsible logic avoids duplication while adding accordion-specific coordination.

## Value-Based Multi-Select State

```typescript
export type AccordionValue = (any | null)[];

const [value, setValue] = useControlled({
  controlled: valueProp,
  default: defaultValue,
  name: 'Accordion',
  state: 'value',
});

const handleValueChange = useStableCallback((newValue, nextOpen) => {
  const details = createChangeEventDetails(REASONS.none);
  if (!multiple) {
    // Single mode: toggle or close
    const nextValue = value[0] === newValue ? [] : [newValue];
    // ...
  } else if (nextOpen) {
    // Multi mode: add to array
    const nextOpenValues = value.slice();
    nextOpenValues.push(newValue);
    // ...
  } else {
    // Multi mode: remove from array
    const nextOpenValues = value.filter((v) => v !== newValue);
    // ...
  }
});
```

**Pattern**: Array-based value allows `multiple` prop to work naturally.

## Props Interface

```typescript
export interface AccordionRootProps extends HeadlessComponentProps<'div', AccordionRoot.State> {
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  loopFocus?: boolean;
  onValueChange?: (value: AccordionValue, eventDetails: AccordionRootChangeEventDetails) => void;
  multiple?: boolean;
  orientation?: Orientation;
}

export interface AccordionItemProps extends HeadlessComponentProps<'div', AccordionItem.State> {
  value?: any;  // Identifies this item in the array
  disabled?: boolean;
  onOpenChange?: (open: boolean, eventDetails: AccordionItem.ChangeEventDetails) => void;
}
```

## CompositeList Integration

```typescript
import { CompositeList } from '../../composite/list/CompositeList';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';

// In Root:
return (
  <AccordionRootContext.Provider value={contextValue}>
    <CompositeList elementsRef={accordionItemRefs}>{element}</CompositeList>
  </AccordionRootContext.Provider>
);

// In Item:
const { ref: listItemRef, index } = useCompositeListItem();
```

**Pattern**: CompositeList provides ref tracking for keyboard navigation without rendering extra DOM.

## Value Auto-Generation

```typescript
const fallbackValue = useComponentId();
const value = valueProp ?? fallbackValue;
```

If no `value` prop is provided, a unique ID is generated automatically.

## Dual Context Pattern

AccordionItem provides two contexts:
1. `CollapsibleRootContext` - For Trigger/Panel (collapsible behavior)
2. `AccordionItemContext` - For accordion-specific state

```typescript
const accordionItemContext: AccordionItemContext = React.useMemo(
  () => ({
    open: isOpen,
    state,
    setTriggerId,
    triggerId,
  }),
  [isOpen, state, setTriggerId, triggerId],
);
```

## State Derivation

Item's open state is derived from root's value array:

```typescript
const isOpen = React.useMemo(() => {
  if (!openValues) {
    return false;
  }

  for (let i = 0; i < openValues.length; i += 1) {
    if (openValues[i] === value) {
      return true;
    }
  }

  return false;
}, [openValues, value]);
```

## Accessibility

```typescript
// In Root:
{
  dir: direction,
  role: 'region',
}
```

Individual items inherit accessibility from Collapsible (trigger = button, panel = region).

## What Makes This API Good

1. **Collapsible reuse**: Animation and mounting logic inherited
2. **Flexible value**: Any type for item identification
3. **Single/multiple modes**: Easy switch between behaviors
4. **Auto-generated IDs**: No boilerplate for simple cases
5. **Keyboard navigation**: Via CompositeList
6. **Orientation support**: Horizontal and vertical

## Key Pattern: Hook Composition

Accordion demonstrates composition of multiple hooks:
- `useControlled` - Value management
- `useCollapsibleRoot` - Collapsible behavior (reused)
- `useCompositeListItem` - Index tracking
- `useStableCallback` - Stable event handlers
- `useDirection` - RTL support
