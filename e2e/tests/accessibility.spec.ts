import { test, expect } from "../fixtures/blog.fixture";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function runAxeAudit(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(results.violations).toEqual([]);
}

test.describe("Accessibility - axe-core audits", () => {
  test("homepage passes axe audit", async ({ homePage }) => {
    await homePage.goto("/");
    await homePage.setLightMode();
    await runAxeAudit(homePage.page);
  });

  test("post page passes axe audit", async ({ postPage }) => {
    await postPage.goto("/posts/winning-a-coding-competition-in-48-hours");
    await postPage.setLightMode();
    await runAxeAudit(postPage.page);
  });
});
