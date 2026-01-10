import { test, expect } from "../fixtures/blog.fixture";

test.describe("Post Page", () => {
  test("renders post content from MDX", async ({ postPage, homePage }) => {
    await homePage.goto("/");
    await homePage.clickFirstPost();

    await expect(postPage.page).toHaveURL(/\/posts\//);
    await expect(postPage.postTitle).toBeVisible();
    await expect(postPage.articleContent).toBeVisible();

    const title = await postPage.getTitle();
    expect(title.length).toBeGreaterThan(0);
  });

  test("displays post title as h1", async ({ postPage, homePage }) => {
    await homePage.goto("/");
    await homePage.clickFirstPost();

    const h1 = postPage.page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
  });

  test("code blocks have syntax highlighting", async ({
    postPage,
    homePage,
  }) => {
    await homePage.goto("/");
    await homePage.clickFirstPost();

    const codeBlockCount = await postPage.codeBlocks.count();
    if (codeBlockCount > 0) {
      const hasHighlighting = await postPage.hasCodeHighlighting();
      expect(hasHighlighting).toBe(true);
    }
  });

  test("navigation back to home works", async ({ postPage, homePage }) => {
    await homePage.goto("/");
    await homePage.clickFirstPost();
    await expect(postPage.page).toHaveURL(/\/posts\//);

    await postPage.navigateToHome();
    await expect(postPage.page).toHaveURL("/");
  });

  test("header and footer are visible", async ({ postPage, homePage }) => {
    await homePage.goto("/");
    await homePage.clickFirstPost();

    await expect(postPage.header).toBeVisible();
    await expect(postPage.footer).toBeVisible();
  });

  test("direct post URL loads correctly", async ({ postPage }) => {
    await postPage.goto("/posts/winning-a-coding-competition-in-48-hours");

    await expect(postPage.postTitle).toBeVisible();
    await expect(postPage.articleContent).toBeVisible();
  });
});
