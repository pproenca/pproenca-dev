"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx/lite";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  readonly href: string;
  readonly label: string;
};

type SocialLink = {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
};

type MobileMenuProps = {
  navLinks: readonly NavLink[];
  socialLinks: readonly SocialLink[];
};

export function MobileMenu({ navLinks, socialLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-text-tertiary transition-colors duration-base hover:bg-bg-elevated hover:text-text-secondary"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
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
      </button>

      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-bg-deep/80 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out drawer */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-bg-surface shadow-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex h-12 items-center justify-between border-b border-border-subtle/50 px-5 sm:h-14">
          <span className="font-serif text-lg font-bold text-accent">Menu</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-tertiary transition-colors duration-base hover:bg-bg-elevated hover:text-text-secondary"
            aria-label="Close menu"
          >
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
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-base",
                    pathname === href
                      ? "bg-bg-elevated text-accent"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with social links */}
        <div className="border-t border-border-subtle/50 px-5 py-6">
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-tertiary transition-colors duration-base hover:bg-bg-elevated hover:text-text-secondary"
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
