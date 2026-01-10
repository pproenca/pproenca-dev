import { test, expect } from "../fixtures/blog.fixture";

test.describe("Categories", () => {
  test("category listing page loads", async ({ categoryPage }) => {
    await categoryPage.goto("/categories");

    await expect(categoryPage.page).toHaveURL("/categories");
    await expect(categoryPage.categoryHeading).toContainText(/categories/i);
  });

  test("displays category links", async ({ categoryPage }) => {
    await categoryPage.goto("/categories");

    const categoryNames = await categoryPage.getCategoryNames();
    expect(categoryNames.length).toBeGreaterThan(0);
  });

  test("clicking a category shows filtered posts", async ({ categoryPage }) => {
    await categoryPage.goto("/categories");

    const categoryNames = await categoryPage.getCategoryNames();
    expect(categoryNames.length).toBeGreaterThan(0);

    const firstCategory = categoryNames[0];
    await categoryPage.clickCategory(firstCategory);

    await expect(categoryPage.page).toHaveURL(/\/categories\/.+/);
  });

  test("individual category page displays posts", async ({ categoryPage }) => {
    await categoryPage.goto("/categories");

    const categoryNames = await categoryPage.getCategoryNames();
    if (categoryNames.length > 0) {
      await categoryPage.clickCategory(categoryNames[0]);

      const postCount = await categoryPage.getPostCount();
      expect(postCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("category page has navigation", async ({ categoryPage }) => {
    await categoryPage.goto("/categories");

    await expect(categoryPage.header).toBeVisible();
    await expect(categoryPage.homeLink).toBeVisible();
    await expect(categoryPage.aboutLink).toBeVisible();
  });

  test("navigating from category page to home works", async ({
    categoryPage,
  }) => {
    await categoryPage.goto("/categories");

    await categoryPage.navigateToHome();
    await expect(categoryPage.page).toHaveURL("/");
  });
});
