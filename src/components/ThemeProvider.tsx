"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Props for the ThemeProvider component */
interface ThemeProviderProps {
  /** Child components to render within the theme context */
  children: React.ReactNode;
}

/**
 * Provides theme context (light/dark/system) to the application.
 * Wraps next-themes provider with default configuration.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
