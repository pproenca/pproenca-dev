# UI Animation Specification

## ADDED Requirements

### Requirement: ASCII Wave Header Animation

The homepage header MUST animate with a staggered character reveal effect that evokes pages rustling.

**Animation Parameters:**
- Transform: `translateY(8px)` → `translateY(0)`
- Opacity: `0` → `1`
- Duration: 0.6s per character
- Delay: 0.05s × character index
- Easing: `ease-out`
- Fill mode: `forwards` (retain final state)

#### Scenario: Header animates on page load

- **GIVEN** a user navigates to the homepage
- **WHEN** the page renders
- **THEN** each character of "Latest Posts" appears with a staggered delay
- **AND** the wave effect completes within approximately 1.2 seconds
- **AND** the final state shows the full text at full opacity

#### Scenario: Animation replays on navigation

- **GIVEN** a user is on the homepage
- **WHEN** they navigate away and return
- **THEN** the animation replays from the beginning
- **AND** each visit provides the same entrance effect

#### Scenario: Dark mode animation is consistent

- **GIVEN** the user has dark mode enabled
- **WHEN** viewing the homepage
- **THEN** the wave animation displays identically to light mode
- **AND** only the text color reflects the theme (warm cream in dark mode)

---

### Requirement: Reduced Motion Accessibility

Users who prefer reduced motion MUST see the header without animation.

#### Scenario: Static display for motion-sensitive users

- **GIVEN** a user has `prefers-reduced-motion: reduce` set in their OS/browser
- **WHEN** they visit the homepage
- **THEN** "Latest Posts" displays immediately at full opacity
- **AND** no movement or transition occurs
- **AND** the text position is identical to the animation's final state

---

### Requirement: Animation Inline Style Exception

Per-character animation delays SHALL use inline styles to avoid generating excessive utility classes.

**Scope:** This exception applies ONLY to dynamic `animation-delay` values computed at render time. All other styling (colors, spacing, typography) MUST use Tailwind utilities or CSS custom properties.

#### Scenario: Inline style limited to animation-delay

- **GIVEN** the AsciiHeader component renders
- **WHEN** inspecting the generated HTML
- **THEN** each character span has a `style` attribute containing ONLY `animation-delay`
- **AND** no other CSS properties are set via inline styles
- **AND** the delay value is computed as `${index * 0.05}s`
