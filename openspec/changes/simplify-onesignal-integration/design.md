## Context

The OneSignal integration currently uses a provider pattern where:

1. `OneSignalProvider` initializes the SDK globally in layout.tsx
2. `SubscribeButton` polls `window.OneSignal` waiting for the provider to complete

This proposal consolidates everything into a single self-initializing button component.

## Goals / Non-Goals

### Goals

- Remove the need for a global provider component
- Make SubscribeButton fully self-contained
- Maintain all accessibility patterns (aria-disabled, aria-pressed, data-\*)
- Keep the same user-facing API

### Non-Goals

- Changing the push notification service (staying with OneSignal)
- Adding new features to the subscribe button
- Changing the visual design

## Decisions

### Decision 1: Lazy-load OneSignal SDK in the button

**Why**: The current provider loads OneSignal on every page. Moving initialization to the button means the SDK only loads on pages that render the button.

**Pattern**:

```tsx
// Before: Provider initializes globally
// OneSignalProvider.tsx runs on every page load

// After: Button initializes on-demand
useEffect(() => {
  let cancelled = false;

  const init = async () => {
    const OneSignal = (await import('react-onesignal')).default;
    await OneSignal.init({ appId, ... });
    if (!cancelled) {
      setIsReady(true);
      setIsSubscribed(OneSignal.Notifications.permission);
    }
  };

  init();
  return () => { cancelled = true; };
}, []);
```

### Decision 2: Use ref to prevent double initialization

**Why**: React Strict Mode and HMR can cause effects to run twice. The current provider uses `useRef` for this - we'll keep the same pattern.

**Pattern**:

```tsx
const isInitialized = useRef(false);

useEffect(() => {
  if (isInitialized.current) return;
  isInitialized.current = true;

  // Initialize OneSignal...
}, []);
```

### Decision 3: Keep service worker file

**Why**: The OneSignal service worker (`public/OneSignalSDKWorker.js`) is still needed for push notifications to work. It's loaded by the OneSignal SDK, not by our code directly.

### Decision 4: Keep next.config.ts headers

**Why**: The service worker headers ensure proper MIME type and caching. These are still required for the service worker to register correctly.

## Risks / Trade-offs

| Risk                                                              | Mitigation                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Button takes longer to be interactive (must initialize SDK first) | User experience unchanged - button shows loading state while initializing |
| SDK initialization in multiple button instances                   | Use ref guard - only first mount initializes                              |
| Breaking existing behavior                                        | Same API, same accessibility patterns, same visual states                 |

## Open Questions

None - this is a straightforward consolidation of existing code.
