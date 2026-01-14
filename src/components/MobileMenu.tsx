"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Shared icon button styling
const iconButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-lg text-text-tertiary transition-colors duration-base hover:bg-bg-elevated hover:text-text-secondary";

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

type MobileMenuProps = {
  navLinks: readonly { href: string; label: string }[];
  socialLinks: readonly { href: string; label: string; icon: string }[];
};

export function MobileMenu({ navLinks, socialLinks }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  // Close menu on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={open}
        className={iconButtonClass}
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {/* Native dialog with backdrop */}
      <dialog
        ref={dialogRef}
        aria-label="Mobile navigation menu"
        className="fixed inset-0 m-0 h-full max-h-full w-full max-w-full bg-transparent p-0 overscroll-contain backdrop:bg-bg-deep/80 backdrop:backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {/* Slide-out drawer */}
        <div className="mobile-menu-drawer ml-auto flex h-full w-full max-w-xs flex-col bg-bg-surface shadow-xl">
          {/* Header */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-subtle/50 px-5 sm:h-14">
            <span className="font-serif text-lg font-bold text-accent">
              Menu
            </span>
            <button
              type="button"
              onClick={close}
              className={iconButtonClass}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
            <ul className="space-y-1">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-base ${
                      pathname === href
                        ? "bg-bg-elevated text-accent"
                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer with social links */}
          <div className="shrink-0 border-t border-border-subtle/50 px-5 py-6">
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={iconButtonClass}
                  aria-label={label}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={icon} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
