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

  test("post page passes axe audit", async ({ postPage }) => {
    await postPage.goto("/posts/winning-a-coding-competition-in-48-hours");
    await postPage.setLightMode();

    const results = await new AxeBuilder({ page: postPage.page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
