import { test, expect } from '@playwright/test';

test('contact form submits successfully', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Name').fill('Jane Doe');
  await page.getByLabel('Email').fill('jane@example.com');
  await page.getByLabel('Message').fill('I would like to learn more about your setup.');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.getByText("Thanks! We'll be in touch.")).toBeVisible();
});

