# Accessibility Patterns

## 1. ARIA Role Mapping

Semantic roles for custom components:

```typescript
// Role based on element type
const rootProps = {
  role: "checkbox", // Checkbox
  role: "radio", // Radio
  role: "switch", // Switch
  role: "slider", // Slider
  role: "progressbar", // Progress
  role: "meter", // Meter
  role: "dialog", // Dialog
  role: "alertdialog", // AlertDialog
  role: "menu", // Menu popup
  role: "menuitem", // Menu item
  role: "menuitemcheckbox", // Menu checkbox item
  role: "menuitemradio", // Menu radio item
  role: "listbox", // Select/Combobox popup
  role: "option", // Select/Combobox item
  role: "combobox", // Combobox input
  role: "tablist", // Tabs list
  role: "tab", // Tab trigger
  role: "tabpanel", // Tab content
  role: "separator", // Separator
  role: "toolbar", // Toolbar
  role: "navigation", // NavigationMenu (root)
};
```

### Priority-Based Role

```typescript
// Toast role changes based on priority
const role = priority === 'high' ? 'alert' : 'status';
const ariaLive = priority === 'high' ? 'assertive' : 'polite';

<div
  role={role}
  aria-live={ariaLive}
  aria-atomic="true"
>
  {content}
</div>
```

---

## 2. ARIA State Attributes

Communicating component state:

```typescript
// Boolean states
'aria-checked': checked,              // Checkbox, Radio, Switch
'aria-pressed': pressed,              // Toggle
'aria-expanded': expanded,            // Accordion, Disclosure, Menu trigger
'aria-selected': selected,            // Tab, Select item
'aria-disabled': disabled || undefined,
'aria-required': required || undefined,
'aria-invalid': invalid || undefined,
'aria-hidden': true,                  // Hidden elements

// Tristate
'aria-checked': indeterminate ? 'mixed' : checked,  // Checkbox with indeterminate

// Value states
'aria-valuenow': value,               // Slider, Progress
'aria-valuemin': min,
'aria-valuemax': max,
'aria-valuetext': valueText,          // Human-readable value

// Orientation
'aria-orientation': orientation,       // 'horizontal' | 'vertical'
```

---

## 3. ARIA Relationships

Connecting related elements:

```typescript
// Label association
'aria-labelledby': labelId,           // Points to label element

// Description association
'aria-describedby': descriptionId,    // Points to description/error

// Controls relationship
'aria-controls': controlledId,        // What this element controls

// Owns relationship
'aria-owns': ownedId,                 // For elements outside DOM hierarchy

// Active descendant (for composite widgets)
'aria-activedescendant': activeItemId,

// Popup relationship
'aria-haspopup': 'dialog',            // 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid'
```

### ID Coordination Pattern

```typescript
// Generate coordinated IDs
const titleId = useId();
const descriptionId = useId();
const controlId = useId();

// Apply to related elements
<Dialog.Title id={titleId}>Title</Dialog.Title>
<Dialog.Description id={descriptionId}>Description</Dialog.Description>
<Dialog.Popup aria-labelledby={titleId} aria-describedby={descriptionId}>
  <input id={controlId} />
</Dialog.Popup>
```

---

## 4. Keyboard Navigation Patterns

### Single Key Navigation

```typescript
// Arrow keys for linear navigation
const handleKeyDown = (event) => {
  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      focusNext();
      break;
    case "ArrowUp":
    case "ArrowLeft":
      focusPrevious();
      break;
    case "Home":
      focusFirst();
      break;
    case "End":
      focusLast();
      break;
  }
};
```

### Orientation-Aware Navigation

```typescript
const handleKeyDown = (event) => {
  const isHorizontal = orientation === "horizontal";
  const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
  const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

  if (event.key === nextKey) focusNext();
  if (event.key === prevKey) focusPrevious();
};
```

### RTL-Aware Navigation

```typescript
const { direction } = useDirectionContext();
const isRTL = direction === "rtl";

const handleKeyDown = (event) => {
  if (event.key === "ArrowRight") {
    isRTL ? focusPrevious() : focusNext();
  }
  if (event.key === "ArrowLeft") {
    isRTL ? focusNext() : focusPrevious();
  }
};
```

### Loop Navigation

```typescript
const focusNext = () => {
  const nextIndex = activeIndex + 1;
  if (nextIndex >= items.length) {
    if (loop) {
      setActiveIndex(0); // Wrap to start
    }
    // else: stay at end
  } else {
    setActiveIndex(nextIndex);
  }
};
```

---

## 5. Focus Management Patterns

### Focus Trap

```typescript
// Dialog traps focus
useEffect(() => {
  if (!open || !modal) return;

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      const focusables = getFocusableElements(popupRef.current);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [open, modal]);
```

### Initial Focus

```typescript
// Focus first focusable on open
useEffect(() => {
  if (!open) return;

  const focusables = getFocusableElements(popupRef.current);
  focusables[0]?.focus();
}, [open]);
```

### Return Focus

```typescript
// Return focus on close
const triggerRef = useRef<HTMLElement | null>(null);

const handleClose = () => {
  setOpen(false);

  // Return focus to trigger
  requestAnimationFrame(() => {
    triggerRef.current?.focus();
  });
};
```

### Focus Sentinels

```typescript
// NavigationMenu uses sentinel elements
<div ref={startSentinelRef} tabIndex={0} onFocus={handleStartFocus} />
{children}
<div ref={endSentinelRef} tabIndex={0} onFocus={handleEndFocus} />

// Sentinels redirect focus appropriately
const handleStartFocus = () => {
  // User tabbed backwards into menu
  focusLastItem();
};

const handleEndFocus = () => {
  // User tabbed forwards out of menu
  focusTrigger();
};
```

---

## 6. Composite Widget Pattern

Roving tabindex for groups:

```typescript
// Only active item is tabbable
<CompositeRoot>
  <CompositeItem tabIndex={activeIndex === 0 ? 0 : -1}>Item 1</CompositeItem>
  <CompositeItem tabIndex={activeIndex === 1 ? 0 : -1}>Item 2</CompositeItem>
  <CompositeItem tabIndex={activeIndex === 2 ? 0 : -1}>Item 3</CompositeItem>
</CompositeRoot>

// Arrow keys move between items
// Tab moves out of entire group
```

### Active Descendant Pattern

```typescript
// Alternative: container manages focus
<div
  role="listbox"
  tabIndex={0}
  aria-activedescendant={activeItemId}
  onKeyDown={handleKeyDown}
>
  <div role="option" id="item-1">Item 1</div>
  <div role="option" id="item-2">Item 2</div>
</div>

// Focus stays on container
// aria-activedescendant indicates visual focus
```

---

## 7. Typeahead Pattern

Keyboard search in lists:

```typescript
const [searchString, setSearchString] = useState("");
const searchTimeoutRef = useRef<number>();

const handleKeyDown = (event) => {
  // Printable character
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
    // Accumulate search string
    setSearchString((prev) => prev + event.key);

    // Reset after delay
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = window.setTimeout(() => {
      setSearchString("");
    }, 500);

    // Find matching item
    const match = items.find((item) =>
      item.label.toLowerCase().startsWith(searchString.toLowerCase()),
    );
    if (match) {
      focusItem(match);
    }
  }
};
```

---

## 8. Disabled But Focusable Pattern

For accessibility, sometimes disabled items should be focusable:

```typescript
// Toolbar items can be disabled but focusable
<CompositeItem
  disabled={disabled}
  focusableWhenDisabled={true}  // Can receive focus for screen readers
>
  {children}
</CompositeItem>

// Implementation
const tabIndex = disabled && !focusableWhenDisabled ? -1 : 0;
const ariaDisabled = disabled ? true : undefined;

// Don't use `disabled` attribute - it prevents focus
<button
  tabIndex={tabIndex}
  aria-disabled={ariaDisabled}
  onClick={disabled ? undefined : onClick}
>
```

---

## 9. Live Regions

Announcing dynamic content:

```typescript
// Toast announcements
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {toastMessage}
</div>

// High priority announcements
<div
  role="alert"
  aria-live="assertive"
>
  {criticalMessage}
</div>

// Progress announcements
<Progress.Root
  aria-label="Loading"
  aria-valuetext={`${percent}% complete`}
>
```

### aria-live Values

```typescript
// off: No announcements (default)
// polite: Announce when user is idle
// assertive: Interrupt immediately
```

---

## 10. Screen Reader Only Content

Visually hidden but accessible:

```typescript
const visuallyHidden: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
};

// Usage
<span style={visuallyHidden}>
  Currently selected: Option 1
</span>
```

---

## 11. Modal vs Non-Modal

Different focus behaviors:

```typescript
// Modal: traps focus, has backdrop
<Dialog.Root modal={true}>
  <Dialog.Backdrop />  {/* Blocks interaction */}
  <Dialog.Popup>
    {/* Focus trapped inside */}
  </Dialog.Popup>
</Dialog.Root>

// Non-modal: no focus trap, no backdrop
<Dialog.Root modal={false}>
  <Dialog.Popup>
    {/* Focus can leave */}
  </Dialog.Popup>
</Dialog.Root>
```

### inert Attribute

```typescript
// Modal dialogs use inert on background content
useEffect(() => {
  if (open && modal) {
    // Make everything except popup inert
    document.body.setAttribute("inert", "");
    popupRef.current?.removeAttribute("inert");
  }

  return () => {
    document.body.removeAttribute("inert");
  };
}, [open, modal]);
```

---

## 12. Escape Key Dismissal

Standard pattern for popups:

```typescript
useEffect(() => {
  if (!open) return;

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      const details = createEventDetails("escapeKey", event);
      setOpen(false, details);
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [open]);
```

### AlertDialog Exception

```typescript
// AlertDialog doesn't dismiss on Escape (user must make choice)
<AlertDialog.Root>
  {/* No escape dismissal */}
  {/* Must click confirm or cancel */}
</AlertDialog.Root>
```
