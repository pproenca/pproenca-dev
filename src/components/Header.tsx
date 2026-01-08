import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-(--color-border-subtle) bg-(--color-bg-deep)/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[55px] max-w-[680px] items-center justify-between px-golden-3">
        <Link
          href="/"
          className="font-serif text-xl font-bold text-(--color-accent) transition-colors duration-200 hover:text-(--color-accent-muted)"
        >
          Blog
        </Link>

        <nav className="flex items-center gap-golden-3">
          <Link
            href="/"
            className="text-(--color-text-secondary) transition-colors duration-200 hover:text-(--color-text-primary)"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-(--color-text-secondary) transition-colors duration-200 hover:text-(--color-text-primary)"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-(--color-text-secondary) transition-colors duration-200 hover:text-(--color-text-primary)"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
