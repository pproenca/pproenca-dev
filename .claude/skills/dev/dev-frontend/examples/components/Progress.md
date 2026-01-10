# Progress Component Analysis

**Files**: `packages/react/src/progress/`
**Pattern**: Simple Compound with Track/Indicator
**Sub-parts**: Root, Track, Indicator, Value, Label

## Directory Structure

```
progress/
├── index.ts
├── index.parts.ts
├── root/
│   ├── ProgressRoot.tsx (~150 lines)
│   ├── ProgressRootContext.tsx
│   ├── ProgressRootDataAttributes.ts
│   └── stateAttributesMapping.ts
├── track/
│   └── ProgressTrack.tsx
├── indicator/
│   └── ProgressIndicator.tsx
├── value/
│   └── ProgressValue.tsx
└── label/
    └── ProgressLabel.tsx
```

## Key Architectural Pattern: Simple Compound

Progress is one of the simpler compound components - a good reference for basics:

```typescript
export const ProgressRoot = React.forwardRef(function ProgressRoot(
  componentProps: ProgressRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    format,
    getAriaValueText = getDefaultAriaValueText,
    locale,
    max = 100,
    min = 0,
    value,
    render,
    className,
    ...elementProps
  } = componentProps;

  // ... minimal state

  return (
    <ProgressRootContext.Provider value={contextValue}>
      {element}
    </ProgressRootContext.Provider>
  );
});
```

**Pattern**: No store, no floating-ui, no complex state - just context.

## Status Derived from Value

```typescript
export type ProgressStatus = "indeterminate" | "progressing" | "complete";

let status: ProgressStatus = "indeterminate";
if (Number.isFinite(value)) {
  status = value === max ? "complete" : "progressing";
}
```

**Pattern**: Derived state from props - `null` value means indeterminate.

## Formatted Value

```typescript
function formatValue(
  value: number | null,
  locale?: Intl.LocalesArgument,
  format?: Intl.NumberFormatOptions,
): string {
  if (value == null) {
    return "";
  }

  if (!format) {
    return formatNumber(value / 100, locale, { style: "percent" });
  }

  return formatNumber(value, locale, format);
}

const formattedValue = formatValue(value, locale, formatOptionsRef.current);
```

**Pattern**: Default percentage formatting, customizable via Intl.NumberFormatOptions.

## Aria Attributes on Root

```typescript
const defaultProps: HTMLProps = {
  "aria-labelledby": labelId,
  "aria-valuemax": max,
  "aria-valuemin": min,
  "aria-valuenow": value ?? undefined,
  "aria-valuetext": getAriaValueText(formattedValue, value),
  role: "progressbar",
};
```

**Pattern**: Root element carries all ARIA progressbar attributes.

## Custom Aria Value Text

```typescript
function getDefaultAriaValueText(
  formattedValue: string | null,
  value: number | null,
) {
  if (value == null) {
    return "indeterminate progress";
  }

  return formattedValue || `${value}%`;
}

interface ProgressRootProps {
  /**
   * Accepts a function which returns a string value that provides
   * a human-readable text alternative for the current value.
   */
  getAriaValueText?: (
    formattedValue: string | null,
    value: number | null,
  ) => string;
}
```

**Pattern**: Customizable screen reader text with sensible default.

## Label ID Coordination

```typescript
const [labelId, setLabelId] = React.useState<string | undefined>();

const contextValue: ProgressRootContext = React.useMemo(
  () => ({
    // ...
    setLabelId,  // Passed to context for Label to call
  }),
  [...]
);

// In ProgressLabel:
const context = useProgressRootContext();
React.useEffect(() => {
  context.setLabelId(id);
  return () => context.setLabelId(undefined);
}, [id, context]);
```

**Pattern**: Label registers its ID with Root for aria-labelledby.

## Indicator with Computed Styles

```typescript
export const ProgressIndicator = React.forwardRef(function ProgressIndicator(
  componentProps: ProgressIndicator.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { max, min, value, state } = useProgressRootContext();

  const percentageValue =
    Number.isFinite(value) && value !== null
      ? valueToPercent(value, min, max)
      : null;

  const getStyles = React.useCallback(() => {
    if (percentageValue == null) {
      return {}; // Indeterminate - no width
    }

    return {
      insetInlineStart: 0,
      height: "inherit",
      width: `${percentageValue}%`,
    };
  }, [percentageValue]);

  const element = useRenderElement("div", componentProps, {
    state,
    ref: forwardedRef,
    props: [{ style: getStyles() }, elementProps],
    stateAttributesMapping: progressStateAttributesMapping,
  });

  return element;
});
```

**Pattern**: Indicator computes width from percentage value.

## Simple State Object

```typescript
export interface ProgressRootState {
  status: ProgressStatus;
}

const state: ProgressRoot.State = React.useMemo(
  () => ({
    status,
  }),
  [status],
);
```

**Pattern**: Minimal state - only status needed for data attributes.

## State Attributes Mapping

```typescript
// In stateAttributesMapping.ts
export const progressStateAttributesMapping = {
  status: "data-status",
};

// Usage in component:
const element = useRenderElement("div", componentProps, {
  state,
  stateAttributesMapping: progressStateAttributesMapping,
});

// Renders: <div data-status="progressing">
```

**Pattern**: State object maps to data-\* attributes for CSS styling.

## Context Structure

```typescript
export interface ProgressRootContext {
  formattedValue: string;
  max: number;
  min: number;
  setLabelId: (id: string | undefined) => void;
  state: ProgressRoot.State;
  status: ProgressStatus;
  value: number | null;
}
```

**Pattern**: Context exposes computed values (formattedValue, status) for children.

## What Makes This API Good

1. **Simple mental model**: Value, min, max - that's it
2. **Indeterminate support**: `null` value = indeterminate
3. **I18n ready**: Intl.NumberFormat for formatting
4. **Screen reader friendly**: Custom aria-valuetext
5. **CSS-driven animations**: data-status for styling
6. **Minimal footprint**: No store, no floating-ui

## Key Difference from Slider

| Aspect           | Progress      | Slider             |
| ---------------- | ------------- | ------------------ |
| Interaction      | Read-only     | Interactive        |
| Value control    | External only | User can change    |
| Hidden input     | None          | Per thumb          |
| Keyboard         | None          | Full support       |
| State complexity | Minimal       | Extensive          |
| Form integration | None          | Full field support |

**Pattern**: Progress is the "display" version, Slider is the "input" version.

## Anti-Pattern: Not Over-Engineering

Progress shows restraint:

- No store pattern (not needed)
- No complex state machine
- No event handlers
- No refs for tracking
- Simple derived state

**Lesson**: Match complexity to requirements. Progress doesn't need what Slider has.
