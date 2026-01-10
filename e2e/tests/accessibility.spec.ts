import { test, expect } from '../fixtures/blog.fixture';

test.describe('Accessibility', () => {
  test('skip to content link exists and works', async ({ blogPage }) => {
    await blogPage.goto('/');

    await blogPage.skipLink.focus();
    await expect(blogPage.skipLink).toBeFocused();

    await blogPage.skipLink.click();

    const mainContent = blogPage.page.locator('#main-content');
    await expect(mainContent).toBeInViewport();
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeLessThanOrEqual(1);

    const h1 = page.locator('h1');
    if ((await h1.count()) > 0) {
      await expect(h1).toBeVisible();
    }
  });

  test('main landmark is present', async ({ blogPage }) => {
    await blogPage.goto('/');
    await expect(blogPage.mainContent).toBeVisible();
  });

  test('header landmark is present', async ({ blogPage }) => {
    await blogPage.goto('/');
    await expect(blogPage.header).toBeVisible();
  });

  test('footer is present', async ({ blogPage }) => {
    await blogPage.goto('/');
    await expect(blogPage.footer).toBeVisible();
  });

  test('navigation is accessible by keyboard', async ({ blogPage, page }) => {
    await blogPage.goto('/');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName.toLowerCase();
    });

    expect(['a', 'button']).toContain(focusedElement);
  });

  test('links have visible focus states', async ({ page }) => {
    await page.goto('/');

    const firstLink = page.getByRole('link').first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
  });

  test('theme toggle is keyboard accessible', async ({ blogPage }) => {
    await blogPage.goto('/');

    await blogPage.themeToggle.focus();
    await expect(blogPage.themeToggle).toBeFocused();

    const initialDark = await blogPage.isDarkMode();
    await blogPage.page.keyboard.press('Enter');
    await blogPage.page.waitForTimeout(100);

    const afterEnter = await blogPage.isDarkMode();
    expect(afterEnter).not.toBe(initialDark);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img:not([role="presentation"])');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt', /.*/);
    }
  });

  test('post page has proper document structure', async ({ postPage }) => {
    await postPage.goto('/posts/winning-a-coding-competition-in-48-hours');

    await expect(postPage.postTitle).toBeVisible();

    const h1Count = await postPage.page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('language attribute is set on html', async ({ page }) => {
    await page.goto('/');

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');

    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
  });
});
