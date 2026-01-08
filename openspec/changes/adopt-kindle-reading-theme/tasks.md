# Tasks: Adopt Kindle Reading Theme

- [x] **Task 1: Update CSS Color Variables**
  - Files: `src/app/globals.css`
  - Description: Replace Literary Nightfall color palette with Kindle-inspired sepia (light) and night reading (dark) palettes.
  - Validation: Visual inspection confirms paper-like warmth in light mode, OLED-friendly darkness in dark mode.

- [x] **Task 2: Add Paper Texture Overlay**
  - Files: `src/app/globals.css`
  - Description: Add subtle SVG noise texture to simulate paper grain in light mode only. Use `::before` pseudo-element on body with `mix-blend-mode: multiply`.
  - Validation: Light mode shows subtle paper texture; dark mode has no texture.

- [x] **Task 3: Optimize Typography for Reading Comfort**
  - Files: `src/app/globals.css`
  - Description: Increase base font size to 18px, adjust line-height to 1.75 for body text, ensure paragraph spacing promotes comfortable reading.
  - Validation: Body text is larger, more spaced; reading feels less cramped.

- [x] **Task 4: Soften Terminal/Code Block Chrome**
  - Files: `src/app/globals.css`
  - Description: Mute terminal window chrome (traffic light dots become subtle, uniform color). Code blocks feel like printed code on paper.
  - Validation: Code blocks integrate visually with content; dots are barely noticeable.

- [x] **Task 5: Refine Header and Footer Presence**
  - Files: `src/components/Header.tsx`, `src/components/Footer.tsx`
  - Description: Make header more transparent and minimal. Footer very light, nearly invisible. Reduced navigation visual weight.
  - Validation: Header feels less "sticky" and intrusive; footer is subtle.

- [x] **Task 6: Adjust Prose Element Styling**
  - Files: `src/app/globals.css`
  - Description: Update blockquote styling to be more book-like (subtle left border, italic treatment).
  - Validation: Prose elements feel like formatted book pages.

- [x] **Task 7: Visual QA and Fine-tuning**
  - Files: All modified files
  - Description: Tested both themes across routes. Build and lint pass. Visual inspection confirms Kindle-like reading experience.
  - Validation: Both modes pass visual inspection; no accessibility regressions.

---

## Execution Order

```
Task 1 (colors) ──┬──> Task 2 (texture)
                  ├──> Task 3 (typography)
                  ├──> Task 4 (code blocks)
                  ├──> Task 5 (header/footer)
                  └──> Task 6 (prose)
                           │
                           └──> Task 7 (QA)
```

**Group 1:** Task 1 (sequential - foundation)
**Group 2:** Tasks 2, 3, 4, 5, 6 (parallel)
**Group 3:** Task 7 (sequential - verification)
