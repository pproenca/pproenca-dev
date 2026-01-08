# CSS Styling Specification

## MODIFIED Requirements

### Requirement: Tailwind CSS Variable Syntax

Tailwind utility classes MUST use v4 native parentheses syntax `(--variable-name)` for CSS variable references. The legacy v3 bracket syntax `[var(--variable-name)]` SHALL NOT be used.

**Acceptance Criteria:**
- CSS variables in arbitrary values MUST use parentheses syntax
- All theme color references SHALL use consistent v4 syntax
- Build process MUST complete without style warnings

#### Scenario: Color utility with CSS variable

**Given** a component using a theme color
**When** the color is applied via Tailwind utility
**Then** the syntax SHALL follow v4 pattern: `text-(--color-text-primary)`

**Example:**
```tsx
// Correct v4 syntax
<span className="text-(--color-accent)">Accent text</span>
```

#### Scenario: Background with opacity modifier

**Given** a component using a background color with opacity
**When** the color is applied with opacity modifier
**Then** the syntax SHALL follow v4 pattern: `bg-(--color-bg-deep)/95`

**Example:**
```tsx
// Correct v4 syntax
<header className="bg-(--color-bg-deep)/95">...</header>
```

#### Scenario: Border color with CSS variable

**Given** a component using a border color
**When** the border color uses a CSS variable
**Then** the syntax SHALL follow v4 pattern: `border-(--color-border-subtle)`

**Example:**
```tsx
// Correct v4 syntax
<div className="border border-(--color-border-subtle)">...</div>
```
