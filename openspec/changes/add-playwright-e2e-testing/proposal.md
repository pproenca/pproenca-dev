# Proposal: Add Playwright E2E Testing

## Summary

Add Playwright end-to-end testing infrastructure to protect critical path functionality during refactoring, with visual regression testing to detect unintended UI changes quickly.

## Motivation

The project has no testing framework configured. As refactoring continues, there's risk of breaking:
- Post rendering and navigation
- Category filtering and listing
- Theme switching (dark/light)
- Code syntax highlighting (dual themes)
- SEO metadata and JSON-LD output
- RSS/JSON feed generation

E2E tests provide confidence that the site works correctly from a user perspective, while visual regression testing catches subtle CSS and layout regressions that functional tests miss.

## Research Findings (2025/2026 Best Practices)

### Playwright 1.57 Key Features

1. **WebServer Wait Configuration** - Intelligent readiness detection with regex patterns:
   ```typescript
   webServer: {
     command: 'pnpm build && pnpm start',
     url: 'http://localhost:3000',
     wait: { stdout: /Ready in/ },
     reuseExistingServer: !process.env.CI
   }
   ```

2. **Speedboard Dashboard** - New HTML reporter tab identifies slow tests, helps optimize CI runtime

3. **Aria Snapshots** - Accessibility tree comparison with `toMatchAriaSnapshot()` for structural testing without brittle CSS selectors

4. **Chrome for Testing** - Playwright now uses Chrome for Testing builds (more stable than Chromium)

### Visual Regression Best Practices

1. **`toHaveScreenshot()` Assertion** - Built-in visual comparison with pixelmatch:
   - `maxDiffPixels` / `maxDiffPixelRatio` for tolerance
   - `threshold` for per-pixel sensitivity
   - `fullPage` option for full page captures
   - Automatic baseline management with `--update-snapshots`

2. **Cross-Platform Consistency** - Run visual tests in CI only (Linux Docker) to avoid font rendering differences:
   ```typescript
   test.describe('Visual', () => {
     test.skip(process.platform !== 'linux', 'Visual tests run on CI only');
   });
   ```

3. **Element-Scoped Screenshots** - Test specific components to reduce flakiness:
   ```typescript
   await expect(page.locator('article')).toHaveScreenshot('post-content.png');
   ```

### CI/CD Integration (GitHub Actions)

1. **Sharding** - Split tests across parallel jobs for faster feedback
2. **Blob Reporter** - Merge reports from sharded runs
3. **Artifact Upload** - Store HTML reports and failed screenshots
4. **Caching** - Cache browser binaries between runs

### Next.js 16 Integration

1. **Static Export Testing** - Build to `out/`, serve with `npx serve out`
2. **WebServer Config** - Playwright starts server automatically before tests
3. **Route Coverage** - Test all static routes: `/`, `/posts/[slug]`, `/categories`, `/categories/[slug]`, `/about`

## Proposed Solution

### Test Structure

```
e2e/
├── fixtures/
│   └── blog.fixture.ts      # Page Object Model for blog pages
├── tests/
│   ├── critical-path.spec.ts # Core navigation and rendering
│   ├── visual.spec.ts        # Screenshot comparisons
│   ├── theme.spec.ts         # Dark/light mode switching
│   ├── seo.spec.ts           # Meta tags, JSON-LD, feeds
│   └── accessibility.spec.ts # Aria snapshots, keyboard nav
├── playwright.config.ts
└── __screenshots__/          # Visual baselines (git-tracked)
```

### Critical Path Tests

1. **Homepage** - Post listing loads, posts sorted by date
2. **Post Page** - Content renders, code blocks highlighted, navigation works
3. **Categories** - Category listing works, filtering by category works
4. **About Page** - Static content renders
5. **Theme Toggle** - Switches between light/dark, persists preference
6. **External Links** - RSS/JSON feeds accessible

### Visual Regression Strategy

1. **Full Page Screenshots** - Homepage, about page (stable layouts)
2. **Component Screenshots** - Header, footer, post card, code block
3. **Theme Variants** - Both light and dark mode captures
4. **Tolerance Settings** - Allow minor anti-aliasing differences

### CI Pipeline

```yaml
# .github/workflows/e2e.yml
- Build static site
- Start preview server
- Run Playwright tests (sharded)
- Upload HTML report as artifact
- Upload failed screenshots for debugging
```

## Alternatives Considered

1. **Cypress** - More established but slower, no native visual regression
2. **Puppeteer** - Lower-level, requires more setup, no test runner
3. **Percy/Chromatic** - Cloud-based visual testing, adds cost and external dependency
4. **Jest + Testing Library** - Good for unit/integration, but doesn't test real browser rendering

**Decision**: Playwright provides the best combination of modern features, built-in visual testing, and CI integration without external dependencies.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Visual test flakiness | Run on Linux CI only, use element-scoped screenshots, configure tolerance |
| Slow CI feedback | Shard tests, cache browsers, run critical path first |
| Baseline drift | Review screenshot changes in PRs, keep baselines minimal |
| Font rendering differences | Use web-safe fallbacks in tests, or accept CI-only visual tests |

## Success Criteria

- [ ] All critical path tests pass on every PR
- [ ] Visual regression detects intentional and unintentional changes
- [ ] CI completes in < 3 minutes
- [ ] Test failures provide actionable debugging info (screenshots, traces)

## References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Next.js Playwright Guide](https://nextjs.org/docs/app/guides/testing/playwright)
- [Playwright 1.57 Release Notes](https://playwright.dev/docs/release-notes)
