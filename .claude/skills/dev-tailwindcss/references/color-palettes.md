# OKLCH Color Palettes for TailwindCSS v4.1

## Understanding OKLCH

OKLCH is a perceptually uniform color space:

- **L** (Lightness): 0% to 100%
- **C** (Chroma): Saturation/intensity (typically 0 to 0.4)
- **H** (Hue): 0-360 degrees

## Palette Structure

Each palette has 11 shades following this lightness/chroma curve:

| Shade | Lightness | Chroma | Use Case                      |
| ----- | --------- | ------ | ----------------------------- |
| 50    | 98.8%     | 0.003  | Lightest backgrounds          |
| 100   | 96.6%     | 0.005  | Page backgrounds (light mode) |
| 200   | 93%       | 0.007  | Hover states, subtle borders  |
| 300   | 88%       | 0.011  | Dark mode buttons             |
| 400   | 73.7%     | 0.021  | Dark mode secondary text      |
| 500   | 58%       | 0.031  | Midpoint, dark mode muted     |
| 600   | 46.6%     | 0.025  | Light mode muted text         |
| 700   | 39.4%     | 0.023  | Light mode secondary text     |
| 800   | 28.6%     | 0.016  | Light mode hover states       |
| 900   | 22.8%     | 0.013  | Deep backgrounds              |
| 950   | 15.3%     | 0.006  | Page backgrounds (dark mode)  |

## Complete Palette Examples

### Olive (Original - Hue 106.5-107.4)

```css
@theme {
  --color-olive-50: oklch(98.8% 0.003 106.5);
  --color-olive-100: oklch(96.6% 0.005 106.5);
  --color-olive-200: oklch(93% 0.007 106.5);
  --color-olive-300: oklch(88% 0.011 106.6);
  --color-olive-400: oklch(73.7% 0.021 106.9);
  --color-olive-500: oklch(58% 0.031 107.3);
  --color-olive-600: oklch(46.6% 0.025 107.3);
  --color-olive-700: oklch(39.4% 0.023 107.4);
  --color-olive-800: oklch(28.6% 0.016 107.4);
  --color-olive-900: oklch(22.8% 0.013 107.4);
  --color-olive-950: oklch(15.3% 0.006 107.1);
}
```

### Slate (Cool Gray - Hue 264)

```css
@theme {
  --color-slate-50: oklch(98.8% 0.003 264);
  --color-slate-100: oklch(96.6% 0.006 264);
  --color-slate-200: oklch(93% 0.009 264);
  --color-slate-300: oklch(88% 0.014 264);
  --color-slate-400: oklch(73.7% 0.025 264);
  --color-slate-500: oklch(58% 0.035 264);
  --color-slate-600: oklch(46.6% 0.03 264);
  --color-slate-700: oklch(39.4% 0.027 264);
  --color-slate-800: oklch(28.6% 0.02 264);
  --color-slate-900: oklch(22.8% 0.016 264);
  --color-slate-950: oklch(15.3% 0.01 264);
}
```

### Stone (Warm Gray - Hue 60)

```css
@theme {
  --color-stone-50: oklch(98.8% 0.003 60);
  --color-stone-100: oklch(96.6% 0.005 60);
  --color-stone-200: oklch(93% 0.008 60);
  --color-stone-300: oklch(88% 0.012 60);
  --color-stone-400: oklch(73.7% 0.022 60);
  --color-stone-500: oklch(58% 0.032 60);
  --color-stone-600: oklch(46.6% 0.027 60);
  --color-stone-700: oklch(39.4% 0.024 60);
  --color-stone-800: oklch(28.6% 0.018 60);
  --color-stone-900: oklch(22.8% 0.014 60);
  --color-stone-950: oklch(15.3% 0.008 60);
}
```

### Ocean (Blue - Hue 230)

```css
@theme {
  --color-ocean-50: oklch(98.8% 0.004 230);
  --color-ocean-100: oklch(96.6% 0.008 230);
  --color-ocean-200: oklch(93% 0.015 230);
  --color-ocean-300: oklch(88% 0.025 230);
  --color-ocean-400: oklch(73.7% 0.045 230);
  --color-ocean-500: oklch(58% 0.065 230);
  --color-ocean-600: oklch(46.6% 0.055 230);
  --color-ocean-700: oklch(39.4% 0.048 230);
  --color-ocean-800: oklch(28.6% 0.035 230);
  --color-ocean-900: oklch(22.8% 0.028 230);
  --color-ocean-950: oklch(15.3% 0.018 230);
}
```

### Sage (Green - Hue 140)

```css
@theme {
  --color-sage-50: oklch(98.8% 0.004 140);
  --color-sage-100: oklch(96.6% 0.007 140);
  --color-sage-200: oklch(93% 0.012 140);
  --color-sage-300: oklch(88% 0.02 140);
  --color-sage-400: oklch(73.7% 0.035 140);
  --color-sage-500: oklch(58% 0.05 140);
  --color-sage-600: oklch(46.6% 0.042 140);
  --color-sage-700: oklch(39.4% 0.037 140);
  --color-sage-800: oklch(28.6% 0.027 140);
  --color-sage-900: oklch(22.8% 0.022 140);
  --color-sage-950: oklch(15.3% 0.014 140);
}
```

### Terracotta (Warm Red/Orange - Hue 25)

```css
@theme {
  --color-terracotta-50: oklch(98.8% 0.005 25);
  --color-terracotta-100: oklch(96.6% 0.01 25);
  --color-terracotta-200: oklch(93% 0.018 25);
  --color-terracotta-300: oklch(88% 0.03 25);
  --color-terracotta-400: oklch(73.7% 0.055 25);
  --color-terracotta-500: oklch(58% 0.08 25);
  --color-terracotta-600: oklch(46.6% 0.068 25);
  --color-terracotta-700: oklch(39.4% 0.058 25);
  --color-terracotta-800: oklch(28.6% 0.042 25);
  --color-terracotta-900: oklch(22.8% 0.034 25);
  --color-terracotta-950: oklch(15.3% 0.022 25);
}
```

### Plum (Purple - Hue 310)

```css
@theme {
  --color-plum-50: oklch(98.8% 0.004 310);
  --color-plum-100: oklch(96.6% 0.008 310);
  --color-plum-200: oklch(93% 0.015 310);
  --color-plum-300: oklch(88% 0.025 310);
  --color-plum-400: oklch(73.7% 0.045 310);
  --color-plum-500: oklch(58% 0.065 310);
  --color-plum-600: oklch(46.6% 0.055 310);
  --color-plum-700: oklch(39.4% 0.048 310);
  --color-plum-800: oklch(28.6% 0.035 310);
  --color-plum-900: oklch(22.8% 0.028 310);
  --color-plum-950: oklch(15.3% 0.018 310);
}
```

## Creating Custom Palettes

### Step 1: Choose Your Hue

Common hue ranges:

- **Reds**: 0-30
- **Oranges**: 30-60
- **Yellows**: 60-100
- **Yellow-Greens**: 100-120
- **Greens**: 120-160
- **Teals**: 160-200
- **Blues**: 200-260
- **Purples**: 260-320
- **Magentas**: 320-360

### Step 2: Adjust Chroma

For muted/professional themes:

- Use lower chroma values (0.003-0.035)
- Increase slightly in midtones (400-600)

For vibrant themes:

- Use higher chroma values (0.010-0.080)
- Keep extremes (50, 950) relatively low

### Step 3: Test Contrast

Ensure sufficient contrast for accessibility:

- 950 on 100 background → Should be 7:1+ for body text
- 700 on 100 background → Should be 4.5:1+ for large text
- 400 on 950 background → Should be 4.5:1+ for dark mode

## Wallpaper Gradients (Decorative Backgrounds)

For hero sections and feature demos, use gradient wallpapers:

```tsx
const wallpaperColors = {
  green: "from-[#9ca88f] to-[#596352] dark:from-[#333a2b] dark:to-[#26361b]",
  blue: "from-[#637c86] to-[#778599] dark:from-[#243a42] dark:to-[#232f40]",
  purple: "from-[#7b627d] to-[#8f6976] dark:from-[#412c42] dark:to-[#3c1a26]",
  brown: "from-[#8d7359] to-[#765959] dark:from-[#382d23] dark:to-[#3d2323]",
};
```
