# Change: Simplify OneSignal Integration

## Why

The current OneSignal push notification implementation uses two separate components:

1. **OneSignalProvider** - A global provider in layout.tsx that initializes the OneSignal SDK on every page load
2. **SubscribeButton** - A button that waits for the provider to initialize, then triggers the subscription prompt

This split architecture adds complexity:

- The provider initializes OneSignal SDK globally, even on pages without the subscribe button
- The button has complex polling logic to wait for the provider's initialization
- Two components with tightly coupled behavior are harder to maintain

**Simplification**: Move initialization into the button itself. The button becomes self-contained - it initializes OneSignal on-demand when mounted, eliminating the need for a global provider.

## What Changes

### 1. Delete OneSignalProvider

- Remove `src/components/OneSignalProvider.tsx`
- Remove `<OneSignalProvider />` from `src/app/layout.tsx`

### 2. Refactor SubscribeButton to Self-Initialize

- Move OneSignal SDK initialization logic into the button component
- Initialize on-demand when the button mounts (lazy loading)
- Remove polling/backoff logic (no longer waiting for external provider)
- Maintain all existing dev-frontend patterns (aria-_, data-_, ref forwarding)

### 3. Clean Up next.config.ts

- Remove OneSignal service worker headers (no longer needed if using CDN directly)
- Or keep if still required for service worker registration

## Impact

- Affected code:
  - `src/components/OneSignalProvider.tsx` (DELETE)
  - `src/components/SubscribeButton.tsx` (MODIFY)
  - `src/app/layout.tsx` (MODIFY - remove provider)
  - `next.config.ts` (REVIEW - may simplify headers)
  - `public/OneSignalSDKWorker.js` (KEEP - still needed for push)

- **No breaking changes** - The button API remains identical
- **Smaller bundle on non-subscribe pages** - OneSignal SDK only loads when button is rendered
- **Simpler mental model** - One component handles everything
