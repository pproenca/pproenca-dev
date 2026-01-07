export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-3xl px-4 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
        <p>&copy; {new Date().getFullYear()} Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
