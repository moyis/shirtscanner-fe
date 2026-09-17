import { test, expect } from "@playwright/test";


test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(
    "ShirtScanner - Find the Best Sports Clothes in China"
  );
});

test("can search", async ({ page }) => {
  const query = "Argentina";
  await page.goto("/");
  await page.getByPlaceholder("Find your next shirt...").fill(query);
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(`/search?q=${query}`);
});

test("has providers", async ({ page }) => {
  await page.goto(`/providers`);
  const rowCount = await page.$$eval(`tr`, rows => rows.length);
  expect(rowCount).toBeGreaterThan(0);
});

test("has seo head tags", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.shirtscanner.com/"
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://www.shirtscanner.com/og-image.png"
  );
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(jsonLd).toContain("SearchAction");
});

test("providers redirects to providers page search", async ({ page }) => {
  await page.goto("/");
  await page.getByRole('link', { name: 'Providers' }).click();
  await expect(page).toHaveURL(`/providers`);
});

test('not found page exists', async ({ page }) => {
  await page.goto('/this-does-not-exists');
  await expect(page.getByRole('heading', { name: '404 - Not Found' })).toBeVisible();
});

test('not found page has a button that redirects to homepage', async ({ page }) => {
  await page.goto('/this-also-does-not-exists');
  await page.getByRole('button', { name: 'Go back to homepage' }).click();
  await expect(page).toHaveURL(`/`);
});