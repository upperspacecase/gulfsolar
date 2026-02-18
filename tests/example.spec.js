// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring
  await expect(page).toHaveTitle(/Gulf Solar/);
});

test('calculator form is visible', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check if the calculator section exists
  const calculator = page.locator('#estimate');
  await expect(calculator).toBeVisible();

  // Check if email input exists
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
});

test('about section exists', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check if the about section is present
  const aboutSection = page.locator('#about');
  await expect(aboutSection).toBeAttached();
});

test('mobile menu opens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000');

  // Click hamburger button
  const menuButton = page.locator('button[aria-label="Toggle mobile menu"]');
  await expect(menuButton).toBeVisible();
  await menuButton.click();

  // Nav links should appear
  const servicesLink = page.locator('nav >> text=Services').first();
  await expect(servicesLink).toBeVisible();
});

test('privacy page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/privacy');
  await expect(page).toHaveTitle(/Privacy Policy/);
});

test('terms page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/terms');
  await expect(page).toHaveTitle(/Terms of Service/);
});
