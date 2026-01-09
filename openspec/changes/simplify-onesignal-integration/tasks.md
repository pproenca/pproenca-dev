## 1. Refactor SubscribeButton

- [x] 1.1 Add OneSignal SDK initialization logic (from OneSignalProvider)
- [x] 1.2 Add `useRef` guard for Strict Mode / HMR double-mount prevention
- [x] 1.3 Remove polling/backoff logic (replace with direct initialization callback)
- [x] 1.4 Maintain all existing accessibility patterns (aria-disabled, aria-pressed, data-\*)
- [x] 1.5 Maintain React 19 ref-as-prop pattern

## 2. Remove OneSignalProvider

- [x] 2.1 Delete `src/components/OneSignalProvider.tsx`
- [x] 2.2 Remove `<OneSignalProvider />` from `src/app/layout.tsx`
- [x] 2.3 Remove import statement from layout.tsx

## 3. Verification

- [x] 3.1 Run `pnpm lint` - verify no ESLint errors
- [x] 3.2 Run `pnpm build` - verify static build succeeds
- [ ] 3.3 Test subscribe button appears on pages where it's rendered
- [ ] 3.4 Test subscribe button does NOT cause errors on pages without it
- [ ] 3.5 Verify OneSignal SDK only loads on pages with the button (check Network tab)
