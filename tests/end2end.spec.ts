import { test, expect } from "@playwright/test";


test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(
    "ShirtScanner: Explore, Compare, and Find the Best Sports Clothes in China"
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

test("providers redirects to providers page search", async ({ page }) => {
  await page.goto("/");
  await page.getByRole('link', { name: 'Providers' }).click();
  await expect(page).toHaveURL(`/providers`);
});