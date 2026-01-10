# Advanced TypeScript Patterns

Complex TypeScript patterns found in headless component.

---

## 1. Multi-Generic Components

```typescript
// Select has Value and Multiple generics
export interface SelectRootProps<
  Value,
  Multiple extends boolean = false,
> extends HeadlessComponentProps<"div", SelectRootState<Value, Multiple>> {
  /**
   * The current value. Use when controlled.
   */
  value?: Multiple extends true ? Value[] : Value;
  /**
   * The default value. Use when uncontrolled.
   */
  defaultValue?: Multiple extends true ? Value[] : Value;
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (
    value: Multiple extends true ? Value[] : Value,
    details: ValueChangeDetails<Value>,
  ) => void;
  /**
   * Whether multiple items can be selected.
   */
  multiple?: Multiple;
}

// State type also generic
export interface SelectRootState<Value, Multiple extends boolean = false> {
  value: Multiple extends true ? Value[] : Value;
  open: boolean;
  disabled: boolean;
}
```

### Key Pattern:

- **Conditional type based on boolean generic**: `Multiple extends true ? Value[] : Value`
- **Default generic value**: `Multiple extends boolean = false`
- **Generic propagation**: Root passes generic to children via context

---

## 2. Function Overloads for Different Shapes

```typescript
// Autocomplete supports flat or grouped items
export function AutocompleteRoot<Value>(
  props: AutocompleteRootProps<Value> & {
    items: Value[];
  },
): React.ReactElement;

export function AutocompleteRoot<Value>(
  props: AutocompleteRootProps<Value> & {
    items: AutocompleteItemGroup<Value>[];
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

## 3. Context Hook with Optional Overload

```typescript
// The three overloads provide different behavior
export function useDialogRootContext(): DialogRootContext;
export function useDialogRootContext(optional: false): DialogRootContext;
export function useDialogRootContext(
  optional: true,
): DialogRootContext | undefined;
export function useDialogRootContext(
  optional?: boolean,
): DialogRootContext | undefined {
  const context = React.useContext(DialogRootContext);

  if (!optional && context === undefined) {
    throw new Error("useDialogRootContext must be used within <Dialog.Root>");
  }

  return context;
}
```

### Type Narrowing:

```typescript
// Required - throws if missing, returns non-undefined
const ctx = useDialogRootContext(); // Type: DialogRootContext

// Explicit required
const ctx = useDialogRootContext(false); // Type: DialogRootContext

// Optional - never throws, may be undefined
const ctx = useDialogRootContext(true); // Type: DialogRootContext | undefined
```

---

## 4. Discriminated Union for Context Types

```typescript
// Menu parent varies by context
type MenuParentContext =
  | {
      type: "menu";
      closeParent: () => void;
      setClickAndDragActive: (active: boolean) => void;
      nested: true;
    }
  | {
      type: "menubar";
      closeParent: () => void;
      setClickAndDragActive: (active: boolean) => void;
      nested: true;
    }
  | {
      type: "context-menu";
      closeParent: () => void;
      setClickAndDragActive: (active: boolean) => void;
      nested: true;
    }
  | {
      type: "root";
      nested: false;
    };

// Type narrowing via discriminant
function handleParent(ctx: MenuParentContext) {
  if (ctx.nested) {
    // Type narrowed: closeParent exists
    ctx.closeParent();
  }

  if (ctx.type === "menubar") {
    // Type narrowed: all menubar props available
    ctx.setClickAndDragActive(true);
  }
}
```

---

## 5. Conditional Return Type

```typescript
export function useRenderElement<
  State extends Record<string, any>,
  RenderedElementType extends Element,
  TagName extends IntrinsicTagName | undefined,
  Enabled extends boolean | undefined = undefined,
>(
  element: TagName,
  componentProps: useRenderElement.ComponentProps<State>,
  params?: useRenderElement.Parameters<
    State,
    RenderedElementType,
    TagName,
    Enabled
  >,
): Enabled extends false ? null : React.ReactElement;
```

### Usage:

```typescript
// enabled: true (default) - returns ReactElement
const el1 = useRenderElement("div", props);
// Type: React.ReactElement

// enabled: false - returns null
const el2 = useRenderElement("div", props, { enabled: false });
// Type: null

// enabled: boolean - returns either
const el3 = useRenderElement("div", props, { enabled: someCondition });
// Type: React.ReactElement | null
```

---

## 6. Mapped Type with Function Values

```typescript
export type StateAttributesMapping<State> = {
  [Property in keyof State]?: (
    state: State[Property],
  ) => Record<string, string> | null;
};

// Usage
interface ButtonState {
  disabled: boolean;
  pressed: boolean;
  orientation: "horizontal" | "vertical";
}

const mapping: StateAttributesMapping<ButtonState> = {
  // value is boolean
  disabled(value) {
    return value ? { "data-disabled": "" } : null;
  },
  // value is boolean
  pressed(value) {
    return value ? { "data-pressed": "" } : null;
  },
  // value is 'horizontal' | 'vertical'
  orientation(value) {
    return { "data-orientation": value };
  },
};
```

---

## 7. Event Handler Type Transformation

```typescript
type WithPreventDefaultHandler<T> = T extends (event: infer E) => any
  ? E extends React.SyntheticEvent<Element, Event>
    ? (event: ComponentEvent<E>) => ReturnType<T>
    : T
  : T extends undefined
    ? undefined
    : T;

export type WithComponentEvent<T> = {
  [K in keyof T]: WithPreventDefaultHandler<T[K]>;
};
```

### What This Does:

1. **Infers event type**: Extracts `E` from function signature
2. **Checks if SyntheticEvent**: Only transforms React events
3. **Adds extension**: `ComponentEvent<E>` adds `preventDefaultHandler()`
4. **Preserves non-events**: Non-function props pass through unchanged

---

## 8. Namespace for Type Organization

```typescript
// In component file
export const DialogRoot = React.forwardRef(function DialogRoot(
  props: DialogRoot.Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  // ...
});

export interface DialogRootProps {
  /* ... */
}
export interface DialogRootState {
  /* ... */
}

// Namespace provides aliases
export namespace DialogRoot {
  export type Props = DialogRootProps;
  export type State = DialogRootState;
}

// Usage - both work
type P1 = DialogRoot.Props; // Via namespace
type P2 = DialogRootProps; // Direct import
```

---

## 9. State Extension Pattern

```typescript
// Base state
export interface FieldRootState {
  dirty: boolean;
  touched: boolean;
  valid: boolean | null;
  disabled: boolean;
}

// Extended state includes all base + additions
export interface RadioGroupRootState extends FieldRootState {
  // Inherits: dirty, touched, valid, disabled
  readOnly: boolean;
  required: boolean;
  orientation: "horizontal" | "vertical";
}
```

---

## 10. Props Getter Return Type

```typescript
type PropsGetter<T extends Element = Element> = (
  externalProps?: React.HTMLAttributes<T>,
) => React.HTMLAttributes<T>;

// Usage in component
const getInputProps: PropsGetter<HTMLInputElement> = (externalProps = {}) =>
  mergeProps(
    {
      "aria-invalid": invalid || undefined,
      "aria-required": required || undefined,
      name,
      disabled,
    },
    externalProps,
  );
```

---

## 11. Omit + Re-declare Pattern

```typescript
// AlertDialog removes certain props from Dialog
export interface AlertDialogRootProps extends Omit<
  DialogRootProps,
  "dismissible" | "modal"
> {
  // Props are now fixed in implementation
}

// Can re-declare with different type if needed
export interface AlertDialogPopupProps extends Omit<DialogPopupProps, "role"> {
  /**
   * @default 'alertdialog'
   */
  role?: "alertdialog" | "dialog"; // Narrower type
}
```

---

## 12. Generic Form Values

```typescript
export interface FormProps<Values extends Record<string, any> = Record<string, any>> {
  /**
   * Default values for the form fields.
   */
  defaultValues?: Partial<Values>;
  /**
   * Callback fired when the form is submitted.
   */
  onSubmit?: (values: Values) => void | Promise<void>;
  /**
   * External validation errors (e.g., from server).
   */
  errors?: Partial<Record<keyof Values, string[]>>;
  /**
   * Callback to clear external errors.
   */
  onClearErrors?: (field: keyof Values) => void;
}

// Usage with explicit type
interface MyForm {
  email: string;
  password: string;
  remember: boolean;
}

<Form<MyForm>
  defaultValues={{ remember: true }}
  errors={{ email: ['Invalid email'] }}  // Type-safe keys
  onSubmit={(values) => {
    // values is MyForm
    console.log(values.email);
  }}
/>
```

---

## 13. Array Always Pattern

```typescript
// ToggleGroup internally always uses array
interface ToggleGroupState<Multiple extends boolean> {
  // External API varies by Multiple
  value: Multiple extends true ? string[] : string;
}

// Internal implementation always uses array
const [values, setValues] = React.useState<string[]>([]);

// For single mode: array has 0 or 1 element
// For multiple mode: array has 0 to N elements

// Conversion for external API
const externalValue = multiple ? values : values[0];
```

---

## 14. Loading Status State Machine

```typescript
type LoadingStatus = "idle" | "loading" | "loaded" | "error";

export interface AvatarRootState {
  loadingStatus: LoadingStatus;
}

// State transitions
// idle -> loading      (when src is set)
// loading -> loaded    (when onLoad fires)
// loading -> error     (when onError fires)
// error -> loading     (when src changes)
// loaded -> loading    (when src changes)
```
