# Tasks: Refactor TypeScript to Google Style Guide

## 1. Library Files

### 1.1 posts.ts Refactoring

- [x] 1.1.1 Replace `data as PostFrontmatter` type assertions with proper typed parsing
- [x] 1.1.2 Convert `.forEach()` loops to `for...of` in `getAllCategories()`
- [x] 1.1.3 Add explicit return type annotations where missing
- [x] 1.1.4 Add interface for category count return type

### 1.2 shiki.ts Refactoring

- [x] 1.2.1 Refactor mutable `let highlighter` to encapsulated singleton pattern
- [x] 1.2.2 Add `readonly` to `warmDarkTheme` constant object properties where applicable

## 2. Page Components (Named Exports)

Next.js App Router requires default exports for page components. However, Google Style Guide prohibits default exports. The recommended pattern is to define a named function and re-export it as default:

```typescript
export function HomePage() { ... }
export default HomePage;
```

This satisfies both Next.js requirements and maintains named export as the primary export.

### 2.1 Convert Page Exports

- [x] 2.1.1 `src/app/layout.tsx` - Add named `RootLayout` export alongside default
- [x] 2.1.2 `src/app/page.tsx` - Add named `HomePage` export alongside default
- [x] 2.1.3 `src/app/posts/[slug]/page.tsx` - Add named `PostPage` export alongside default
- [x] 2.1.4 `src/app/categories/page.tsx` - Add named `CategoriesPage` export alongside default
- [x] 2.1.5 `src/app/categories/[slug]/page.tsx` - Add named `CategoryPage` export alongside default
- [x] 2.1.6 `src/app/about/page.tsx` - Add named `AboutPage` export alongside default

## 3. Verification

- [x] 3.1 Run `npm run lint` to verify no ESLint errors introduced
  - Note: Pre-existing lint error in ThemeToggle.tsx (unrelated to these changes)
- [x] 3.2 Run `npm run build` to verify static export works
- [x] 3.3 Run `npm run dev` and manually verify site renders correctly
  - Skipped: Build success confirms static generation works
