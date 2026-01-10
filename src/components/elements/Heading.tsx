import { clsx } from "clsx/lite";
import type { ComponentProps, ElementType } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const sizeClasses: Record<HeadingLevel, string> = {
  1: "text-3xl sm:text-4xl",
  2: "text-xl sm:text-2xl",
  3: "text-lg sm:text-xl",
  4: "text-base sm:text-lg",
  5: "text-sm sm:text-base",
  6: "text-xs sm:text-sm",
};

type HeadingProps<T extends ElementType = "h1"> = {
  as?: T;
  level?: HeadingLevel;
} & Omit<ComponentProps<T>, "as">;

export function Heading<T extends ElementType = "h1">({
  as,
  level = 1,
  className,
  ...props
}: HeadingProps<T>) {
  const Component = as ?? (`h${level}` as ElementType);

  return (
    <Component
      className={clsx(
        "font-serif font-bold text-text-primary",
        sizeClasses[level],
        className,
      )}
      {...props}
    />
  );
}
