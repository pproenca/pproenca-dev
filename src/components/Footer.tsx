export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-[680px] px-golden-3 py-golden-4 text-center text-sm text-[var(--color-text-tertiary)]">
        <p>&copy; {new Date().getFullYear()} Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
