# Menu Component Analysis

**Files**: `packages/react/src/menu/`
**Pattern**: Most Complex Compound Component
**Sub-parts**: Root, Positioner, Popup, Trigger, Item, CheckboxItem, CheckboxItemIndicator, RadioGroup, RadioItem, RadioItemIndicator, Group, GroupLabel, Arrow, Backdrop, Portal, SubmenuRoot, SubmenuTrigger

## Directory Structure (20+ files)

```
menu/
├── index.ts
├── index.parts.ts
├── root/
│   ├── MenuRoot.tsx (~700 lines!)
│   └── MenuRootContext.ts
├── positioner/
│   └── MenuPositioner.tsx
├── popup/
│   └── MenuPopup.tsx
├── trigger/
│   └── MenuTrigger.tsx
├── item/
│   ├── MenuItem.tsx
│   └── MenuItemContext.ts
├── checkbox-item/
│   ├── MenuCheckboxItem.tsx
│   └── MenuCheckboxItemContext.ts
├── checkbox-item-indicator/
│   └── MenuCheckboxItemIndicator.tsx
├── radio-group/
│   └── MenuRadioGroup.tsx
├── radio-item/
│   ├── MenuRadioItem.tsx
│   └── MenuRadioItemContext.ts
├── radio-item-indicator/
│   └── MenuRadioItemIndicator.tsx
├── group/
│   └── MenuGroup.tsx
├── group-label/
│   └── MenuGroupLabel.tsx
├── arrow/
│   └── MenuArrow.tsx
├── backdrop/
│   └── MenuBackdrop.tsx
├── portal/
│   └── MenuPortal.tsx
├── submenu-root/
│   ├── MenuSubmenuRoot.tsx
│   └── MenuSubmenuRootContext.ts
├── submenu-trigger/
│   └── MenuSubmenuTrigger.tsx
├── store/
│   ├── MenuStore.ts
│   └── MenuHandle.ts
└── utils/
```

## Key Architectural Pattern: Multi-Parent Support

Menu can be a child of multiple parent types:

```typescript
export type MenuParent =
  | { type: 'menu'; store: MenuStore<unknown>; }
  | { type: 'menubar'; context: MenubarContext; }
  | { type: 'context-menu'; context: ContextMenuRootContext; }
  | { type: 'nested-context-menu'; context: ContextMenuRootContext; menuContext: MenuRootContext; }
  | { type: undefined; };

const parentFromContext: MenuParent = React.useMemo(() => {
  if (isSubmenu && parentMenuRootContext) {
    return { type: 'menu', store: parentMenuRootContext.store };
  }
  if (menubarContext) {
    return { type: 'menubar', context: menubarContext };
  }
  if (contextMenuContext && !parentMenuRootContext) {
    return { type: 'context-menu', context: contextMenuContext };
  }
  return { type: undefined };
}, [...]);
```

## Comprehensive Floating-UI Integration

```typescript
const dismiss = useDismiss(floatingRootContext, {
  enabled: !disabled,
  bubbles: { escapeKey: closeParentOnEsc && parent.type === 'menu' },
  outsidePress() { /* complex logic */ },
  externalTree: nested ? floatingTreeRoot : undefined,
});

const role = useRole(floatingRootContext, { role: 'menu' });

const listNavigation = useListNavigation(floatingRootContext, {
  enabled: !disabled,
  listRef: store.context.itemDomElements,
  activeIndex,
  nested: parent.type !== undefined,
  loopFocus,
  orientation,
  parentOrientation: parent.type === 'menubar' ? parent.context.orientation : undefined,
  rtl: direction === 'rtl',
  disabledIndices: EMPTY_ARRAY,
  onNavigate: setActiveIndex,
  openOnArrowKeyDown: parent.type !== 'context-menu',
  externalTree: nested ? floatingTreeRoot : undefined,
  focusItemOnHover: highlightItemOnHover,
});

const typeahead = useTypeahead(floatingRootContext, {
  listRef: store.context.itemLabels,
  activeIndex,
  resetMs: TYPEAHEAD_RESET_MS,
  onMatch: (index) => { ... },
  onTypingChange,
});
```

**Pattern**: Four floating-ui hooks composed: dismiss, role, listNavigation, typeahead.

## Complex setOpen Logic

The `setOpen` function is ~100 lines handling:

- Event cancellation
- FloatingEvents emission
- Touch interaction guards
- TabIndex cleanup
- Mobile touch delay protection
- Instant animation type based on reason
- Parent type-specific behavior

```typescript
const setOpen = useStableCallback((nextOpen, eventDetails) => {
  // ... 100+ lines of logic

  if (reason === REASONS.triggerHover) {
    ReactDOM.flushSync(changeState);  // Sync state for hover!
  } else {
    changeState();
  }

  if (parent.type === 'menubar' && /* various reasons */) {
    store.set('instantType', 'group');
  } else if (isKeyboardClick || isDismissClose) {
    store.set('instantType', isKeyboardClick ? 'click' : 'dismiss');
  }
});
```

## Change Event Reasons (Most Comprehensive)

```typescript
export type MenuRootChangeEventReason =
  | typeof REASONS.triggerHover
  | typeof REASONS.triggerFocus
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.focusOut
  | typeof REASONS.listNavigation // Unique!
  | typeof REASONS.escapeKey
  | typeof REASONS.itemPress // Unique!
  | typeof REASONS.closePress
  | typeof REASONS.siblingOpen // Unique!
  | typeof REASONS.cancelOpen // Unique!
  | typeof REASONS.imperativeAction
  | typeof REASONS.none;
```

Menu has the most event reasons due to its complex interaction model.

## Hover Behavior Management

```typescript
useIsoLayoutEffect(() => {
  if (!open && !hoverEnabled) {
    store.set('hoverEnabled', true);
  }
}, [open, hoverEnabled, store]);

const popupProps = React.useMemo(
  () => getFloatingProps({
    onMouseEnter() {
      if (parent.type === 'menu') {
        disableHoverTimeout.request(() => store.set('hoverEnabled', false));
      }
    },
    onMouseMove() {
      store.set('allowMouseEnter', true);
    },
    onClick() {
      if (store.select('hoverEnabled')) {
        store.set('hoverEnabled', false);
      }
    },
  }),
  [...],
);
```

**Pattern**: Complex hover state management for submenus.

## FloatingTree Conditional Wrapping

```typescript
if (parent.type === undefined || parent.type === 'context-menu') {
  return <FloatingTree externalTree={floatingTreeRoot}>{content}</FloatingTree>;
}

return content;
```

Only top-level menus wrap in FloatingTree.

## Item Props Distribution

```typescript
const { getReferenceProps, getFloatingProps, getItemProps, getTriggerProps } =
  useInteractions([dismiss, role, listNavigation, typeahead]);

const itemProps = React.useMemo(() => getItemProps(), [getItemProps]);

store.useSyncedValues({
  // ...
  itemProps, // Distributed to all menu items
});
```

**Pattern**: Item props calculated once at root, distributed via store.

## What Makes This API Good

1. **Multi-parent support**: Works in menu, menubar, context-menu
2. **Full keyboard navigation**: Arrow keys, typeahead, loop focus
3. **Submenu support**: First-class nested menu handling
4. **Checkbox/Radio items**: Form controls within menus
5. **Hover intelligence**: Complex hover state for UX polish
6. **Event reason richness**: Precise control over behavior

## Complexity Warning

Menu is the most complex component in the library due to:

- Multiple parent contexts to consume
- Submenu nesting
- Menubar integration
- Context menu integration
- Complex hover state machine
- Typeahead search
- Keyboard navigation
- Touch interaction guards
- Animation instant type logic

Study this component last, after understanding simpler patterns.
