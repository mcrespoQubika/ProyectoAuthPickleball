import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  sharedPage: [
    async ({ browser }, use) => {
      const page = await browser.newPage();
      await use(page);
      await page.close();
    },
    { scope: 'worker' },
  ],
});

export { expect };
