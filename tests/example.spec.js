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

test('navigation works', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Click on About us link
  await page.click('text=About us');
  
  // Check if we scrolled to the about section
  const aboutSection = page.locator('#about');
  await expect(aboutSection).toBeVisible();
});
