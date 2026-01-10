import { test, expect } from '../fixtures/blog.fixture';

test.describe('Homepage', () => {
  test('loads without errors', async ({ homePage }) => {
    await homePage.goto('/');
    await expect(homePage.page).toHaveTitle(/pproenca\.dev/);
  });

  test('displays header with site title', async ({ homePage }) => {
    await homePage.goto('/');
    await expect(homePage.header).toBeVisible();
    await expect(homePage.page.getByRole('link', { name: 'pproenca.dev' })).toBeVisible();
  });

  test('displays post cards with titles', async ({ homePage }) => {
    await homePage.goto('/');
    const postCount = await homePage.getPostCount();
    expect(postCount).toBeGreaterThan(0);

    const titles = await homePage.getPostTitles();
    expect(titles.length).toBeGreaterThan(0);
    titles.forEach((title) => {
      expect(title.length).toBeGreaterThan(0);
    });
  });

  test('navigation links are visible and work', async ({ homePage }) => {
    await homePage.goto('/');

    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.categoriesLink).toBeVisible();
    await expect(homePage.aboutLink).toBeVisible();

    await homePage.navigateToCategories();
    await expect(homePage.page).toHaveURL(/\/categories/);

    await homePage.navigateToHome();
    await expect(homePage.page).toHaveURL('/');

    await homePage.navigateToAbout();
    await expect(homePage.page).toHaveURL(/\/about/);
  });

  test('clicking a post navigates to post page', async ({ homePage }) => {
    await homePage.goto('/');
    const titles = await homePage.getPostTitles();
    expect(titles.length).toBeGreaterThan(0);

    await homePage.clickFirstPost();
    await expect(homePage.page).toHaveURL(/\/posts\//);
  });

  test('footer is visible with copyright', async ({ homePage }) => {
    await homePage.goto('/');
    await expect(homePage.footer).toBeVisible();
    await expect(homePage.footer).toContainText('pproenca.dev');
  });
});
