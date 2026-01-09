"use client";

import * as React from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

/** Props for the ThemeToggle component */
export interface ThemeToggleProps {
  /** Ref to the underlying button element */
  ref?: React.Ref<HTMLButtonElement>;
  /** Additional class names */
  className?: string;
}

/**
 * A toggle button that switches between light and dark themes.
 * Uses aria-pressed for accessibility and data-theme for CSS styling.
 */
export function ThemeToggle({ ref, className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const handleToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        ref={ref}
        className={
          className ??
          "rounded-md p-2 text-text-secondary transition-colors duration-200 hover:text-text-primary"
        }
        aria-label="Toggle theme"
      >
        <span className="h-5 w-5 block" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      ref={ref}
      onClick={handleToggle}
      className={
        className ??
        "rounded-md p-2 text-text-secondary transition-colors duration-200 hover:text-accent"
      }
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      data-theme={isDark ? "dark" : "light"}
    >
      {isDark ? (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
