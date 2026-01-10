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

  test("navigation back to home works", async ({ postPage, homePage }) => {
    await homePage.goto("/");
    await homePage.clickFirstPost();
    await expect(postPage.page).toHaveURL(/\/posts\//);

    await postPage.navigateToHome();
    await expect(postPage.page).toHaveURL("/");
  });

  test("direct post URL loads correctly", async ({ postPage }) => {
    await postPage.goto("/posts/winning-a-coding-competition-in-48-hours");

    await expect(postPage.postTitle).toBeVisible();
    await expect(postPage.articleContent).toBeVisible();
  });
});
