# Checkbox Component Analysis

**Files**: `packages/react/src/checkbox/`
**Pattern**: Compound Component with Complex Group Integration
**Sub-parts**: Root, Indicator

## Directory Structure

```
checkbox/
├── index.ts
├── index.parts.ts
├── root/
│   ├── CheckboxRoot.tsx (~430 lines)
│   ├── CheckboxRootContext.ts
│   └── CheckboxRootDataAttributes.ts
├── indicator/
│   └── CheckboxIndicator.tsx
└── utils/
    └── useStateAttributesMapping.ts
```

## Props Interface

```typescript
export interface CheckboxRootState extends FieldRoot.State {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  indeterminate: boolean;
}

export interface CheckboxRootProps
  extends NonNativeButtonProps,
    Omit<HeadlessComponentProps<'span', CheckboxRoot.State>, 'onChange' | 'value'> {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean, eventDetails: CheckboxRootChangeEventDetails) => void;
  readOnly?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  parent?: boolean;  // For parent checkbox in group
  uncheckedValue?: string;
  value?: string;
}
```

## Key Architectural Pattern: Multi-Context Integration

Checkbox consumes multiple contexts and integrates with several systems:

```typescript
const { clearErrors } = useFormContext();
const { disabled: rootDisabled, name: fieldName, ... } = useFieldRootContext();
const fieldItemContext = useFieldItemContext();
const { labelId, controlId, ... } = useLabelableContext();
const groupContext = useCheckboxGroupContext();
const parentContext = groupContext?.parent;
```

**Context Priority Chain**:
1. `useFormContext` - Form-level error clearing
2. `useFieldRootContext` - Field wrapper integration
3. `useFieldItemContext` - Field item (for groups)
4. `useLabelableContext` - Label association
5. `useCheckboxGroupContext` - Checkbox group integration

## Parent/Child Checkbox Pattern

Checkbox supports a parent-child relationship for "select all" functionality:

```typescript
const isGroupedWithParent = parentContext && groupContext.allValues;

let groupProps: Partial<CheckboxRoot.Props> = {};
if (isGroupedWithParent) {
  if (parent) {
    groupProps = groupContext.parent.getParentProps();
  } else if (value) {
    groupProps = groupContext.parent.getChildProps(value);
  }
}
```

**Pattern**: Parent checkbox tracks disabled states of children:
```typescript
React.useEffect(() => {
  if (parentContext && value) {
    parentContext.disabledStatesRef.current.set(value, disabled);
  }
}, [parentContext, disabled, value]);
```

## Internal State Management

Complex controlled state with group override:

```typescript
const [checked, setCheckedState] = useControlled({
  controlled: value && groupValue && !parent ? groupValue.includes(value) : groupChecked,
  default: value && defaultGroupValue && !parent ? defaultGroupValue.includes(value) : defaultChecked,
  name: 'Checkbox',
  state: 'checked',
});
```

## Hidden Input Pattern

```typescript
<input {...inputProps} />  // Visually hidden but functional

// Props include:
{
  checked,
  disabled,
  name: parent ? undefined : name,  // Parent excluded from form
  id: inputId ?? undefined,
  required,
  ref: mergedInputRef,
  style: visuallyHidden,
  tabIndex: -1,
  type: 'checkbox',
  'aria-hidden': true,
  onChange(event) { ... }
}
```

**Why `aria-hidden`**: The visible checkbox has the ARIA role, hidden input only handles form submission.

## Indeterminate Support

```typescript
useIsoLayoutEffect(() => {
  if (inputRef.current) {
    inputRef.current.indeterminate = groupIndeterminate;
    // ...
  }
}, [checked, groupIndeterminate, setFilled]);
```

Indeterminate is a DOM property (not attribute), so set via effect.

## Dynamic State Attributes Mapping

```typescript
const stateAttributesMapping = useStateAttributesMapping(state);
```

**utils/useStateAttributesMapping.ts** creates dynamic mappings:
- `data-checked` / `data-unchecked`
- `data-indeterminate`
- Field validity attributes

## Accessibility Implementation

```typescript
{
  role: 'checkbox',
  'aria-checked': groupIndeterminate ? 'mixed' : checked,
  'aria-readonly': readOnly || undefined,
  'aria-required': required || undefined,
  'aria-labelledby': labelId,
}
```

Uses `aria-checked="mixed"` for indeterminate state.

## Data Attribute: Parent Marker

```typescript
export const PARENT_CHECKBOX = 'data-parent';

// Applied in element props:
[PARENT_CHECKBOX as string]: parent ? '' : undefined,
```

Allows CSS/JS to distinguish parent checkbox.

## What Makes This API Good

1. **True tri-state**: checked/unchecked/indeterminate
2. **Parent-child pattern**: Select-all functionality built-in
3. **Multiple context integration**: Field, Form, Label, Group
4. **Hidden input for forms**: Native form behavior preserved
5. **Flexible naming**: `value`, `name`, field name cascading
6. **uncheckedValue**: Submit value when unchecked (rare but useful)

## Complexity Warning

This is one of the most complex components due to:
- Multiple context consumers
- Parent/child checkbox relationship
- Group value management
- Field/Form integration
- Indeterminate state handling
- Dynamic ID management

Good candidate for understanding the library's full integration patterns.
