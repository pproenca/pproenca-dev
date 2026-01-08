# Spec: Code Highlighting

## MODIFIED Requirements

### Requirement: Dark mode uses Monokai theme
Code blocks in dark mode MUST use Shiki's built-in `monokai` theme instead of the custom `literary-nightfall` theme.

#### Scenario: Dark mode code block rendering
Given a page with code blocks
When the user views the page in dark mode
Then code blocks display with Monokai syntax highlighting colors
And the background is approximately `#272822`
And keywords appear in pink/magenta
And strings appear in yellow
And functions appear in bright green

---

### Requirement: Light mode uses GitHub Light theme
Code blocks in light mode MUST continue using Shiki's built-in `github-light` theme.

#### Scenario: Light mode code block rendering
Given a page with code blocks
When the user views the page in light mode
Then code blocks display with GitHub Light syntax highlighting colors

---

### Requirement: No custom theme definitions
The codebase MUST NOT contain custom Shiki theme definitions; only built-in themes should be used.

#### Scenario: Shiki configuration uses built-in themes only
Given the file `src/lib/shiki.ts`
When examining the `createHighlighter` configuration
Then the themes array contains only string identifiers for built-in themes
And no `ThemeRegistration` objects are defined in the file
