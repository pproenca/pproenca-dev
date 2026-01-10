import { clsx } from "clsx/lite";

interface ResourcesProps {
  children: React.ReactNode;
  className?: string;
}

export function Resources({ children, className }: ResourcesProps) {
  return (
    <nav
      aria-label="Related resources"
      className={clsx(
        "resources-nav",
        "not-prose mt-golden-5 flex flex-wrap justify-center gap-3",
        "border-t border-border-subtle pt-golden-4",
        className,
      )}
    >
      {children}
    </nav>
  );
}
