# Animation Patterns

## 1. Transition Status Pattern

Track animation phases:

```typescript
const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

// transitionStatus values:
// - 'starting': Opening animation in progress
// - 'ending': Closing animation in progress
// - undefined: Animation complete or not animating

// State for CSS/JS animations
const state = {
  open,
  transitionStatus,
};
```

### Implementation

```typescript
function useTransitionStatus(open: boolean) {
  const [mounted, setMounted] = useState(open);
  const [transitionStatus, setTransitionStatus] = useState<
    'starting' | 'ending' | undefined
  >(undefined);

  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      setTransitionStatus('starting');

      // Clear after one frame (CSS transition starts)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionStatus(undefined);
        });
      });
    } else {
      setTransitionStatus('ending');
    }
  }, [open]);

  return { mounted, setMounted, transitionStatus };
}
```

### Usage for CSS Animations

```typescript
// In component
const stateAttributesMapping = {
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

// CSS
.popup[data-starting] {
  opacity: 0;
  transform: scale(0.95);
}

.popup[data-open] {
  opacity: 1;
  transform: scale(1);
  transition: opacity 200ms, transform 200ms;
}

.popup[data-ending] {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 200ms, transform 200ms;
}
```

---

## 2. keepMounted Pattern

Keep element in DOM for exit animations:

```typescript
interface PositionerProps {
  keepMounted?: boolean;  // Keep in DOM when closed
}

// Implementation
const shouldRender = keepMounted || mounted;

if (!shouldRender) {
  return null;
}

return (
  <div
    data-open={open ? '' : undefined}
    data-ending={transitionStatus === 'ending' ? '' : undefined}
  >
    {children}
  </div>
);
```

### Animation End Detection

```typescript
// Listen for animation/transition end to unmount
useEffect(() => {
  if (transitionStatus !== 'ending') return;

  const handleEnd = () => {
    setMounted(false);
  };

  element.addEventListener('transitionend', handleEnd);
  element.addEventListener('animationend', handleEnd);

  return () => {
    element.removeEventListener('transitionend', handleEnd);
    element.removeEventListener('animationend', handleEnd);
  };
}, [transitionStatus]);
```

---

## 3. CSS Custom Properties Pattern

Inject dimensions for animations:

```typescript
// Collapsible injects height
const [height, setHeight] = useState(0);

useLayoutEffect(() => {
  if (contentRef.current) {
    setHeight(contentRef.current.scrollHeight);
  }
}, [open]);

return (
  <div
    style={{
      '--collapsible-content-height': `${height}px`,
    } as React.CSSProperties}
  >
    {children}
  </div>
);

// CSS animation using variable
.collapsible-content {
  height: 0;
  overflow: hidden;
  transition: height 200ms;
}

.collapsible-content[data-open] {
  height: var(--collapsible-content-height);
}
```

### Toast Position Variables

```typescript
// Toast injects stacking offsets
style={{
  '--toast-index': index,
  '--toast-offset': `${offset}px`,
  '--toast-swipe-amount': `${swipeAmount}px`,
} as React.CSSProperties}

// CSS
.toast {
  transform: translateY(calc(var(--toast-index) * var(--toast-offset)));
}

.toast[data-swiping] {
  transform: translateX(var(--toast-swipe-amount));
}
```

---

## 4. Instant Type Pattern

Skip animations based on interaction:

```typescript
// Track how popup was opened
const [instantType, setInstantType] = useState<'focus' | 'click' | 'hover' | undefined>();

const handleOpen = (type: 'focus' | 'click' | 'hover') => {
  // Skip animation if opened by focus (keyboard nav)
  if (type === 'focus') {
    setInstantType('focus');
  } else {
    setInstantType(undefined);
  }
  setOpen(true);
};

// Expose in state for animation decisions
const state = {
  open,
  instantType,
};

// CSS: Skip animation when instant
.popup[data-instant="focus"] {
  transition: none !important;
}
```

### FlushSync for Hover

```typescript
// Synchronous state for hover animation coordination
import { flushSync } from 'react-dom';

const handleMouseEnter = () => {
  flushSync(() => {
    setInstantType('hover');
  });
  setOpen(true);
};
```

---

## 5. Activation Direction Pattern

Track direction for slide animations:

```typescript
// Tabs tracks direction
const [activationDirection, setActivationDirection] = useState<
  'left' | 'right' | undefined
>();

const handleTabChange = (newIndex: number) => {
  const direction = newIndex > currentIndex ? 'right' : 'left';
  setActivationDirection(direction);
  setCurrentIndex(newIndex);
};

// Expose in state
const state = {
  activationDirection,
};

// Data attribute
'data-activation-direction': activationDirection
```

### CSS Usage

```css
/* Slide from left */
.tab-panel[data-activation-direction="left"] {
  animation: slideFromLeft 200ms;
}

/* Slide from right */
.tab-panel[data-activation-direction="right"] {
  animation: slideFromRight 200ms;
}
```

---

## 6. Fixed Size Before Close Pattern

Prevent layout shift during exit:

```typescript
// NavigationMenu fixes size before closing
const setFixedSize = () => {
  if (viewportRef.current) {
    const { width, height } = viewportRef.current.getBoundingClientRect();
    viewportRef.current.style.width = `${width}px`;
    viewportRef.current.style.height = `${height}px`;
  }
};

const clearFixedSize = () => {
  if (viewportRef.current) {
    viewportRef.current.style.width = '';
    viewportRef.current.style.height = '';
  }
};

const handleClose = () => {
  setFixedSize();  // Lock current size
  setOpen(false);

  // Clear after animation
  setTimeout(clearFixedSize, 200);
};
```

---

## 7. Swipe Gesture Pattern

Touch interactions for dismissal:

```typescript
interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  locked: boolean;  // Direction locked after threshold
}

const handleTouchStart = (e: TouchEvent) => {
  setSwipeState({
    startX: e.touches[0].clientX,
    startY: e.touches[0].clientY,
    currentX: 0,
    currentY: 0,
    direction: null,
    locked: false,
  });
};

const handleTouchMove = (e: TouchEvent) => {
  const deltaX = e.touches[0].clientX - swipeState.startX;
  const deltaY = e.touches[0].clientY - swipeState.startY;

  // Lock direction after threshold
  if (!swipeState.locked && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
    const direction = Math.abs(deltaX) > Math.abs(deltaY)
      ? (deltaX > 0 ? 'right' : 'left')
      : (deltaY > 0 ? 'down' : 'up');

    setSwipeState(prev => ({
      ...prev,
      direction,
      locked: true,
    }));
  }

  // Apply movement
  if (swipeState.locked && isAllowedDirection(swipeState.direction)) {
    setSwipeState(prev => ({
      ...prev,
      currentX: deltaX,
      currentY: deltaY,
    }));
  }
};

const handleTouchEnd = () => {
  // Check if threshold reached for dismiss
  if (Math.abs(swipeState.currentX) > dismissThreshold) {
    onDismiss();
  } else {
    // Snap back
    setSwipeState(prev => ({ ...prev, currentX: 0, currentY: 0 }));
  }
};
```

### Directional Damping

```typescript
// Resistance in non-dismiss direction
const getDampedOffset = (offset: number, direction: string) => {
  if (!isAllowedDirection(direction)) {
    // Apply damping (resistance)
    return offset * 0.3;
  }
  return offset;
};
```

---

## 8. Scroll Arrow Visibility Pattern

Fade indicators based on scroll:

```typescript
// Select tracks scroll position for arrows
const [canScrollUp, setCanScrollUp] = useState(false);
const [canScrollDown, setCanScrollDown] = useState(false);

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = listRef.current;
  setCanScrollUp(scrollTop > 0);
  setCanScrollDown(scrollTop + clientHeight < scrollHeight);
};

// Arrow components
<Select.ScrollUpArrow data-visible={canScrollUp || undefined}>
  <ChevronUp />
</Select.ScrollUpArrow>

<Select.ScrollDownArrow data-visible={canScrollDown || undefined}>
  <ChevronDown />
</Select.ScrollDownArrow>
```

---

## 9. Height Recalculation Pattern

Measure then animate:

```typescript
// Toast recalculates heights for stacking
const recalculateHeights = useStableCallback(() => {
  const toasts = toastsRef.current;
  let offset = 0;

  toasts.forEach((toast, index) => {
    const element = getToastElement(toast.id);
    if (element) {
      const height = element.getBoundingClientRect().height;
      toast.offset = offset;
      offset += height + gap;
    }
  });

  // Trigger re-render with new offsets
  setToasts([...toasts]);
});

// Recalculate on content change
useLayoutEffect(() => {
  recalculateHeights();
}, [toastContent]);
```

---

## 10. Prehydration Script Pattern

Prevent flash before hydration:

```typescript
// Slider injects inline script for SSR
const prehydrationScript = `
  (function() {
    var root = document.currentScript.parentElement;
    var thumbs = root.querySelectorAll('[data-slider-thumb]');
    thumbs.forEach(function(thumb, i) {
      var value = ${JSON.stringify(values)}[i] || 0;
      var percent = (value - ${min}) / (${max} - ${min}) * 100;
      thumb.style.setProperty('--slider-thumb-position', percent + '%');
    });
  })();
`;

return (
  <div data-slider-root>
    <script dangerouslySetInnerHTML={{ __html: prehydrationScript }} />
    {children}
  </div>
);
```

---

## 11. Multiple Index Types Pattern

DOM index vs visible index:

```typescript
// Toast tracks multiple indices
interface ToastState {
  domIndex: number;     // Position in DOM (for refs)
  visibleIndex: number; // Position in visible stack (for animation)
}

// DOM index never changes
// Visible index changes when toasts are dismissed

// Animation uses visible index
style={{
  '--toast-index': visibleIndex,
  '--toast-offset': `${offset}px`,
}}
```

---

## 12. Fallback Delay Pattern

Avoid flash for fast operations:

```typescript
// Avatar delays fallback rendering
interface AvatarProps {
  fallbackDelay?: number;  // Default: 0
}

const [showFallback, setShowFallback] = useState(false);

useEffect(() => {
  if (loadingStatus === 'error') {
    const timeout = setTimeout(() => {
      setShowFallback(true);
    }, fallbackDelay);

    return () => clearTimeout(timeout);
  }
}, [loadingStatus, fallbackDelay]);

// Fallback only renders after delay
const fallbackElement = useRenderElement('span', fallbackProps, {
  enabled: showFallback,
});
```
