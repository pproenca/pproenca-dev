## 1. ThemeToggle Accessibility & React 19

- [x] 1.1 Add `aria-pressed` attribute to indicate toggle state
- [x] 1.2 Convert to React 19 ref-as-prop pattern
- [x] 1.3 Add `data-theme` attribute for CSS hooks
- [x] 1.4 Add explicit keyboard handler (Enter/Space) for consistency
- [x] 1.5 Add TypeScript Props interface with ref support

## 2. CopyButton Improvements

- [x] 2.1 Add `aria-pressed` for copied state
- [x] 2.2 Add `aria-live="polite"` region for copy confirmation
- [x] 2.3 Convert to React 19 ref-as-prop pattern
- [x] 2.4 Add `data-copied` attribute for CSS hooks
- [x] 2.5 Simplify timer logic with useRef (remove useEffect)

## 3. SubscribeButton Accessibility

- [x] 3.1 Replace `disabled` with `aria-disabled` pattern
- [x] 3.2 Add `aria-pressed` for subscribed state
- [x] 3.3 Convert to React 19 ref-as-prop pattern
- [x] 3.4 Add `data-subscribed`, `data-pending` attributes
- [x] 3.5 Add `aria-hidden` to icon SVGs

## 4. CategoryBadge Enhancement

- [x] 4.1 Add ref forwarding to underlying Link
- [x] 4.2 Add `data-size` attribute for CSS hooks
- [x] 4.3 Export Props type for external use

## 5. CodeBlock Accessibility

- [x] 5.1 Add `role="figure"` with `aria-label` for code block container
- [x] 5.2 Add ref forwarding to container div
- [x] 5.3 Export Props type for external use

## 6. Verification

- [x] 6.1 Run `pnpm lint` to verify no ESLint errors
- [x] 6.2 Run `pnpm build` to verify static build succeeds
- [ ] 6.3 Manual test theme toggle with keyboard only
- [ ] 6.4 Manual test copy button with screen reader (if available)
