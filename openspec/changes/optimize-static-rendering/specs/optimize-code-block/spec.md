# Spec: Optimize Code Block

## MODIFIED Requirements

### Requirement: CodeBlock renders as server component
The CodeBlock component MUST render entirely on the server, with only the copy button requiring client-side hydration.

#### Scenario: CodeBlock has no client directive
Given the file `src/components/CodeBlock.tsx`
When examining the file contents
Then there is no `"use client"` directive at the top

#### Scenario: CodeBlock uses no React hooks
Given the CodeBlock component
When examining its implementation
Then it does not import or use `useState`, `useEffect`, or any other React hooks

#### Scenario: CodeBlock delegates copy to CopyButton
Given a code block is rendered
When the user views the terminal header
Then the copy functionality is provided by an embedded CopyButton client component

---

### Requirement: CopyButton provides copy functionality
A dedicated CopyButton client component MUST handle clipboard operations and visual feedback.

#### Scenario: CopyButton is a client component
Given the file `src/components/CopyButton.tsx`
When examining the file contents
Then it begins with `"use client"` directive

#### Scenario: CopyButton accepts code prop
Given a CopyButton component
When it is instantiated
Then it accepts a `code: string` prop containing the text to copy

#### Scenario: Copy action copies to clipboard
Given a rendered CopyButton with code "const x = 1"
When the user clicks the button
Then "const x = 1" is copied to the system clipboard

#### Scenario: Copy shows visual feedback
Given a rendered CopyButton
When the user clicks the button
Then a checkmark icon is displayed
And after 2 seconds the icon reverts to the copy icon

---

### Requirement: Static export compatibility
The refactored components MUST work with Next.js static export.

#### Scenario: Build succeeds
Given the refactored components
When running `npm run build`
Then the build completes successfully with `output: 'export'`

#### Scenario: No hydration errors
Given a statically exported page with code blocks
When the page loads in a browser
Then no hydration mismatch errors appear in the console

---

### Requirement: Visual parity maintained
The refactored code blocks MUST look identical to the current implementation.

#### Scenario: Terminal styling preserved
Given a rendered code block
When viewing the component
Then it displays:
- Terminal header with traffic light dots (red, yellow, green)
- Copy button in the header
- Syntax-highlighted code body

#### Scenario: Theme variants work
Given a page with code blocks
When the user toggles between light and dark themes
Then the appropriate syntax highlighting variant is displayed
And the code block styling matches the theme
