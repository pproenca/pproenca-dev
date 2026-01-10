# Test Utilities Reference

Detailed reference for createRenderer, conformance tests, and helper utilities.

## createRenderer

### Overview

MUI Base UI uses a custom `createRenderer` that wraps `@mui/internal-test-utils` to provide async rendering with `setProps` helper.

### Implementation

```typescript
import * as React from 'react';
import {
  CreateRendererOptions,
  RenderOptions,
  createRenderer as sharedCreateRenderer,
  Renderer,
  MuiRenderResult,
  act,
} from '@mui/internal-test-utils';

export type BaseUIRenderResult = Omit<MuiRenderResult, 'rerender' | 'setProps'> & {
  rerender: (newElement: React.ReactElement<DataAttributes>) => Promise<void>;
  setProps: (newProps: object) => Promise<void>;
};

type BaseUITestRenderer = Omit<Renderer, 'render'> & {
  render: (
    element: React.ReactElement<DataAttributes>,
    options?: RenderOptions,
  ) => Promise<BaseUIRenderResult>;
};

export function createRenderer(globalOptions?: CreateRendererOptions): BaseUITestRenderer {
  const createRendererResult = sharedCreateRenderer(globalOptions);
  const { render: originalRender } = createRendererResult;

  const render = async (element: React.ReactElement<DataAttributes>, options?: RenderOptions) => {
    const result = await act(async () => originalRender(element, options));

    async function rerender(newElement: React.ReactElement<DataAttributes>) {
      await act(async () => result.rerender(newElement));
    }

    async function setProps(newProps: object) {
      await rerender(React.cloneElement(element, newProps));
    }

    return { ...result, rerender, setProps };
  };

  return {
    ...createRendererResult,
    render,
  };
}
```

### Usage Pattern

```typescript
import { createRenderer } from '#test-utils';
import { screen } from '@mui/internal-test-utils';

describe('Component', () => {
  const { render } = createRenderer();

  it('renders correctly', async () => {
    await render(<Component />);
    expect(screen.getByRole('button')).toBeVisible();
  });
});
```

### Render Result Properties

```typescript
const {
  container,      // DOM container element
  rerender,       // Async function to rerender with new element
  setProps,       // Async function to update props on original element
  user,           // userEvent instance
  unmount,        // Cleanup function
} = await render(<Component />);
```

### setProps vs rerender

**setProps** - Update props on original element:

```typescript
// Original element: <Component value={0} />
await setProps({ value: 1 });
// Result: <Component value={1} />
```

- Uses `React.cloneElement` internally
- Preserves original element structure
- Only updates specified props

**rerender** - Replace with new element:

```typescript
// Original element: <Component value={0} />
await rerender(<Component value={1} extra="prop" />);
// Result: <Component value={1} extra="prop" />
```

- Completely replaces the rendered element
- Useful when children or structure changes
- More explicit about what's being rendered

### User Object

```typescript
const { user } = await render(<Component />);

// Keyboard interactions
await user.keyboard('[Tab]');
await user.keyboard('[ArrowDown]');
await user.keyboard('{Enter}');

// Mouse interactions
await user.click(element);
await user.hover(element);
await user.pointer({ keys: '[MouseLeft]', target: element });
```

### Why Async Render?

All renders are wrapped in `act()`:

```typescript
const result = await act(async () => originalRender(element, options));
```

This ensures:

1. All state updates are flushed
2. Effects are executed
3. Microtasks complete before assertions

## describeConformance

### Purpose

Ensures all components follow consistent API patterns for:

- Prop forwarding to DOM elements
- Ref forwarding
- Render prop customization
- className handling

### Configuration Options

```typescript
interface BaseUiConformanceTestsOptions {
  // Required: render function from createRenderer
  render: (element, options?) => Promise<BaseUIRenderResult>;

  // Expected ref type
  refInstanceof: typeof HTMLElement;

  // Skip specific tests
  skip?: ('propsSpread' | 'refForwarding' | 'renderProp' | 'className')[];

  // Only run specific tests
  only?: ('propsSpread' | 'refForwarding' | 'renderProp' | 'className')[];

  // Element type for render prop tests (default: 'div')
  testRenderPropWith?: keyof React.JSX.IntrinsicElements;

  // Component renders as button
  button?: boolean;

  // Cleanup hook
  after?: () => void;
}
```

### Usage

```typescript
describeConformance(<Checkbox.Root />, () => ({
  render,
  refInstanceof: window.HTMLButtonElement,
  testRenderPropWith: 'button',
  button: true,
}));
```

### Tests Included

1. **className** - String className applies to element
2. **refForwarding** - Ref attaches to correct element type
3. **propsSpread** - Custom props forward to DOM element
4. **renderProp** - render prop customizes element

### Common Configurations

```typescript
// Button components
describeConformance(<Button.Root />, () => ({
  render,
  refInstanceof: window.HTMLButtonElement,
  testRenderPropWith: 'button',
  button: true,
}));

// Div-based components
describeConformance(<Dialog.Popup />, () => ({
  render,
  refInstanceof: window.HTMLDivElement,
}));

// Input components
describeConformance(<Input />, () => ({
  render,
  refInstanceof: window.HTMLInputElement,
  testRenderPropWith: 'input',
}));

// Skip render prop test
describeConformance(<Component />, () => ({
  render,
  refInstanceof: window.HTMLDivElement,
  skip: ['renderProp'],
}));
```

## popupConformanceTests

### Purpose

Standardizes testing of popup components (Dialog, Menu, Popover, etc.) for:

- Controlled/uncontrolled open state
- ARIA attributes
- Animation handling
- Trigger interactions

### Configuration

```typescript
interface PopupTestConfig {
  // Factory function that creates the component tree
  createComponent: (props: TestedComponentProps) => React.JSX.Element;

  // How the popup opens
  triggerMouseAction: 'click' | 'hover';

  // Render function from createRenderer
  render: ReturnType<typeof createRenderer>['render'];

  // Expected role attribute
  expectedPopupRole?: string;

  // Expected aria-haspopup value
  expectedAriaHasPopupValue?: string;

  // Popup always in DOM
  alwaysMounted?: boolean | 'only-after-open';

  // Is a combobox
  combobox?: boolean;
}

interface TestedComponentProps {
  root?: { open?: boolean; onOpenChange?: (open: boolean) => void };
  popup?: { className?: string; id?: string; 'data-testid'?: string };
  trigger?: { 'data-testid'?: string };
  portal?: { keepMounted?: boolean };
}
```

### Usage

```typescript
popupConformanceTests({
  createComponent: (props) => (
    <Menu.Root {...props.root}>
      <Menu.Trigger {...props.trigger}>Open</Menu.Trigger>
      <Menu.Portal {...props.portal}>
        <Menu.Positioner>
          <Menu.Popup {...props.popup}>
            <Menu.Item>Item</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
  triggerMouseAction: 'click',
  render,
  expectedPopupRole: 'menu',
});
```

### Tests Included

**Controlled mode:**

- Opens popup with `open` prop
- Closes popup when `open` changes to false

**Uncontrolled mode:**

- Opens popup when clicking/hovering trigger
- Closes popup on appropriate action

**ARIA attributes:**

- Correct role on popup
- aria-controls on trigger
- aria-expanded on trigger
- aria-haspopup on trigger

**Animations:**

- Removes popup when no exit animation
- Handles exit animation timing

## Helper Utilities

### flushMicrotasks

```typescript
import { flushMicrotasks } from '@mui/internal-test-utils';

it('updates after microtasks', async () => {
  const { setProps } = await render(<Component value={0} />);
  await setProps({ value: 1 });
  await flushMicrotasks();
  expect(element).to.have.attribute('data-value', '1');
});
```

### waitFor

```typescript
import { waitFor } from '@mui/internal-test-utils';

it('waits for async updates', async () => {
  const { setProps } = await render(<Component />);
  await setProps({ open: true });

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeVisible();
  });
});
```

### isJSDOM

```typescript
import { isJSDOM } from '#test-utils';

// Skip tests that require browser
describe.skipIf(isJSDOM)('keyboard navigation', () => {});
it.skipIf(isJSDOM)('specific browser test', async () => {});
```

### act

```typescript
import { act } from '@mui/internal-test-utils';

await act(async () => {
  input.focus();
});
```

## Test Setup

### vitest.config.mts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./test/setupVitest.ts'],
    environment: 'jsdom',
    // Or use browser mode
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

### setupVitest.ts

```typescript
import setupVitest from '@mui/internal-test-utils/setupVitest';
import '@testing-library/jest-dom/vitest';

declare global {
  var BASE_UI_ANIMATIONS_DISABLED: boolean;
}

setupVitest({ failOnConsoleEnabled: false });

globalThis.BASE_UI_ANIMATIONS_DISABLED = true;

if (typeof window !== 'undefined' && window?.navigator?.userAgent?.includes('jsdom')) {
  globalThis.requestAnimationFrame = (cb) => {
    setTimeout(() => cb(0), 0);
    return 0;
  };
}
```

### Import Alias (#test-utils)

Configure path alias in tsconfig.json:

```json
{
  "compilerOptions": {
    "paths": {
      "#test-utils": ["./test/index.ts"]
    }
  }
}
```

And in vite/vitest config:

```typescript
resolve: {
  alias: {
    '#test-utils': path.resolve(__dirname, './test'),
  },
}
```

## Best Practices

### 1. Always Await Render

```typescript
// Good
const { user } = await render(<Component />);

// Bad - missing await
const { user } = render(<Component />);
```

### 2. Use setProps for Controlled Testing

```typescript
// Good - clear controlled update
const { setProps } = await render(<Component value={0} />);
await setProps({ value: 1 });
```

### 3. Await All Interactions

```typescript
// Good
await user.click(button);
await setProps({ open: true });

// Bad - missing await
user.click(button);
setProps({ open: true });
```

### 4. Use #test-utils Import

```typescript
// Good - consistent import path
import { createRenderer, isJSDOM } from '#test-utils';

// Avoid - direct import
import { createRenderer } from '../test/createRenderer';
```
