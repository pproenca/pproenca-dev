# Positioning Patterns

## 1. useAnchorPositioning Hook

Foundation for all positioned elements:

```typescript
const positioning = useAnchorPositioning({
  anchor: triggerElement,        // What to position relative to
  positionerRef,                 // Ref to positioned element
  side: 'bottom',                // 'top' | 'bottom' | 'left' | 'right'
  sideOffset: 0,                 // Gap from anchor
  align: 'start',                // 'start' | 'center' | 'end'
  alignOffset: 0,                // Offset along alignment axis
  collisionBoundary,             // Element(s) to avoid
  collisionPadding: 0,           // Padding from boundary
  arrowPadding: 0,               // Min distance from arrow to edge
  sticky: 'partial',             // 'partial' | 'always'
  trackAnchor: true,             // Update on anchor move
  mounted,                       // Only position when mounted
});

// Returns
const {
  styles,           // Position styles
  arrowStyles,      // Arrow position styles
  arrowRef,         // Ref for arrow element
  side,             // Computed side (may flip)
  align,            // Computed align (may shift)
  arrowUncentered,  // Arrow at edge of popup
} = positioning;
```

---

## 2. Collision Avoidance

Automatic repositioning to stay in viewport:

```typescript
// Side flipping: bottom -> top if no space
<Popover.Positioner
  side="bottom"
  collisionPadding={10}
>
  {/* Will flip to top if bottom has no space */}
</Popover.Positioner>

// Alignment shifting: start -> center -> end
<Popover.Positioner
  align="start"
  sticky="partial"  // Allow partial shifting
>
  {/* Will shift alignment to stay visible */}
</Popover.Positioner>
```

### Collision Boundary

```typescript
// Custom boundary element
<Popover.Positioner
  collisionBoundary={containerRef.current}
>
  {/* Stays within container, not viewport */}
</Popover.Positioner>

// Multiple boundaries
<Popover.Positioner
  collisionBoundary={[container1, container2]}
>
</Popover.Positioner>
```

---

## 3. Arrow Positioning

Arrows that point to anchor:

```typescript
<Popover.Positioner>
  <Popover.Popup>
    <Popover.Arrow />
    {content}
  </Popover.Popup>
</Popover.Positioner>

// Arrow receives position from context
export const PopoverArrow = React.forwardRef(function PopoverArrow(...) {
  const { arrowStyles, arrowRef, side, arrowUncentered } = usePopoverPositionerContext();

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, arrowRef],
    props: {
      style: arrowStyles,
      'data-side': side,
      'data-uncentered': arrowUncentered || undefined,
    },
  });
});
```

### Arrow Padding

```typescript
// Minimum distance from popup edge
<Popover.Positioner arrowPadding={8}>
  <Popover.Popup>
    <Popover.Arrow />  {/* Won't get closer than 8px to edge */}
  </Popover.Popup>
</Popover.Positioner>
```

---

## 4. Anchor Types

Different anchor sources:

```typescript
// Element anchor (trigger)
<Menu.Root>
  <Menu.Trigger>Click me</Menu.Trigger>  {/* Automatic anchor */}
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup />
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>

// Custom element anchor
<Popover.Root anchor={customElementRef.current}>
  {/* Positions relative to custom element */}
</Popover.Root>

// Virtual anchor (cursor position)
<ContextMenu.Root>
  {/* Uses right-click position as anchor */}
</ContextMenu.Root>
```

### Virtual Element Pattern

```typescript
// Create virtual element at cursor
const createVirtualElement = (x: number, y: number): VirtualElement => ({
  getBoundingClientRect: () => ({
    x,
    y,
    top: y,
    left: x,
    bottom: y,
    right: x,
    width: 0,
    height: 0,
  }),
});

// ContextMenu usage
const handleContextMenu = (event: React.MouseEvent) => {
  event.preventDefault();
  setAnchor(createVirtualElement(event.clientX, event.clientY));
  setOpen(true);
};
```

---

## 5. Sticky Behavior

How popup sticks to anchor:

```typescript
// 'partial': Keep some of popup visible
<Positioner sticky="partial">
  {/* Allows partial hiding */}
</Positioner>

// 'always': Always fully visible
<Positioner sticky="always">
  {/* Never clips */}
</Positioner>
```

---

## 6. Track Anchor

Update position as anchor moves:

```typescript
// Track anchor position (default)
<Positioner trackAnchor={true}>
  {/* Updates on scroll, resize, anchor move */}
</Positioner>

// Disable tracking for performance
<Positioner trackAnchor={false}>
  {/* Position fixed at open time */}
</Positioner>
```

### Tracking Implementation

```typescript
useEffect(() => {
  if (!trackAnchor || !mounted) return;

  const updatePosition = () => {
    // Recalculate position
    computePosition(anchor, positioner, options);
  };

  // Track scroll
  const scrollParents = getScrollParents(anchor);
  scrollParents.forEach(parent => {
    parent.addEventListener('scroll', updatePosition);
  });

  // Track resize
  window.addEventListener('resize', updatePosition);

  // Track anchor resize
  const resizeObserver = new ResizeObserver(updatePosition);
  resizeObserver.observe(anchor);

  return () => {
    scrollParents.forEach(parent => {
      parent.removeEventListener('scroll', updatePosition);
    });
    window.removeEventListener('resize', updatePosition);
    resizeObserver.disconnect();
  };
}, [trackAnchor, mounted, anchor]);
```

---

## 7. FloatingTree for Nesting

Coordinate nested positioned elements:

```typescript
// FloatingTree provides nesting context
<FloatingTree>
  <Menu.Root>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          {/* Nested menu */}
          <Menu.Root>  {/* Detects it's nested */}
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup>
                  {/* Positions relative to parent menu item */}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</FloatingTree>
```

### Node ID Pattern

```typescript
const nodeId = useFloatingNodeId();
const parentNodeId = useFloatingParentNodeId();
const nested = parentNodeId != null;

// Used for coordination
const { events } = useFloatingTree();

events.emit('menuopen', { nodeId, parentNodeId });
```

---

## 8. Safe Polygon Pattern

Prevent closing when moving to submenu:

```typescript
// PreviewCard, Menu use safePolygon
const { getFloatingProps } = useInteractions([
  useHover(context, {
    handleClose: safePolygon({
      requireIntent: true,
      buffer: 1,
    }),
  }),
]);

// safePolygon creates a polygon from:
// - Current cursor position
// - Popup edges

// Cursor inside polygon = keep open
// Cursor outside polygon = close
```

---

## 9. Cursor Tracking

Tooltip follows cursor:

```typescript
interface TooltipProps {
  trackCursor?: boolean;  // Follow cursor
}

// Implementation
const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

useEffect(() => {
  if (!trackCursor || !open) return;

  const handleMouseMove = (e: MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [trackCursor, open]);

// Use cursor as virtual anchor
const anchor = trackCursor
  ? createVirtualElement(cursorPosition.x, cursorPosition.y)
  : triggerElement;
```

---

## 10. Portal Container

Where portaled content renders:

```typescript
// Default: document.body
<Dialog.Portal>
  {children}
</Dialog.Portal>

// Custom container
<Dialog.Portal container={customContainer}>
  {children}
</Dialog.Portal>

// Function for dynamic container
<Dialog.Portal container={() => document.querySelector('#modals')}>
  {children}
</Dialog.Portal>
```

### Portal Mounting

```typescript
// Only render portal when open (default)
<Dialog.Portal keepMounted={false}>
  {/* Mounts/unmounts with open state */}
</Dialog.Portal>

// Keep in DOM for animations
<Dialog.Portal keepMounted={true}>
  {/* Always in DOM, hidden when closed */}
</Dialog.Portal>
```

---

## 11. Viewport Pattern

Shared container for multiple popups:

```typescript
// NavigationMenu renders content in shared viewport
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Content>
        {/* This content renders in viewport */}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>

  <NavigationMenu.Viewport />  {/* Shared container */}
</NavigationMenu.Root>

// Viewport shows content based on active value
export const NavigationMenuViewport = React.forwardRef(function(...) {
  const { activeValue, contentElements } = useNavigationMenuContext();

  const activeContent = activeValue
    ? contentElements.get(activeValue)
    : null;

  return (
    <div data-navigation-menu-viewport>
      {activeContent}
    </div>
  );
});
```

---

## 12. CSS Position Variables

Expose position data to CSS:

```typescript
// Positioner sets CSS variables
const style = {
  '--side': side,                           // 'top' | 'bottom' | 'left' | 'right'
  '--align': align,                         // 'start' | 'center' | 'end'
  '--anchor-width': `${anchorWidth}px`,     // Anchor dimensions
  '--anchor-height': `${anchorHeight}px`,
  '--available-width': `${availableWidth}px`,   // Space available
  '--available-height': `${availableHeight}px`,
  '--transform-origin': transformOrigin,    // For animations
} as React.CSSProperties;

// CSS usage
.popup {
  max-height: var(--available-height);
  transform-origin: var(--transform-origin);
}

.popup[data-side="top"] {
  animation: slideDown 200ms;
}

.popup[data-side="bottom"] {
  animation: slideUp 200ms;
}
```
