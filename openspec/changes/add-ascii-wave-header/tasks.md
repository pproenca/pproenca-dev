# Tasks: Add ASCII Wave Animation Header

## 1. CSS Animation Foundation
- [ ] 1.1 Add `.ascii-header` class to globals.css (display: inline-block)
- [ ] 1.2 Add `.ascii-char` class with base animation properties
- [ ] 1.3 Add `@keyframes ascii-wave` with translateY and opacity
- [ ] 1.4 Add `@media (prefers-reduced-motion)` override for accessibility

## 2. Component Implementation
- [ ] 2.1 Create `src/components/AsciiHeader.tsx` as client component
- [ ] 2.2 Implement character splitting with span wrapping
- [ ] 2.3 Add dynamic animation-delay via inline style (0.05s × index)
- [ ] 2.4 Handle space characters with `\u00A0` non-breaking space

## 3. Integration
- [ ] 3.1 Import `AsciiHeader` in `src/app/page.tsx`
- [ ] 3.2 Replace static `<h1>` with `<AsciiHeader text="Latest Posts" />`

## 4. Verification
- [ ] 4.1 Run `npm run dev` and verify animation on http://localhost:3000
- [ ] 4.2 Toggle dark mode - animation should work identically
- [ ] 4.3 Test with `prefers-reduced-motion: reduce` in browser devtools
- [ ] 4.4 Run `npm run build` - ensure static export succeeds
- [ ] 4.5 Run `npm run lint` - no new errors
