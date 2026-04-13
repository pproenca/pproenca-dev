"use client";

import { clsx } from "clsx/lite";
import * as React from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

const baseStyles =
  "relative rounded-md p-2 text-text-secondary hover:text-accent";

function TouchTarget() {
  return (
    <span
      aria-hidden="true"
      className="pointer-fine:hidden absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2"
    />
  );
}

export interface ThemeToggleProps {
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
}

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
        className={clsx(baseStyles, className)}
        aria-label="Toggle theme"
      >
        <span className="block size-5" />
        <TouchTarget />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      ref={ref}
      onClick={handleToggle}
      className={clsx(baseStyles, className)}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      data-theme={isDark ? "dark" : "light"}
    >
      {isDark ? (
        <svg
          className="size-5 shrink-0"
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
          className="size-5 shrink-0"
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
      <TouchTarget />
    </button>
  );
}
