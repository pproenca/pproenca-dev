# Dialog Component Analysis

**Files**: `packages/react/src/dialog/`
**Pattern**: Complex Compound with Store Pattern
**Sub-parts**: Root, Popup, Portal, Trigger, Close, Backdrop, Title, Description, Viewport

## Directory Structure

```
dialog/
├── index.ts
├── index.parts.ts
├── root/
│   ├── DialogRoot.tsx          # No forwardRef - doesn't render!
│   ├── DialogRootContext.ts
│   └── useDialogRoot.ts
├── popup/
│   ├── DialogPopup.tsx
│   └── DialogPopupCssVars.ts
├── portal/
│   └── DialogPortal.tsx
├── trigger/
│   └── DialogTrigger.tsx
├── close/
│   └── DialogClose.tsx
├── backdrop/
│   └── DialogBackdrop.tsx
├── title/
│   └── DialogTitle.tsx
├── description/
│   └── DialogDescription.tsx
├── viewport/
│   └── DialogViewport.tsx
└── store/
    ├── DialogStore.ts
    └── DialogHandle.ts
```

## Key Architectural Pattern: Store-Based State

Dialog uses a custom store instead of useState:

```typescript
import { DialogStore } from "../store/DialogStore";

const store = useRefWithInit(() => {
  return (
    handle?.store ??
    new DialogStore<Payload>({
      open: openProp ?? defaultOpen,
      activeTriggerId:
        triggerIdProp !== undefined ? triggerIdProp : defaultTriggerIdProp,
      modal,
      disablePointerDismissal,
      nested,
    })
  );
}).current;

// Controlled prop sync
store.useControlledProp("open", openProp, defaultOpen);
store.useControlledProp("activeTriggerId", triggerIdProp, defaultTriggerIdProp);
store.useSyncedValues({ disablePointerDismissal, nested, modal });
store.useContextCallback("onOpenChange", onOpenChange);
```

**Why**: Dialog has many interconnected state values. A store centralizes updates and enables external handles.

## No DOM Render Pattern

DialogRoot is unique - it doesn't use forwardRef and renders no HTML:

```typescript
export function DialogRoot<Payload>(props: DialogRoot.Props<Payload>) {
  // ... setup

  return (
    <DialogRootContext.Provider value={contextValue as DialogRootContext}>
      {typeof children === 'function' ? children({ payload }) : children}
    </DialogRootContext.Provider>
  );
}
```

**Pattern**: Root is purely a state/context provider. DialogPopup renders the actual dialog element.

## Generic Payload Support

```typescript
export function DialogRoot<Payload>(props: DialogRoot.Props<Payload>) { ... }

export interface DialogRootProps<Payload = unknown> {
  children?: React.ReactNode | PayloadChildRenderFunction<Payload>;
  handle?: DialogHandle<Payload>;
  // ...
}
```

**Pattern**: Dialog can carry typed payload data for advanced use cases.

## Modal Modes

```typescript
modal?: boolean | 'trap-focus';
```

Three modes:

- `true`: Full modal (focus trap + scroll lock + outside interaction disabled)
- `false`: Non-modal (all interactions allowed)
- `'trap-focus'`: Focus trapped but scroll/outside interactions allowed

## Nested Dialog Support

```typescript
const parentDialogRootContext = useDialogRootContext(true);
const nested = Boolean(parentDialogRootContext);

// In state:
nestedOpenDialogCount: store.useState("nestedOpenDialogCount");
nestedDialogOpen: nestedOpenDialogCount > 0;
```

**Pattern**: Dialogs can be nested, with parent aware of child open states.

## Popup with FloatingFocusManager

```typescript
import { FloatingFocusManager } from '../../floating-ui-react';

return (
  <FloatingFocusManager
    context={floatingRootContext}
    openInteractionType={openMethod}
    disabled={!mounted}
    closeOnFocusOut={!disablePointerDismissal}
    initialFocus={resolvedInitialFocus}
    returnFocus={finalFocus}
    modal={modal !== false}
    restoreFocus="popup"
  >
    {element}
  </FloatingFocusManager>
);
```

**Pattern**: Focus management delegated to floating-ui.

## Smart Initial Focus

```typescript
function defaultInitialFocus(interactionType: InteractionType) {
  if (interactionType === "touch") {
    return store.context.popupRef.current; // Focus popup, not first tabbable
  }
  return true; // Default behavior
}
```

**Why**: On touch, focusing the popup prevents virtual keyboard from opening.

## Change Event Reasons

```typescript
export type DialogRootChangeEventReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.escapeKey
  | typeof REASONS.closePress
  | typeof REASONS.focusOut
  | typeof REASONS.imperativeAction
  | typeof REASONS.none;
```

Dialog has the most comprehensive reason tracking.

## Imperative Actions API

```typescript
actionsRef?: React.RefObject<DialogRoot.Actions>;

export interface DialogRootActions {
  unmount: () => void;  // Manual unmount control
  close: () => void;    // Imperative close
}
```

**Pattern**: Escape hatch for animation libraries that need manual lifecycle control.

## Event Details Extension

```typescript
export type DialogRootChangeEventDetails =
  ChangeEventDetails<DialogRoot.ChangeEventReason> & {
    preventUnmountOnClose(): void; // Custom method!
  };
```

**Pattern**: Event details can include methods, not just data.

## CSS Variables

```typescript
// DialogPopupCssVars.ts
style: {
  [DialogPopupCssVars.nestedDialogs]: nestedOpenDialogCount,
}
```

Exposes `--nested-dialogs` CSS variable for styling based on nesting depth.

## What Makes This API Good

1. **Store pattern**: Centralized state for complex interactions
2. **Payload generics**: Type-safe data passing
3. **Modal modes**: Flexible modal/non-modal behavior
4. **Nested support**: First-class nested dialog handling
5. **Imperative escape hatch**: For advanced animation control
6. **Smart focus**: Context-aware initial focus
7. **Rich event reasons**: Know exactly why dialog closed

## Anti-Pattern Warning

Dialog's complexity shows when NOT to use this architecture:

- Simple state → useState
- Few values → Context
- Complex interconnected state → Store pattern

Most components should NOT use stores. Dialog is exceptional due to:

- Many interdependent state values
- External handle requirement
- Nested dialog coordination
- Animation lifecycle control
