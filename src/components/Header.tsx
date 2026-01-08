import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-(--color-border-subtle)/50 bg-(--color-bg-deep)/80 backdrop-blur-sm">
      <div className="mx-auto flex h-[50px] max-w-[680px] items-center justify-between px-golden-3">
        <Link
          href="/"
          className="font-serif text-lg font-bold text-(--color-accent) transition-colors duration-200 hover:text-(--color-accent-muted)"
        >
          Blog
        </Link>

        <nav className="flex items-center gap-golden-3">
          <Link
            href="/"
            className="text-sm text-(--color-text-tertiary) transition-colors duration-200 hover:text-(--color-text-secondary)"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-sm text-(--color-text-tertiary) transition-colors duration-200 hover:text-(--color-text-secondary)"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm text-(--color-text-tertiary) transition-colors duration-200 hover:text-(--color-text-secondary)"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
