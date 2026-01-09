# TypeScript Patterns

## 1. Namespace for Types

Organize component types in namespaces:

```typescript
// Component file
export const DialogRoot = React.forwardRef(function DialogRoot(
  props: DialogRoot.Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  // implementation
});

// Separate interfaces
export interface DialogRootState {
  open: boolean;
  modal: boolean;
  nested: boolean;
}

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: OpenChangeDetails) => void;
  modal?: boolean;
  children?: React.ReactNode;
}

// Namespace aliases
export namespace DialogRoot {
  export type State = DialogRootState;
  export type Props = DialogRootProps;
}

// Usage
function MyComponent(props: DialogRoot.Props) { ... }
const state: DialogRoot.State = { ... };
```

---

## 2. HeadlessComponentProps

Standard props for all components:

```typescript
// Definition
export interface HeadlessComponentProps<
  ElementType extends React.ElementType,
  State,
> extends Omit<React.ComponentPropsWithoutRef<ElementType>, 'className'> {
  className?: string | ((state: State) => string);
  render?:
    | React.ReactElement<Record<string, unknown>>
    | ((props: React.HTMLAttributes<any>, state: State) => React.ReactElement);
}

// Usage
export interface ButtonProps extends HeadlessComponentProps<'button', ButtonState> {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
```

---

## 3. Multi-Generic Components

Components with multiple type parameters:

```typescript
// Select with Value and Multiple generics
export interface SelectRootProps<Value, Multiple extends boolean = false>
  extends HeadlessComponentProps<'div', SelectRootState<Value, Multiple>> {
  value?: Multiple extends true ? Value[] : Value;
  defaultValue?: Multiple extends true ? Value[] : Value;
  onValueChange?: (
    value: Multiple extends true ? Value[] : Value,
    details: ValueChangeDetails<Value>,
  ) => void;
  multiple?: Multiple;
}

// Conditional type based on Multiple
type SelectValue<Value, Multiple extends boolean> =
  Multiple extends true ? Value[] : Value;

// Function signature
export function SelectRoot<Value, Multiple extends boolean = false>(
  props: SelectRootProps<Value, Multiple>,
): React.ReactElement;
```

---

## 4. Generic with Default

Provide defaults while allowing override:

```typescript
// Default to string if not specified
export interface ComboboxRootProps<Value = string>
  extends HeadlessComponentProps<'div', ComboboxRootState<Value>> {
  value?: Value;
  onValueChange?: (value: Value) => void;
}

// Usage
<Combobox.Root>  {/* Value is string */}
<Combobox.Root<number>>  {/* Value is number */}
```

---

## 5. Discriminated Union for Context

Different shapes based on parent context:

```typescript
// Menu parent type varies by context
type MenuParentContext =
  | { type: 'menu'; closeParent: () => void; nested: true }
  | { type: 'menubar'; closeParent: () => void; nested: true }
  | { type: 'context-menu'; closeParent: () => void; nested: true }
  | { type: 'root'; nested: false };

// Type guard
function isNestedMenu(ctx: MenuParentContext): ctx is MenuParentContext & { nested: true } {
  return ctx.nested;
}
```

---

## 6. Omit + Re-declare Pattern

Extend while constraining:

```typescript
// AlertDialog removes certain props from Dialog
export interface AlertDialogRootProps
  extends Omit<DialogRootProps, 'dismissible' | 'modal'> {
  // Can add new props or redeclare omitted ones with fixed types
}

// Implementation applies fixed values
export function AlertDialogRoot(props: AlertDialogRootProps) {
  return (
    <Dialog.Root
      {...props}
      dismissible={false}  // Always false
      modal={true}         // Always true
    />
  );
}
```

---

## 7. Function Overloads

Different signatures for different use cases:

```typescript
// Autocomplete items: flat or grouped
export function AutocompleteRoot<Value>(
  props: AutocompleteRootProps<Value> & {
    items: Value[];  // Flat list
  },
): React.ReactElement;

export function AutocompleteRoot<Value>(
  props: AutocompleteRootProps<Value> & {
    items: AutocompleteItemGroup<Value>[];  // Grouped list
    getGroupItems: (group: AutocompleteItemGroup<Value>) => Value[];
    getGroupLabel: (group: AutocompleteItemGroup<Value>) => string;
  },
): React.ReactElement;

export function AutocompleteRoot<Value>(
  props: AutocompleteRootProps<Value>,
): React.ReactElement {
  // Implementation handles both cases
}
```

---

## 8. Context Hook Overloads

Optional vs required context:

```typescript
// Overloaded hook
export function useDialogRootContext(): DialogRootContext;
export function useDialogRootContext(optional: false): DialogRootContext;
export function useDialogRootContext(optional: true): DialogRootContext | undefined;
export function useDialogRootContext(optional?: boolean): DialogRootContext | undefined {
  const context = React.useContext(DialogRootContext);

  if (!optional && context === undefined) {
    throw new Error('useDialogRootContext must be used within DialogRoot');
  }

  return context;
}

// Usage
const ctx = useDialogRootContext();           // Required, throws if missing
const ctx = useDialogRootContext(false);      // Same as above
const ctx = useDialogRootContext(true);       // Optional, returns undefined if missing
```

---

## 9. State Extends Pattern

Inherit state from parent component:

```typescript
// RadioGroup state extends Field state
export interface RadioGroupRootState extends FieldRootState {
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  orientation: 'horizontal' | 'vertical';
}

// FieldRootState
export interface FieldRootState {
  dirty: boolean;
  touched: boolean;
  valid: boolean | null;
  disabled: boolean;
}
```

---

## 10. Callback Type with Details

Event callbacks with rich information:

```typescript
// Change callback includes details
interface OpenChangeDetails {
  reason: OpenChangeReason;
  event?: Event;
  cancel(): void;
  isCanceled: boolean;
}

type OpenChangeReason =
  | 'triggerPress'
  | 'triggerHover'
  | 'triggerFocus'
  | 'escapeKey'
  | 'outsidePress'
  | 'focusOut';

interface DialogRootProps {
  onOpenChange?: (open: boolean, details: OpenChangeDetails) => void;
}

// Value change with details
interface ValueChangeDetails<Value> {
  value: Value;
  event?: Event;
  reason: string;
}

interface SelectRootProps<Value> {
  onValueChange?: (value: Value, details: ValueChangeDetails<Value>) => void;
}
```

---

## 11. Conditional Return Type

Return type based on parameter:

```typescript
// useRenderElement returns null when enabled is false
export function useRenderElement<
  State extends Record<string, any>,
  RenderedElementType extends Element,
  TagName extends IntrinsicTagName | undefined,
  Enabled extends boolean | undefined = undefined,
>(
  element: TagName,
  componentProps: ComponentProps<State>,
  params?: Parameters<State, RenderedElementType, TagName, Enabled>,
): Enabled extends false ? null : React.ReactElement;

// Usage
const el1 = useRenderElement('div', props, { enabled: true });  // ReactElement
const el2 = useRenderElement('div', props, { enabled: false }); // null
const el3 = useRenderElement('div', props, { enabled: someCondition }); // ReactElement | null
```

---

## 12. Props Getter Type

Functions that return props:

```typescript
type PropsGetter<T extends Element = Element> = (
  externalProps?: React.HTMLAttributes<T>,
) => React.HTMLAttributes<T>;

// Usage
const getInputProps: PropsGetter<HTMLInputElement> = (externalProps = {}) =>
  mergeProps(
    {
      'aria-invalid': invalid || undefined,
      'aria-required': required || undefined,
    },
    externalProps,
  );

// In component
<input {...getInputProps({ className: 'my-input' })} />
```

---

## 13. Ref Type Patterns

Various ref patterns:

```typescript
// ForwardedRef in component signature
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, forwardedRef) {
    // forwardedRef: React.ForwardedRef<HTMLButtonElement>
  }
);

// Internal ref
const rootRef = React.useRef<HTMLDivElement>(null);

// Callback ref
const setElement = React.useCallback((element: HTMLElement | null) => {
  elementRef.current = element;
}, []);

// Multiple refs to merge
ref: [forwardedRef, rootRef, setElement]
```

---

## 14. State Attributes Mapping Type

Type-safe state to attributes:

```typescript
type StateAttributesMapping<State> = {
  [K in keyof State]?: (value: State[K]) => Record<string, string | undefined> | null;
};

// Usage
const stateAttributesMapping: StateAttributesMapping<ButtonState> = {
  disabled(value) {
    return value ? { 'data-disabled': '' } : null;
  },
  pressed(value) {
    return { 'data-pressed': value ? 'true' : 'false' };
  },
};
```

---

## 15. Generic Form Values

Type-safe form handling:

```typescript
interface FormProps<Values extends Record<string, any>> {
  defaultValues?: Partial<Values>;
  onSubmit?: (values: Values) => void | Promise<void>;
  errors?: Partial<Record<keyof Values, string[]>>;
}

// Usage with explicit type
interface MyForm {
  email: string;
  password: string;
  remember: boolean;
}

<Form<MyForm>
  defaultValues={{ remember: true }}
  onSubmit={(values) => {
    // values: MyForm (typed!)
    console.log(values.email);
  }}
  errors={{
    email: ['Invalid email'],  // Type-safe key
  }}
/>
```

---

## 16. Utility Types

Commonly used type utilities:

```typescript
// Extract element type from tag name
type IntrinsicTagName = keyof JSX.IntrinsicElements;

// Props for a given tag
type ElementProps<Tag extends IntrinsicTagName> =
  React.ComponentPropsWithoutRef<Tag>;

// Merge props
type MergeProps<T, U> = Omit<T, keyof U> & U;

// Make some props required
type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make some props optional
type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

---

## 17. Array Value Type

Enforce array even for single values:

```typescript
// ToggleGroup always uses array internally
interface ToggleGroupRootProps<Multiple extends boolean = false> {
  value?: Multiple extends true ? string[] : string;
  defaultValue?: Multiple extends true ? string[] : string;
}

// Internal state is always array
const [values, setValues] = useState<string[]>([]);

// For single mode, array has 0 or 1 element
// For multiple mode, array has 0 to N elements
```

---

## 18. Loading Status Type

State machine for async states:

```typescript
type LoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface AvatarState {
  loadingStatus: LoadingStatus;
}

// State transitions
// idle -> loading (image src set)
// loading -> loaded (onLoad)
// loading -> error (onError)
// error -> loading (src changed)
```
