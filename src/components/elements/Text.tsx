import { clsx } from "clsx/lite";
import type { ComponentProps } from "react";

type TextProps = {
  variant?: "primary" | "secondary" | "tertiary";
} & ComponentProps<"p">;

const variantClasses = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  tertiary: "text-text-tertiary",
};

export function Text({
  variant = "secondary",
  className,
  ...props
}: TextProps) {
  return (
    <p
      className={clsx("text-base/7", variantClasses[variant], className)}
      {...props}
    />
  );
}
