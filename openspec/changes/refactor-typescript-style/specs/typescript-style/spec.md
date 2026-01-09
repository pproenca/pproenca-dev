# Capability: TypeScript Style

TypeScript code conventions following Google's TypeScript Style Guide.

## ADDED Requirements

### Requirement: Named Export Convention

All TypeScript files SHALL use named exports as the primary export mechanism. Default exports SHALL only be used when required by framework constraints (e.g., Next.js pages), and MUST be accompanied by a named export of the same function.

#### Scenario: Component exports

- **WHEN** defining a React component
- **THEN** export using named export syntax (`export function ComponentName`)

#### Scenario: Next.js page exports

- **WHEN** defining a Next.js page component
- **THEN** define a named export AND re-export as default for Next.js compatibility

### Requirement: Type Assertion Documentation

Type assertions using `as` SHALL include a comment explaining why the assertion is safe and necessary.

#### Scenario: External library data

- **WHEN** casting data from external libraries (e.g., gray-matter frontmatter)
- **THEN** include a comment explaining the trust boundary and data source

### Requirement: Iteration Pattern

Array iteration SHALL prefer `for...of` loops over `.forEach()` method chains for better readability and early-exit capability.

#### Scenario: Processing collections

- **WHEN** iterating over arrays to accumulate or transform data
- **THEN** use `for...of` with explicit loop body

### Requirement: Module-Level State Documentation

Module-level mutable state (when necessary for caching/singletons) SHALL be documented with a comment explaining its purpose.

#### Scenario: Lazy-initialized singleton

- **WHEN** using `let` for a module-level cache variable
- **THEN** include a comment explaining the caching pattern
