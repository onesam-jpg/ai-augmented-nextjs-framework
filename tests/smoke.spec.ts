import { test, expect } from '@playwright/test';

test('landing page renders with hero heading', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: /Build AI Agents Faster/i })).toBeVisible();
});
