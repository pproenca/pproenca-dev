# Rendering Patterns

## 1. useRenderElement - The Universal Foundation

Every headless component component uses this hook for rendering:

```typescript
const element = useRenderElement('div', componentProps, {
  state,
  ref: forwardedRef,
  props: [defaultProps, elementProps],
  stateAttributesMapping,
});
```

### Key Capabilities

#### Render Prop Support (Function)
```typescript
<Dialog.Popup render={(props, state) => (
  <motion.div {...props} animate={state.open ? 'open' : 'closed'} />
)} />
```

#### Render Prop Support (Element)
```typescript
<Dialog.Popup render={<CustomPopup />} />
```

#### State-Based className
```typescript
<Button className={(state) => state.disabled ? 'btn-disabled' : 'btn'} />
```

#### Conditional Rendering
```typescript
const element = useRenderElement('img', componentProps, {
  enabled: imageLoadingStatus === 'loaded',  // Returns null if false
});
```

### Implementation Pattern
```typescript
export const MyComponent = React.forwardRef(function MyComponent(
  componentProps: MyComponent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...elementProps } = componentProps;

  const state: MyComponent.State = React.useMemo(() => ({
    // state fields
  }), [/* deps */]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping: myStateMapping,
  });

  return element;
});
```

---

## 2. State Attributes Mapping

Automatically converts state to `data-*` attributes:

```typescript
const stateAttributesMapping: StateAttributesMapping<State> = {
  open(value) {
    return value ? { 'data-open': '' } : null;
  },
  disabled(value) {
    return value ? { 'data-disabled': '' } : null;
  },
  orientation(value) {
    return { 'data-orientation': value };
  },
};
```

### Common Mappings

#### Boolean (presence/absence)
```typescript
open(value) {
  return value ? { 'data-open': '' } : null;
}
```

#### Boolean (true/false string)
```typescript
hasSubmenuOpen(value) {
  return { 'data-has-submenu-open': value ? 'true' : 'false' };
}
```

#### Enum value
```typescript
side(value) {
  return { 'data-side': value };  // 'top' | 'bottom' | 'left' | 'right'
}
```

#### Conditional based on value
```typescript
multiple(value) {
  if (value) {
    return { 'data-multiple': '' };
  }
  return null;  // No attribute when false
}
```

---

## 3. Props Array Merging

Props can be passed as an array, merged left-to-right:

```typescript
const element = useRenderElement('button', componentProps, {
  props: [
    defaultProps,                    // Base props
    validation.getValidationProps,   // Validation adds aria-invalid, etc.
    getDescriptionProps,             // Labelable adds aria-describedby
    elementProps,                    // User props (highest priority)
  ],
});
```

### Props Getter Functions
```typescript
const getValidationProps = React.useCallback(
  (externalProps = {}) => mergeProps(
    getDescriptionProps,
    state.valid === false ? { 'aria-invalid': true } : {},
    externalProps,
  ),
  [getDescriptionProps, state.valid],
);
```

---

## 4. Ref Array Merging

Multiple refs merged automatically:

```typescript
const element = useRenderElement('div', componentProps, {
  ref: [forwardedRef, internalRef, registerControlRef],
});
```

### Common Ref Patterns
```typescript
// Single ref
ref: forwardedRef

// Internal + forwarded
ref: [forwardedRef, rootRef]

// With registration callback
ref: [forwardedRef, setContentElement, contentRef]

// With setState as ref
refs: [forwardedRef, setTriggerElement]  // CompositeRoot uses 'refs'
```

---

## 5. No-DOM Root Pattern

Some roots render no HTML element:

```typescript
// Dialog, Popover, Tooltip, Menu, etc.
export function DialogRoot(props: DialogRoot.Props) {
  // ... logic ...

  return (
    <DialogRootContext.Provider value={contextValue}>
      {props.children}  // Just children, no wrapper element
    </DialogRootContext.Provider>
  );
}
```

### When to Use
- Popup components (Dialog, Popover, Tooltip, Menu)
- When the root just provides context
- When structure should be flexible

### Counter-pattern: Roots WITH DOM
```typescript
// Toolbar, NavigationMenu, Form, RadioGroup render elements
export const ToolbarRoot = React.forwardRef(function ToolbarRoot(...) {
  return (
    <ToolbarRootContext.Provider value={contextValue}>
      <CompositeRoot ... />  // Renders a div
    </ToolbarRootContext.Provider>
  );
});
```

---

## 6. Conditional Element Type

Element type can depend on state:

```typescript
// NavigationMenu: nav when root, div when nested
const element = useRenderElement(nested ? 'div' : 'nav', componentProps, {
  state,
  ref: [forwardedRef, rootRef],
});
```

---

## 7. Default Element Props

Sensible defaults in renderTag:

```typescript
function renderTag(Tag: string, props: Record<string, any>) {
  if (Tag === 'button') {
    return <button type="button" {...props} />;  // Prevent form submit
  }
  if (Tag === 'img') {
    return <img alt="" {...props} />;  // Default empty alt
  }
  return React.createElement(Tag, props);
}
```

---

## 8. Component Structure Template

```typescript
'use client';
import * as React from 'react';
import { useRenderElement } from '../../utils/useRenderElement';
import type { HeadlessComponentProps } from '../../utils/types';

const stateAttributesMapping = {
  // state to data-* mapping
};

export const MyComponent = React.forwardRef(function MyComponent(
  componentProps: MyComponent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...elementProps } = componentProps;

  const state: MyComponent.State = React.useMemo(() => ({
    // derive state
  }), [/* deps */]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping,
  });

  return element;
});

export interface MyComponentState {
  // state interface
}

export interface MyComponentProps extends HeadlessComponentProps<'div', MyComponent.State> {
  // additional props
}

export namespace MyComponent {
  export type State = MyComponentState;
  export type Props = MyComponentProps;
}
```
