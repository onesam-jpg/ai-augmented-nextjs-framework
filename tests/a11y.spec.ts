import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('landing page has no critical a11y violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(v => (v.impact || '').toLowerCase() === 'critical');
    if (critical.length) {
      console.log('Critical a11y violations:', JSON.stringify(critical, null, 2));
    }
    expect(critical.length, 'No critical accessibility violations').toBe(0);
  });
});

