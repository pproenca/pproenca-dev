# Tabs Component Analysis

**Files**: `packages/react/src/tabs/`
**Pattern**: Compound Component with Composite Navigation
**Sub-parts**: Root, List, Tab, Panel, Indicator

## Directory Structure

```
tabs/
├── index.ts
├── index.parts.ts
├── root/
│   ├── TabsRoot.tsx
│   ├── TabsRootContext.ts
│   └── stateAttributesMapping.ts
├── list/
│   ├── TabsList.tsx
│   └── TabsListContext.ts
├── tab/
│   ├── TabsTab.tsx
│   └── TabsTabDataAttributes.ts
├── panel/
│   └── TabsPanel.tsx
└── indicator/
    ├── TabsIndicator.tsx
    └── useActivationDirectionDetector.ts
```

## Key Architectural Pattern: Tab-Panel Association

Tabs maintains bidirectional mapping between tabs and panels:

```typescript
// Track mounted panels: value -> panelId
const [mountedTabPanels, setMountedTabPanels] = React.useState(
  () => new Map<TabsTab.Value | number, string>(),
);

// Track tab metadata: element -> metadata
const [tabMap, setTabMap] = React.useState(
  () => new Map<Node, CompositeMetadata<TabsTab.Metadata> | null>(),
);

// Get panel ID for aria-controls on Tab
const getTabPanelIdByValue = React.useCallback(
  (tabValue: TabsTab.Value) => mountedTabPanels.get(tabValue),
  [mountedTabPanels],
);

// Get tab ID for aria-labelledby on Panel
const getTabIdByPanelValue = React.useCallback(
  (tabPanelValue: TabsTab.Value) => {
    for (const tabMetadata of tabMap.values()) {
      if (tabPanelValue === tabMetadata?.value) {
        return tabMetadata?.id;
      }
    }
    return undefined;
  },
  [tabMap],
);
```

## Activation Direction Tracking

```typescript
export type TabsTabActivationDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "none";

const [tabActivationDirection, setTabActivationDirection] =
  React.useState<TabsTab.ActivationDirection>("none");

// Exposed in state for styling:
const state: TabsRoot.State = {
  orientation,
  tabActivationDirection,
};
```

**Why**: Enables CSS animations based on direction (`data-activation-direction="left"`).

## Automatic Disabled Tab Handling

```typescript
useIsoLayoutEffect(() => {
  if (isControlled || tabMap.size === 0) {
    return;
  }

  const selectionIsDisabled = selectedTabMetadata?.disabled;
  const selectionIsMissing = selectedTabMetadata == null && value !== null;

  // Honor explicit defaultValue even if disabled
  const shouldHonorExplicitDefaultSelection =
    hasExplicitDefaultValueProp &&
    selectionIsDisabled &&
    value === defaultValueProp;

  if (shouldHonorExplicitDefaultSelection) {
    return;
  }

  if (!selectionIsDisabled && !selectionIsMissing) {
    return;
  }

  // Fall back to first enabled tab
  const fallbackValue = firstEnabledTabValue ?? null;
  setValue(fallbackValue);
});
```

**Pattern**: Auto-selects first enabled tab when current selection is disabled/missing.

## Tab Component: useCompositeItem

```typescript
const { compositeProps, compositeRef, index } =
  useCompositeItem<TabsTab.Metadata>({
    metadata: tabMetadata,
  });

const element = useRenderElement("button", componentProps, {
  state,
  ref: [forwardedRef, buttonRef, compositeRef],
  props: [
    compositeProps,
    {
      role: "tab",
      "aria-controls": tabPanelId,
      "aria-selected": active,
      // ...
    },
    elementProps,
    getButtonProps,
  ],
});
```

**Pattern**: Composite provides roving tabindex, merged with button and custom props.

## Activate-on-Focus Pattern

```typescript
function onFocus(event: React.FocusEvent<HTMLButtonElement>) {
  if (index > -1 && !disabled) {
    setHighlightedTabIndex(index);
  }

  if (
    activateOnFocus &&
    (!isPressingRef.current || // keyboard/touch focus
      (isPressingRef.current && isMainButtonRef.current)) // mouse focus
  ) {
    onTabActivation(value, createChangeEventDetails(...));
  }
}
```

**Pattern**: Distinguishes between keyboard focus (activate) and mouse press (click activates).

## Tab Metadata Interface

```typescript
export interface TabsTabMetadata {
  disabled: boolean;
  id: string | undefined;
  value: TabsTab.Value | undefined;
}

const tabMetadata = React.useMemo(
  () => ({ disabled, id, value }),
  [disabled, id, value],
);
```

Metadata travels with the DOM element via CompositeItem.

## Event Details Extension

```typescript
export type TabsRootChangeEventDetails = ChangeEventDetails<
  TabsRoot.ChangeEventReason,
  { activationDirection: TabsTab.ActivationDirection } // Extended!
>;
```

**Pattern**: Event details can be extended with component-specific data.

## What Makes This API Good

1. **Bidirectional association**: Tabs and panels linked automatically
2. **Activation direction**: CSS animation hooks built-in
3. **Disabled handling**: Automatic fallback to enabled tabs
4. **Activate-on-focus**: Configurable for different UX patterns
5. **Index-based default**: Works without explicit values
6. **Indicator component**: Animated selection indicator support

## Key Insight: Map-Based State

Tabs uses Maps instead of arrays for O(1) lookups:

```typescript
new Map<TabsTab.Value | number, string>(); // Panel registration
new Map<Node, CompositeMetadata<TabsTab.Metadata> | null>(); // Tab registration
```

This scales better than array searches for many tabs.
