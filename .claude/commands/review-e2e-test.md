---
name: review-e2e-test
description: Review Playwright E2E test files against best practices and provide detailed feedback with fixes
allowed-tools:
  - Read
  - Glob
  - Grep
argument-hint: "<test-file-path>"
---

# Review Playwright E2E Test File

Analyze a Playwright E2E test file for adherence to best practices and provide detailed feedback with corrected code.

## Review Checklist

### 1. Page Object Model

Check for proper POM usage:

- [ ] Uses fixture-based page objects from `blog.fixture.ts`
- [ ] Locators defined as class properties (not inline in tests)
- [ ] Actions encapsulated as methods (e.g., `clickFirstPost()`, `navigateToHome()`)
- [ ] No direct `page.locator()` calls in test files

**Expected pattern:**

```typescript
// In test file - GOOD
test("displays posts", async ({ homePage }) => {
  await homePage.goto("/");
  const titles = await homePage.getPostTitles();
  expect(titles.length).toBeGreaterThan(0);
});

// BAD - direct locator in test
test("displays posts", async ({ page }) => {
  await page.goto("/");
  const titles = await page.locator("article h2").allTextContents();
});
```

### 2. Locator Strategies

Verify accessible locator usage:

- [ ] Prefer `getByRole()` over CSS selectors
- [ ] Use descriptive role options: `{ name: /pattern/i }`
- [ ] Avoid brittle selectors (IDs, classes that may change)
- [ ] Avoid `getByTestId` unless necessary

**Issue example:**

```typescript
// BAD - brittle CSS selector
this.postCards = page.locator("div.post-card-wrapper > article");

// GOOD - semantic selector
this.postCards = page.locator("main article.group");

// BEST - role-based
this.homeLink = page.getByRole("link", { name: "Home" });
```

### 3. Async Patterns

Verify all async operations are awaited:

- [ ] All `page.goto()` calls awaited
- [ ] All `user.click()` / `locator.click()` awaited
- [ ] Use `await expect()` for assertions with auto-waiting
- [ ] Avoid mixing sync/async patterns

**Issue example:**

```typescript
// BAD - missing await
test("clicks button", async ({ page }) => {
  page.goto("/"); // Missing await!
  expect(page).toHaveURL("/"); // Missing await!
});

// GOOD
test("clicks button", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
});
```

### 4. Assertion Patterns

Check correct assertion usage:

- [ ] Use Playwright's `expect()` with auto-retry for DOM assertions
- [ ] Prefer `toHaveURL()` over manual URL checks
- [ ] Use `toBeVisible()` for visibility assertions
- [ ] Use `toHaveAttribute()` for attribute checks
- [ ] Use `toHaveTitle()` for title assertions

**Issue example:**

```typescript
// BAD - manual check without auto-retry
const url = page.url();
expect(url).toBe("/posts/slug");

// GOOD - auto-waiting assertion
await expect(page).toHaveURL("/posts/slug");

// BAD - manual visibility check
const isVisible = await element.isVisible();
expect(isVisible).toBe(true);

// GOOD
await expect(element).toBeVisible();
```

### 5. Test Structure

Check test organization:

- [ ] Top-level `test.describe()` with descriptive name
- [ ] Individual tests are focused and independent
- [ ] Test names describe expected behavior (not implementation)
- [ ] No shared mutable state between tests

**Issue example:**

```typescript
// BAD - vague test name
test("test1", async ({ page }) => {});

// GOOD - descriptive
test("displays post cards with titles", async ({ homePage }) => {});

// BAD - tests depend on shared state
let savedUrl: string;
test("saves URL", async ({ page }) => {
  savedUrl = page.url();
});
test("uses saved URL", async ({ page }) => {
  await page.goto(savedUrl); // Depends on previous test!
});
```

### 6. Wait Strategies

Check for proper waiting:

- [ ] Avoid hard-coded `waitForTimeout()` - use explicit waits
- [ ] Use `waitFor({ state: 'visible' | 'attached' })` for dynamic content
- [ ] Use `expect().toBeVisible()` which auto-waits
- [ ] Use `waitForLoadState()` for navigation

**Issue example:**

```typescript
// BAD - arbitrary timeout
await page.waitForTimeout(2000);
await page.click("button");

// GOOD - wait for specific condition
await page.locator("button").waitFor({ state: "visible" });
await page.click("button");

// BETTER - auto-waiting assertion
await expect(page.locator("button")).toBeVisible();
await page.click("button");
```

### 7. Accessibility Testing

Check a11y patterns (if applicable):

- [ ] Uses `@axe-core/playwright` for audits
- [ ] WCAG tags specified (`wcag2a`, `wcag2aa`, etc.)
- [ ] Theme state set before audit (light/dark)
- [ ] Violations assertion is clear

**Expected pattern:**

```typescript
import AxeBuilder from "@axe-core/playwright";

test("page passes axe audit", async ({ blogPage }) => {
  await blogPage.goto("/");
  await blogPage.setLightMode();

  const results = await new AxeBuilder({ page: blogPage.page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### 8. Fixture Usage

Check fixture patterns:

- [ ] Imports `test` and `expect` from fixture file (not `@playwright/test`)
- [ ] Uses typed fixtures (`homePage`, `postPage`, etc.)
- [ ] Page objects properly extended from base class

**Issue example:**

```typescript
// BAD - direct import when fixtures available
import { test, expect } from "@playwright/test";

// GOOD - use fixtures
import { test, expect } from "../fixtures/blog.fixture";
```

## Output Format

Provide feedback in this structure:

### Issues Found

For each issue:

**Issue:** [Description of the problem]
**Location:** [File:line or code snippet]
**Why it matters:** [Impact on test quality/reliability]
**Fix:**

```typescript
// Corrected code
```

### Summary

- Total issues: X
- Critical issues: X (blocking test reliability)
- Warnings: X (style/best practices)
- Suggestions: X (improvements)

### Corrected Code

If requested, provide the complete corrected test file with all issues fixed.
