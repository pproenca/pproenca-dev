# Design: Playwright E2E Testing Architecture

## Overview

This document describes the architectural decisions for implementing Playwright E2E testing in the pproenca-dev blog.

## Directory Structure

```
pproenca-dev/
├── e2e/
│   ├── fixtures/
│   │   └── blog.fixture.ts       # Page Object Model classes
│   ├── tests/
│   │   ├── homepage.spec.ts      # Homepage functional tests
│   │   ├── post.spec.ts          # Post page tests
│   │   ├── categories.spec.ts    # Category navigation tests
│   │   ├── theme.spec.ts         # Theme switching tests
│   │   ├── visual.spec.ts        # Visual regression tests
│   │   ├── seo.spec.ts           # SEO metadata tests
│   │   ├── feeds.spec.ts         # RSS/JSON feed tests
│   │   └── accessibility.spec.ts # A11y tests
│   └── __screenshots__/          # Visual baselines (git-tracked)
│       ├── homepage-light.png
│       ├── homepage-dark.png
│       └── ...
├── playwright.config.ts          # Root config
└── .github/workflows/e2e.yml     # CI workflow
```

## Configuration Design

### playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",

  // Fail fast in CI, continue locally
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // HTML reporter with Speedboard for performance analysis
  reporter: [["html", { open: "never" }], ["list"]],

  // Global settings
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  // Screenshot comparison settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // Allow 1% difference
      threshold: 0.2, // Per-pixel sensitivity
      animations: "disabled", // Reduce flakiness
    },
  },

  // Build and serve static site before tests
  webServer: {
    command: "pnpm build && npx serve out -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Build can take time
  },

  // Browser projects
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Firefox as secondary validation
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
```

### Key Configuration Decisions

1. **Static Build Testing** - Tests run against the production build (`out/`), not dev server, ensuring we test what actually deploys.

2. **Single Worker in CI** - Prevents resource contention and ensures consistent screenshot baselines.

3. **Retries in CI Only** - Catches flaky tests in CI while keeping local feedback fast.

4. **Screenshot Tolerance** - 1% pixel difference ratio accounts for anti-aliasing variations without masking real changes.

5. **Animations Disabled** - Prevents timing-related flakiness in visual tests.

## Page Object Model Design

### Base Fixture

```typescript
// e2e/fixtures/blog.fixture.ts
import { test as base, expect, Page, Locator } from "@playwright/test";

export class BlogPage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly themeToggle: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("header");
    this.footer = page.locator("footer");
    this.themeToggle = page.getByRole("button", { name: /theme/i });
    this.mainContent = page.locator("main");
  }

  async goto(path: string = "/") {
    await this.page.goto(path);
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async isDarkMode(): Promise<boolean> {
    return this.page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark"));
  }
}

export class HomePage extends BlogPage {
  readonly postCards: Locator;

  constructor(page: Page) {
    super(page);
    this.postCards = page.locator("article");
  }

  async getPostTitles(): Promise<string[]> {
    return this.postCards.locator("h2, h3").allTextContents();
  }
}

export class PostPage extends BlogPage {
  readonly articleContent: Locator;
  readonly codeBlocks: Locator;

  constructor(page: Page) {
    super(page);
    this.articleContent = page.locator("article");
    this.codeBlocks = page.locator("pre code");
  }

  async hasCodeHighlighting(): Promise<boolean> {
    const codeBlock = this.codeBlocks.first();
    if ((await codeBlock.count()) === 0) return true; // No code blocks
    return codeBlock
      .locator("span[style]")
      .count()
      .then((c) => c > 0);
  }
}

// Export test with fixtures
export const test = base.extend<{
  homePage: HomePage;
  postPage: PostPage;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  postPage: async ({ page }, use) => {
    await use(new PostPage(page));
  },
});

export { expect };
```

### Design Rationale

1. **Inheritance over Composition** - BlogPage base class shares common elements (header, footer, theme toggle) across all page types.

2. **Locator Caching** - Locators defined once in constructor, reused in methods.

3. **Semantic Selectors** - Use roles and accessible names (`getByRole`) over CSS selectors for resilience.

4. **Fixture Extension** - Custom `test` export provides typed page objects automatically.

## Visual Testing Strategy

### Screenshot Categories

| Category       | Scope                      | Purpose                  |
| -------------- | -------------------------- | ------------------------ |
| Full Page      | Homepage, About            | Catch layout regressions |
| Component      | Header, Footer, Code Block | Isolate styling changes  |
| Theme Variants | Light + Dark               | Ensure both themes work  |

### Visual Test Structure

```typescript
// e2e/tests/visual.spec.ts
import { test, expect } from "../fixtures/blog.fixture";

test.describe("Visual Regression", () => {
  // Only run visual tests on Linux (CI)
  test.skip(process.platform !== "linux", "Visual tests run on CI only");

  test("homepage light theme", async ({ homePage }) => {
    await homePage.goto("/");
    // Ensure light mode
    if (await homePage.isDarkMode()) {
      await homePage.toggleTheme();
    }
    await expect(homePage.page).toHaveScreenshot("homepage-light.png", {
      fullPage: true,
    });
  });

  test("homepage dark theme", async ({ homePage }) => {
    await homePage.goto("/");
    // Ensure dark mode
    if (!(await homePage.isDarkMode())) {
      await homePage.toggleTheme();
    }
    await expect(homePage.page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
    });
  });

  test("code block styling", async ({ postPage, page }) => {
    // Find a post with code
    await postPage.goto("/posts/some-post-with-code");
    const codeBlock = page.locator("pre").first();
    await expect(codeBlock).toHaveScreenshot("code-block.png");
  });
});
```

### Baseline Management

1. **Git-Tracked Baselines** - Screenshots stored in `e2e/__screenshots__/` and committed to git.

2. **CI-Generated** - Baselines created on Linux CI to ensure consistency.

3. **Update Workflow**:

   ```bash
   # On CI, update baselines:
   npx playwright test --update-snapshots
   # Commit updated screenshots
   git add e2e/__screenshots__
   git commit -m "chore(e2e): update visual baselines"
   ```

4. **PR Review** - Screenshot changes visible in git diff, requires review.

## CI Pipeline Design

### GitHub Actions Workflow

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium firefox

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Upload failed screenshots
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: failed-screenshots
          path: test-results/
          retention-days: 7
```

### CI Design Decisions

1. **Single Job** - No sharding initially (small test suite), add later if needed.

2. **Browser Caching** - Cache Playwright browsers to speed up runs.

3. **Artifact Upload** - Always upload report, screenshots only on failure.

4. **10-Minute Timeout** - Generous for static build + tests, prevents hung jobs.

## Test Categories and Priority

### Critical Path (Must Pass)

| Test                 | Priority | Blocks Deploy |
| -------------------- | -------- | ------------- |
| Homepage loads       | P0       | Yes           |
| Post content renders | P0       | Yes           |
| Navigation works     | P0       | Yes           |
| Theme toggle works   | P1       | Yes           |

### Visual Regression (Review Required)

| Test                  | Priority | Blocks Deploy |
| --------------------- | -------- | ------------- |
| Homepage screenshot   | P1       | Review only   |
| Post screenshot       | P1       | Review only   |
| Code block screenshot | P2       | Review only   |

### SEO/A11y (Should Pass)

| Test               | Priority | Blocks Deploy |
| ------------------ | -------- | ------------- |
| Meta tags present  | P1       | Warning       |
| JSON-LD valid      | P1       | Warning       |
| Feeds accessible   | P2       | Warning       |
| Keyboard nav works | P2       | Warning       |

## Trade-offs

### Accepted Limitations

1. **Linux-Only Visual Tests** - Font rendering differs across OS. We accept CI-only visual tests to maintain baseline consistency.

2. **No Mobile Visual Tests** - Mobile screenshots are more prone to flakiness. Functional tests cover mobile responsiveness.

3. **Build Before Test** - Slower than dev server, but tests production-identical output.

### Future Improvements

1. **Sharding** - Add when test count exceeds 50+ tests.
2. **Component Testing** - Consider Playwright component testing for React components.
3. **Accessibility Automation** - Integrate axe-core for automated a11y scanning.
