# Hook Signatures

Actual TypeScript signatures for core headless component hooks.

---

## 1. useRenderElement - Universal Rendering

```typescript
/**
 * Renders a headless component element.
 *
 * @param element The default HTML element to render. Can be overridden by `render` prop.
 * @param componentProps An object containing the `render` and `className` props.
 * @param params Additional parameters for rendering the element.
 */
export function useRenderElement<
  State extends Record<string, any>,
  RenderedElementType extends Element,
  TagName extends IntrinsicTagName | undefined,
  Enabled extends boolean | undefined = undefined,
>(
  element: TagName,
  componentProps: useRenderElement.ComponentProps<State>,
  params?: useRenderElement.Parameters<State, RenderedElementType, TagName, Enabled>,
): Enabled extends false ? null : React.ReactElement;

// Namespace exports
export namespace useRenderElement {
  export type Parameters<
    State,
    RenderedElementType extends Element,
    TagName,
    Enabled extends boolean | undefined,
  > = UseRenderElementParameters<State, RenderedElementType, TagName, Enabled>;
  export type ComponentProps<State> = UseRenderElementComponentProps<State>;
}
```

### Parameters Type:

```typescript
export type UseRenderElementParameters<
  State,
  RenderedElementType extends Element,
  TagName,
  Enabled extends boolean | undefined,
> = {
  /**
   * If `false`, the hook will skip most of its internal logic and return `null`.
   * @default true
   */
  enabled?: Enabled;
  /**
   * The ref to apply to the rendered element.
   */
  ref?: React.Ref<RenderedElementType> | (React.Ref<RenderedElementType> | undefined)[];
  /**
   * The state of the component.
   */
  state?: State;
  /**
   * Intrinsic props to be spread on the rendered element.
   */
  props?:
    | RenderFunctionProps<TagName>
    | Array<
        | RenderFunctionProps<TagName>
        | undefined
        | ((props: RenderFunctionProps<TagName>) => RenderFunctionProps<TagName>)
      >;
  /**
   * A mapping of state to `data-*` attributes.
   */
  stateAttributesMapping?: StateAttributesMapping<State>;
};
```

### ComponentProps Type:

```typescript
export interface UseRenderElementComponentProps<State> {
  /**
   * The class name to apply to the rendered element.
   * Can be a string or a function that accepts the state and returns a string.
   */
  className?: string | ((state: State) => string | undefined);
  /**
   * The render prop or React element to override the default element.
   */
  render?: undefined | ComponentRenderFn<React.HTMLAttributes<any>, State> | React.ReactElement;
  /**
   * The style to apply to the rendered element.
   * Can be a style object or a function that accepts the state and returns a style object.
   */
  style?: React.CSSProperties | ((state: State) => React.CSSProperties | undefined);
}
```

### Key TypeScript Features:
1. **Conditional return type**: `Enabled extends false ? null : React.ReactElement`
2. **Namespace for types**: `useRenderElement.Parameters`, `useRenderElement.ComponentProps`
3. **Props union**: Array or single value, with function support
4. **Ref union**: Single ref or array of refs

---

## 2. useTransitionStatus - Animation States

```typescript
export type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;

/**
 * Provides a status string for CSS animations.
 * @param open - a boolean that determines if the element is open.
 * @param enableIdleState - a boolean that enables the `'idle'` state
 */
export function useTransitionStatus(
  open: boolean,
  enableIdleState?: boolean,
  deferEndingState?: boolean,
): {
  mounted: boolean;
  setMounted: React.Dispatch<React.SetStateAction<boolean>>;
  transitionStatus: TransitionStatus;
};
```

---

## 3. useControlled - Controlled/Uncontrolled Pattern

```typescript
export interface UseControlledProps<T = unknown> {
  /**
   * The controlled value.
   */
  controlled: T | undefined;
  /**
   * The default value when uncontrolled.
   */
  default: T | undefined;
  /**
   * The name of the component (for dev warnings).
   */
  name: string;
  /**
   * The name of the state being controlled.
   */
  state?: string;
}

export function useControlled<T>(
  props: UseControlledProps<T>,
): [T, (newValue: T | ((prevValue: T) => T)) => void];
```

### Usage Pattern:
```typescript
const [open, setOpen] = useControlled({
  controlled: openProp,
  default: defaultOpen ?? false,
  name: 'Dialog',
  state: 'open',
});
```

---

## 4. useMergedRefs - Ref Composition

```typescript
/**
 * Merges two refs into one.
 */
export function useMergedRefs<T>(
  refA: React.Ref<T> | undefined,
  refB: React.Ref<T> | undefined,
  refC?: React.Ref<T> | undefined,
): React.RefCallback<T>;

/**
 * Merges N refs into one.
 */
export function useMergedRefsN<T>(
  refs: (React.Ref<T> | undefined)[],
): React.RefCallback<T>;
```

---

## 5. useStableCallback - Stable Function Reference

```typescript
/**
 * Creates a stable callback that always has access to the latest values
 * without recreating the function identity.
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T;
```

---

## 6. useTimeout - Managed Timeouts

```typescript
export interface UseTimeoutReturn {
  start: (delay: number, callback: () => void) => void;
  clear: () => void;
  isStarted: () => boolean;
}

export function useTimeout(): UseTimeoutReturn;
```

---

## 7. useAnchorPositioning - Floating UI Integration

```typescript
export interface UseAnchorPositioningParams {
  anchor?: Element | VirtualElement | (() => Element | VirtualElement | null) | null;
  positionerRef: React.RefObject<HTMLElement | null>;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  collisionBoundary?: Element | Element[] | 'clippingAncestors';
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  keepMounted?: boolean;
  trackAnchor?: boolean;
  mounted?: boolean;
}

export interface UseAnchorPositioningReturn {
  positionerStyles: React.CSSProperties;
  arrowStyles: React.CSSProperties;
  arrowRef: React.RefObject<Element | null>;
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
  arrowUncentered: boolean;
  renderedSide: 'top' | 'bottom' | 'left' | 'right';
  renderedAlign: 'start' | 'center' | 'end';
}

export function useAnchorPositioning(
  params: UseAnchorPositioningParams,
): UseAnchorPositioningReturn;
```

---

## 8. useComponentId - ID Generation

```typescript
/**
 * Generates a unique ID for a headless component component.
 * Uses React.useId() internally with a prefix.
 */
export function useComponentId(idOverride?: string): string;
```

---

## 9. useOpenInteractionType - Track How Opened

```typescript
export type OpenInteractionType = 'focus' | 'click' | 'hover' | undefined;

export function useOpenInteractionType(
  open: boolean,
): [OpenInteractionType, (type: OpenInteractionType) => void];
```

---

## 10. useAnimationsFinished - Wait for Animations

```typescript
/**
 * Returns a promise that resolves when all animations on the element finish.
 */
export function useAnimationsFinished(
  ref: React.RefObject<HTMLElement | null>,
): () => Promise<void>;
```

---

## 11. useValueChanged - Track Value Changes

```typescript
/**
 * Returns true on the first render where value differs from previous.
 */
export function useValueChanged<T>(value: T): boolean;
```

---

## 12. useIsoLayoutEffect - SSR-Safe Layout Effect

```typescript
/**
 * useLayoutEffect on client, useEffect on server.
 */
export const useIsoLayoutEffect: typeof React.useLayoutEffect;
```
