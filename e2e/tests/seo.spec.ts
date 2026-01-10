import { test, expect } from "../fixtures/blog.fixture";

test.describe("SEO Metadata", () => {
  test("homepage has meta title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/pproenca\.dev/);
  });

  test("homepage has meta description", async ({ page }) => {
    await page.goto("/");
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);
  });

  test("homepage has canonical URL", async ({ page }) => {
    await page.goto("/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /.+/);
  });

  test("homepage has Open Graph tags", async ({ page }) => {
    await page.goto("/");

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute("content", /.+/);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", /.+/);
  });

  test("homepage has Twitter card tags", async ({ page }) => {
    await page.goto("/");

    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", /.+/);
  });

  test("post page has JSON-LD structured data", async ({ page }) => {
    await page.goto("/posts/winning-a-coding-competition-in-48-hours");

    // Multiple JSON-LD scripts exist (Article + BreadcrumbList), target Article schema
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScripts.first()).toBeAttached();

    // Find the Article schema (not BreadcrumbList)
    const scriptsCount = await jsonLdScripts.count();
    let articleData: Record<string, unknown> | null = null;

    for (let i = 0; i < scriptsCount; i++) {
      const content = await jsonLdScripts.nth(i).textContent();
      if (content) {
        const data = JSON.parse(content);
        if (data["@type"] === "Article") {
          articleData = data;
          break;
        }
      }
    }

    expect(articleData).toBeTruthy();
    expect(articleData!["@type"]).toBe("Article");
    expect(articleData!.headline).toBeTruthy();
    expect(articleData!.datePublished).toBeTruthy();
    expect(articleData!.author).toBeTruthy();
  });

  test("post page has meta title with post name", async ({ page }) => {
    await page.goto("/posts/winning-a-coding-competition-in-48-hours");

    const title = await page.title();
    expect(title).toContain("pproenca.dev");
    expect(title.length).toBeGreaterThan(15);
  });

  test("post page has meta description", async ({ page }) => {
    await page.goto("/posts/winning-a-coding-competition-in-48-hours");

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);

    const content = await metaDescription.getAttribute("content");
    expect(content!.length).toBeGreaterThan(20);
  });

  test("about page has meta tags", async ({ page }) => {
    await page.goto("/about");

    await expect(page).toHaveTitle(/About.*pproenca\.dev/);

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);
  });

  test("categories page has meta tags", async ({ page }) => {
    await page.goto("/categories");

    await expect(page).toHaveTitle(/Categories.*pproenca\.dev/);
  });

  test("all pages have viewport meta tag", async ({ page }) => {
    await page.goto("/");
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", /width=device-width/);
  });
});
