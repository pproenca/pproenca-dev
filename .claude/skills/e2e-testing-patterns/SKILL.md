---
name: Playwright E2E Testing Patterns
description: This skill should be used when the user asks to "write E2E tests", "add Playwright tests", "test page flow", "add integration tests", or mentions testing with Playwright. Provides patterns for this blog codebase's E2E testing approach.
---

# Playwright E2E Testing Patterns

Comprehensive testing patterns for Playwright E2E tests following the Page Object Model conventions used in this codebase.

## Testing Stack

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| @playwright/test     | Test runner and assertions |
| @axe-core/playwright | Accessibility audits       |

## Project Structure

```
e2e/
├── fixtures/
│   └── blog.fixture.ts    # Page Object Model classes and fixtures
├── tests/
│   ├── homepage.spec.ts   # Homepage tests
│   ├── post.spec.ts       # Post page tests
│   ├── accessibility.spec.ts  # axe-core audits
│   └── feeds.spec.ts      # Sitemap/robots.txt tests
└── playwright.config.ts
```

## Page Object Model

### Base Page Class

All page objects extend the `BlogPage` base class:

```typescript
export class BlogPage {
  readonly page: Page;
  readonly header: Locator;
  readonly themeToggle: Locator;
  readonly homeLink: Locator;
  readonly categoriesLink: Locator;
  readonly aboutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("header");
    this.themeToggle = page.getByRole("button", {
      name: /toggle theme|switch to/i,
    });
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.categoriesLink = page.getByRole("link", { name: "Categories" });
    this.aboutLink = page.getByRole("link", { name: "About" });
  }

  async goto(path: string = "/") {
    await this.page.goto(path);
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async navigateToHome() {
    await this.homeLink.click();
  }
}
```

### Specialized Page Classes

```typescript
export class HomePage extends BlogPage {
  readonly postCards: Locator;

  constructor(page: Page) {
    super(page);
    this.postCards = page.locator("main article.group");
  }

  async getPostTitles(): Promise<string[]> {
    await this.postCards.first().waitFor({ state: "attached", timeout: 5000 });
    return this.postCards.locator("h2 a, h3 a").allTextContents();
  }

  async clickFirstPost() {
    await this.postCards.first().waitFor({ state: "visible", timeout: 5000 });
    await this.postCards.first().locator("a").first().click();
  }
}
```

### Fixture Registration

```typescript
export const test = base.extend<{
  blogPage: BlogPage;
  homePage: HomePage;
  postPage: PostPage;
  categoryPage: CategoryPage;
}>({
  blogPage: async ({ page }, use) => {
    await use(new BlogPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect };
```

## Core Patterns

### Test Structure

```typescript
import { test, expect } from "../fixtures/blog.fixture";

test.describe("Homepage", () => {
  test("loads without errors", async ({ homePage }) => {
    await homePage.goto("/");
    await expect(homePage.page).toHaveTitle(/pproenca\.dev/);
  });

  test("displays post cards with titles", async ({ homePage }) => {
    await homePage.goto("/");
    const titles = await homePage.getPostTitles();
    expect(titles.length).toBeGreaterThan(0);
  });
});
```

### Locator Strategies

Prefer accessibility-first locators:

1. **getByRole** - Primary choice for semantic elements
2. **getByText** - Content verification
3. **locator with semantic selector** - For complex cases
4. **getByTestId** - Last resort

```typescript
// BEST - role-based
page.getByRole("link", { name: "Home" });
page.getByRole("button", { name: /toggle theme/i });

// GOOD - semantic selector
page.locator("main article.group");
page.locator("main > article header h1");

// AVOID - brittle selectors
page.locator("#post-123");
page.locator(".css-1a2b3c");
```

### Assertions with Auto-Waiting

Playwright's `expect` auto-waits for conditions:

```typescript
// Page assertions
await expect(page).toHaveTitle(/pproenca\.dev/);
await expect(page).toHaveURL(/\/posts\//);

// Element assertions
await expect(element).toBeVisible();
await expect(element).toHaveAttribute("aria-selected", "true");
await expect(element).toHaveText("Expected text");

// Array assertions (no auto-wait)
const titles = await homePage.getPostTitles();
expect(titles.length).toBeGreaterThan(0);
```

### Wait Strategies

```typescript
// Explicit wait for element state
await this.postCards.first().waitFor({ state: "attached", timeout: 5000 });
await this.postCards.first().waitFor({ state: "visible", timeout: 5000 });

// Auto-waiting assertions (preferred)
await expect(this.postTitle).toBeVisible();

// Wait for navigation
await page.waitForLoadState("networkidle");

// AVOID - arbitrary timeouts
await page.waitForTimeout(2000); // Only for theme transitions
```

### Navigation Patterns

```typescript
test("navigation links work", async ({ homePage }) => {
  await homePage.goto("/");

  await expect(homePage.homeLink).toBeVisible();
  await expect(homePage.categoriesLink).toBeVisible();

  await homePage.navigateToCategories();
  await expect(homePage.page).toHaveURL(/\/categories/);

  await homePage.navigateToHome();
  await expect(homePage.page).toHaveURL("/");
});
```

## Accessibility Testing

### axe-core Integration

```typescript
import { test, expect } from "../fixtures/blog.fixture";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility - axe-core audits", () => {
  test("homepage passes axe audit", async ({ blogPage }) => {
    await blogPage.goto("/");
    await blogPage.setLightMode();

    const results = await new AxeBuilder({ page: blogPage.page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

### Theme-Aware Testing

```typescript
async setLightMode() {
  if (await this.isDarkMode()) {
    await this.toggleTheme();
    await this.page.waitForTimeout(100); // Allow theme transition
  }
}

async isDarkMode(): Promise<boolean> {
  return this.page
    .locator("html")
    .evaluate((el) => el.classList.contains("dark"));
}
```

## API Request Testing

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feeds", () => {
  test("sitemap is accessible", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/xml/);

    const body = await response.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("<urlset");
  });
});
```

## Test Organization

### Describe Blocks by Feature

```typescript
test.describe("Homepage", () => {
  test("loads without errors", async ({ homePage }) => {});
  test("displays post cards", async ({ homePage }) => {});
  test("navigation works", async ({ homePage }) => {});
});

test.describe("Post Page", () => {
  test("renders MDX content", async ({ postPage, homePage }) => {});
  test("navigation back works", async ({ postPage, homePage }) => {});
  test("direct URL loads", async ({ postPage }) => {});
});
```

### Test Naming Conventions

- Use present tense verbs
- Describe expected behavior, not implementation
- Be specific about the scenario

```typescript
// GOOD
test("displays post cards with titles", async () => {});
test("navigation back to home works", async () => {});
test("direct post URL loads correctly", async () => {});

// BAD
test("test homepage", async () => {});
test("it should work", async () => {});
```

## Quick Reference

| Pattern            | Example                                             |
| ------------------ | --------------------------------------------------- |
| Import fixtures    | `import { test, expect } from '../fixtures/...'`    |
| Role locator       | `page.getByRole('link', { name: 'Home' })`          |
| URL assertion      | `await expect(page).toHaveURL(/\/posts\//)`         |
| Visibility         | `await expect(element).toBeVisible()`               |
| Wait for element   | `await el.waitFor({ state: 'visible' })`            |
| Get text content   | `await locator.textContent()`                       |
| Get all texts      | `await locator.allTextContents()`                   |
| Navigate           | `await homePage.goto('/')`                          |
| Click              | `await element.click()`                             |
| Count elements     | `await locator.count()`                             |
| axe audit          | `new AxeBuilder({ page }).withTags([...]).analyze()` |

## Running Tests

```bash
pnpm test:e2e          # Run all E2E tests (builds first)
pnpm test:e2e:ui       # Interactive UI mode
pnpm test:e2e:update   # Update visual snapshots
```
