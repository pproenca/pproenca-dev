import {
  test as base,
  expect,
  type Page,
  type Locator,
} from "@playwright/test";

/** Locator for post card articles, excluding embedded content like tweets */
const POST_CARDS_SELECTOR = "main article.group";

export class BlogPage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly themeToggle: Locator;
  readonly mainContent: Locator;
  readonly skipLink: Locator;
  readonly homeLink: Locator;
  readonly categoriesLink: Locator;
  readonly aboutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("header");
    this.footer = page.locator("footer");
    this.themeToggle = page.getByRole("button", {
      name: /toggle theme|switch to/i,
    });
    this.mainContent = page.locator("main#main-content");
    this.skipLink = page.getByRole("link", { name: /skip to main content/i });
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.categoriesLink = page.getByRole("link", { name: "Categories" });
    this.aboutLink = page.getByRole("link", { name: "About" });
  }

  async goto(path: string = "/") {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
    await this.mainContent.waitFor({ state: "visible", timeout: 10000 });
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async isDarkMode(): Promise<boolean> {
    return this.page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark"));
  }

  async setLightMode() {
    if (await this.isDarkMode()) {
      await this.toggleTheme();
      await expect(this.page.locator("html")).not.toHaveClass(/dark/);
    }
  }

  async setDarkMode() {
    if (!(await this.isDarkMode())) {
      await this.toggleTheme();
      await expect(this.page.locator("html")).toHaveClass(/dark/);
    }
  }

  async navigateToHome() {
    await this.homeLink.click();
  }

  async navigateToCategories() {
    await this.categoriesLink.click();
  }

  async navigateToAbout() {
    await this.aboutLink.click();
  }
}

export class HomePage extends BlogPage {
  readonly postCards: Locator;

  constructor(page: Page) {
    super(page);
    this.postCards = page.locator(POST_CARDS_SELECTOR);
  }

  async getPostTitles(): Promise<string[]> {
    // Wait for at least one post card to be visible before counting
    await this.postCards.first().waitFor({ state: "attached", timeout: 5000 });
    return this.postCards.locator("h2, h3").allTextContents();
  }

  async getPostCount(): Promise<number> {
    // Wait for at least one post card to be visible before counting
    await this.postCards.first().waitFor({ state: "attached", timeout: 5000 });
    return this.postCards.count();
  }

  async clickFirstPost() {
    await this.postCards.first().waitFor({ state: "visible", timeout: 5000 });
    await this.postCards.first().locator("a").first().click();
  }
}

export class PostPage extends BlogPage {
  readonly articleContent: Locator;
  readonly codeBlocks: Locator;
  readonly postTitle: Locator;
  readonly postDate: Locator;

  constructor(page: Page) {
    super(page);
    // Target main article - use descendant selector for h1 since it's nested in header
    this.articleContent = page.locator("main > article");
    this.codeBlocks = page.locator("main > article pre");
    this.postTitle = page.locator("main > article header h1");
    this.postDate = page.locator("main > article time");
  }

  async hasCodeHighlighting(): Promise<boolean> {
    const codeBlockCount = await this.codeBlocks.count();
    if (codeBlockCount === 0) {
      return false;
    }
    const styledSpanCount = await this.codeBlocks
      .first()
      .locator("span[style]")
      .count();
    return styledSpanCount > 0;
  }

  async getTitle(): Promise<string> {
    await this.postTitle.waitFor({ state: "visible", timeout: 5000 });
    return (await this.postTitle.textContent()) ?? "";
  }
}

export class CategoryPage extends BlogPage {
  readonly categoryLinks: Locator;
  readonly categoryHeading: Locator;
  readonly postCards: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryLinks = page.locator('a[href^="/categories/"]');
    this.categoryHeading = page.locator("h1");
    this.postCards = page.locator(POST_CARDS_SELECTOR);
  }

  async getCategoryNames(): Promise<string[]> {
    return this.categoryLinks.allTextContents();
  }

  async clickCategory(name: string) {
    await this.page.getByRole("link", { name }).click();
  }

  async getPostCount(): Promise<number> {
    return this.postCards.count();
  }
}

export const test = base.extend<{
  blogPage: BlogPage;
  homePage: HomePage;
  postPage: PostPage;
  categoryPage: CategoryPage;
}>({
  blogPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright's use() is not a React hook
    await use(new BlogPage(page));
  },
  homePage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright's use() is not a React hook
    await use(new HomePage(page));
  },
  postPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright's use() is not a React hook
    await use(new PostPage(page));
  },
  categoryPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright's use() is not a React hook
    await use(new CategoryPage(page));
  },
});

export { expect };
