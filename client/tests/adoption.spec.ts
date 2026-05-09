import { test, expect } from '@playwright/test';

test('homepage opens', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Командний центр' })
  ).toBeVisible();
});

test('animals section is visible', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Список тварин' })
  ).toBeVisible();
});