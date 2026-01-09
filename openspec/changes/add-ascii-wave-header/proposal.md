# Proposal: Add ASCII Wave Animation Header

## Change ID

`add-ascii-wave-header`

## Summary

Replace the static "Latest Posts" heading on the homepage with an animated header that reveals characters in a staggered wave pattern, evoking pages rustling in a breeze.

## Motivation

The Kindle reading theme establishes a warm, literary aesthetic but lacks memorable micro-interactions. A subtle entrance animation on the homepage header would:

- Create a distinctive first impression that aligns with the bookish theme
- Add visual delight without compromising the calm, contemplative feel
- Differentiate the blog with purposeful motion design
- Reinforce the literary identity (pages turning, gentle movement)

## Scope

### In Scope

- CSS-only wave animation using `@keyframes`
- Per-character staggered reveal with `animation-delay`
- New `AsciiHeader` client component
- Reduced motion preference support
- Works in both light and dark themes

### Out of Scope

- JavaScript-based animations
- Complex ASCII art graphics
- Animation on other page headers (just homepage for now)
- Sound effects

## Animation Design

### Effect: "Page Turn Wave"

Each character floats up and fades in with staggered timing, creating a wave that ripples across the text.

```
L  a  t  e  s  t     P  o  s  t  s
↑  ↑  ↑  ↑  ↑  ↑     ↑  ↑  ↑  ↑  ↑
   (0.05s delay between each character)
```

### Technical Details

- Animation: `translateY(8px → 0)` + `opacity(0 → 1)`
- Duration: 0.6s per character
- Delay: 0.05s × character index
- Total reveal: ~0.6s + (12 chars × 0.05s) = ~1.2s
- Easing: `ease-out` for natural deceleration
- Replay: Every page visit

## Impact Analysis

### Files Created

- `src/components/AsciiHeader.tsx` - Client component wrapping each character in animated spans

### Files Modified

- `src/app/globals.css` - Add `.ascii-header`, `.ascii-char` styles and `@keyframes ascii-wave`
- `src/app/page.tsx` - Replace `<h1>` with `<AsciiHeader text="Latest Posts" />`

### No Breaking Changes

- Existing pages unaffected
- Theme colors preserved
- Accessibility maintained via `prefers-reduced-motion`

## Note on Inline Styles

This change introduces a narrow exception to the "no inline styles" rule from `ui-design/spec.md`. Per-character animation delays (`style={{ animationDelay: '0.05s' }}`) are the only practical way to achieve staggered timing without generating 20+ utility classes. This exception is limited to dynamic animation timing and does not affect layout or theming.

## Success Criteria

1. Characters animate smoothly on page load
2. Animation completes in ~1.2s without jank
3. Dark mode displays same animation
4. Users with `prefers-reduced-motion` see static text immediately
5. No visible flash of unstyled content (FOUC)
