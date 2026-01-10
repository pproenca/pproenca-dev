# Comprehensive Testing Patterns

Detailed patterns for React component testing.

## User Event Patterns

### Click Patterns

```typescript
const { user } = await render(<Dialog.Root />);

// Basic click
await user.click(screen.getByRole('button', { name: 'Open' }));

// Sequential clicks
await user.click(trigger);
await waitFor(() => {
  expect(screen.queryByRole('dialog')).not.to.equal(null);
});

await user.click(closeButton);
await waitFor(() => {
  expect(screen.queryByRole('dialog')).to.equal(null);
});

// Click on hidden/presentation elements
await user.click(screen.getByRole('presentation', { hidden: true }));
```

### Keyboard Patterns

```typescript
// Single keys with brackets
await user.keyboard('[Enter]');
await user.keyboard('[Space]');
await user.keyboard('[Escape]');
await user.keyboard('[Tab]');

// Arrow keys
await user.keyboard('[ArrowDown]');
await user.keyboard('[ArrowUp]');
await user.keyboard('[ArrowLeft]');
await user.keyboard('[ArrowRight]');

// Parameterized tests
['Enter', 'Space'].forEach((key) => {
  it(`can be activated with ${key} key`, async () => {
    const { user } = await render(<Switch.Root />);
    await user.keyboard('[Tab]');
    await user.keyboard(`[${key}]`);
    expect(screen.getByRole('switch')).to.have.attribute('aria-checked', 'true');
  });
});
```

### Pointer Patterns

```typescript
// Click with pointer API
await user.pointer({ keys: "[MouseLeft]", target: button });

// Toggle interactions
const button = screen.getByRole("button", { name: "One" });
expect(button).to.have.attribute("aria-pressed", "false");
await user.pointer({ keys: "[MouseLeft]", target: button });
expect(button).to.have.attribute("aria-pressed", "true");
```

## fireEvent vs user-event

### When to Use fireEvent

Use `fireEvent` for low-level events:

```typescript
import { fireEvent } from "@mui/internal-test-utils";

// Input value changes
fireEvent.change(input, { target: { value: "12" } });

// Wheel events
fireEvent.wheel(input, { deltaY: -100 });

// Focus events
fireEvent.focus(input);
fireEvent.blur(input);

// Key events with specific properties
fireEvent.keyDown(input, { key: "ArrowUp" });

// Composition events (IME)
fireEvent.compositionStart(input);
fireEvent.change(input, { target: { value: "n" } });
fireEvent.compositionEnd(input);
```

### When to Use user-event

Use `user` for realistic user behavior:

```typescript
const { user } = await render(<Component />);
await user.click(button);        // Click interactions
await user.keyboard('[Tab]');    // Tab navigation
await user.keyboard('[Enter]');  // Key presses
```

## ARIA Testing Patterns

### State Attributes

```typescript
// aria-checked
expect(element).to.have.attribute("aria-checked", "false");
expect(element).to.have.attribute("aria-checked", "true");
expect(element).to.have.attribute("aria-checked", "mixed"); // Indeterminate

// aria-expanded
expect(trigger).to.have.attribute("aria-expanded", "false");
await user.click(trigger);
await waitFor(() => {
  expect(trigger).to.have.attribute("aria-expanded", "true");
});

// aria-disabled
expect(screen.getByRole("switch")).to.have.attribute("aria-disabled", "true");

// aria-readonly
expect(screen.getByRole("switch")).to.have.attribute("aria-readonly", "true");

// aria-invalid
expect(checkbox).to.have.attribute("aria-invalid", "true");

// aria-selected
expect(tab).to.have.attribute("aria-selected", "true");

// aria-pressed
expect(button).to.have.attribute("aria-pressed", "true");
```

### Value Attributes

```typescript
// aria-valuenow, aria-valuemin, aria-valuemax
const meter = screen.getByRole("meter");
expect(meter).to.have.attribute("aria-valuenow", "30");
expect(meter).to.have.attribute("aria-valuemin", "0");
expect(meter).to.have.attribute("aria-valuemax", "100");

// With setProps
await setProps({ value: 77 });
expect(meter).to.have.attribute("aria-valuenow", "77");
```

### Relationship Attributes

```typescript
// aria-labelledby
const popup = screen.queryByRole("dialog");
expect(screen.getByText("title text").getAttribute("id")).to.equal(
  popup?.getAttribute("aria-labelledby"),
);

// aria-describedby
expect(screen.getByText("description text").getAttribute("id")).to.equal(
  popup?.getAttribute("aria-describedby"),
);

// aria-controls
const trigger = screen.getByRole("button");
const dialog = screen.getByRole("dialog");
expect(trigger.getAttribute("aria-controls")).to.equal(
  dialog.getAttribute("id"),
);
```

### Hidden Role Queries

```typescript
// Query hidden elements by role
const [, hiddenInput] = screen.getAllByRole<HTMLInputElement>("checkbox", {
  hidden: true,
});

// Query presentation role (backdrops)
expect(screen.getByRole("presentation", { hidden: true })).not.to.equal(null);

// Query hidden tabpanels
const panels = screen.getAllByRole("tabpanel", { hidden: true });
```

## Testing Disabled State

```typescript
describe('prop: disabled', () => {
  it('prevents interaction', async () => {
    const handleClick = spy();
    const { user } = await render(<Button disabled onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick.called).to.equal(false);
  });

  it('sets aria-disabled', async () => {
    await render(<Button disabled />);
    expect(screen.getByRole('button')).to.have.attribute('aria-disabled', 'true');
  });

  it('does not use HTML disabled attribute', async () => {
    await render(<Switch.Root disabled />);
    expect(screen.getByRole('switch')).to.not.have.attribute('disabled');
    expect(screen.getByRole('switch')).to.have.attribute('aria-disabled', 'true');
  });
});
```

## Form Integration Testing

```typescript
describe('Form', () => {
  it('submits value', async () => {
    const handleSubmit = spy((e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      return Object.fromEntries(formData);
    });

    const { user } = await render(
      <form onSubmit={handleSubmit}>
        <Field.Root name="email">
          <Input defaultValue="test@example.com" />
        </Field.Root>
        <button type="submit">Submit</button>
      </form>
    );

    await user.click(screen.getByText('Submit'));

    expect(handleSubmit.firstCall.returnValue).to.deep.equal({
      email: 'test@example.com',
    });
  });
});
```

## RTL Direction Testing

```typescript
describe.skipIf(isJSDOM)('RTL support', () => {
  it('reverses arrow key direction', async () => {
    const { user } = await render(
      <DirectionProvider direction="rtl">
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab value={0} />
            <Tabs.Tab value={1} />
          </Tabs.List>
        </Tabs.Root>
      </DirectionProvider>
    );

    await user.keyboard('[Tab]');
    await user.keyboard('[ArrowLeft]'); // Moves RIGHT in RTL

    expect(screen.getAllByRole('tab')[1]).toHaveFocus();
  });
});
```

## Roving tabIndex Testing

```typescript
it('assigns tabIndex based on focus state', async () => {
  await render(<TestMenu />);

  await user.click(trigger);

  const [firstItem, ...otherItems] = screen.getAllByRole('menuitem');
  await waitFor(() => {
    expect(firstItem.tabIndex).to.equal(0);
  });
  otherItems.forEach((item) => {
    expect(item.tabIndex).to.equal(-1);
  });
});
```

## Modal Behavior Testing

```typescript
describe.skipIf(isJSDOM)('modality', () => {
  it('makes other elements inert when modal is open', async () => {
    await render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Popup>Content</AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    expect(screen.getByRole('presentation', { hidden: true })).not.to.equal(null);
  });

  it('does not make elements inert when non-modal', async () => {
    await render(<TestDialog rootProps={{ defaultOpen: true, modal: false }} />);
    expect(screen.queryByRole('presentation')).to.equal(null);
  });
});
```

## Parameterized Tests

### forEach Pattern

```typescript
['Enter', 'Space'].forEach((key) => {
  it(`can be activated with ${key} key`, async () => {
    const { user } = await render(<Switch.Root />);
    await user.keyboard('[Tab]');
    await user.keyboard(`[${key}]`);
    expect(screen.getByRole('switch')).to.have.attribute('aria-checked', 'true');
  });
});

[false, true].forEach((activateOnFocusProp) => {
  it(`when activateOnFocus = ${activateOnFocusProp}`, async () => {
    // ...
  });
});
```

### describe.for Pattern

```typescript
describe.for([
  { name: "contained triggers", Component: ContainedTriggerDialog },
  { name: "detached triggers", Component: DetachedTriggerDialog },
])("when using $name", ({ Component: TestDialog }) => {
  // Tests run for each variant
});
```

## Test Helper Components

### Local Test Components

```typescript
function Test() {
  const [checked, setChecked] = React.useState(false);
  return (
    <div>
      <button onClick={() => setChecked((c) => !c)}>Toggle</button>
      <Checkbox.Root checked={checked} />;
    </div>
  );
}

await render(<Test />);
```

### Reusable Test Component with Props

```typescript
type TestDialogProps = {
  rootProps?: Omit<Dialog.Root.Props, 'children'>;
  triggerProps?: Dialog.Trigger.Props;
  popupProps?: Dialog.Popup.Props;
};

function ContainedTriggerDialog(props: TestDialogProps) {
  const { rootProps, triggerProps, popupProps } = props;
  return (
    <Dialog.Root {...rootProps}>
      <Dialog.Trigger data-testid="trigger" {...triggerProps}>
        Open
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup data-testid="dialog-popup" {...popupProps}>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## Animation Testing

```typescript
describe("animations", () => {
  beforeEach(() => {
    globalThis.BASE_UI_ANIMATIONS_DISABLED = false;
  });

  afterEach(() => {
    globalThis.BASE_UI_ANIMATIONS_DISABLED = true;
  });

  it("removes popup when no exit animation", async ({ skip }) => {
    if (isJSDOM) {
      skip();
    }

    const { rerender } = await render(
      prepareComponent({ root: { open: true } }),
    );

    await waitFor(() => {
      expect(getPopup()).not.to.equal(null);
    });

    await rerender(prepareComponent({ root: { open: false } }));
    await waitFor(() => {
      expect(getPopup()).to.equal(null);
    });
  });
});
```

## Skip Patterns

```typescript
// Skip entire describe block in JSDOM
describe.skipIf(isJSDOM)("browser-specific", () => {
  // Tests that require real browser
});

// Skip individual test
it.skipIf(isJSDOM)("pointer events", async () => {});

// Conditional skip with context
it("focus trap behavior", async ({ skip }) => {
  if (isJSDOM) {
    skip();
  }
  // Test requires real browser
});

// Safari-specific skip
beforeEach(function beforeHook({ skip }) {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    skip();
  }
});
```
