# Component Template

A complete template following all headless component patterns.

---

## Simple Component Template

For components like Button, Toggle, Separator:

```typescript
'use client';
import * as React from 'react';
import { useRenderElement } from '../../utils/useRenderElement';
import { useButton } from '../../utils/useButton';
import type { HeadlessComponentProps } from '../../utils/types';

// State attributes mapping
const stateAttributesMapping = {
  disabled(value: boolean) {
    return value ? { 'data-disabled': '' } : null;
  },
  pressed(value: boolean) {
    return value ? { 'data-pressed': '' } : null;
  },
};

/**
 * A button component with proper accessibility and styling hooks.
 */
export const Button = React.forwardRef(function Button(
  componentProps: Button.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    render,
    className,
    disabled = false,
    type = 'button',
    ...elementProps
  } = componentProps;

  // Use button behavior hook
  const { getButtonProps, buttonRef } = useButton({
    disabled,
    buttonRef: forwardedRef,
  });

  // Memoize state
  const state: Button.State = React.useMemo(
    () => ({
      disabled,
    }),
    [disabled],
  );

  // Render with useRenderElement
  const element = useRenderElement('button', componentProps, {
    state,
    ref: buttonRef,
    props: [
      { type },
      getButtonProps,
      elementProps,
    ],
    stateAttributesMapping,
  });

  return element;
});

// State interface
export interface ButtonState {
  /**
   * Whether the button is disabled.
   */
  disabled: boolean;
}

// Props interface
export interface ButtonProps
  extends HeadlessComponentProps<'button', ButtonState> {
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The type of button.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
}

// Namespace exports
export namespace Button {
  export type State = ButtonState;
  export type Props = ButtonProps;
}
```

---

## Compound Component Template

For components like Switch, Checkbox, Progress:

### Root Component

```typescript
'use client';
import * as React from 'react';
import { useControlled } from '../../utils/useControlled';
import { useRenderElement } from '../../utils/useRenderElement';
import { useFieldRootContext } from '../../field/root/FieldRootContext';
import type { HeadlessComponentProps } from '../../utils/types';
import { SwitchRootContext } from './SwitchRootContext';

const stateAttributesMapping = {
  checked(value: boolean) {
    return value ? { 'data-checked': '' } : null;
  },
  disabled(value: boolean) {
    return value ? { 'data-disabled': '' } : null;
  },
  readOnly(value: boolean) {
    return value ? { 'data-readonly': '' } : null;
  },
};

export const SwitchRoot = React.forwardRef(function SwitchRoot(
  componentProps: SwitchRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    render,
    className,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled: disabledProp = false,
    readOnly = false,
    required = false,
    name,
    ...elementProps
  } = componentProps;

  // Field integration
  const fieldContext = useFieldRootContext();
  const disabled = fieldContext.disabled || disabledProp;

  // Controlled/uncontrolled state
  const [checked, setCheckedState] = useControlled({
    controlled: checkedProp,
    default: defaultChecked,
    name: 'Switch',
    state: 'checked',
  });

  // Stable callback for change
  const setChecked = React.useCallback(
    (nextChecked: boolean, event?: React.SyntheticEvent) => {
      if (readOnly) return;

      const details = {
        event,
        reason: 'click',
        isCanceled: false,
        cancel() {
          this.isCanceled = true;
        },
      };

      onCheckedChange?.(nextChecked, details);

      if (!details.isCanceled) {
        setCheckedState(nextChecked);
      }
    },
    [onCheckedChange, readOnly, setCheckedState],
  );

  // Input ref for form submission
  const inputRef = React.useRef<HTMLInputElement>(null);

  // State
  const state: SwitchRoot.State = React.useMemo(
    () => ({
      checked,
      disabled,
      readOnly,
      required,
    }),
    [checked, disabled, readOnly, required],
  );

  // Context value
  const contextValue: SwitchRootContext = React.useMemo(
    () => ({
      checked,
      setChecked,
      disabled,
      readOnly,
      required,
      inputRef,
      state,
    }),
    [checked, setChecked, disabled, readOnly, required, state],
  );

  // Default props
  const defaultProps: React.ComponentPropsWithoutRef<'button'> = {
    role: 'switch',
    type: 'button',
    'aria-checked': checked,
    'aria-disabled': disabled || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-required': required || undefined,
    onClick(event) {
      if (disabled || readOnly) return;
      inputRef.current?.click();
    },
    onKeyDown(event) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        inputRef.current?.click();
      }
    },
  };

  const element = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [defaultProps, elementProps],
    stateAttributesMapping,
  });

  return (
    <SwitchRootContext.Provider value={contextValue}>
      {element}
      {/* Hidden input for form submission */}
      <input
        ref={inputRef}
        type="checkbox"
        tabIndex={-1}
        aria-hidden
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: 0,
        }}
        checked={checked}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        name={name}
        onChange={(event) => {
          setChecked(event.target.checked, event);
        }}
      />
    </SwitchRootContext.Provider>
  );
});

// Interfaces and namespace
export interface SwitchRootState {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
}

export interface SwitchRootProps
  extends HeadlessComponentProps<'button', SwitchRootState> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, details: ChangeDetails) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
}

interface ChangeDetails {
  event?: React.SyntheticEvent;
  reason: string;
  isCanceled: boolean;
  cancel(): void;
}

export namespace SwitchRoot {
  export type State = SwitchRootState;
  export type Props = SwitchRootProps;
}
```

### Context File

```typescript
'use client';
import * as React from 'react';

export interface SwitchRootContext {
  checked: boolean;
  setChecked: (checked: boolean, event?: React.SyntheticEvent) => void;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  state: {
    checked: boolean;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
  };
}

export const SwitchRootContext = React.createContext<
  SwitchRootContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  SwitchRootContext.displayName = 'SwitchRootContext';
}

export function useSwitchRootContext(): SwitchRootContext;
export function useSwitchRootContext(optional: false): SwitchRootContext;
export function useSwitchRootContext(
  optional: true,
): SwitchRootContext | undefined;
export function useSwitchRootContext(
  optional?: boolean,
): SwitchRootContext | undefined {
  const context = React.useContext(SwitchRootContext);

  if (!optional && context === undefined) {
    throw new Error(
      'useSwitchRootContext must be used within <Switch.Root>',
    );
  }

  return context;
}
```

### Child Component (Thumb)

```typescript
'use client';
import * as React from 'react';
import { useRenderElement } from '../../utils/useRenderElement';
import type { HeadlessComponentProps } from '../../utils/types';
import { useSwitchRootContext } from '../root/SwitchRootContext';

const stateAttributesMapping = {
  checked(value: boolean) {
    return value ? { 'data-checked': '' } : null;
  },
  disabled(value: boolean) {
    return value ? { 'data-disabled': '' } : null;
  },
};

export const SwitchThumb = React.forwardRef(function SwitchThumb(
  componentProps: SwitchThumb.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, ...elementProps } = componentProps;

  // Get state from parent context
  const { state } = useSwitchRootContext();

  const element = useRenderElement('span', componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping,
  });

  return element;
});

export interface SwitchThumbState {
  checked: boolean;
  disabled: boolean;
}

export interface SwitchThumbProps
  extends HeadlessComponentProps<'span', SwitchThumbState> {}

export namespace SwitchThumb {
  export type State = SwitchThumbState;
  export type Props = SwitchThumbProps;
}
```

### Index File

```typescript
export { SwitchRoot as Root } from './root/SwitchRoot';
export { SwitchThumb as Thumb } from './thumb/SwitchThumb';

export type { SwitchRootProps, SwitchRootState } from './root/SwitchRoot';
export type { SwitchThumbProps, SwitchThumbState } from './thumb/SwitchThumb';
```

---

## Complex Component Template (with Store)

For Dialog, Popover, Menu:

```typescript
'use client';
import * as React from 'react';
import { useControlled } from '../../utils/useControlled';
import { useRefWithInit } from '../../utils/useRefWithInit';
import { DialogStore } from './DialogStore';

export function DialogRoot(props: DialogRoot.Props) {
  const {
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = true,
    dismissible = true,
  } = props;

  // Store for complex state management
  const store = useRefWithInit(() => {
    return new DialogStore({
      open: openProp ?? defaultOpen,
      modal,
      dismissible,
    });
  }).current;

  // Sync controlled prop
  store.useControlledProp('open', openProp, defaultOpen);

  // Sync values
  store.useSyncedValue('modal', modal);
  store.useSyncedValue('dismissible', dismissible);

  // Register callback
  store.useContextCallback('onOpenChange', onOpenChange);

  // Subscribe to open state
  const open = store.useState('open');

  // Detect nesting
  const parentContext = useDialogRootContext(true);
  const nested = Boolean(parentContext);

  // Context value
  const contextValue = React.useMemo(
    () => ({
      open,
      store,
      modal,
      nested,
    }),
    [open, store, modal, nested],
  );

  // No DOM element - just provider
  return (
    <DialogRootContext.Provider value={contextValue}>
      {children}
    </DialogRootContext.Provider>
  );
}

export interface DialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: OpenChangeDetails) => void;
  modal?: boolean;
  dismissible?: boolean;
}

export interface OpenChangeDetails {
  reason: OpenChangeReason;
  event?: Event;
  isCanceled: boolean;
  cancel(): void;
}

export type OpenChangeReason =
  | 'triggerPress'
  | 'escapeKey'
  | 'outsidePress'
  | 'focusOut';

export namespace DialogRoot {
  export type Props = DialogRootProps;
}
```

---

## Directory Structure

```
my-component/
├── index.ts                    # Public exports
├── index.parts.ts              # Named part exports (Root, Trigger, etc.)
├── root/
│   ├── MyComponentRoot.tsx     # Root component
│   └── MyComponentRootContext.ts
├── trigger/
│   └── MyComponentTrigger.tsx  # Trigger component
├── popup/
│   └── MyComponentPopup.tsx    # Popup component
├── [other-parts]/
│   └── ...
└── utils/
    ├── stateAttributesMapping.ts  # Shared state mapping
    └── constants.ts               # Shared constants
```

---

## Checklist

When creating a component:

- [ ] Use `'use client'` directive
- [ ] Forward ref with `React.forwardRef`
- [ ] Destructure props, separate render/className/elementProps
- [ ] Support controlled and uncontrolled mode with `useControlled`
- [ ] Create memoized state object
- [ ] Use `useRenderElement` for rendering
- [ ] Define `stateAttributesMapping` for data attributes
- [ ] Create context with undefined default
- [ ] Create throwing context hook with optional overload
- [ ] Export State and Props interfaces
- [ ] Export namespace with type aliases
- [ ] Add JSDoc comments for props
- [ ] Handle disabled via aria-disabled, not disabled attribute
- [ ] Include hidden input for form components
- [ ] Support event cancellation via details object
