# Composition Patterns

## 1. Compound Component Pattern

The foundational architecture for multi-part components:

```typescript
// Pattern: Root provides context, children consume it
export function DialogRoot(props: DialogRoot.Props) {
  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    modal,
    // ...
  }), [open, setOpen, modal]);

  return (
    <DialogRootContext.Provider value={contextValue}>
      {props.children}
    </DialogRootContext.Provider>
  );
}

// Sub-components consume context
export const DialogTrigger = React.forwardRef(function DialogTrigger(...) {
  const { open, setOpen } = useDialogRootContext();
  // ...
});
```

### Compound Hierarchy Examples

```typescript
// Simple compound (2 parts)
<Switch.Root>
  <Switch.Thumb />
</Switch.Root>

// Medium compound (3-4 parts)
<Accordion.Root>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Trigger />
    </Accordion.Header>
    <Accordion.Panel />
  </Accordion.Item>
</Accordion.Root>

// Complex compound (5+ parts)
<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Group>
          <Select.GroupLabel />
          <Select.Item>
            <Select.ItemText />
            <Select.ItemIndicator />
          </Select.Item>
        </Select.Group>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

---

## 2. Variant via Wrapper Pattern

Create variants by wrapping and constraining:

```typescript
// AlertDialog wraps Dialog with restrictions
export function AlertDialogRoot(props: AlertDialogRoot.Props) {
  return (
    <Dialog.Root
      {...props}
      dismissible={false}  // Fixed: cannot be dismissed
      modal={true}         // Fixed: always modal
    />
  );
}

export interface AlertDialogRootProps
  extends Omit<Dialog.Root.Props, 'dismissible' | 'modal'> {
  // Re-declare with documentation but don't allow override
}
```

### Autocomplete Wrapping Combobox

```typescript
export function AutocompleteRoot<Value>(
  props: AutocompleteRoot.Props<Value>,
) {
  return (
    <Combobox.Root
      {...props}
      selectionMode="none"  // Fixed: no selection
    />
  );
}
```

### ContextMenu Wrapping Menu

```typescript
export function ContextMenuRoot(props: ContextMenuRoot.Props) {
  // Custom trigger handling for right-click
  const [open, setOpen] = useControlled(...);
  const [anchor, setAnchor] = useState<VirtualElement | null>(null);

  return (
    <Menu.Root
      {...otherProps}
      open={open}
      onOpenChange={setOpen}
      anchor={anchor}  // Virtual element at cursor
    />
  );
}
```

---

## 3. Hook Reuse Pattern

Extract logic to hooks for composition:

```typescript
// Accordion reuses Collapsible logic
function useAccordionItem(params) {
  const { open, setOpen, panelId, triggerId, ... } = useCollapsibleRoot({
    open: isOpen,
    onOpenChange: (nextOpen, details) => {
      if (nextOpen) {
        accordionContext.handleValueChange(value);
      } else {
        accordionContext.handleValueChange(undefined);
      }
    },
  });

  return {
    open,
    setOpen,
    panelId,
    triggerId,
  };
}
```

### Extracted Logic Hooks

```typescript
// Pattern: Component-specific hooks
useDialogRoot()       // Dialog state management
usePopoverRoot()      // Popover with positioning
useTooltipRoot()      // Tooltip with delay management
useCollapsibleRoot()  // Collapsible animation logic
useSliderRoot()       // Slider value management
useNumberFieldRoot()  // Number formatting and stepping
```

---

## 4. Context Consumption Pattern

Multiple contexts for rich integration:

```typescript
// Radio consumes 4 contexts
const radioGroupContext = useRadioGroupContext();
const fieldRootContext = useFieldRootContext();
const fieldItemContext = useFieldItemContext();
const labelableContext = useLabelableContext();

// Merge disabled from all sources
const disabled =
  fieldRootContext.disabled ||
  fieldItemContext.disabled ||
  radioGroupContext.disabled ||
  disabledProp;
```

### Context Priority Rules

```typescript
// Generally: prop > parent context > grandparent context
const value = propValue ?? parentContext.value ?? grandparentContext.value;

// For disabled: any true wins (OR logic)
const disabled = propDisabled || parentDisabled || grandparentDisabled;

// For required: any true wins (OR logic)
const required = propRequired || parentRequired || grandparentRequired;
```

---

## 5. Standalone vs Grouped Pattern

Components that work alone or in groups:

```typescript
// Toggle detects group context
const groupContext = useToggleGroupContext(true);  // optional = true
const isGrouped = groupContext !== undefined;

if (isGrouped) {
  // Delegate to CompositeItem
  return <CompositeItem {...} />;
} else {
  // Render as standalone button
  return useRenderElement('button', ...);
}
```

### Conditional Rendering Based on Context

```typescript
// Radio: CompositeItem only in RadioGroup
const isRadioGroup = setCheckedValue !== NOOP;

return (
  <RadioRootContext.Provider value={contextValue}>
    {isRadioGroup ? (
      <CompositeItem ... />
    ) : (
      element  // Plain span
    )}
    <input {...inputProps} />
  </RadioRootContext.Provider>
);
```

---

## 6. Portal Pattern

Rendering outside DOM hierarchy:

```typescript
// Portal moves content to container
<Dialog.Portal container={document.body}>
  <Dialog.Backdrop />
  <Dialog.Popup />
</Dialog.Portal>

// Implementation
export function DialogPortal(props: DialogPortal.Props) {
  const { container = document.body, children } = props;

  if (!mounted) {
    return null;
  }

  return ReactDOM.createPortal(children, container);
}
```

### Portal + Positioner Pattern

```typescript
<Select.Portal>
  <Select.Positioner>  {/* Handles positioning */}
    <Select.Popup>     {/* The actual popup */}
      {/* content */}
    </Select.Popup>
  </Select.Positioner>
</Select.Portal>
```

---

## 7. Provider Pattern

Shared state across component tree:

```typescript
// Tooltip.Provider shares delay state
<Tooltip.Provider>
  <Tooltip.Root>...</Tooltip.Root>
  <Tooltip.Root>...</Tooltip.Root>  {/* Shares instant state */}
  <Tooltip.Root>...</Tooltip.Root>
</Tooltip.Provider>

// Implementation
export function TooltipProvider(props: TooltipProvider.Props) {
  const [isInstantPhase, setIsInstantPhase] = useState(false);
  const closeDelayRef = useRef(CLOSE_DELAY);

  const contextValue = useMemo(() => ({
    isInstantPhase,
    setIsInstantPhase,
    closeDelayRef,
  }), [isInstantPhase]);

  return (
    <TooltipProviderContext.Provider value={contextValue}>
      {children}
    </TooltipProviderContext.Provider>
  );
}
```

---

## 8. Positioner Pattern

Floating element positioning:

```typescript
// Positioner handles all positioning logic
export const SelectPositioner = React.forwardRef(function SelectPositioner(...) {
  const {
    side = 'bottom',
    sideOffset = 0,
    align = 'start',
    alignOffset = 0,
    collisionBoundary,
    collisionPadding,
    arrowPadding,
    sticky = 'partial',
    keepMounted = false,
  } = props;

  const positioning = useAnchorPositioning({
    anchor: triggerElement,
    positionerRef,
    side,
    sideOffset,
    align,
    alignOffset,
    collisionBoundary,
    collisionPadding,
    arrowPadding,
    sticky,
    trackAnchor,
    mounted,
  });

  // Returns positioned element with CSS custom properties
});
```

### Positioning Props Pattern

```typescript
interface PositionerProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  collisionBoundary?: Element | Element[];
  collisionPadding?: number | Partial<Record<Side, number>>;
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  keepMounted?: boolean;
}
```

---

## 9. Nesting Pattern

Components that can nest within themselves:

```typescript
// Menu nesting with FloatingTree
<Menu.Root>
  <Menu.Trigger />
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.SubmenuTrigger />  {/* Triggers nested menu */}
        <Menu.Root>  {/* Nested menu */}
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                {/* Nested content */}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>
```

### FloatingTree Context

```typescript
const { events: floatingTreeEvents } = useFloatingTree();
const nodeId = useFloatingNodeId();

// Parent detection
const parentNodeId = useFloatingParentNodeId();
const nested = parentNodeId != null;
```

---

## 10. CompositeRoot/Item Pattern

Keyboard navigation for lists:

```typescript
// CompositeRoot manages focus and keyboard navigation
<CompositeRoot
  orientation="horizontal"
  loop
  onNavigate={handleNavigate}
>
  <CompositeItem>Item 1</CompositeItem>
  <CompositeItem>Item 2</CompositeItem>
  <CompositeItem>Item 3</CompositeItem>
</CompositeRoot>

// Used by: Tabs, RadioGroup, Menu, Select, Toolbar, etc.
```

### CompositeList for Dynamic Items

```typescript
// Slider thumbs use CompositeList
<CompositeList elementsRef={thumbRefs}>
  {thumbs.map((_, index) => (
    <Slider.Thumb key={index} />
  ))}
</CompositeList>
```

---

## 11. Viewport Pattern

Shared container for multiple popups:

```typescript
// NavigationMenu viewport shows active content
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger />
      <NavigationMenu.Content>
        {/* Content rendered in viewport */}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>

  <NavigationMenu.Viewport />  {/* Shared container */}
</NavigationMenu.Root>
```

### Viewport Implementation

```typescript
// Viewport renders the currently active content
const { activeContentId, contentElements } = useNavigationMenuContext();

const activeContent = contentElements.get(activeContentId);
```

---

## 12. External Manager Pattern

State management outside React:

```typescript
// Toast uses external manager
const toastManager = new ToastManager();

// In React
<Toast.Provider toastManager={toastManager}>
  <Toast.Viewport />
</Toast.Provider>

// Usage anywhere (including outside React)
toastManager.add({
  title: 'Success',
  description: 'Item saved',
});
```

### Manager Implementation

```typescript
class ToastManager {
  private listeners = new Set<(toasts: Toast[]) => void>();
  private toasts: Toast[] = [];

  add(toast: ToastData): string {
    const id = generateId();
    this.toasts = [...this.toasts, { ...toast, id }];
    this.notify();
    return id;
  }

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.toasts));
  }
}
```
