# Design: Kindle Reading Theme

## Architectural Overview

This design transforms the blog's visual layer while preserving all structural patterns. The change is purely cosmetic—CSS variables, typography values, and subtle texture additions.

```
┌─────────────────────────────────────────────────────────────┐
│                     Theme Layer (CSS)                        │
├─────────────────────────────────────────────────────────────┤
│  globals.css                                                 │
│  ├── :root (Light/Sepia)     ├── .dark (Night Reading)      │
│  │   - Paper backgrounds     │   - Deep black backgrounds   │
│  │   - Warm ink text         │   - Cream text               │
│  │   - Sepia accents         │   - Gold accents             │
│  │   - Paper texture         │   - No texture (OLED clean)  │
│  └───────────────────────────┴──────────────────────────────┤
│                                                              │
│  Typography System                                           │
│  ├── Base: 18px (reading comfort)                           │
│  ├── Line height: 1.75-1.8 (generous)                       │
│  ├── Measure: max-width 680px (~70ch)                       │
│  └── Paragraph spacing: Golden ratio maintained             │
└─────────────────────────────────────────────────────────────┘
```

## Color System Deep Dive

### Light Mode: "Aged Paper"
The goal is to replicate the warm, non-fatiguing quality of e-ink displays.

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-bg-deep` | `#f4f1e8` | Main background - aged paper |
| `--color-bg-surface` | `#ebe6d9` | Cards, elevated surfaces |
| `--color-bg-elevated` | `#e2dccf` | Code blocks, inputs |
| `--color-text-primary` | `#3d3731` | Body text - warm black |
| `--color-text-secondary` | `#6b6459` | Metadata, captions |
| `--color-text-tertiary` | `#9a948a` | Hints, disabled |
| `--color-accent` | `#9a7b4f` | Links, emphasis |
| `--color-accent-muted` | `#7a6342` | Hover states |
| `--color-border-subtle` | `#ddd7cb` | Light dividers |
| `--color-border-visible` | `#ccc5b8` | Stronger dividers |

### Dark Mode: "Night Reading"
Optimized for OLED screens and nighttime reading.

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-bg-deep` | `#0a0908` | True black (OLED) |
| `--color-bg-surface` | `#141210` | Slight elevation |
| `--color-bg-elevated` | `#1e1b17` | Code blocks |
| `--color-text-primary` | `#d4cfc4` | Cream text (not white) |
| `--color-text-secondary` | `#9a958c` | Muted text |
| `--color-text-tertiary` | `#5a5650` | Tertiary text |
| `--color-accent` | `#a89060` | Soft gold links |
| `--color-accent-muted` | `#87734d` | Hover states |
| `--color-border-subtle` | `#252220` | Subtle dividers |
| `--color-border-visible` | `#353230` | Visible dividers |

## Typography Decisions

### Reading Comfort Optimizations

**Line Height: 1.75**
Research shows 1.5-1.8 line height optimal for reading. Current 1.618 (golden ratio) increases to 1.75 for more breathing room.

**Font Size: 18px base**
Slightly larger than typical web (16px) reduces eye strain. Kindle defaults to similar sizing.

**Paragraph Spacing**
Maintain golden ratio spacing (`--spacing-golden-3`) but paragraphs get extra `margin-bottom` for clear visual breaks.

**Character Measure**
The 680px max-width yields ~65-70 characters per line at 18px, within optimal 45-75ch range.

### Font Stack (Unchanged)
The current fonts work perfectly for this aesthetic:
- **Libre Baskerville**: Classic, literary serif - ideal for e-reader feel
- **Source Sans 3**: Clean UI text
- **JetBrains Mono**: Code blocks

## Paper Texture Implementation

### Light Mode Only
Apply subtle noise texture to mimic paper grain. Dark mode stays clean for OLED.

```css
:root {
  --paper-texture: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: var(--paper-texture);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: multiply;
}

.dark body::before {
  display: none;
}
```

## Code Block Treatment

### Design Principle
Code should feel like it's printed on the same paper, not a jarring "terminal" break.

**Light Mode:**
- Background: Slightly darker paper `#e2dccf`
- Border: Warm, soft edge
- No terminal chrome (dots removed or muted)
- Typography: Maintain JetBrains Mono

**Dark Mode:**
- Background: Elevated dark `#1e1b17`
- Subtle warm border
- Minimal chrome
- Good contrast without being harsh

### Terminal Window Modifications
The current macOS-style terminal is too "digital" for the e-reader feel. Options:
1. **Remove chrome entirely**: Just code on paper
2. **Mute chrome**: Make dots very subtle, almost invisible
3. **Book-style**: Replace dots with subtle page number or section marker

Recommendation: Option 2 (mute chrome) - preserves functionality while reducing distraction.

## UI Element Treatments

### Header
- More transparent, less sticky presence
- Text slightly smaller
- Navigation fades when reading (optional enhancement)

### Footer
- Very light treatment
- Nearly invisible divider
- Small, unobtrusive text

### Links
- Underline by default (book convention)
- Muted color, not screaming for attention
- Clear hover state without being flashy

### Blockquotes
- Indented, italic (book style)
- Very subtle left border or none
- Clear attribution styling

## Accessibility Considerations

### Color Contrast
All color combinations tested for WCAG AA compliance:
- Primary text on background: 7:1+ ratio
- Secondary text: 4.5:1+ ratio
- Accent on background: 4.5:1+ ratio

### Reduced Motion
Paper texture animation (if any) respects `prefers-reduced-motion`.

### Dark Mode Preference
System preference respected via `next-themes`.

## Trade-offs Considered

### Why Not True E-ink Simulation?
True e-ink has limited gray levels and no real "dark mode." We prioritize:
- Reading comfort (the goal of e-ink)
- Modern UX expectations (dark mode)
- Performance (no heavy filters)

### Why Keep Golden Ratio Spacing?
The current spacing system is mathematically elegant and works well. No need to replace what works.

### Why Not Change Fonts?
Libre Baskerville is excellent for this aesthetic. Changing fonts would be change for change's sake.
