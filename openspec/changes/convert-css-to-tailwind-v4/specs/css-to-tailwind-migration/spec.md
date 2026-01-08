# CSS to Tailwind v4 Migration Spec

## MODIFIED Requirements

### Requirement: Theme colors defined in @theme block

The project MUST define theme color tokens in the Tailwind v4 `@theme inline` block alongside existing CSS variables, enabling both CSS variable references and Tailwind utility generation.

#### Scenario: Color tokens accessible via @theme
- Given globals.css has a `@theme inline` block
- When the block includes color token definitions referencing CSS variables
- Then Tailwind utilities like `bg-bg-deep` and `text-text-primary` are generated
- And CSS variable syntax `bg-(--color-bg-deep)` continues to work

#### Scenario: Dark mode colors work with @theme
- Given colors are defined as CSS variables in both `:root` and `.dark`
- When @theme references these variables
- Then utilities automatically use the correct color based on `.dark` class presence

---

### Requirement: Body element uses Tailwind utilities for base styles

The `<body>` element in layout.tsx MUST use Tailwind utility classes for background color, text color, and transitions instead of CSS selectors in globals.css.

#### Scenario: Body styled via layout.tsx
- Given the body element in layout.tsx
- When rendered
- Then it has classes: `bg-(--color-bg-deep) text-(--color-text-primary) transition-colors duration-200`
- And globals.css body selector only contains non-utility styles (font-size, pseudo-elements)

#### Scenario: Theme toggle updates body correctly
- Given the body is styled with Tailwind utilities referencing CSS variables
- When dark mode is toggled via next-themes
- Then body background and text colors transition smoothly
- And no flash of unstyled content occurs

---

### Requirement: Terminal component uses @variant for dark mode styles

The terminal window component styles MUST use Tailwind v4's `@variant dark` directive instead of separate `.dark .terminal-*` selectors.

#### Scenario: Dark mode terminal styles use @variant
- Given the `.terminal-window` CSS class
- When it includes dark mode specific box-shadow
- Then the dark styles are defined inside `@variant dark { }` block
- And no separate `.dark .terminal-window` selector exists

#### Scenario: Terminal dots use @variant for dark colors
- Given the `.terminal-dot-red`, `.terminal-dot-yellow`, `.terminal-dot-green` classes
- When dark mode is active
- Then the dot colors are defined via `@variant dark` inside each class
- And hover states for dark mode also use `@variant dark`

---

### Requirement: Terminal dot colors defined as @theme tokens

Traffic light dot colors (red, yellow, green) for the code block terminal window MUST be defined as semantic tokens in the `@theme` block.

#### Scenario: Traffic light colors in @theme
- Given globals.css @theme block
- When terminal dot colors are defined
- Then tokens exist for: `--color-terminal-red`, `--color-terminal-yellow`, `--color-terminal-green`
- And separate hover/active variants are defined

---

### Requirement: Visual parity maintained after migration

All CSS-to-Tailwind conversions MUST maintain exact visual appearance. No color, spacing, or typography changes SHALL occur.

#### Scenario: Before/after screenshot comparison
- Given screenshots taken before migration
- When compared with screenshots after migration
- Then no visual differences are detectable
- And pages tested include: home, post, about (both light and dark modes)

#### Scenario: Build and lint pass
- Given all CSS migrations are complete
- When `npm run build` is executed
- Then the build succeeds without errors
- And `npm run lint` passes
