---
name: dev-tailwindcss
description: Modern TailwindCSS v4.1 theming patterns extracted from professional landing page components. Use when creating custom color themes, building React/Next.js components with TailwindCSS v4, designing dark mode support, or building production-grade landing pages. Covers OKLCH color palettes, @theme configuration, component architecture (elements/sections/icons), typography, spacing systems, and responsive design patterns.
---

# TailwindCSS v4.1 Theming Skill

Professional patterns for TailwindCSS v4.1 theming based on the Tailwind Plus Oatmeal Kit.

## CSS Configuration

### @theme Block (globals.css)

```css
@import 'tailwindcss';

@theme {
  /* Typography - Display font for headings, sans for body */
  --font-display: 'Instrument Serif', serif;
  --font-sans: 'Inter', system-ui, sans-serif;

  /* OKLCH Color Palette - 11 shades from 50-950 */
  --color-{name}-50: oklch(98.8% 0.003 {hue});
  --color-{name}-100: oklch(96.6% 0.005 {hue});
  --color-{name}-200: oklch(93% 0.007 {hue});
  --color-{name}-300: oklch(88% 0.011 {hue});
  --color-{name}-400: oklch(73.7% 0.021 {hue});
  --color-{name}-500: oklch(58% 0.031 {hue});
  --color-{name}-600: oklch(46.6% 0.025 {hue});
  --color-{name}-700: oklch(39.4% 0.023 {hue});
  --color-{name}-800: oklch(28.6% 0.016 {hue});
  --color-{name}-900: oklch(22.8% 0.013 {hue});
  --color-{name}-950: oklch(15.3% 0.006 {hue});
}

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--color-{name}-100);
    --scroll-padding-top: 0;
    scroll-padding-top: var(--scroll-padding-top);

    @variant dark {
      background-color: var(--color-{name}-950);
    }
  }
}
```

See `references/color-palettes.md` for complete color palette examples.

## Component Architecture

Three-tier structure: **elements** → **sections** → **pages**

### Elements (Atomic Components)

Small, reusable primitives. See `references/element-patterns.md` for complete examples.

```tsx
import { clsx } from "clsx/lite";
import type { ComponentProps } from "react";

// Size variants as object
const sizes = {
  md: "px-3 py-1",
  lg: "px-4 py-2",
};

export function Button({
  size = "md",
  color = "dark/light",
  className,
  ...props
}: {
  size?: keyof typeof sizes;
  color?: "dark/light" | "light";
} & ComponentProps<"button">) {
  return (
    <button
      className={clsx(
        // Base styles
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium",
        // Color variants with dark mode
        color === "dark/light" &&
          "bg-{name}-950 text-white hover:bg-{name}-800 dark:bg-{name}-300 dark:text-{name}-950 dark:hover:bg-{name}-200",
        color === "light" &&
          "bg-white text-{name}-950 hover:bg-{name}-100 dark:bg-{name}-100 dark:hover:bg-white",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
```

### Sections (Composite Components)

Combine elements into page sections. Use `Container` for consistent max-widths.

```tsx
export function Section({
  eyebrow, headline, subheadline, cta, children, className, ...props
}: { ... } & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container className="flex flex-col gap-10 sm:gap-16">
        {headline && (
          <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-2">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              <Subheading>{headline}</Subheading>
            </div>
            {subheadline && <Text className="text-pretty">{subheadline}</Text>}
            {cta}
          </div>
        )}
        <div>{children}</div>
      </Container>
    </section>
  )
}
```

## Key Patterns

### Dark Mode

- Use `dark:` prefix for dark mode styles
- Use `not-dark:` for light-only visibility (hiding dark alternatives)
- Pattern: pair light/dark variants together

```tsx
// Text colors
"text-{name}-950 dark:text-white"; // Primary text
"text-{name}-700 dark:text-{name}-400"; // Secondary text
"text-{name}-600 dark:text-{name}-500"; // Tertiary/muted

// Backgrounds
"bg-{name}-100 dark:bg-{name}-950"; // Page background
"bg-{name}-950/2.5 dark:bg-white/5"; // Card backgrounds
"bg-{name}-950/10 dark:bg-white/10"; // Soft button backgrounds

// Borders
"border-{name}-950/10 dark:border-white/10";
"divide-{name}-950/10 dark:divide-white/10";
```

### Typography Scale

```
font-display    → Headings (serif)
text-sm/7       → Small text, buttons, labels
text-base/7     → Body text (md)
text-lg/8       → Large body text
text-2xl/8      → Small headings (h3)
text-[2rem]/10  → Subheadings (h2) mobile
text-5xl/14     → Subheadings (h2) desktop
text-5xl/12     → Main heading mobile
text-[5rem]/20  → Main heading desktop
```

### Spacing System

```
Section padding:  py-16
Content gaps:     gap-2 (tight), gap-4, gap-6 (standard), gap-10, gap-16 (sections)
Container:        px-6 lg:px-10, max-w-2xl md:max-w-3xl lg:max-w-7xl
```

### Button Variants

1. **Solid** - `bg-{name}-950 text-white` → Primary CTAs
2. **Soft** - `bg-{name}-950/10 text-{name}-950` → Secondary actions
3. **Plain** - `text-{name}-950 hover:bg-{name}-950/10` → Tertiary/links

### Icons

- SVG-based, 13x13 viewBox standard
- Use `stroke="currentColor"` for coloring
- Pattern: `h-lh` aligns icon with line-height

```tsx
export function CheckmarkIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      className={clsx("inline-block", className)}
      {...props}
    >
      <path
        d="M1.5 6.5L5.5 11.5L11.5 1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

### Container Component

```tsx
export function Container({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Responsive Grid Patterns

```tsx
// Auto-adjusting based on child count
"grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3";

// Smart column detection
"sm:has-[>:nth-child(5)]:grid-cols-2";
"lg:has-[>:nth-child(5)]:grid-cols-3";
```

## Reference Files

- **color-palettes.md** - Complete OKLCH color palette examples for different hues
- **element-patterns.md** - Full element component patterns (Button, Text, Heading, etc.)
- **section-patterns.md** - Section component patterns (Hero, Features, Pricing, etc.)
