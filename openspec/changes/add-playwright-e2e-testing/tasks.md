# Tasks: Add Playwright E2E Testing

## Phase 1: Infrastructure Setup

- [x] **Task 1**: Install Playwright and dependencies
  - Add `@playwright/test` to devDependencies
  - Run `npx playwright install` to download browsers
  - Verify: `npx playwright --version` outputs version

- [x] **Task 2**: Create playwright.config.ts
  - Configure webServer to build and serve static site
  - Set up HTML reporter with Speedboard
  - Configure screenshot comparison settings
  - Add projects for chromium (primary) and firefox (secondary)
  - Verify: `npx playwright test --list` shows no errors

- [x] **Task 3**: Add npm scripts to package.json
  - `test:e2e` - Run all E2E tests
  - `test:e2e:ui` - Run with UI mode for debugging
  - `test:e2e:update` - Update visual snapshots
  - Verify: Scripts execute without errors

## Phase 2: Test Fixtures and Page Objects

- [x] **Task 4**: Create blog page fixture (e2e/fixtures/blog.fixture.ts)
  - BlogPage class with common selectors and actions
  - HomePage, PostPage, CategoryPage extending base
  - Methods: goto(), getPostCards(), getThemeToggle(), etc.
  - Verify: TypeScript compiles without errors

## Phase 3: Critical Path Tests

- [x] **Task 5**: Homepage tests (e2e/tests/homepage.spec.ts)
  - Page loads without errors
  - Post cards display with titles and dates
  - Navigation links work (About, Categories)
  - Verify: Tests pass with `npx playwright test homepage`

- [x] **Task 6**: Post page tests (e2e/tests/post.spec.ts)
  - Post content renders from MDX
  - Code blocks have syntax highlighting
  - Back navigation works
  - Verify: Tests pass

- [x] **Task 7**: Category tests (e2e/tests/categories.spec.ts)
  - Category listing page shows all categories
  - Individual category page filters posts correctly
  - Verify: Tests pass

- [x] **Task 8**: Theme toggle tests (e2e/tests/theme.spec.ts)
  - Toggle switches between light and dark
  - Preference persists across page navigation
  - Code blocks show correct theme variant
  - Verify: Tests pass

## Phase 4: Visual Regression Tests

- [x] **Task 9**: Create visual test suite (e2e/tests/visual.spec.ts)
  - Homepage full page screenshot (light + dark)
  - Post page article content screenshot
  - Code block component screenshot (both themes)
  - Header and footer component screenshots
  - Configure `toHaveScreenshot()` with appropriate tolerance
  - Verify: Baselines generated with `--update-snapshots`

- [x] **Task 10**: Add visual test guards
  - Skip visual tests on non-Linux platforms (CI-only)
  - Document how to update baselines
  - Verify: Local dev can run non-visual tests

## Phase 5: SEO and Accessibility Tests

- [x] **Task 11**: SEO validation tests (e2e/tests/seo.spec.ts)
  - Meta title and description present
  - Canonical URL set correctly
  - Open Graph tags present
  - JSON-LD structured data valid
  - Verify: Tests pass

- [x] **Task 12**: Feed tests (e2e/tests/feeds.spec.ts)
  - RSS feed accessible at /feed.xml
  - JSON feed accessible at /feed.json
  - Sitemap accessible at /sitemap.xml
  - Verify: Tests pass

- [x] **Task 13**: Accessibility tests (e2e/tests/accessibility.spec.ts)
  - Keyboard navigation works
  - Focus states visible
  - Aria landmarks present (nav, main, footer)
  - Skip to content link works
  - Verify: Tests pass

## Phase 6: CI Integration

- [x] **Task 14**: Create GitHub Actions workflow (.github/workflows/e2e.yml)
  - Trigger on PR and push to master
  - Cache Playwright browsers
  - Build static site
  - Run tests with sharding (2 shards)
  - Upload HTML report as artifact
  - Upload failed screenshots on failure
  - Verify: Workflow runs successfully

- [x] **Task 15**: Add PR status check
  - Configure branch protection to require E2E passing
  - Document test debugging workflow
  - Verify: PR cannot merge with failing tests

## Phase 7: Documentation

- [x] **Task 16**: Update CLAUDE.md and README
  - Add testing commands to Commands section
  - Document visual snapshot update workflow
  - Add CI badge
  - Verify: Documentation is clear and accurate

## Dependencies

```
Task 1 → Task 2 → Task 3 (sequential, infrastructure)
Task 4 → Tasks 5-8 (fixtures before tests)
Tasks 5-8 → Task 9-10 (functional before visual)
Tasks 5-13 → Task 14 (tests before CI)
Task 14 → Task 15 → Task 16 (CI before docs)
```

## Parallel Execution Groups

| Group | Tasks | Notes |
|-------|-------|-------|
| 1 | 1 | Infrastructure (must be first) |
| 2 | 2, 3 | Config files (can parallel) |
| 3 | 4 | Fixtures (depends on config) |
| 4 | 5, 6, 7, 8 | Critical path tests (can parallel) |
| 5 | 9, 10 | Visual tests (depends on critical path) |
| 6 | 11, 12, 13 | SEO/a11y tests (can parallel) |
| 7 | 14 | CI workflow |
| 8 | 15, 16 | Final config and docs |
