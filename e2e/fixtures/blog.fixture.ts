import {
  test as base,
  expect,
  type Page,
  type Locator,
} from "@playwright/test";

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
    await this.page.goto(path);
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
      await this.page.waitForTimeout(100);
    }
  }

  async setDarkMode() {
    if (!(await this.isDarkMode())) {
      await this.toggleTheme();
      await this.page.waitForTimeout(100);
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
    // Target only direct post card articles, not embedded tweet articles
    this.postCards = page.locator("main article.group");
  }

  async getPostTitles(): Promise<string[]> {
    return this.postCards.locator("h2 a, h3 a").allTextContents();
  }

  async getPostCount(): Promise<number> {
    return this.postCards.count();
  }

  async clickFirstPost() {
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
    // Target main article directly under main, not embedded tweet articles
    this.articleContent = page.locator("main > article");
    this.codeBlocks = page.locator("main > article pre");
    this.postTitle = page.locator("main > article h1");
    this.postDate = page.locator("main > article time");
  }

  async hasCodeHighlighting(): Promise<boolean> {
    const count = await this.codeBlocks.count();
    if (count === 0) return true;
    const codeBlock = this.codeBlocks.first();
    const spanCount = await codeBlock.locator("span[style]").count();
    return spanCount > 0;
  }

  async getTitle(): Promise<string> {
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
    // Target only direct post card articles, not embedded tweet articles
    this.postCards = page.locator("main article.group");
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
