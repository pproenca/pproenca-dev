# Core TypeScript Types

Actual type definitions from headless component source code.

---

## 1. HeadlessComponentProps - The Foundation

```typescript
/**
 * Props shared by all headless component components.
 * Contains `className` (string or callback taking the component's state as an argument)
 * and `render` (function to customize rendering).
 */
export type HeadlessComponentProps<
  ElementType extends React.ElementType,
  State,
  RenderFunctionProps = HTMLProps,
> = Omit<
  WithComponentEvent<React.ComponentPropsWithRef<ElementType>>,
  "className" | "color" | "defaultValue" | "defaultChecked"
> & {
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component's state.
   */
  className?: string | ((state: State) => string | undefined);
  /**
   * Allows you to replace the component's HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render?: ComponentRenderFn<RenderFunctionProps, State> | React.ReactElement;
  /**
   * Style applied to the element, or a function that
   * returns a style object based on the component's state.
   */
  style?:
    | React.CSSProperties
    | ((state: State) => React.CSSProperties | undefined);
};
```

### Key Features:

- **Three generic parameters**: ElementType, State, RenderFunctionProps
- **Omits problematic native props**: 'className', 'color', 'defaultValue', 'defaultChecked'
- **Function className/style**: Can be state-dependent
- **Dual render prop**: Function or ReactElement

---

## 2. ComponentRenderFn - Render Prop Type

```typescript
/**
 * Shape of the render prop: a function that takes props to be spread on the
 * element and component's state and returns a React element.
 *
 * @template Props Props to be spread on the rendered element.
 * @template State Component's internal state.
 */
export type ComponentRenderFn<Props, State> = (
  props: Props,
  state: State,
) => React.ReactElement<unknown>;
```

---

## 3. HTMLProps - Extended HTML Props

```typescript
export type HTMLProps<T = any> = React.HTMLAttributes<T> & {
  ref?: React.Ref<T> | undefined;
};
```

---

## 4. StateAttributesMapping - State to Data Attributes

```typescript
export type StateAttributesMapping<State> = {
  [Property in keyof State]?: (
    state: State[Property],
  ) => Record<string, string> | null;
};
```

### Example Usage:

```typescript
const stateAttributesMapping: StateAttributesMapping<ButtonState> = {
  disabled(value) {
    return value ? { "data-disabled": "" } : null;
  },
  pressed(value) {
    return value ? { "data-pressed": "" } : null;
  },
  // Value-based attribute
  orientation(value) {
    return { "data-orientation": value };
  },
};
```

---

## 5. WithComponentEvent - Event Handler Extension

```typescript
export type ComponentEvent<E extends React.SyntheticEvent<Element, Event>> =
  E & {
    preventDefaultHandler: () => void;
    readonly defaultHandlerPrevented?: boolean;
  };

type WithPreventDefaultHandler<T> = T extends (event: infer E) => any
  ? E extends React.SyntheticEvent<Element, Event>
    ? (event: ComponentEvent<E>) => ReturnType<T>
    : T
  : T extends undefined
    ? undefined
    : T;

/**
 * Adds a `preventDefaultHandler` method to all event handlers.
 */
export type WithComponentEvent<T> = {
  [K in keyof T]: WithPreventDefaultHandler<T[K]>;
};
```

### What This Does:

- Adds `preventDefaultHandler()` to all event handlers
- Allows consumers to prevent headless component's default event handling
- Preserves original event types with extension

---

## 6. TransitionStatus - Animation States

```typescript
export type TransitionStatus = "starting" | "ending" | "idle" | undefined;
```

---

## 7. Orientation Type

```typescript
export type Orientation = "horizontal" | "vertical";
```

---

## 8. Simplify - Display Type Helper

```typescript
/**
 * Simplifies the display of a type (without modifying it).
 * Taken from https://effectivetypescript.com/2022/02/25/gentips-4-display/
 */
export type Simplify<T> = T extends Function ? T : { [K in keyof T]: T[K] };
```

---

## 9. RequiredExcept - Partial Required Helper

```typescript
export type RequiredExcept<T, K extends keyof T> = Required<Omit<T, K>> &
  Pick<T, K>;
```

---

## 10. NativeButtonProps Variants

```typescript
// For components that default to native button
export interface NativeButtonProps {
  /**
   * Whether the component renders a native `<button>` element when replacing it
   * via the `render` prop.
   * Set to `false` if the rendered element is not a button (e.g. `<div>`).
   * @default true
   */
  nativeButton?: boolean;
}

// For components that don't default to native button
export interface NonNativeButtonProps {
  /**
   * Whether the component renders a native `<button>` element when replacing it
   * via the `render` prop.
   * Set to `true` if the rendered element is a native button.
   * @default false
   */
  nativeButton?: boolean;
}
```

---

## 11. RenderFunctionProps - Tag-Based Props

```typescript
type RenderFunctionProps<TagName> =
  TagName extends keyof React.JSX.IntrinsicElements
    ? React.JSX.IntrinsicElements[TagName]
    : React.HTMLAttributes<any>;
```

### What This Does:

- If TagName is a valid HTML tag, returns that tag's props
- Otherwise falls back to generic HTMLAttributes

---

## 12. FloatingUIOpenChangeDetails

```typescript
export interface FloatingUIOpenChangeDetails {
  open: boolean;
  reason: string;
  nativeEvent: Event;
  nested: boolean;
  triggerElement?: Element | undefined;
}
```
