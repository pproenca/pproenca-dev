import { test, expect } from '../fixtures/blog.fixture';

test.describe('Theme Toggle', () => {
  test('theme toggle button is visible', async ({ blogPage }) => {
    await blogPage.goto('/');
    await expect(blogPage.themeToggle).toBeVisible();
  });

  test('toggles between light and dark mode', async ({ blogPage }) => {
    await blogPage.goto('/');

    const initialDark = await blogPage.isDarkMode();
    await blogPage.toggleTheme();
    await blogPage.page.waitForTimeout(100);

    const afterToggle = await blogPage.isDarkMode();
    expect(afterToggle).not.toBe(initialDark);

    await blogPage.toggleTheme();
    await blogPage.page.waitForTimeout(100);

    const afterSecondToggle = await blogPage.isDarkMode();
    expect(afterSecondToggle).toBe(initialDark);
  });

  test('theme preference persists across navigation', async ({ blogPage }) => {
    await blogPage.goto('/');
    await blogPage.setDarkMode();
    expect(await blogPage.isDarkMode()).toBe(true);

    await blogPage.navigateToAbout();
    await blogPage.page.waitForTimeout(100);
    expect(await blogPage.isDarkMode()).toBe(true);

    await blogPage.navigateToHome();
    await blogPage.page.waitForTimeout(100);
    expect(await blogPage.isDarkMode()).toBe(true);
  });

  test('can set light mode explicitly', async ({ blogPage }) => {
    await blogPage.goto('/');
    await blogPage.setLightMode();
    expect(await blogPage.isDarkMode()).toBe(false);
  });

  test('can set dark mode explicitly', async ({ blogPage }) => {
    await blogPage.goto('/');
    await blogPage.setDarkMode();
    expect(await blogPage.isDarkMode()).toBe(true);
  });

  test('theme toggle has proper accessibility attributes', async ({ blogPage }) => {
    await blogPage.goto('/');

    await expect(blogPage.themeToggle).toHaveAttribute('aria-label', /.+/);
  });

  test('theme works on post pages', async ({ blogPage, homePage }) => {
    await homePage.goto('/');
    await blogPage.setDarkMode();

    await homePage.clickFirstPost();
    await blogPage.page.waitForTimeout(100);
    expect(await blogPage.isDarkMode()).toBe(true);

    await blogPage.toggleTheme();
    await blogPage.page.waitForTimeout(100);
    expect(await blogPage.isDarkMode()).toBe(false);
  });
});
