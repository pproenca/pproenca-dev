# Form Patterns

## 1. Hidden Input Pattern

Native form submission with custom UI:

```typescript
// The pattern: hidden input for form + visible custom element
return (
  <>
    {/* Visible custom element */}
    <span
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          inputRef.current?.click();
        }
      }}
    >
      {children}
    </span>

    {/* Hidden native input for form submission */}
    <input
      ref={inputRef}
      type="checkbox"
      tabIndex={-1}
      aria-hidden
      style={visuallyHidden}
      checked={checked}
      name={name}
      value={value}
      disabled={disabled}
      required={required}
      onChange={(e) => setChecked(e.target.checked)}
    />
  </>
);
```

### Input Props Pattern

```typescript
const inputProps: React.ComponentPropsWithRef<"input"> = React.useMemo(
  () => ({
    type: "checkbox", // or 'radio'
    ref: inputRef,
    tabIndex: -1,
    style: visuallyHidden,
    "aria-hidden": true,
    disabled,
    checked,
    required,
    readOnly,
    name,
    value,
    onChange(event) {
      if (event.defaultPrevented || readOnly) return;
      setChecked(event.target.checked);
    },
    onFocus() {
      // Redirect focus to visible element
      rootRef.current?.focus();
    },
  }),
  [disabled, checked, required, readOnly, name, value],
);
```

---

## 2. Field Integration Pattern

Components integrate with Field for labels/errors:

```typescript
// Field.Root wraps form controls
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Field.Control />  {/* or Input */}
  <Field.Description>We'll never share your email</Field.Description>
  <Field.Error>Invalid email format</Field.Error>
</Field.Root>

// Field.Control consumes Field context
export const FieldControl = React.forwardRef(function FieldControl(...) {
  const {
    labelId,
    name,
    disabled,
    invalid,
    getInputValidationProps,
  } = useFieldRootContext();

  const element = useRenderElement('input', componentProps, {
    props: [
      {
        id: controlId,
        name,
        disabled,
        'aria-labelledby': labelId,
        'aria-invalid': invalid || undefined,
        'aria-describedby': descriptionId || errorId || undefined,
      },
      getInputValidationProps,
      elementProps,
    ],
  });
});
```

### LabelableProvider Pattern

```typescript
// Field wraps inner content with LabelableProvider
<FieldRootContext.Provider value={fieldContext}>
  <LabelableProvider controlId={controlId}>
    {children}
  </LabelableProvider>
</FieldRootContext.Provider>

// Labelable context provides label association
const { labelId, getDescriptionProps } = useLabelableContext();
```

---

## 3. Validation Props Getter Pattern

Functions that return validation-related props:

```typescript
// Props getter for input validation
const getInputValidationProps = React.useCallback(
  (externalProps = {}) =>
    mergeProps(
      {
        "aria-invalid": valid === false || undefined,
        "aria-describedby": errorId || undefined,
      },
      externalProps,
    ),
  [valid, errorId],
);

// Usage in component
const element = useRenderElement("input", componentProps, {
  props: [
    defaultProps,
    getInputValidationProps, // Function in props array
    elementProps,
  ],
});
```

### Validation State Structure

```typescript
// Mirrors HTML5 Constraint API
interface ValidityData {
  state: {
    badInput: boolean;
    customError: boolean;
    patternMismatch: boolean;
    rangeOverflow: boolean;
    rangeUnderflow: boolean;
    stepMismatch: boolean;
    tooLong: boolean;
    tooShort: boolean;
    typeMismatch: boolean;
    valueMissing: boolean;
    valid: boolean;
  };
  errors: string[];
  value: string;
}
```

---

## 4. Control Registration Pattern

First control registers for focus management:

```typescript
// Field tracks the first control
const registerControlRef = React.useCallback((element: HTMLElement | null) => {
  if (element && !controlRef.current) {
    controlRef.current = element;
  }
}, []);

// Controls register themselves
const element = useRenderElement("input", componentProps, {
  ref: [forwardedRef, registerControlRef],
});

// Field can focus the control
const focusControl = React.useCallback(() => {
  controlRef.current?.focus();
}, []);
```

---

## 5. Dirty/Touched Tracking Pattern

Track user interaction state:

```typescript
interface FieldState {
  dirty: boolean; // Value changed from initial
  touched: boolean; // User has interacted
  valid: boolean | null; // null = not validated yet
}

// In Field.Root
const [dirty, setDirty] = React.useState(false);
const [touched, setTouched] = React.useState(false);

// Controls update on interaction
const handleBlur = () => {
  setTouched(true);
  validate();
};

const handleChange = (value) => {
  setDirty(true);
  setValue(value);
};
```

### State Attributes for Styling

```typescript
const stateAttributesMapping = {
  dirty(value) {
    return value ? { "data-dirty": "" } : null;
  },
  touched(value) {
    return value ? { "data-touched": "" } : null;
  },
  valid(value) {
    if (value === true) return { "data-valid": "" };
    if (value === false) return { "data-invalid": "" };
    return null; // null = not validated
  },
};
```

---

## 6. Validation Debouncing Pattern

Debounce validation for performance:

```typescript
interface FieldRootProps {
  validationDebounceTime?: number; // Default: 0
  validateOnChange?: boolean;
}

// Implementation
const validationTimeoutRef = useRef<number>();

const validate = useStableCallback(() => {
  if (validationTimeoutRef.current) {
    clearTimeout(validationTimeoutRef.current);
  }

  if (validationDebounceTime > 0) {
    validationTimeoutRef.current = window.setTimeout(() => {
      performValidation();
    }, validationDebounceTime);
  } else {
    performValidation();
  }
});
```

---

## 7. External Errors Pattern

Support server-side validation:

```typescript
interface FormProps<T> {
  errors?: Partial<Record<keyof T, string[]>>;
  onClearErrors?: (field: keyof T) => void;
}

// Form passes errors to fields
<Form errors={serverErrors}>
  <Field.Root name="email">
    {/* Field shows serverErrors.email if present */}
  </Field.Root>
</Form>

// Field consumes external errors
const { externalErrors } = useFormContext();
const fieldErrors = externalErrors?.[name] ?? [];
```

---

## 8. Form Values Generic Pattern

Type-safe form values:

```typescript
interface FormProps<Values extends Record<string, any>> {
  onSubmit?: (values: Values) => void;
  defaultValues?: Partial<Values>;
  errors?: Partial<Record<keyof Values, string[]>>;
}

// Usage
interface MyFormValues {
  email: string;
  password: string;
}

<Form<MyFormValues>
  onSubmit={(values) => {
    // values is typed as MyFormValues
    console.log(values.email, values.password);
  }}
  errors={{
    email: ['Invalid email'],  // Type-checked
  }}
>
```

---

## 9. Field Registration Map Pattern

Track all fields in form:

```typescript
// Form tracks registered fields
const formRef = React.useRef({
  fields: new Map<string, FieldData>(),
});

interface FieldData {
  validate: () => boolean;
  value: unknown;
  element: HTMLElement | null;
}

// Fields register on mount
useEffect(() => {
  formRef.current.fields.set(name, {
    validate,
    value,
    element: controlRef.current,
  });

  return () => {
    formRef.current.fields.delete(name);
  };
}, [name]);
```

---

## 10. Checkbox Group Parent Pattern

Parent checkbox for "select all":

```typescript
// Hook for parent checkbox behavior
const { checked, indeterminate, getParentProps } = useCheckboxGroupParent({
  values: groupValues, // All selected values
  allValues: allChildValues, // All possible values
  onParentChange,
});

// Parent checkbox state
// - checked: all children selected
// - indeterminate: some children selected
// - unchecked: no children selected

// Cycling behavior
// mixed -> all checked -> all unchecked -> mixed (if some were checked)
```

### Parent/Child Props Getters

```typescript
// For parent checkbox
const getParentProps = () => ({
  checked,
  indeterminate,
  onChange: handleParentChange,
});

// For child checkboxes
const getChildProps = (value: string) => ({
  checked: groupValues.includes(value),
  onChange: () => handleChildChange(value),
});
```

---

## 11. Fieldset Pattern

Grouping with legend:

```typescript
<Fieldset.Root>
  <Fieldset.Legend>Personal Information</Fieldset.Legend>
  <Field.Root>...</Field.Root>
  <Field.Root>...</Field.Root>
</Fieldset.Root>

// Legend registers ID for aria-labelledby
export const FieldsetLegend = React.forwardRef(function FieldsetLegend(...) {
  const { setLegendId } = useFieldsetRootContext();
  const legendId = useId();

  useEffect(() => {
    setLegendId(legendId);
    return () => setLegendId(undefined);
  }, [legendId, setLegendId]);

  return useRenderElement('legend', componentProps, {
    props: { id: legendId },
  });
});
```

---

## 12. Number Field Pattern

Formatted display vs raw value:

```typescript
// Three values tracked
const [rawValue, setRawValue] = useState<number | null>(null);
const [inputValue, setInputValue] = useState(""); // Formatted display
const [committedValue, setCommittedValue] = useState<number | null>(null);

// Formatting on blur
const handleBlur = () => {
  const formatted = formatNumber(rawValue, locale, format);
  setInputValue(formatted);
  setCommittedValue(rawValue);
};

// Parsing on change
const handleChange = (event) => {
  const parsed = parseNumber(event.target.value, locale);
  if (!isNaN(parsed)) {
    setRawValue(parsed);
  }
  setInputValue(event.target.value); // Keep user input as-is
};
```

### Step Sizes Pattern

```typescript
// Three step sizes based on modifiers
interface NumberFieldProps {
  step?: number; // Default step (arrows, up/down)
  largeStep?: number; // Shift + arrows
  smallStep?: number; // Alt + arrows
}

const handleKeyDown = (event) => {
  let stepSize = step;
  if (event.shiftKey) stepSize = largeStep ?? step * 10;
  if (event.altKey) stepSize = smallStep ?? step / 10;

  if (event.key === "ArrowUp") {
    setValue(value + stepSize);
  }
};
```
