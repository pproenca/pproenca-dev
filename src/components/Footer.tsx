export function Footer() {
  return (
    <footer className="border-t border-border-subtle/30">
      <div className="mx-auto max-w-[680px] px-golden-3 py-golden-3 text-center text-xs text-text-tertiary/70">
        <p>&copy; {new Date().getFullYear()} pproenca.dev</p>
      </div>
    </footer>
  );
}
