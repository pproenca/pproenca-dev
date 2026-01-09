# Tasks: Optimize Static Rendering

## Prerequisites

- [x] User approves proposal approach (Option B: Extract CopyButton)

## Implementation Tasks

### Task 1: Create CopyButton client component

**Files:**

- Create: `src/components/CopyButton.tsx`

**Description:**
Extract the copy button logic into a dedicated client component. This component handles:

- Copy to clipboard functionality
- Visual feedback state (copied/not copied)
- SVG icons for both states

**Validation:**

- [x] Component compiles without TypeScript errors
- [x] `"use client"` directive is present

---

### Task 2: Refactor CodeBlock to server component

**Files:**

- Modify: `src/components/CodeBlock.tsx`

**Description:**
Remove `"use client"` directive and refactor to use CopyButton:

- Remove `useState` import
- Remove internal copy state management
- Import and use CopyButton component
- Pass `code` prop (currently `children`) to CopyButton

**Validation:**

- [x] No `"use client"` directive in CodeBlock
- [x] No React hooks in CodeBlock
- [x] Imports CopyButton correctly

---

### Task 3: Verify build and functionality

**Commands:**

```bash
npm run build
```

**Validation:**

- [x] Build succeeds with `output: 'export'`
- [ ] No hydration errors in browser console (manual verification)
- [ ] Copy button works on code blocks (manual verification)
- [ ] Visual feedback (checkmark) displays after copy (manual verification)
- [ ] Both light and dark theme code blocks render correctly (manual verification)

---

### Task 4: Verify client component count

**Commands:**

```bash
grep -r '"use client"' src/
```

**Expected output:**

```
src/components/CopyButton.tsx:"use client";
src/components/ThemeProvider.tsx:"use client";
src/components/ThemeToggle.tsx:"use client";
```

**Validation:**

- [x] Still exactly 3 client components
- [x] CodeBlock is NOT in the list

## Post-Implementation

- [x] Run `npm run lint` to ensure code style compliance
- [ ] Test on deployed preview (if available)
