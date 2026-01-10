import { test, expect } from '../fixtures/blog.fixture';

test.describe('Visual Regression', () => {
  // Visual tests only run on Linux (CI) to ensure consistent baselines
  test.skip(process.platform !== 'linux', 'Visual tests run on CI only');

  test('homepage light theme', async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.setLightMode();
    await homePage.page.waitForLoadState('networkidle');

    await expect(homePage.page).toHaveScreenshot('homepage-light.png', {
      fullPage: true,
    });
  });

  test('homepage dark theme', async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.setDarkMode();
    await homePage.page.waitForLoadState('networkidle');

    await expect(homePage.page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    });
  });

  test('about page light theme', async ({ blogPage }) => {
    await blogPage.goto('/about');
    await blogPage.setLightMode();
    await blogPage.page.waitForLoadState('networkidle');

    await expect(blogPage.page).toHaveScreenshot('about-light.png', {
      fullPage: true,
    });
  });

  test('about page dark theme', async ({ blogPage }) => {
    await blogPage.goto('/about');
    await blogPage.setDarkMode();
    await blogPage.page.waitForLoadState('networkidle');

    await expect(blogPage.page).toHaveScreenshot('about-dark.png', {
      fullPage: true,
    });
  });

  test('header component light theme', async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.setLightMode();

    await expect(homePage.header).toHaveScreenshot('header-light.png');
  });

  test('header component dark theme', async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.setDarkMode();

    await expect(homePage.header).toHaveScreenshot('header-dark.png');
  });

  test('footer component light theme', async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.setLightMode();

    await expect(homePage.footer).toHaveScreenshot('footer-light.png');
  });

  test('footer component dark theme', async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.setDarkMode();

    await expect(homePage.footer).toHaveScreenshot('footer-dark.png');
  });

  test('post content light theme', async ({ postPage }) => {
    await postPage.goto('/posts/winning-a-coding-competition-in-48-hours');
    await postPage.setLightMode();
    await postPage.page.waitForLoadState('networkidle');

    await expect(postPage.articleContent).toHaveScreenshot('post-content-light.png');
  });

  test('post content dark theme', async ({ postPage }) => {
    await postPage.goto('/posts/winning-a-coding-competition-in-48-hours');
    await postPage.setDarkMode();
    await postPage.page.waitForLoadState('networkidle');

    await expect(postPage.articleContent).toHaveScreenshot('post-content-dark.png');
  });

  test('code block styling', async ({ postPage }) => {
    await postPage.goto('/posts/winning-a-coding-competition-in-48-hours');
    await postPage.setLightMode();

    const codeBlockCount = await postPage.codeBlocks.count();
    if (codeBlockCount > 0) {
      await expect(postPage.codeBlocks.first()).toHaveScreenshot('code-block-light.png');
    }
  });

  test('code block dark theme', async ({ postPage }) => {
    await postPage.goto('/posts/winning-a-coding-competition-in-48-hours');
    await postPage.setDarkMode();

    const codeBlockCount = await postPage.codeBlocks.count();
    if (codeBlockCount > 0) {
      await expect(postPage.codeBlocks.first()).toHaveScreenshot('code-block-dark.png');
    }
  });
});
