# Spec: E2E Testing

## Overview

End-to-end testing capability for the blog using Playwright, covering critical path functionality and visual regression detection.

## ADDED Requirements

### Requirement: E2E Test Infrastructure

The project SHALL have Playwright configured for end-to-end testing with automatic server startup.

#### Scenario: Running E2E tests

**Given** the developer is in the project root
**When** they run `pnpm test:e2e`
**Then** the static site builds automatically
**And** a preview server starts on port 3000
**And** all E2E tests execute
**And** an HTML report is generated in `playwright-report/`

#### Scenario: Debugging tests with UI mode

**Given** the developer wants to debug a failing test
**When** they run `pnpm test:e2e:ui`
**Then** Playwright UI mode opens
**And** they can step through tests visually
**And** they can inspect locators and actions

---

### Requirement: Critical Path Testing

The project SHALL have automated tests for all critical user journeys.

#### Scenario: Homepage renders correctly

**Given** a user navigates to the homepage
**When** the page loads
**Then** the header with site title is visible
**And** post cards are displayed
**And** each post card shows title and date
**And** navigation links to About and Categories are visible

#### Scenario: Post page renders content

**Given** a user navigates to a blog post
**When** the page loads
**Then** the post title is visible as an h1
**And** the post content renders from MDX
**And** code blocks have syntax highlighting applied
**And** navigation back to home works

#### Scenario: Category filtering works

**Given** a user navigates to a category page
**When** the page loads
**Then** only posts in that category are displayed
**And** the category name is shown in the heading

#### Scenario: Theme toggle persists

**Given** a user is on any page
**When** they click the theme toggle
**Then** the theme switches between light and dark
**And** the preference persists when navigating to another page
**And** the preference persists on page reload

---

### Requirement: Visual Regression Testing

The project SHALL detect unintended visual changes through screenshot comparison.

#### Scenario: Homepage visual baseline

**Given** visual tests are running on CI (Linux)
**When** the homepage is captured in light mode
**Then** the screenshot matches the stored baseline within 1% pixel difference
**And** differences are reported with a diff image

#### Scenario: Dark mode visual baseline

**Given** visual tests are running on CI (Linux)
**When** the homepage is captured in dark mode
**Then** the screenshot matches the stored baseline within 1% pixel difference
**And** code blocks show the correct dark theme variant

#### Scenario: Updating visual baselines

**Given** intentional visual changes have been made
**When** the developer runs `pnpm test:e2e:update`
**Then** new baseline screenshots are generated
**And** the updated screenshots can be committed to git

---

### Requirement: SEO Verification Testing

The project SHALL verify SEO metadata is present and correct.

#### Scenario: Meta tags present

**Given** a user navigates to any page
**When** the page loads
**Then** a meta title tag is present
**And** a meta description tag is present
**And** canonical URL is set
**And** Open Graph tags are present (og:title, og:description, og:image)

#### Scenario: JSON-LD structured data

**Given** a user navigates to a blog post
**When** the page loads
**Then** a script tag with type="application/ld+json" is present
**And** the JSON-LD contains @type "BlogPosting"
**And** the JSON-LD contains headline, datePublished, and author

#### Scenario: Feeds are accessible

**Given** a client requests the RSS feed
**When** they fetch `/feed.xml`
**Then** the response status is 200
**And** the content-type indicates XML

**Given** a client requests the JSON feed
**When** they fetch `/feed.json`
**Then** the response status is 200
**And** the content-type indicates JSON

---

### Requirement: CI Integration

The project SHALL run E2E tests automatically on every PR and push to master.

#### Scenario: PR triggers E2E tests

**Given** a developer opens a pull request
**When** the PR is created or updated
**Then** the E2E test workflow runs automatically
**And** the test results are reported as a status check
**And** the HTML report is uploaded as an artifact

#### Scenario: Failed test debugging

**Given** an E2E test fails in CI
**When** the workflow completes
**Then** screenshots of failed tests are uploaded as artifacts
**And** the developer can download and review the failures
**And** the HTML report shows detailed failure information

---

## Test File Mapping

| Requirement | Test File |
|-------------|-----------|
| Critical Path - Homepage | `e2e/tests/homepage.spec.ts` |
| Critical Path - Post | `e2e/tests/post.spec.ts` |
| Critical Path - Categories | `e2e/tests/categories.spec.ts` |
| Critical Path - Theme | `e2e/tests/theme.spec.ts` |
| Visual Regression | `e2e/tests/visual.spec.ts` |
| SEO Verification | `e2e/tests/seo.spec.ts` |
| SEO - Feeds | `e2e/tests/feeds.spec.ts` |

## Configuration Files

| Purpose | File |
|---------|------|
| Playwright config | `playwright.config.ts` |
| Page fixtures | `e2e/fixtures/blog.fixture.ts` |
| Visual baselines | `e2e/__screenshots__/*.png` |
| CI workflow | `.github/workflows/e2e.yml` |
