import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Ожидаем, что заголовок "содержит" подстроку.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Нажимаем на ссылку "Начать".
  await page.getByRole('link', { name: 'Get started' }).click();

  // Ожидаем, что на странице есть заголовок с именем "Установка".
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});