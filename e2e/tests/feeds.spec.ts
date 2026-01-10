import { test, expect } from '@playwright/test';

test.describe('Feeds', () => {
  test('RSS feed is accessible', async ({ request }) => {
    const response = await request.get('/feed.xml');
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/xml/);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
  });

  test('Atom feed is accessible', async ({ request }) => {
    const response = await request.get('/atom.xml');
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/xml/);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<feed');
  });

  test('JSON feed is accessible', async ({ request }) => {
    const response = await request.get('/feed.json');
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/json/);

    const body = await response.json();
    expect(body.version).toContain('jsonfeed.org');
    expect(body.title).toBeTruthy();
    expect(body.items).toBeDefined();
  });

  test('sitemap is accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/xml/);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
    expect(body).toContain('<url>');
  });

  test('robots.txt is accessible', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('User-agent');
    expect(body).toContain('Sitemap');
  });

  test('RSS feed contains posts', async ({ request }) => {
    const response = await request.get('/feed.xml');
    const body = await response.text();

    expect(body).toContain('<item>');
    expect(body).toContain('<title>');
    expect(body).toContain('<link>');
  });

  test('JSON feed contains posts', async ({ request }) => {
    const response = await request.get('/feed.json');
    const body = await response.json();

    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items[0].title).toBeTruthy();
    expect(body.items[0].url).toBeTruthy();
  });
});
