import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-deep)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[55px] max-w-[680px] items-center justify-between px-golden-3">
        <Link
          href="/"
          className="font-serif text-xl font-bold text-[var(--color-accent)] transition-colors duration-200 hover:text-[var(--color-accent-muted)]"
        >
          Blog
        </Link>

        <nav className="flex items-center gap-golden-3">
          <Link
            href="/"
            className="text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
