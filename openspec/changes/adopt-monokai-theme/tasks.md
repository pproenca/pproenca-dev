# Tasks: Adopt Monokai Theme

## Implementation Tasks

### Task 1: Update Shiki configuration to use Monokai
**Files:**
- Modify: `src/lib/shiki.ts`
- Modify: `src/components/MDXContent.tsx`

**Description:**
1. Remove the entire `warmDarkTheme` object (lines 4-69)
2. Update `createHighlighter` themes array from `["github-light", warmDarkTheme]` to `["github-light", "monokai"]`
3. Update `highlightCode()` to use `"monokai"` instead of `"literary-nightfall"`
4. Remove the unused `ThemeRegistration` type import
5. Update MDXContent.tsx to use `"monokai"` instead of `"literary-nightfall"`

**Validation:**
- [x] File compiles without TypeScript errors
- [x] No references to `literary-nightfall` or `warmDarkTheme` remain

---

### Task 2: Verify build succeeds
**Commands:**
```bash
npm run build
```

**Validation:**
- [x] Build completes successfully
- [x] No warnings about missing themes

---

### Task 3: Visual verification
**Commands:**
```bash
npm run dev
```

**Validation:**
- [ ] Navigate to a post with code blocks (manual)
- [ ] Dark mode shows Monokai colors (pink keywords, yellow strings, green functions) (manual)
- [ ] Light mode shows GitHub Light colors (unchanged) (manual)
- [ ] Theme toggle switches correctly between both (manual)
