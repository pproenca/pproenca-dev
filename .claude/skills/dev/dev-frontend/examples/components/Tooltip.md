# Tooltip Component Analysis

**Files**: `packages/react/src/tooltip/`
**Pattern**: Complex Compound with Hover Behavior
**Sub-parts**: Root, Provider, Positioner, Popup, Trigger, Arrow, Portal, Viewport

## Directory Structure

```
tooltip/
├── index.ts
├── index.parts.ts
├── root/
│   ├── TooltipRoot.tsx
│   └── TooltipRootContext.ts
├── provider/              # Unique to Tooltip!
│   └── TooltipProvider.tsx
├── positioner/
│   ├── TooltipPositioner.tsx
│   └── TooltipPositionerContext.ts
├── popup/
│   └── TooltipPopup.tsx
├── trigger/
│   └── TooltipTrigger.tsx
├── portal/
│   └── TooltipPortal.tsx
├── arrow/
│   └── TooltipArrow.tsx
├── viewport/
│   └── TooltipViewport.tsx
├── store/
│   ├── TooltipStore.ts
│   └── TooltipHandle.ts
└── utils/
```

## Key Unique Feature: TooltipProvider

Tooltip has a `Provider` component not found in other popups:

```typescript
// Usage:
<Tooltip.Provider delay={200} skipDelayDuration={500}>
  <Tooltip.Root>...</Tooltip.Root>
  <Tooltip.Root>...</Tooltip.Root>  {/* Share delay state */}
</Tooltip.Provider>
```

**Why**: Multiple tooltips should share open/close delay state for smooth UX.

## Instant Phase Management

Complex logic for adjacent tooltip transitions:

```typescript
// Animations should be instant in two cases:
// 1) Opening during the provider's instant phase (adjacent tooltip opens instantly)
// 2) Closing because another tooltip opened (reason === 'none')
useIsoLayoutEffect(() => {
  if (
    (transitionStatus === "ending" && lastOpenChangeReason === REASONS.none) ||
    (transitionStatus !== "ending" && isInstantPhase)
  ) {
    if (instantType !== "delay") {
      previousInstantTypeRef.current = instantType;
    }
    store.set("instantType", "delay");
  } else if (previousInstantTypeRef.current !== null) {
    store.set("instantType", previousInstantTypeRef.current);
    previousInstantTypeRef.current = null;
  }
}, [
  transitionStatus,
  isInstantPhase,
  lastOpenChangeReason,
  instantType,
  store,
]);
```

**Pattern**: Preserve instant type during transitions, restore after.

## Cursor Tracking

```typescript
trackCursorAxis?: 'none' | 'x' | 'y' | 'both';

const clientPoint = useClientPoint(floatingRootContext, {
  enabled: !disabled && trackCursorAxis !== 'none',
  axis: trackCursorAxis === 'none' ? undefined : trackCursorAxis,
});
```

Tooltip can follow cursor on X, Y, or both axes.

## Floating-UI Hooks

Different hook composition than Popover:

```typescript
const focus = useFocus(floatingRootContext, { enabled: !disabled });
const dismiss = useDismiss(floatingRootContext, { enabled: !disabled, referencePress: true });
const clientPoint = useClientPoint(floatingRootContext, { ... });

const { getReferenceProps, getFloatingProps, getTriggerProps } = useInteractions([
  focus,
  dismiss,
  clientPoint,
]);
```

**Note**: `useFocus` instead of `useRole` - tooltips open on focus/hover, not click.

## Disabled State Handling

```typescript
const open = !disabled && openState;

useIsoLayoutEffect(() => {
  if (openState && disabled) {
    store.setOpen(false, createChangeEventDetails(REASONS.disabled));
  }
}, [openState, disabled, store]);
```

**Pattern**: Force close if disabled while open.

## Hoverable Popup

```typescript
disableHoverablePopup?: boolean;
```

When false (default), users can hover over the tooltip content without it closing.

## Props Interface

```typescript
export interface TooltipRootProps<Payload = unknown> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (
    open: boolean,
    eventDetails: TooltipRoot.ChangeEventDetails,
  ) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  disableHoverablePopup?: boolean;
  trackCursorAxis?: "none" | "x" | "y" | "both";
  actionsRef?: React.RefObject<TooltipRoot.Actions>;
  disabled?: boolean;
  handle?: TooltipHandle<Payload>;
  children?: React.ReactNode | PayloadChildRenderFunction<Payload>;
  triggerId?: string | null;
  defaultTriggerId?: string | null;
}
```

## Change Event Reasons

```typescript
export type TooltipRootChangeEventReason =
  | typeof REASONS.triggerHover
  | typeof REASONS.triggerFocus
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.escapeKey
  | typeof REASONS.disabled // Unique to Tooltip!
  | typeof REASONS.imperativeAction
  | typeof REASONS.none;
```

**Note**: `REASONS.disabled` is unique - other components don't emit this.

## What Makes This API Good

1. **Provider for delay sharing**: Smooth multi-tooltip UX
2. **Cursor tracking**: Follow mouse for context-aware positioning
3. **Instant phase**: Adjacent tooltips animate smoothly
4. **Hoverable content**: Default allows hovering over tooltip
5. **Disabled reason**: Clear event when programmatically disabled
6. **Focus support**: Opens on focus for keyboard users

## Key Pattern: No Modal Support

Unlike Popover/Dialog, Tooltip has no `modal` prop. Tooltips are always non-modal by design.

## Key Pattern: Light Store Usage

Tooltip uses the store pattern but with less complexity than Menu:

```typescript
const store = TooltipStore.useStore<Payload>(handle?.store, {
  open: openProp ?? defaultOpen,
  activeTriggerId:
    triggerIdProp !== undefined ? triggerIdProp : defaultTriggerIdProp,
});
```

Store mainly tracks: open, activeTriggerId, payload, floatingRootContext.
