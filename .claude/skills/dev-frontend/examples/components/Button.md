# Button Component Analysis

**File**: `packages/react/src/button/Button.tsx`
**Pattern**: Simple Component (single file)
**Lines of Code**: ~100

## Props Interface

```typescript
export interface ButtonState {
  disabled: boolean;
}

interface ButtonCommonProps {
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
}

// Discriminated union based on nativeButton
interface ButtonNativeProps
  extends NativeButtonProps, ButtonCommonProps,
    Omit<HeadlessComponentProps<'button', ButtonState>, 'disabled'> {
  nativeButton?: true;
}

interface ButtonNonNativeProps
  extends NonNativeButtonProps, ButtonCommonProps,
    Omit<HeadlessComponentProps<'button', ButtonState>, NonNativeAttributeKeys | 'disabled'> {
  nativeButton: false;
}

export type ButtonProps = ButtonNativeProps | ButtonNonNativeProps;
```

**Key Insight**: Uses discriminated union to handle native vs non-native button cases, excluding form-related attributes (`form`, `formAction`, etc.) when not a native button.

## Internal State Management

```typescript
const state: Button.State = React.useMemo(
  () => ({
    disabled,
  }),
  [disabled],
);
```

- State is a simple memoized object
- Contains only the `disabled` boolean derived from props
- Uses `useMemo` for referential stability

## Hook Composition

1. **`useButton` hook**: Core button behavior
   - Handles disabled state
   - Manages focusable-when-disabled behavior
   - Returns `getButtonProps` and `buttonRef`

2. **`useRenderElement`**: Element rendering
   - Takes default element ('button')
   - Processes component props (render, className)
   - Merges refs, props, and state

```typescript
const { getButtonProps, buttonRef } = useButton({
  disabled,
  focusableWhenDisabled,
  native: nativeButton,
});

return useRenderElement('button', componentProps, {
  state,
  ref: [forwardedRef, buttonRef],
  props: [elementProps, getButtonProps],
});
```

## Event Handling

Handled in `useButton` hook:
- `onClick`: Prevents default if disabled
- `onMouseDown`: Blocked if disabled
- `onKeyDown`: Adds keyboard accessibility for non-native buttons (Enter/Space)
- `onKeyUp`: Space key handling for non-native buttons
- `onPointerDown`: Prevents default if disabled

**Pattern**: Event handlers are created via `getButtonProps` prop getter pattern, allowing external props to be merged.

## Accessibility Implementation

1. **Native button**: Uses native `disabled` attribute
2. **Non-native**:
   - Adds `role="button"`
   - Uses `aria-disabled="true"`
   - Manages `tabIndex` appropriately

```typescript
!isNativeButton ? { role: 'button' } : undefined,
focusableWhenDisabledProps, // includes aria-disabled, tabIndex
```

## Data Attributes

```typescript
export enum ButtonDataAttributes {
  disabled = 'data-disabled',
}
```

Applied automatically via `stateAttributesMapping` in `useRenderElement`.

## Slot/Customization Mechanism

Uses the `render` prop pattern:

```typescript
render?: ComponentRenderFn<RenderFunctionProps, State> | React.ReactElement;
```

Can be:
1. A React element: `<Button render={<a href="/" />} />`
2. A render function: `<Button render={(props, state) => <a {...props} />} />`

## Edge Cases Handled

1. **Non-native button as anchor**: Detects valid links and skips keyboard click handling
2. **Focusable when disabled**: Allows focus but blocks interactions
3. **Composite context**: Integrates with `CompositeRoot` for toolbar/menu scenarios
4. **Dev mode validation**: Warns if `nativeButton` prop mismatches actual element type

## What Makes This API Good

1. **Type-safe discriminated union**: Can't use form attributes on non-native buttons
2. **Sensible defaults**: `nativeButton=true` for semantic HTML
3. **Progressive enhancement**: Native button with optional non-native fallback
4. **State callback for styling**: `className={(state) => state.disabled ? 'disabled' : ''}`
5. **Ref forwarding**: Standard forwardRef pattern
6. **Namespace export**: `Button.Props`, `Button.State` for clean imports

## TypeScript Namespace Pattern

```typescript
export namespace Button {
  export type State = ButtonState;
  export type Props = ButtonProps;
}
```

This allows importing types as `Button.Props` while keeping implementation types private.
