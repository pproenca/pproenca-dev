# Switch Component Analysis

**Files**: `packages/react/src/switch/`
**Pattern**: Compound Component
**Sub-parts**: Root, Thumb

## Directory Structure

```
switch/
├── index.ts              # Public API: `export * as Switch from './index.parts'`
├── index.parts.ts        # Part exports: Root, Thumb
├── stateAttributesMapping.ts  # Shared state→data-* mapping
├── root/
│   ├── SwitchRoot.tsx
│   ├── SwitchRoot.test.tsx
│   ├── SwitchRootContext.ts
│   └── SwitchRootDataAttributes.ts
└── thumb/
    └── SwitchThumb.tsx
```

## Export Pattern

**index.ts**:
```typescript
export * as Switch from './index.parts';
export type * from './root/SwitchRoot';
export type * from './thumb/SwitchThumb';
```

**index.parts.ts**:
```typescript
export { SwitchRoot as Root } from './root/SwitchRoot';
export { SwitchThumb as Thumb } from './thumb/SwitchThumb';
```

**Usage**: `<Switch.Root><Switch.Thumb /></Switch.Root>`

## Props Interface (Root)

```typescript
export interface SwitchRootState extends FieldRoot.State {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
}

export interface SwitchRootProps
  extends NonNativeButtonProps,
    Omit<HeadlessComponentProps<'span', SwitchRoot.State>, 'onChange'> {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  name?: string;
  onCheckedChange?: (checked: boolean, eventDetails: SwitchRoot.ChangeEventDetails) => void;
  readOnly?: boolean;
  required?: boolean;
  uncheckedValue?: string;
}
```

**Key Insight**: Extends `FieldRoot.State` for form integration. Uses `onCheckedChange` instead of `onChange` for semantic clarity.

## Internal State Management

```typescript
// Controlled/uncontrolled pattern
const [checked, setCheckedState] = useControlled({
  controlled: checkedProp,
  default: Boolean(defaultChecked),
  name: 'Switch',
  state: 'checked',
});

// State object for context and rendering
const state: SwitchRoot.State = React.useMemo(
  () => ({
    ...fieldState,
    checked,
    disabled,
    readOnly,
    required,
  }),
  [fieldState, checked, disabled, readOnly, required],
);
```

## Hook Composition

1. **`useControlled`**: Controlled/uncontrolled value management
2. **`useButton`**: Button behavior for keyboard accessibility
3. **`useField`**: Form field integration
4. **`useFieldRootContext`**: Field wrapper context
5. **`useFormContext`**: Form error clearing
6. **`useLabelableContext`**: Label association
7. **`useRenderElement`**: Element rendering
8. **`useStableCallback`**: Stable callback reference
9. **`useMergedRefs`**: Ref merging
10. **`useIsoLayoutEffect`**: SSR-safe layout effect
11. **`useValueChanged`**: Value change detection

## Context Pattern

**SwitchRootContext.ts**:
```typescript
export const SwitchRootContext = React.createContext<SwitchRootContext | undefined>(undefined);

export function useSwitchRootContext() {
  const context = React.useContext(SwitchRootContext);
  if (context === undefined) {
    throw new Error(
      'headless component: SwitchRootContext is missing. Switch parts must be placed within <Switch.Root>.',
    );
  }
  return context;
}
```

**Pattern**: Context is typed as `undefined` initially, with a throwing hook for child access.

## Event Handling

```typescript
// Hidden input handles the actual change
onChange(event) {
  if (event.nativeEvent.defaultPrevented) {
    return;
  }

  const nextChecked = event.target.checked;
  const eventDetails = createChangeEventDetails(REASONS.none, event.nativeEvent);

  onCheckedChange?.(nextChecked, eventDetails);

  if (eventDetails.isCanceled) {
    return;
  }

  setCheckedState(nextChecked);
}
```

**Pattern**: Event details object allows cancellation via `eventDetails.isCanceled`.

## Accessibility Implementation

1. **Hidden checkbox**: Real `<input type="checkbox">` for form submission
2. **ARIA attributes**:
   - `role="switch"`
   - `aria-checked={checked}`
   - `aria-readonly={readOnly}`
   - `aria-labelledby={labelId}`
3. **Input hiding**: Uses `visuallyHidden` style (not `display:none`)
4. **Focus management**: Focus redirects from input to visible switch

## Data Attributes

```typescript
export enum SwitchRootDataAttributes {
  checked = 'data-checked',
  unchecked = 'data-unchecked',
  disabled = 'data-disabled',
  readonly = 'data-readonly',
  required = 'data-required',
  valid = 'data-valid',
  invalid = 'data-invalid',
  touched = 'data-touched',
  dirty = 'data-dirty',
  filled = 'data-filled',
  focused = 'data-focused',
}
```

**stateAttributesMapping.ts**:
```typescript
export const stateAttributesMapping: StateAttributesMapping<SwitchRoot.State> = {
  ...fieldValidityMapping,
  checked(value): Record<string, string> {
    if (value) {
      return { [SwitchRootDataAttributes.checked]: '' };
    }
    return { [SwitchRootDataAttributes.unchecked]: '' };
  },
};
```

## Slot/Customization Mechanism

Same as Button - `render` prop pattern. Default renders `<span>`.

## Child Component (Thumb)

```typescript
export const SwitchThumb = React.forwardRef(function SwitchThumb(
  componentProps: SwitchThumb.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, ...elementProps } = componentProps;
  const { state: fieldState } = useFieldRootContext();
  const state = useSwitchRootContext(); // Gets parent state
  const extendedState = { ...fieldState, ...state };

  return useRenderElement('span', componentProps, {
    state: extendedState,
    ref: forwardedRef,
    stateAttributesMapping,
    props: elementProps,
  });
});
```

**Pattern**: Child components consume parent context and extend state from multiple sources.

## Edge Cases Handled

1. **Form submission**: Hidden checkbox submits actual value
2. **Unchecked value**: Optional `uncheckedValue` prop for submitting when off
3. **Field integration**: Works standalone or within `<Field.Root>`
4. **Validation modes**: Supports `onChange` and `onBlur` validation
5. **Read-only**: Prevents changes while maintaining focus

## What Makes This API Good

1. **Compound component pattern**: Clear parent-child relationship
2. **Hidden input for forms**: Native form behavior without visual compromise
3. **Dual data attributes**: `data-checked` OR `data-unchecked` (not absence)
4. **Event details**: Rich event info with cancellation support
5. **Field system integration**: Works with validation, labels, errors
6. **State inheritance**: Children inherit and extend parent state

## TypeScript Namespace Pattern

```typescript
export namespace SwitchRoot {
  export type State = SwitchRootState;
  export type Props = SwitchRootProps;
  export type ChangeEventReason = SwitchRootChangeEventReason;
  export type ChangeEventDetails = SwitchRootChangeEventDetails;
}

export namespace SwitchThumb {
  export type Props = SwitchThumbProps;
  export type State = SwitchThumbState;
}
```
