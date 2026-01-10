/**
 * WCAG Color Contrast Checker
 *
 * Verifies all color pairs in globals.css meet WCAG AA contrast requirements.
 * Uses culori for accurate OKLCH to sRGB conversion.
 */

import { parse, formatHex, type Color } from "culori";

// WCAG AA thresholds
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;

// Color definitions from globals.css
interface ColorPair {
  name: string;
  foreground: string;
  background: string;
  isLargeText?: boolean;
}

const lightModeColors: ColorPair[] = [
  {
    name: "text-primary / bg-deep",
    foreground: "oklch(30% 0.02 70)",
    background: "oklch(95.5% 0.012 85)",
  },
  {
    name: "text-secondary / bg-deep",
    foreground: "oklch(48% 0.02 70)",
    background: "oklch(95.5% 0.012 85)",
  },
  {
    name: "text-tertiary / bg-deep",
    foreground: "oklch(49% 0.015 70)",
    background: "oklch(95.5% 0.012 85)",
  },
  {
    name: "accent / bg-deep",
    foreground: "oklch(50% 0.09 70)",
    background: "oklch(95.5% 0.012 85)",
  },
  {
    name: "accent-muted / bg-deep",
    foreground: "oklch(48% 0.08 70)",
    background: "oklch(95.5% 0.012 85)",
  },
  {
    name: "text-primary / bg-surface",
    foreground: "oklch(30% 0.02 70)",
    background: "oklch(92.5% 0.015 85)",
  },
  {
    name: "text-primary / bg-elevated",
    foreground: "oklch(30% 0.02 70)",
    background: "oklch(89.5% 0.018 85)",
  },
  {
    name: "text-tertiary / bg-elevated (copy btn)",
    foreground: "oklch(49% 0.015 70)",
    background: "oklch(89.5% 0.018 85)",
  },
  {
    name: "text-primary / code-bg",
    foreground: "oklch(30% 0.02 70)",
    background: "oklch(100% 0 0)",
  },
];

const darkModeColors: ColorPair[] = [
  {
    name: "text-primary / bg-deep",
    foreground: "oklch(85% 0.015 70)",
    background: "oklch(8% 0.01 70)",
  },
  {
    name: "text-secondary / bg-deep",
    foreground: "oklch(65% 0.012 70)",
    background: "oklch(8% 0.01 70)",
  },
  {
    name: "text-tertiary / bg-deep",
    foreground: "oklch(67% 0.012 70)",
    background: "oklch(8% 0.01 70)",
  },
  {
    name: "accent / bg-deep",
    foreground: "oklch(65% 0.08 70)",
    background: "oklch(8% 0.01 70)",
  },
  {
    name: "accent-muted / bg-deep",
    foreground: "oklch(60% 0.07 70)",
    background: "oklch(8% 0.01 70)",
  },
  {
    name: "text-primary / bg-surface",
    foreground: "oklch(85% 0.015 70)",
    background: "oklch(12% 0.01 70)",
  },
  {
    name: "text-primary / bg-elevated",
    foreground: "oklch(85% 0.015 70)",
    background: "oklch(16% 0.012 70)",
  },
  {
    name: "text-tertiary / bg-elevated (copy btn)",
    foreground: "oklch(67% 0.012 70)",
    background: "oklch(16% 0.012 70)",
  },
  {
    name: "text-primary / code-bg",
    foreground: "oklch(85% 0.015 70)",
    background: "oklch(22% 0.02 100)",
  },
];

/**
 * Convert parsed color to sRGB values (0-1 range)
 */
function toSRGB(color: Color): { r: number; g: number; b: number } {
  const hex = formatHex(color);
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function contrastRatio(fg: string, bg: string): number {
  const fgColor = parse(fg);
  const bgColor = parse(bg);

  if (!fgColor || !bgColor) {
    throw new Error(`Failed to parse colors: fg=${fg}, bg=${bg}`);
  }

  const fgRGB = toSRGB(fgColor);
  const bgRGB = toSRGB(bgColor);

  const l1 = relativeLuminance(fgRGB.r, fgRGB.g, fgRGB.b);
  const l2 = relativeLuminance(bgRGB.r, bgRGB.g, bgRGB.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

interface Result {
  name: string;
  ratio: number;
  threshold: number;
  pass: boolean;
  fgHex: string;
  bgHex: string;
}

function checkColorPairs(pairs: ColorPair[]): Result[] {
  const results: Result[] = [];

  for (const pair of pairs) {
    const ratio = contrastRatio(pair.foreground, pair.background);
    const threshold = pair.isLargeText ? WCAG_AA_LARGE : WCAG_AA_NORMAL;
    const pass = ratio >= threshold;

    const fgColor = parse(pair.foreground);
    const bgColor = parse(pair.background);

    results.push({
      name: pair.name,
      ratio,
      threshold,
      pass,
      fgHex: fgColor ? formatHex(fgColor) : "unknown",
      bgHex: bgColor ? formatHex(bgColor) : "unknown",
    });
  }

  return results;
}

function printResults(results: Result[], modeName: string): boolean {
  console.log(`\n${modeName} Mode Contrast Ratios (WCAG AA Target: 4.5:1)`);
  console.log("─".repeat(75));
  console.log(
    `${"Pair".padEnd(35)} ${"Ratio".padEnd(10)} ${"Threshold".padEnd(10)} ${"Status".padEnd(8)} Colors`
  );
  console.log("─".repeat(75));

  let allPass = true;

  for (const result of results) {
    const status = result.pass ? "✓ PASS" : "✗ FAIL";
    const statusColor = result.pass ? "\x1b[32m" : "\x1b[31m";
    const reset = "\x1b[0m";

    console.log(
      `${result.name.padEnd(35)} ${result.ratio.toFixed(2).padEnd(10)} ${result.threshold.toFixed(1).padEnd(10)} ${statusColor}${status.padEnd(8)}${reset} ${result.fgHex} / ${result.bgHex}`
    );

    if (!result.pass) {
      allPass = false;
    }
  }

  console.log("─".repeat(75));
  return allPass;
}

function main() {
  console.log("WCAG AA Color Contrast Checker");
  console.log("==============================");

  const lightResults = checkColorPairs(lightModeColors);
  const darkResults = checkColorPairs(darkModeColors);

  const lightPass = printResults(lightResults, "Light");
  const darkPass = printResults(darkResults, "Dark");

  console.log("\n");

  if (lightPass && darkPass) {
    console.log("\x1b[32m✓ All color pairs pass WCAG AA contrast requirements\x1b[0m");
    process.exit(0);
  } else {
    console.log("\x1b[31m✗ Some color pairs fail WCAG AA contrast requirements\x1b[0m");

    const failures = [
      ...lightResults.filter((r) => !r.pass).map((r) => ({ ...r, mode: "Light" })),
      ...darkResults.filter((r) => !r.pass).map((r) => ({ ...r, mode: "Dark" })),
    ];

    console.log("\nFailing pairs:");
    for (const f of failures) {
      const needed = f.threshold / f.ratio;
      console.log(
        `  - ${f.mode}: ${f.name} (${f.ratio.toFixed(2)}:1, needs ${f.threshold}:1)`
      );
      console.log(`    To fix: increase foreground lightness or decrease background lightness by ~${((needed - 1) * 100).toFixed(0)}%`);
    }

    process.exit(1);
  }
}

main();
